import { NextResponse } from "next/server";
import crypto from "crypto";
import { client } from "@/sanity/lib/client";

export async function POST(req: Request) {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        sanity_order_id
    } = await req.json();

    // Create the signature string
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    // Hash it using the Razorpay Secret Key
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
        .update(body.toString())
        .digest("hex");

    // Compare signatures
    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
        // Update Sanity status to paid
        await client
        .patch(sanity_order_id)
        .set({
            status: "paid",
            rzorpayPaymentId: razorpay_payment_id // You can repurpose this field or add a razorpayPaymentId field
        })
        .commit();

        return NextResponse.json({ message: "Payment verified successfully" }, { status: 200 });
    } else {
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
}