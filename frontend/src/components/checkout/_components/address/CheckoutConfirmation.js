import { useAuth } from "@/components/providers/AuthProvider";
import { useCart } from "@/components/providers/CartProvider";
import { OrderConfirmed } from "@/components/ui/build/OrderConfirmed";
import handlePayment from "@/utils/Razorpaylaunch";
import { Loader2Icon, MapPin } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
export default function CheckoutConfirmation({ address, onChange }) {
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
        <p className="text-secondary text-lg">No address found.</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      {paid ? (
        <OrderConfirmed />
      ) : (
        <div className="bg-white rounded-3xl shadow-xl border border-border overflow-hidden w-full max-w-2xl">
          <div className="bg-primary/5 p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">
                Confirm Order
              </h2>
              <button
                onClick={onChange}
                className="text-sm font-semibold text-primary hover:text-primary-hover underline decoration-2 underline-offset-4"
              >
                Change Address
              </button>
            </div>
          </div>

          <div className="p-8 space-y-8">
            <div className="flex gap-4 p-4 rounded-2xl bg-surface border border-border/50">
              <div className="p-3 bg-white rounded-xl shadow-sm h-fit">
                <MapPin className="text-primary w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-lg text-foreground">Delivery Address</h3>
                <p className="text-secondary leading-relaxed">
                  {address.Name}, {address.Flat}, {address.Landmark}, {address.Area}
                </p>
                <p className="text-secondary">
                  {address.District}, {address.State} - <span className="font-semibold">{address.PinCode}</span>
                </p>
                <p className="text-muted text-sm font-medium mt-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  {address.Mobile}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-4 border-t border-dashed border-border">
                <span className="text-secondary font-medium">Subtotal</span>
                <span className="font-semibold text-foreground">₹{total}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-border">
                <span className="text-secondary font-medium">Delivery Fee</span>
                <span className="font-semibold text-success">Free</span>
              </div>
              <div className="flex justify-between items-center text-xl pt-2">
                <span className="font-bold text-foreground">Total Amount</span>
                <span className="font-black text-primary text-2xl">₹{total}</span>
              </div>
            </div>

            {loading ? (
              <button className="w-full py-4 rounded-xl bg-primary/80 text-white cursor-wait flex justify-center items-center gap-3">
                <Loader2Icon className="animate-spin w-6 h-6" />
                <span className="font-bold text-lg">Processing...</span>
              </button>
            ) : (
              <button
                className="w-full py-4 rounded-xl bg-primary hover:bg-primary-hover text-white transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1 font-bold text-lg flex justify-center items-center gap-2"
                onClick={checkout}
              >
                <span>Proceed to Payment</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </button>
            )}

            <p className="text-center text-xs text-muted font-medium">
              By placing this order, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
