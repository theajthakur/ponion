export default async function handlePayment(order, callback, cancelCallback) {
  if (!window.Razorpay) {
    await new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }

  const options = {
    key: "rzp_test_RbAnmtGe8gnCv6",
    amount: order.amount,
    currency: order.currency,
    name: "Ponion",
    description: "Order Payment",
    order_id: order.id,
    handler: callback,
    modal: {
      ondismiss: cancelCallback,
    },
    theme: {
      color: "#ff4c4c",
    },
  };

  const razor = new window.Razorpay(options);
  razor.open();
}
