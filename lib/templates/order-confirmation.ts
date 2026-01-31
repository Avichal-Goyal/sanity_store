type OrderEmailProps = {
  customerName: string;
  orderId: string;
  totalAmount: number;
};

export function orderConfirmationTemplate({
  customerName,
  orderId,
  totalAmount,
}: OrderEmailProps) {
  return `
  <div style="
    font-family: Arial, sans-serif;
    background-color: #f6f9fc;
    padding: 24px;
  ">
    <div style="
      max-width: 600px;
      margin: auto;
      background: #ffffff;
      border-radius: 8px;
      overflow: hidden;
    ">
      <!-- Header -->
      <div style="
        background: #111827;
        color: #ffffff;
        padding: 20px;
        text-align: center;
        font-size: 20px;
        font-weight: bold;
      ">
        🛒 Sanity Store
      </div>

      <!-- Body -->
      <div style="padding: 24px; color: #374151;">
        <p>Hi <b>${customerName}</b>,</p>

        <p>
          Thank you for your order! We’ve received your purchase and will
          start processing it right away.
        </p>

        <div style="
          background: #f9fafb;
          padding: 16px;
          border-radius: 6px;
          margin: 20px 0;
        ">
          <p><b>Order ID:</b> #${orderId}</p>
          <p><b>Total Amount:</b> ₹${totalAmount}</p>
        </div>

        <a
          href="http://localhost:3000/orders/${orderId}"
          style="
            display: inline-block;
            background: #2563eb;
            color: #ffffff;
            padding: 12px 18px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: bold;
          "
        >
          View Order
        </a>

        <p style="margin-top: 24px;">
          If you have any questions, just reply to this email —
          we’re always happy to help.
        </p>

        <p>Cheers,<br /><b>Sanity Store Team</b></p>
      </div>

      <!-- Footer -->
      <div style="
        background: #f3f4f6;
        padding: 16px;
        font-size: 12px;
        color: #6b7280;
        text-align: center;
      ">
        © ${new Date().getFullYear()} Sanity Store. All rights reserved.
      </div>
    </div>
  </div>
  `;
}
