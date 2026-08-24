const test = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const axios = require("axios");

// Set environment variables for tests
process.env.MERCHANT_OS_WEBHOOK_KEY = "test-webhook-key";
process.env.MERCHANT_OS_VERIFY_URL = "http://localhost:8000/mock-verify";

const Menu = require("../models/Menu");
const Order = require("../models/Order");
const WebhookEvent = require("../models/WebhookEvent");
const { createMerchantOrder } = require("../controllers/user/order.controller");
const { handleWebhook, verifyOrder } = require("../controllers/webhook/merchant-os.controller");

// Helper to mock Express response
const makeMockRes = () => {
  const res = {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.body = data;
      return this;
    },
  };
  return res;
};

// Save original mongoose and axios functions to restore later
const originalMenuFindById = Menu.findById;
const originalOrderCreate = Order.create;
const originalOrderFindOne = Order.findOne;
const originalWebhookEventFindOne = WebhookEvent.findOne;
const originalWebhookEventCreate = WebhookEvent.create;
const originalAxiosGet = axios.get;
const originalSetTimeout = global.setTimeout;

const restoreMocks = () => {
  Menu.findById = originalMenuFindById;
  Order.create = originalOrderCreate;
  Order.findOne = originalOrderFindOne;
  WebhookEvent.findOne = originalWebhookEventFindOne;
  WebhookEvent.create = originalWebhookEventCreate;
  axios.get = originalAxiosGet;
  global.setTimeout = originalSetTimeout;
};

test.afterEach(() => {
  restoreMocks();
});

test("Create Order API - Happy Path", async () => {
  const req = {
    body: {
      product_id: new mongoose.Types.ObjectId().toString(),
      quantity: 2,
      coupon_code: "SAVE10",
      address: "123 Test St",
      user_id: new mongoose.Types.ObjectId().toString(),
    },
  };
  const res = makeMockRes();

  // Mock database calls
  Menu.findById = async (id) => {
    return {
      _id: id,
      price: 150,
      available: true,
    };
  };

  let createdOrderData = null;
  Order.create = async (data) => {
    createdOrderData = data;
    return { _id: "order_id_123", ...data };
  };

  await createMerchantOrder(req, res);

  assert.strictEqual(res.statusCode, 201);
  assert.strictEqual(res.body.success, true);
  assert.match(res.body.merchant_order_id, /^ORD-/);
  assert.strictEqual(res.body.status, "pending");
  assert.strictEqual(res.body.order_total, 300);

  // Validate stored fields in database
  assert.ok(createdOrderData);
  assert.strictEqual(createdOrderData.price, 300);
  assert.strictEqual(createdOrderData.unitPrice, 150);
  assert.strictEqual(createdOrderData.quantity, 2);
  assert.strictEqual(createdOrderData.couponCode, "SAVE10");
  assert.strictEqual(createdOrderData.address, "123 Test St");
  assert.strictEqual(createdOrderData.status, "pending");
});

test("Create Order API - Product Not Found (404)", async () => {
  const req = {
    body: {
      product_id: new mongoose.Types.ObjectId().toString(),
      quantity: 1,
      address: "123 Test St",
      user_id: new mongoose.Types.ObjectId().toString(),
    },
  };
  const res = makeMockRes();

  Menu.findById = async () => null;

  await createMerchantOrder(req, res);

  assert.strictEqual(res.statusCode, 404);
  assert.strictEqual(res.body.success, false);
  assert.strictEqual(res.body.message, "Product not found");
});

test("Create Order API - Product Out of Stock/Unavailable (400)", async () => {
  const req = {
    body: {
      product_id: new mongoose.Types.ObjectId().toString(),
      quantity: 1,
      address: "123 Test St",
      user_id: new mongoose.Types.ObjectId().toString(),
    },
  };
  const res = makeMockRes();

  Menu.findById = async (id) => {
    return {
      _id: id,
      price: 100,
      available: false,
    };
  };

  await createMerchantOrder(req, res);

  assert.strictEqual(res.statusCode, 400);
  assert.strictEqual(res.body.success, false);
  assert.strictEqual(res.body.message, "Product is not available or out of stock");
});

test("Create Order API - Invalid Quantity (400)", async () => {
  const req = {
    body: {
      product_id: new mongoose.Types.ObjectId().toString(),
      quantity: -5,
      address: "123 Test St",
      user_id: new mongoose.Types.ObjectId().toString(),
    },
  };
  const res = makeMockRes();

  await createMerchantOrder(req, res);

  assert.strictEqual(res.statusCode, 400);
  assert.strictEqual(res.body.success, false);
  assert.match(res.body.message, /quantity must be a number greater than 0/);
});

