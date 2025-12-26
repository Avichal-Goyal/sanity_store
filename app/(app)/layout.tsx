import React, { Children } from 'react'
import { ClerkProvider } from "@clerk/nextjs";
import { SanityLive } from '@/sanity/lib/live';
function layout({ children }: { children: React.ReactNode }) {
    return (
        <ClerkProvider>
            <main>{children}</main>
            <SanityLive />
        </ClerkProvider>
    );
}

export default layout