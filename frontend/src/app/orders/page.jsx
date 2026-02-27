"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import AdvancedLoader from "@/components/ui/AdvancedLoader";
import { Package, Calendar, Clock, ChevronRight, ShoppingBag, ReceiptText } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function OrdersPage() {
    const { token, serverURL, loading: authLoading } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const response = await fetch(`${serverURL}/user/my-orders`, {
                    headers: {
                        Authorization: token.replace(/"/g, ""),
                    },
                });
                const data = await response.json();
                if (data.success) {
                    setOrders(data.orders);
                } else {
                    setError(data.message || "Failed to fetch orders");
                }
            } catch (err) {
                setError(err.message || "An error occurred while fetching orders");
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading) {
            fetchOrders();
        }
    }, [token, serverURL, authLoading]);

    if (authLoading || loading) {
        return <AdvancedLoader />;
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
                <div className="bg-red-50 p-4 rounded-full mb-4">
                    <ReceiptText className="w-12 h-12 text-red-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
                <p className="text-gray-600 mb-6 max-w-md">{error}</p>
                <Button onClick={() => window.location.reload()} variant="outline">
                    Try Again
                </Button>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
                <div className="bg-primary/10 p-6 rounded-full mb-6">
                    <ShoppingBag className="w-16 h-16 text-primary" />
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900 mb-2">No Orders Yet</h2>
                <p className="text-gray-600 mb-8 max-w-sm">
                    It looks like you haven&apos;t placed any orders yet. Start exploring our delicious menu!
                </p>
                <Link href="/">
                    <Button size="lg" className="rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-primary/30 transition-all duration-300">
                        Order Now
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            <div className="max-w-4xl mx-auto px-4 pt-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight">My Orders</h1>
                        <p className="text-gray-500 mt-1 flex items-center gap-2">
                            <Package className="w-4 h-4" />
                            Total {orders.length} orders placed
                        </p>
                    </div>
                    <Link href="/">
                        <Button variant="ghost" className="text-primary font-bold hover:bg-primary/5">
                            Continue Shopping <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    </Link>
                </div>

                <div className="space-y-6">
                    {orders.map((order) => (
                        <div
                            key={order._id}
                            className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 overflow-hidden"
                        >
                            <div className="p-6">
                                <div className="flex flex-wrap items-center justify-between mb-6 pb-6 border-b border-gray-50 gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-primary/10 p-2.5 rounded-2xl">
                                            <Calendar className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Order Date</p>
                                            <p className="text-sm font-bold text-gray-900">
                                                {new Date(order.createdAt).toLocaleDateString("en-US", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="bg-secondary/10 p-2.5 rounded-2xl">
                                            <Clock className="w-5 h-5 text-secondary" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Order Time</p>
                                            <p className="text-sm font-bold text-gray-900">
                                                {new Date(order.createdAt).toLocaleTimeString("en-US", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    <Badge variant="secondary" className="bg-green-50 text-green-600 border-green-100 px-4 py-1.5 rounded-full text-xs font-bold">
                                        Delivered
                                    </Badge>
                                </div>

                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="relative w-full md:w-32 h-32 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                                        <img
                                            src={order.menuId?.thumbnail || "/placeholder-food.png"}
                                            alt={order.menuId?.itemName || "Food item"}
                                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>

                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                                                {order.menuId?.itemName || "Item Name Unavailable"}
                                            </h3>
                                            <p className="text-sm text-gray-500 line-clamp-2 max-w-lg mb-4">
                                                {order.menuId?.description || "A delicious meal prepared just for you with fresh ingredients."}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between mt-auto">
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-2xl font-black text-gray-900">₹{order.price * order.quantity}</span>
                                                <span className="text-sm font-bold text-gray-400">
                                                    {order.quantity} × ₹{order.price}
                                                </span>
                                            </div>
                                            <Link href={`/order/${order._id}`}>
                                                <Button variant="outline" className="rounded-xl border-gray-200 hover:border-primary hover:text-primary transition-colors text-xs font-bold px-5">
                                                    View Details
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
