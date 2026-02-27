"use client";

import React, { useEffect, useState, use } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import AdvancedLoader from "@/components/ui/AdvancedLoader";
import {
    Package,
    Calendar,
    Clock,
    ChevronLeft,
    CheckCircle2,
    Truck,
    Box,
    UtensilsCrossed,
    MapPin,
    ReceiptText,
    ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const statusSteps = [
    { label: "Confirmed", icon: CheckCircle2, color: "text-green-500", bg: "bg-green-100" },
    { label: "Packed", icon: Box, color: "text-blue-500", bg: "bg-blue-100" },
    { label: "Shipped", icon: Truck, color: "text-purple-500", bg: "bg-purple-100" },
    { label: "Delivered", icon: UtensilsCrossed, color: "text-orange-500", bg: "bg-orange-100" }
];

export default function OrderDetailPage({ params: paramsPromise }) {
    const params = use(paramsPromise);
    const { orderId } = params;
    const { token, serverURL, loading: authLoading } = useAuth();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const response = await fetch(`${serverURL}/user/order/${orderId}`, {
                    headers: {
                        Authorization: token.replace(/"/g, ""),
                    },
                });
                const data = await response.json();
                if (data.success) {
                    setOrder(data.order);
                } else {
                    setError(data.message || "Failed to fetch order details");
                }
            } catch (err) {
                setError(err.message || "An error occurred while fetching order details");
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading) {
            fetchOrder();
        }
    }, [token, serverURL, authLoading, orderId]);

    if (authLoading || loading) {
        return <AdvancedLoader />;
    }

    if (error || !order) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
                <div className="bg-red-50 p-4 rounded-full mb-4">
                    <ReceiptText className="w-12 h-12 text-red-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
                <p className="text-gray-600 mb-6 max-w-md">{error || "The order you are looking for does not exist."}</p>
                <Link href="/orders">
                    <Button variant="outline" className="rounded-full px-8">
                        Back to Orders
                    </Button>
                </Link>
            </div>
        );
    }

    const currentStatusIndex = statusSteps.findIndex(step => step.label === (order.status || "Confirmed"));

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20 pt-10">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/orders">
                        <Button variant="ghost" size="icon" className="rounded-full bg-white shadow-sm hover:bg-white hover:shadow-md transition-all">
                            <ChevronLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Order Details</h1>
                        <p className="text-gray-500 text-sm">Order ID: #{order._id.slice(-8).toUpperCase()}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Timeline */}
                        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                            <h2 className="text-lg font-bold text-gray-900 mb-8 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-primary" />
                                Order Status
                            </h2>

                            <div className="relative">
                                {/* Timeline Line */}
                                <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-100 hidden md:block">
                                    <motion.div
                                        className="h-full bg-primary"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(currentStatusIndex / (statusSteps.length - 1)) * 100}%` }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                    />
                                </div>

                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative gap-8 md:gap-0">
                                    {statusSteps.map((step, index) => {
                                        const StatusIcon = step.icon;
                                        const isCompleted = index <= currentStatusIndex;
                                        const isCurrent = index === currentStatusIndex;

                                        return (
                                            <div key={step.label} className="flex md:flex-col items-center gap-4 md:gap-3 flex-1">
                                                <div className="relative z-10">
                                                    <motion.div
                                                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${isCompleted ? "bg-primary text-white" : "bg-white border-2 border-gray-100 text-gray-300"
                                                            } ${isCurrent ? "ring-4 ring-primary/20" : ""}`}
                                                        initial={isCurrent ? { scale: 0.8 } : false}
                                                        animate={isCurrent ? { scale: 1 } : false}
                                                        transition={{ repeat: Infinity, duration: 2, repeatType: "reverse" }}
                                                    >
                                                        <StatusIcon className="w-5 h-5" />
                                                    </motion.div>
                                                    {index < statusSteps.length - 1 && (
                                                        <div className={`absolute top-10 left-1/2 -ml-px w-0.5 h-8 md:hidden ${index < currentStatusIndex ? "bg-primary" : "bg-gray-100"
                                                            }`} />
                                                    )}
                                                </div>
                                                <div className="md:text-center">
                                                    <p className={`text-sm font-bold ${isCompleted ? "text-gray-900" : "text-gray-400"}`}>
                                                        {step.label}
                                                    </p>
                                                    {isCurrent && (
                                                        <p className="text-[10px] font-medium text-primary uppercase tracking-wider">Current</p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm overflow-hidden">
                            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Package className="w-5 h-5 text-primary" />
                                Order Items
                            </h2>

                            <div className="flex items-center gap-6 p-4 rounded-2xl bg-gray-50/50 border border-gray-50 group transition-all duration-300 hover:bg-white hover:shadow-md">
                                <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-200 shrink-0">
                                    <img
                                        src={order.menuId?.thumbnail || "/placeholder-food.png"}
                                        alt={order.menuId?.itemName}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <div className="flex-1">
                                    <Badge variant="outline" className="mb-2 text-[10px] font-bold uppercase tracking-wider border-primary/20 text-primary">
                                        Active Order
                                    </Badge>
                                    <h3 className="text-xl font-bold text-gray-900">{order.menuId?.itemName}</h3>
                                    <p className="text-sm text-gray-500 line-clamp-1 mb-2">{order.menuId?.description}</p>
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg font-black text-gray-900">₹{order.price}</span>
                                        <span className="text-xs font-bold text-gray-400">Qty: {order.quantity}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t border-gray-100 space-y-4">
                                <div className="flex justify-between items-center text-gray-500 font-medium">
                                    <span>Subtotal</span>
                                    <span>₹{order.price * order.quantity}</span>
                                </div>
                                <div className="flex justify-between items-center text-gray-500 font-medium">
                                    <span>Delivery Fee</span>
                                    <span className="text-green-500">FREE</span>
                                </div>
                                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                    <span className="text-xl font-bold text-gray-900">Total Amount</span>
                                    <span className="text-2xl font-black text-primary">₹{order.price * order.quantity}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-8">
                        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-primary" />
                                Delivery Info
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Placed On</p>
                                    <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Time</p>
                                    <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                                        <Clock className="w-4 h-4 text-gray-400" />
                                        {new Date(order.createdAt).toLocaleTimeString("en-US", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-gray-50">
                                    <Button className="w-full rounded-2xl py-6 font-bold flex items-center justify-center gap-2 group shadow-lg shadow-primary/20">
                                        Track Live
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-primary/10 rounded-3xl p-6 border border-primary/10 flex items-start gap-4">
                            <div className="bg-white p-2 rounded-xl">
                                <UtensilsCrossed className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 text-sm">Need Help?</h4>
                                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                                    If you have any issues with your order, please contact our support team.
                                </p>
                                <Link href="#" className="text-xs font-bold text-primary mt-2 flex items-center gap-1 hover:underline">
                                    Chat with us
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
