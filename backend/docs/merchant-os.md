# Merchant OS Integration Documentation

This document describes the Merchant OS order, webhook, and verification flow in the Ponion backend.

## Flow Overview
When a third-party service ("Merchant OS") handles customer acquisition and payment on our behalf:
1. **Order Creation**: The user places a pending order via Ponion's Merchant OS order endpoint. We validate availability and snapshot the unit price.
2. **Webhook Notification**: When the customer successfully pays on Merchant OS, Merchant OS posts to our webhook receiver `/webhook/merchant-os`.
3. **Verification**: The backend verifies the webhook by querying the Merchant OS Verification API directly. Upon verification, the order status is updated.

---

## Database Schemas

### Order (`models/Order.js`)
We extend the standard Order model with the following fields:
* `merchantOrderId` (String, unique, sparse): The unique order identifier generated during order creation.
* `unitPrice` (Number): The snapshot of the menu item's price at the time the order was placed.
* `couponCode` (String): The coupon code applied (currently no discount logic is applied).
* `address` (String): The shipping/delivery address.
* `razorpayPaymentId` (String): Stored upon successful verification (returned by Merchant OS).
* `confirmedAt` (Date): Timestamp when the order was confirmed.
* `status` (String): The status field now supports:
  - `"pending"`: Order created, awaiting webhook notification.
  - `"confirmed"`: Payment captured and verified.
  - `"failed"`: Payment failed to capture.
  - `"flagged_amount_mismatch"`: Payment was captured, but the paid amount does not match our recorded total.

### WebhookEvent (`models/WebhookEvent.js`)
Used to enforce idempotency of webhook event processing:
* `eventId` (String, unique, required): The unique event ID sent by Merchant OS (`event_id`).

---

## API Endpoints

### 1. Create Merchant OS Order
* **Endpoint**: `POST /user/order/merchant-os`
* **Headers**: `Authorization: <JWT_Token>`
* **Request Body**:
  ```json
  {
    "product_id": "60d5ec49f3e4b42b10f2d4a1",
    "quantity": 2,
    "coupon_code": "DISCOUNT10",
    "address": "123 Main St, Springfield",
    "user_id": "60d5ec49f3e4b42b10f2d4a0"
  }
  ```
* **Validation**:
  - `quantity` must be greater than 0.
  - `product_id` must reference a valid and available `Menu` item (`available !== false`).
  - Total price `order_total` is computed server-side (`quantity * product.price`). **Do not trust request price.**
* **Response**:
  ```json
  {
    "success": true,
    "merchant_order_id": "ORD-1624632000000-1234",
    "status": "pending",
    "order_total": 500
  }
  ```

### 2. Webhook Receiver
* **Endpoint**: `POST /webhook/merchant-os`
* **Headers**: No JWT authentication required.
* **Request Body**:
  ```json
  {
    "event": "order.payment_completed",
    "event_id": "evt_12345",
    "merchant_order_id": "ORD-1624632000000-1234"
  }
  ```
* **Validation**:
  - `event` must be exactly `"order.payment_completed"`.
  - Both `event_id` and `merchant_order_id` must be present.
* **Idempotency**:
  - If `event_id` is already in the `webhook_events` collection, immediately respond with `200 OK`.
* **Flow**:
  1. Finds the order by `merchantOrderId`. If not found, returns `404 Not Found`.
  2. If the order is already `"confirmed"`, returns `200 OK`.
  3. Responds immediately with `200 OK` (to prevent timeout).
  4. Runs the verify flow asynchronously.

---

## Verification Flow (Background Job)
* **Endpoint Called**: `GET {process.env.MERCHANT_OS_VERIFY_URL}?merchant_order_id={merchant_order_id}`
* **Headers**: `Authorization: Bearer {process.env.MERCHANT_OS_WEBHOOK_KEY}`
* **Response Structure Expected**:
  ```json
  {
    "payment": {
      "status": "captured",
      "razorpay_payment_id": "pay_xyz123"
    },
    "data": {
      "order": {
        "order_total": 500
      }
    }
  }
  ```

### Processing Logic
1. **Network/Transient Failures**: If the API call fails (network issue or non-2xx status code), the order is left in `"pending"` status. Merchant OS can retry or we can trigger it again later.
2. **Payment Not Captured**: If `payment.status !== "captured"`, the order status is updated to `"failed"`.
3. **Amount Mismatch**:
   - Compares the returned `data.order.order_total` against the order's stored `price`.
   - If they do not match, the order is updated to `"flagged_amount_mismatch"` and a warning is logged.
4. **Successful Matching**:
   - The order status is updated to `"confirmed"`.
   - `razorpayPaymentId` is set to the returned payment ID.
   - `confirmedAt` is set to the current timestamp.
   - The `event_id` is recorded in `webhook_events` to ensure idempotency.

> [!NOTE]
> **Production Hardening TODO**: In production, this inline background verification should be replaced with a message queue (e.g., BullMQ or RabbitMQ) and retried with exponential backoff.
