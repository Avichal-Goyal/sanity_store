import React, { Children } from 'react'
import { ClerkProvider } from "@clerk/nextjs";
import { CartStoreProvider } from '@/lib/store/cart-store-provider';
import { SanityLive } from '@/sanity/lib/live';
function layout({ children }: { children: React.ReactNode }) {
    return (
        <ClerkProvider>
            <CartStoreProvider>
                <main>{children}</main>
                <SanityLive />
            </CartStoreProvider>
        </ClerkProvider>
    );
}

export default layout