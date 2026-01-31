import { NextResponse } from "next/server";
import crypto from "crypto";
import { client } from "@/sanity/lib/client";
import { sendMail } from "@/lib/mail";
import { orderConfirmationTemplate } from "@/lib/templates/order-confirmation";

export async function POST(req: Request) {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    sanity_order_id,
  } = await req.json();

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  await client
    .patch(sanity_order_id)
    .set({
      status: "paid",
      razorpayPaymentId: razorpay_payment_id,
    })
    .commit();

  const order = await client.getDocument(sanity_order_id);

  if (!order?.email) {
    return NextResponse.json(
      { error: "Order email not found" },
      { status: 400 }
    );
  }

  await sendMail({
    to: order.email,
    subject: `Order Confirmed – ${order.orderNumber} 🎉`,
    html: orderConfirmationTemplate({
      customerName: order.email.split("@")[0],
      orderId: order.orderNumber,
      totalAmount: order.total,
    }),
  });

  return NextResponse.json(
    { message: "Payment verified & email sent" },
    { status: 200 }
  );
}
