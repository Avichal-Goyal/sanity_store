import { sendMail } from "@/lib/mail";
import { orderConfirmationTemplate } from "@/lib/templates/order-confirmation";

await sendMail({
  to: "customer@test.com",
  subject: "Your order is confirmed 🎉",
  html: orderConfirmationTemplate({
    customerName: "Gourish",
    orderId: "ORD12345",
    totalAmount: 2499,
  }),
});

