import { useAuth } from "@/components/providers/AuthProvider";
import { useCart } from "@/components/providers/CartProvider";
import { OrderConfirmed } from "@/components/ui/build/OrderConfirmed";
import handlePayment from "@/utils/Razorpaylaunch";
import { Loader2Icon } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
export default function CheckoutConfirmation({ address }) {
  const { total, cart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState(false);
  const { token } = useAuth();

  const launchRazorpay = (order) => {
    handlePayment(order, callback, cancelCallback);
  };

  const callback = async (response) => {
    orderConfirmed();
  };

  const cancelCallback = async () => {
    toast.error("Payment was cancelled by user!");
    setLoading(false);
    setPaid(true);
  };

  const orderConfirmed = () => {
    toast.success("Congratulations, Order Placed!");
    setLoading(false);
    setPaid(true);
    clearCart();
  };

  const checkout = () => {
    setLoading(true);
    try {
      fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/user/payments/create-order`,
        {
          method: "POST",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cart }),
        }
      )
        .then((res) => res.json())
        .then((data) => {
          launchRazorpay(data.order);
        });
    } catch (error) {
      console.log(error);
    }
  };

  if (!address) {
    return (
      <div className="p-6 bg-surface rounded-2xl text-center border border-border">
        <p className="text-text-secondary text-lg">No address found.</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center w-full">
      {paid ? (
        <OrderConfirmed />
      ) : (
        <div className="p-6 bg-surface rounded-2xl shadow-sm border border-border space-y-5 w-full lg:w-md">
          <h2 className="text-xl font-semibold text-foreground">
            Confirm Your Order
          </h2>

          <div className="p-4 rounded-xl bg-accent-surface border border-border">
            <h3 className="font-medium text-lg mb-2 text-foreground">
              Delivery Address
            </h3>
            <p className="text-text-secondary">
              {address.Name}, {address.Flat}, {address.Landmark}, {address.Area}
            </p>
            <p className="text-text-secondary">
              {address.District}, {address.State} - {address.PinCode}
            </p>
            <p className="text-text-muted mt-1">📞 {address.Mobile}</p>
          </div>

          <div className="flex justify-between items-center text-lg">
            <span className="text-text-secondary font-medium">Total:</span>
            <span className="font-semibold text-success">₹{total}</span>
          </div>
          {loading ? (
            <button className="w-full text-lg py-4 rounded-xl bg-primary text-white transition">
              <div className="flex w-full justify-center">
                <Loader2Icon className="animate-spin" />
              </div>
            </button>
          ) : (
            <button
              className="w-full text-lg py-4 rounded-xl bg-primary hover:bg-primary-hover text-white transition"
              onClick={checkout}
            >
              Proceed to Payment
            </button>
          )}
        </div>
      )}
    </div>
  );
}
