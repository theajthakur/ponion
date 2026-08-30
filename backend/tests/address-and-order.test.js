process.env.RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || "rzp_test_key";
process.env.RAZORPAY_SECRET = process.env.RAZORPAY_SECRET || "rzp_test_secret";

const Razorpay = require("razorpay");
Razorpay.prototype.orders = {
  create: async (options) => ({
    id: "order_mock_123",
    status: "created",
    amount: options.amount,
    currency: options.currency,
  }),
};

const test = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");

const Address = require("../models/Address");
const Order = require("../models/Order");
const Menu = require("../models/Menu");
const {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} = require("../controllers/user/address.controller");
const { createMerchantOrder } = require("../controllers/user/order.controller");
const { handlePlaceOrder, razorpay } = require("../controllers/user/payment.controller");

razorpay.orders = {
  create: async (options) => ({
    id: "order_mock_123",
    status: "created",
    amount: options.amount,
    currency: options.currency,
  }),
};

// Helper mock for Express response
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

// Store original model methods
const originalAddressFind = Address.find;
const originalAddressFindOne = Address.findOne;
const originalAddressCreate = Address.create;
const originalAddressUpdateMany = Address.updateMany;
const originalAddressFindOneAndDelete = Address.findOneAndDelete;
const originalOrderCreate = Order.create;
const originalMenuFind = Menu.find;
const originalMenuFindOne = Menu.findOne;

const restoreMocks = () => {
  Address.find = originalAddressFind;
  Address.findOne = originalAddressFindOne;
  Address.create = originalAddressCreate;
  Address.updateMany = originalAddressUpdateMany;
  Address.findOneAndDelete = originalAddressFindOneAndDelete;
  Order.create = originalOrderCreate;
  Menu.find = originalMenuFind;
  Menu.findOne = originalMenuFindOne;
};

test.afterEach(() => {
  restoreMocks();
});

// --- Address Controller Tests ---

test("Address - Create Address (Success)", async () => {
  const userId = new mongoose.Types.ObjectId().toString();
  const req = {
    user: { _id: userId },
    body: {
      label: "Home",
      flatNo: "A-101",
      street: "MG Road",
      landmark: "Near Metro",
      city: "Bengaluru",
      district: "Bengaluru Urban",
      state: "Karnataka",
      pincode: "560001",
      country: "India",
      isDefault: true,
    },
  };
  const res = makeMockRes();

  let updateManyCalled = false;
  Address.updateMany = async (filter, update) => {
    updateManyCalled = true;
  };

  let createdData = null;
  Address.create = async (data) => {
    createdData = data;
    return { _id: "addr_1", ...data };
  };

  await createAddress(req, res);

  assert.strictEqual(res.statusCode, 201);
  assert.strictEqual(res.body.success, true);
  assert.strictEqual(updateManyCalled, true);
  assert.strictEqual(createdData.flatNo, "A-101");
  assert.strictEqual(createdData.pincode, "560001");
  assert.strictEqual(createdData.isDefault, true);
});

test("Address - Create Address (Missing Required Fields)", async () => {
  const userId = new mongoose.Types.ObjectId().toString();
  const req = {
    user: { _id: userId },
    body: {
      flatNo: "A-101",
      // street missing
      city: "Bengaluru",
      district: "Bengaluru Urban",
      state: "Karnataka",
      pincode: "560001",
    },
  };
  const res = makeMockRes();

  await createAddress(req, res);

  assert.strictEqual(res.statusCode, 400);
  assert.strictEqual(res.body.success, false);
  assert.match(res.body.message, /street is required/i);
});

test("Address - Create Address (Invalid Pincode Format)", async () => {
  const userId = new mongoose.Types.ObjectId().toString();
  const req = {
    user: { _id: userId },
    body: {
      flatNo: "A-101",
      street: "MG Road",
      city: "Bengaluru",
      district: "Bengaluru Urban",
      state: "Karnataka",
      pincode: "060001", // Starts with 0 - invalid for 6-digit Indian PIN
    },
  };
  const res = makeMockRes();

  await createAddress(req, res);

  assert.strictEqual(res.statusCode, 400);
  assert.strictEqual(res.body.success, false);
  assert.match(res.body.message, /Invalid pincode format/i);
});