test("Webhook - Duplicate Event ID (Idempotency 200)", async () => {
  const req = {
    body: {
      event: "order.payment_completed",
      event_id: "evt_duplicate",
      merchant_order_id: "ORD-12345",
    },
  };
  const res = makeMockRes();

  WebhookEvent.findOne = async (query) => {
    if (query.eventId === "evt_duplicate") {
      return { eventId: "evt_duplicate" };
    }
    return null;
  };

  await handleWebhook(req, res);

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.success, true);
  assert.strictEqual(res.body.message, "Event already processed");
});

test("Webhook - Unknown Order (404)", async () => {
  const req = {
    body: {
      event: "order.payment_completed",
      event_id: "evt_unknown",
      merchant_order_id: "ORD-UNKNOWN",
    },
  };
  const res = makeMockRes();

  WebhookEvent.findOne = async () => null;
  Order.findOne = async () => null;

  await handleWebhook(req, res);

  assert.strictEqual(res.statusCode, 404);
  assert.strictEqual(res.body.success, false);
  assert.strictEqual(res.body.message, "Order not found");
});

test("Webhook & Verify - Happy Path (Confirmed & Matches Amount)", async () => {
  global.setTimeout = () => {};
  const req = {
    body: {
      event: "order.payment_completed",
      event_id: "evt_happy",
      merchant_order_id: "ORD-HAPPY",
    },
  };
  const res = makeMockRes();

  WebhookEvent.findOne = async () => null;

  let savedOrder = null;
  const mockOrder = {
    merchantOrderId: "ORD-HAPPY",
    price: 300,
    status: "pending",
    async save() {
      savedOrder = this;
      return this;
    },
  };

  Order.findOne = async () => mockOrder;

  // Mock Axios for verify endpoint response
  axios.get = async (url, config) => {
    assert.strictEqual(url, process.env.MERCHANT_OS_VERIFY_URL);
    assert.strictEqual(config.params.merchant_order_id, "ORD-HAPPY");
    assert.strictEqual(config.headers.Authorization, `Bearer ${process.env.MERCHANT_OS_WEBHOOK_KEY}`);
    return {
      status: 200,
      data: {
        payment: {
          status: "captured",
          razorpay_payment_id: "pay_happy_id",
        },
        data: {
          order: {
            order_total: 300,
          },
        },
      },
    };
  };

  let webhookEventCreated = null;
  WebhookEvent.create = async (data) => {
    webhookEventCreated = data;
    return data;
  };

  // Run webhook endpoint handler
  await handleWebhook(req, res);

  // Webhook receiver responds 200 promptly
  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.success, true);
  assert.strictEqual(res.body.message, "Processing payment confirmation");

  // Manually run verifyOrder directly to test the background verification logic synchronous in test
  await verifyOrder("ORD-HAPPY", "evt_happy");

  // Validate state mutations
  assert.ok(savedOrder);
  assert.strictEqual(savedOrder.status, "confirmed");
  assert.strictEqual(savedOrder.razorpayPaymentId, "pay_happy_id");
  assert.ok(savedOrder.confirmedAt instanceof Date);

  // Validate idempotency database write
  assert.ok(webhookEventCreated);
  assert.strictEqual(webhookEventCreated.eventId, "evt_happy");
});

test("Webhook & Verify - Amount Mismatch (Flags Order)", async () => {
  const mockOrder = {
    merchantOrderId: "ORD-MISMATCH",
    price: 300, // Stored total
    status: "pending",
    async save() {
      return this;
    },
  };

  Order.findOne = async () => mockOrder;

  // Mock Axios returns order_total of 100 instead of 300
  axios.get = async () => {
    return {
      status: 200,
      data: {
        payment: {
          status: "captured",
          razorpay_payment_id: "pay_mismatch_id",
        },
        data: {
          order: {
            order_total: 100, // Paid mismatch
          },
        },
      },
    };
  };

  await verifyOrder("ORD-MISMATCH", "evt_mismatch");

  assert.strictEqual(mockOrder.status, "flagged_amount_mismatch");
  assert.notStrictEqual(mockOrder.status, "confirmed");
});

test("Webhook & Verify - Merchant OS Verify Call Failure (Leaves Pending)", async () => {
  const mockOrder = {
    merchantOrderId: "ORD-FAIL",
    price: 300,
    status: "pending",
    async save() {
      return this;
    },
  };

  Order.findOne = async () => mockOrder;

  // Mock Axios throws error
  axios.get = async () => {
    throw new Error("Network Timeout");
  };

  await verifyOrder("ORD-FAIL", "evt_fail");

  // Order status should remain pending due to transient failure
  assert.strictEqual(mockOrder.status, "pending");
});
