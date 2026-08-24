# Merchant OS API Reference

This document details the API request and response structures for the Merchant OS integration in Ponion, including the Order Creation/Simulation endpoint, the Webhook receiver, and the background Verification endpoint.

---

## 1. Create / Simulate Order
Creates a pending merchant order, or returns a simulated order if the requested product(s) are not present in the database.

* **URL**: `/user/order/merchant-os`
* **Method**: `POST`
* **Headers**:
  * `Content-Type: application/json`
  * `Authorization: Bearer <JWT_Token>`
* **Request Body Schema**:
  * **Multi-item Cart Format** (Recommended):
    * `cart` (Array, optional): List of items to purchase. If specified, `product_id` and `quantity` fields are ignored.
      * `product_id` (String, required): ID of the product.
      * `quantity` (Number, required): Must be a number greater than 0.
      * `price` (Number, optional): Optional price for simulated fallback checks.
  * **Single Product Format** (Legacy):
    * `product_id` (String, optional): ID of the product.
    * `quantity` (Number, optional): Must be a number greater than 0.
  * **Common Fields**:
    * `address` (String, required): The delivery address.
    * `coupon_code` (String, optional): Coupon code.
    * `user_id` (String, optional): Overrides the default authenticated user ID.

### Request Example
```json
{
  "cart": [
    {
      "product_id": "60d5ec49f3e4b42b10f2d4a1",
      "quantity": 1,
      "price": 299
    },
    {
      "product_id": "60d5ec49f3e4b42b10f2d4a2",
      "quantity": 2,
      "price": 150
    }
  ],
  "address": "123 Main St, Springfield",
  "coupon_code": "DISCOUNT10"
}
```

### Responses
#### Success (201 Created - Real Order Saved to DB)
Returned when all products exist in the database. Order records are persisted.
```json
{
  "success": true,
  "merchant_order_id": "ORD-1624632000000-A2B3",
  "status": "pending",
  "order_total": 599
}
```

#### Success (200 OK - Simulated Order)
Returned when everything is valid, but one or more product IDs are missing from the database. No order documents are written to the database.
```json
{
  "success": true,
  "message": "endpoint working and simulate 2 items",
  "merchant_order_id": "ORD-1624632000000-C5D6",
  "status": "pending",
  "order_total": 599
}
```

#### Error (400 Bad Request)
Returned for validation issues such as missing address or invalid quantity.
```json
{
  "success": false,
  "message": "quantity must be a number greater than 0"
}
```

---

## 2. Webhook Receiver
Receives payment completion notifications from Merchant OS.

* **URL**: `/webhook/merchant-os`
* **Method**: `POST`
* **Headers**:
  * `Content-Type: application/json`
* **Request Body Schema**:
  * `event` (String, required): Must be exactly `"order.payment_completed"`.
  * `event_id` (String, required): Unique event tracking identifier (for idempotency checks).
  * `merchant_order_id` (String, required): The base merchant order ID.

### Request Example
```json
{
  "event": "order.payment_completed",
  "event_id": "evt_98765",
  "merchant_order_id": "ORD-1624632000000-A2B3"
}
```

### Responses
#### Success (200 OK)
Returned on successful receipt (triggers background verification) or if the event has already been processed.
```json
{
  "success": true,
  "message": "Processing payment confirmation"
}
```

#### Success (200 OK - Already Confirmed)
Returned if all matching order items are already confirmed.
```json
{
  "success": true,
  "message": "Order already confirmed"
}
```

#### Error (404 Not Found)
Returned if the `merchant_order_id` does not match any orders in the database.
```json
{
  "success": false,
  "message": "Order not found"
}
```

#### Error (400 Bad Request)
Returned if request fields are missing or if the event type is unsupported.
```json
{
  "success": false,
  "message": "Invalid webhook payload"
}
```

---

## 3. Remote Verification API
The API requested by the Ponion backend to verify transaction integrity from Merchant OS.

* **URL**: `{process.env.MERCHANT_OS_VERIFY_URL}`
* **Method**: `GET`
* **Query Parameters**:
  * `merchant_order_id` (String, required): The base order ID to verify.
* **Headers**:
  * `Authorization: Bearer {process.env.MERCHANT_OS_WEBHOOK_KEY}`

### Expected JSON Response
```json
{
  "payment": {
    "status": "captured",
    "razorpay_payment_id": "pay_xyz123"
  },
  "data": {
    "order": {
      "order_total": 599
    }
  }
}
```