test("Address - List Addresses", async () => {
  const userId = new mongoose.Types.ObjectId().toString();
  const req = { user: { _id: userId } };
  const res = makeMockRes();

  Address.find = (query) => {
    assert.strictEqual(query.userId, userId);
    return {
      sort: (sortObj) => [
        { _id: "addr_default", isDefault: true },
        { _id: "addr_normal", isDefault: false },
      ],
    };
  };

  await getAddresses(req, res);

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.success, true);
  assert.strictEqual(res.body.addresses.length, 2);
  assert.strictEqual(res.body.addresses[0].isDefault, true);
});

test("Address - Update Address (Success)", async () => {
  const userId = new mongoose.Types.ObjectId().toString();
  const addressId = new mongoose.Types.ObjectId().toString();

  const mockAddressDoc = {
    _id: addressId,
    userId,
    flatNo: "A-101",
    street: "Old Street",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    state: "Karnataka",
    pincode: "560001",
    isDefault: false,
    async save() {
      return this;
    },
  };

  Address.findOne = async (query) => {
    if (query._id === addressId && query.userId === userId) {
      return mockAddressDoc;
    }
    return null;
  };

  Address.updateMany = async () => {};

  const req = {
    user: { _id: userId },
    params: { id: addressId },
    body: {
      flatNo: "A-101",
      street: "New Street",
      city: "Bengaluru",
      district: "Bengaluru Urban",
      state: "Karnataka",
      pincode: "560002",
      isDefault: true,
    },
  };
  const res = makeMockRes();

  await updateAddress(req, res);

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.success, true);
  assert.strictEqual(mockAddressDoc.street, "New Street");
  assert.strictEqual(mockAddressDoc.pincode, "560002");
  assert.strictEqual(mockAddressDoc.isDefault, true);
});

test("Address - Update Address (Not Owned / Not Found)", async () => {
  const userId = new mongoose.Types.ObjectId().toString();
  const addressId = new mongoose.Types.ObjectId().toString();

  Address.findOne = async () => null;

  const req = {
    user: { _id: userId },
    params: { id: addressId },
    body: {
      flatNo: "A-101",
      street: "New Street",
      city: "Bengaluru",
      district: "Bengaluru Urban",
      state: "Karnataka",
      pincode: "560002",
    },
  };
  const res = makeMockRes();

  await updateAddress(req, res);

  assert.strictEqual(res.statusCode, 404);
  assert.strictEqual(res.body.success, false);
  assert.match(res.body.message, /Address not found/i);
});

test("Address - Delete Address (Success)", async () => {
  const userId = new mongoose.Types.ObjectId().toString();
  const addressId = new mongoose.Types.ObjectId().toString();

  Address.findOneAndDelete = async (query) => {
    if (query._id === addressId && query.userId === userId) {
      return { _id: addressId, userId };
    }
    return null;
  };

  const req = {
    user: { _id: userId },
    params: { id: addressId },
  };
  const res = makeMockRes();

  await deleteAddress(req, res);

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.success, true);
  assert.strictEqual(res.body.message, "Address deleted successfully");
});

// --- Order Creation & Address Validation Tests ---

test("Order - Create Merchant Order with Valid addressId", async () => {
  const userId = new mongoose.Types.ObjectId().toString();
  const addressId = new mongoose.Types.ObjectId().toString();
  const productId = new mongoose.Types.ObjectId().toString();

  Address.findOne = async (query) => {
    if (query._id === addressId && query.userId === userId) {
      return {
        _id: addressId,
        userId,
        flatNo: "B-202",
        street: "Park Street",
        city: "Mumbai",
        district: "Mumbai Suburban",
        state: "Maharashtra",
        pincode: "400001",
        country: "India",
      };
    }
    return null;
  };

  Menu.find = async () => [
    { _id: productId, price: 200, available: true },
  ];

  let createdOrder = null;
  Order.create = async (data) => {
    createdOrder = data;
    return { _id: "ord_created_1", ...data };
  };

  const req = {
    user: { _id: userId },
    body: {
      product_id: productId,
      quantity: 1,
      addressId,
    },
  };
  const res = makeMockRes();

  await createMerchantOrder(req, res);

  assert.strictEqual(res.statusCode, 201);
  assert.strictEqual(res.body.success, true);
  assert.ok(createdOrder);
  assert.strictEqual(createdOrder.address.street, "Park Street");
  assert.strictEqual(createdOrder.address.pincode, "400001");
});

