"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useCartStore, useCartItems, useTotalPrice } from "@/lib/store/cart-store-provider";
 // Adjust this to your actual store path
import { AddressForm, AddressValues } from "@/components/checkoutPage/AddressForm";
import { useRouter } from "next/navigation";
import Script from "next/script";

export default function CheckoutPage() {
    const { user } = useUser();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);

    // 1. Pull data from your Zustand store
    const items = useCartItems();
    const clearCart = useCartStore((state) => state.clearCart);

    const totalAmount = useTotalPrice();

    //The logic that triggers after AddressForm validation passes
    const handlePaymentFlow = async (addressData: AddressValues) => {
        if (items.length === 0) {
        alert("Your cart is empty!");
        return;
        }

        setIsProcessing(true);

        try {
        //Create the Order Bridge in our Backend
        const res = await fetch("/api/razorpay/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
            amount: totalAmount,
            cartItems: items,
            userdetails: {
                email: user?.primaryEmailAddress?.emailAddress,
                address: addressData
            },
            }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to initiate order");

        //Configure Razorpay Popup
        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: Math.round(totalAmount * 100), // Amount in paise
            currency: "INR",
            name: "store",
            description: "Purchase for " + (user?.fullName || "User"),
            order_id: data.razorpayOrderId,

            //Successful Payment Handler
            handler: async function (response: any) {
            // Send verification to our API
            const verifyRes = await fetch("/api/razorpay/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                sanity_order_id: data.sanityOrderId, // The internal Sanity ID
                }),
            });

            if (verifyRes.ok) {
                clearCart();
                router.push("/success"); // Redirect to success page
            } else {
                alert("Payment verification failed. Please contact support.");
            }
            },
            prefill: {
            name: addressData.name,
            email: user?.primaryEmailAddress?.emailAddress,
            },
            theme: { color: "#000000" },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();

        } catch (error: any) {
        console.error("Checkout Error:", error);
        alert(error.message);
        } finally {
        setIsProcessing(false);
        }
    };

    return (
        <main className="container mx-auto max-w-5xl py-12 px-4 min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7">
            <div className="bg-white p-6 border rounded-xl shadow-sm">
                <h2 className="text-2xl font-semibold mb-6">Shipping Details</h2>
                <AddressForm onSubmit={handlePaymentFlow} isLoading={isProcessing} />
            </div>
            </div>

            {/* Right Side: Order Summary */}
            <div className="lg:col-span-5">
            <div className="bg-gray-50 p-6 border rounded-xl sticky top-24">
                <h2 className="text-xl font-semibold mb-4 border-b pb-4">Order Summary</h2>
                <div className="space-y-4 max-h-[400px] overflow-y-auto mb-6 pr-2">
                {items.map((item) => (
                    <div key={item.productId} className="flex justify-between items-center text-sm">
                    <div className="flex flex-col">
                        <span className="font-medium">{item.name}</span>
                        <span className="text-gray-500">Qty: {item.quantity}</span>
                    </div>
                    <span className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-blue-600 pt-2 border-t">
                    <span>Total Amount</span>
                    <span>₹{totalAmount.toFixed(2)}</span>
                </div>
                </div>
            </div>
            </div>
        </div>
        </main>
    );
}