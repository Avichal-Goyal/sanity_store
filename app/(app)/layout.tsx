import Script from "next/script";
import React, { Children } from 'react'
import { ClerkProvider } from "@clerk/nextjs";
import { CartStoreProvider } from '@/lib/store/cart-store-provider';
import { Toaster } from "@/components/ui/sonner";
import { SanityLive } from '@/sanity/lib/live';
import { CartSheet } from '@/components/cart/CartSheet';
function layout({ children }: { children: React.ReactNode }) {
    return (
        <ClerkProvider>
            <CartStoreProvider>
                <main>{children}</main>
                <Script
                src="https://checkout.razorpay.com/v1/checkout.js"
                strategy="lazyOnload"
                />
                <CartSheet />
                <Toaster position="bottom-center" />
                <SanityLive />
            </CartStoreProvider>
        </ClerkProvider>
    );
}

export default layout