test("Order - Create Merchant Order with Someone Else's addressId (Fail 400)", async () => {
  const authenticatedUserId = new mongoose.Types.ObjectId().toString();
  const foreignUserId = new mongoose.Types.ObjectId().toString();
  const addressId = new mongoose.Types.ObjectId().toString();

  Address.findOne = async (query) => {
    // Return address owned by someone else
    return null;
  };

  const req = {
    user: { _id: authenticatedUserId },
    body: {
      product_id: new mongoose.Types.ObjectId().toString(),
      quantity: 1,
      addressId,
    },
  };
  const res = makeMockRes();

  await createMerchantOrder(req, res);

  assert.strictEqual(res.statusCode, 400);
  assert.strictEqual(res.body.success, false);
  assert.strictEqual(res.body.error, "INVALID_ADDRESS");
  assert.strictEqual(res.body.message, "Address not found for this user");
});

test("Order - Create Merchant Order with Non-Existent addressId (Fail 400)", async () => {
  const userId = new mongoose.Types.ObjectId().toString();

  Address.findOne = async () => null;

  const req = {
    user: { _id: userId },
    body: {
      product_id: new mongoose.Types.ObjectId().toString(),
      quantity: 1,
      addressId: "non_existent_id",
    },
  };
  const res = makeMockRes();

  await createMerchantOrder(req, res);

  assert.strictEqual(res.statusCode, 400);
  assert.strictEqual(res.body.success, false);
  assert.strictEqual(res.body.error, "INVALID_ADDRESS");
  assert.strictEqual(res.body.message, "Address not found for this user");
});

test("Order - Handle Place Order with Someone Else's addressId (Fail 400)", async () => {
  const userId = new mongoose.Types.ObjectId().toString();

  Address.findOne = async () => null;

  const req = {
    user: { _id: userId },
    body: {
      cart: [{ _id: new mongoose.Types.ObjectId().toString(), quantity: 1 }],
      addressId: new mongoose.Types.ObjectId().toString(),
    },
  };
  const res = makeMockRes();

  await handlePlaceOrder(req, res);

  assert.strictEqual(res.statusCode, 400);
  assert.strictEqual(res.body.success, false);
  assert.strictEqual(res.body.error, "INVALID_ADDRESS");
  assert.strictEqual(res.body.message, "Address not found for this user");
});

test("Order - Handle Place Order with Valid addressId", async () => {
  const userId = new mongoose.Types.ObjectId().toString();
  const addressId = new mongoose.Types.ObjectId().toString();
  const menuId = new mongoose.Types.ObjectId().toString();

  Address.findOne = async (query) => {
    if (query._id === addressId && query.userId === userId) {
      return {
        _id: addressId,
        userId,
        flatNo: "101",
        street: "Main St",
        city: "Delhi",
        district: "New Delhi",
        state: "Delhi",
        pincode: "110001",
      };
    }
    return null;
  };

  Menu.findOne = async () => ({ _id: menuId, price: 150 });

  let savedOrder = null;
  Order.create = async (data) => {
    savedOrder = data;
    return { _id: "ord_rzp_1", ...data };
  };

  const req = {
    user: { _id: userId },
    body: {
      cart: [{ _id: menuId, quantity: 2 }],
      addressId,
    },
  };
  const res = makeMockRes();

  await handlePlaceOrder(req, res);

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.status, "success");
  assert.ok(savedOrder);
  assert.strictEqual(savedOrder.address.street, "Main St");
  assert.strictEqual(savedOrder.price, 300);
});
