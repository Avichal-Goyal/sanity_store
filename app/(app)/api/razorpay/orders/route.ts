import Razorpay from "razorpay";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: Request) {
    try {
        const { userId } = await auth();
        if(!userId) return new NextResponse("Unauthorized", { status: 401 });
      
        const body = await request.json();
        const { amount, cartItems, userdetails } = body;

        let sanityOrder;

        try {
            sanityOrder = await client.create({
                _type: "order",
                orderNumber: `ORD-${Date.now()}`,
                items: cartItems.map((item: any) => ({
                    _key: Math.random().toString(36).substring(2),
                    product: {_type: "reference", _ref: item.productId},
                    quantity: item.quantity,
                    priceAtPurchase: item.price,
                })),
                total: amount,
                status: "pending",
                clerkUserId: userId,
                email: userdetails.email,
                createdAt: new Date().toString(),
            });

        } catch(sanityError) {
            console.error("Sanity Error:", sanityError);
            return NextResponse.json({ error: "Failed to create Sanity order"}, {status: 500});
        }

        let razorpayOrder;
        try {
            razorpayOrder = await razorpay.orders.create({
                amount: Math.round(amount * 100),
                currency: "INR",
                receipt: sanityOrder._id,
            });
        } catch (rzpError) {
            console.error("Razopray Error:", rzpError);
            throw new Error("failed to initiate payment gateway");
        }

        //this ismkaing the bridge between the razorpay and sanity
        //Saving Razorpay ID back to Sanity is the Bridge between razorpay and sanity
        try {
            await client
                .patch(sanityOrder._id)
                .set({ razorpayOrderId: razorpayOrder.id })
                .commit();
        } catch (patchError) {
            console.error("Patch Error:", patchError);
        }

        return NextResponse.json({
            razorpayOrderId: razorpayOrder.id,
            sanityOrderId: sanityOrder._id,
            amount: razorpayOrder
        });
    } catch (error) {
        console.error("Final Catch: ", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }

}