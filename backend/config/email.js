const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ── Helpers ────────────────────────────────────────────────────────────────

const formatItems = (items) =>
  items
    .map(
      (i) =>
        `<tr>
          <td style="padding:6px 12px;border-bottom:1px solid #eee">${i.product.name}</td>
          <td style="padding:6px 12px;border-bottom:1px solid #eee;text-align:center">${i.quantity}</td>
          <td style="padding:6px 12px;border-bottom:1px solid #eee;text-align:right">ZMW ${(i.product.price * i.quantity).toFixed(2)}</td>
        </tr>`
    )
    .join('');

const baseTemplate = (title, body) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f5f0e8;font-family:'DM Sans',sans-serif">
  <div style="max-width:560px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.08)">
    <div style="background:#2d4a3e;padding:28px 32px">
      <h1 style="margin:0;color:#f5f0e8;font-size:22px">🌿 Green Hollow Farm</h1>
    </div>
    <div style="padding:32px">
      <h2 style="margin:0 0 16px;color:#2d4a3e;font-size:20px">${title}</h2>
      ${body}
    </div>
    <div style="background:#f5f0e8;padding:16px 32px;text-align:center">
      <p style="margin:0;font-size:12px;color:#888">© ${new Date().getFullYear()} Green Hollow Farm · All rights reserved</p>
    </div>
  </div>
</body>
</html>`;

// ── Exported mailers ───────────────────────────────────────────────────────

/**
 * Send order confirmation to the customer.
 */
const sendOrderConfirmation = async (order) => {
  const body = `
    <p style="color:#444">Hi <strong>${order.customerName}</strong>, thank you for your order!</p>
    <p style="color:#444">We're preparing your farm-fresh goods and will be in touch about delivery.</p>
    <table style="width:100%;border-collapse:collapse;margin:20px 0">
      <thead>
        <tr style="background:#f5f0e8">
          <th style="padding:8px 12px;text-align:left;font-size:13px;color:#2d4a3e">Item</th>
          <th style="padding:8px 12px;text-align:center;font-size:13px;color:#2d4a3e">Qty</th>
          <th style="padding:8px 12px;text-align:right;font-size:13px;color:#2d4a3e">Price</th>
        </tr>
      </thead>
      <tbody>${formatItems(order.items)}</tbody>
    </table>
    <p style="text-align:right;font-size:16px;font-weight:600;color:#2d4a3e">Total: ZMW ${order.total.toFixed(2)}</p>
    <p style="color:#444;font-size:13px">Delivery to: ${order.address}</p>
    <p style="color:#888;font-size:12px;margin-top:24px">Order ID: ${order._id}</p>`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: order.email,
    subject: `🌿 Order Confirmed — Green Hollow Farm (#${order._id.toString().slice(-6).toUpperCase()})`,
    html: baseTemplate('Your order is confirmed!', body),
  });
};

/**
 * Notify the admin about a new order.
 */
const sendAdminNewOrderAlert = async (order) => {
  const body = `
    <p style="color:#444">A new order has been placed on the storefront.</p>
    <table style="width:100%;border-collapse:collapse;margin:20px 0">
      <thead>
        <tr style="background:#f5f0e8">
          <th style="padding:8px 12px;text-align:left;font-size:13px;color:#2d4a3e">Item</th>
          <th style="padding:8px 12px;text-align:center;font-size:13px;color:#2d4a3e">Qty</th>
          <th style="padding:8px 12px;text-align:right;font-size:13px;color:#2d4a3e">Price</th>
        </tr>
      </thead>
      <tbody>${formatItems(order.items)}</tbody>
    </table>
    <p style="text-align:right;font-size:16px;font-weight:600;color:#2d4a3e">Total: ZMW ${order.total.toFixed(2)}</p>
    <hr style="border:none;border-top:1px solid #eee;margin:20px 0">
    <p style="color:#444;font-size:14px"><strong>Customer:</strong> ${order.customerName}</p>
    <p style="color:#444;font-size:14px"><strong>Email:</strong> ${order.email}</p>
    <p style="color:#444;font-size:14px"><strong>Phone:</strong> ${order.phone}</p>
    <p style="color:#444;font-size:14px"><strong>Address:</strong> ${order.address}</p>`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_USER,
    subject: `🛒 New Order — ZMW ${order.total.toFixed(2)} from ${order.customerName}`,
    html: baseTemplate('New order received', body),
  });
};

/**
 * Notify customer their order has been fulfilled.
 */
const sendFulfillmentNotification = async (order) => {
  const body = `
    <p style="color:#444">Hi <strong>${order.customerName}</strong>, great news!</p>
    <p style="color:#444">Your order has been packed and is on its way to you.</p>
    <p style="color:#444;font-size:14px"><strong>Delivery address:</strong> ${order.address}</p>
    <p style="color:#444;font-size:14px"><strong>Order total:</strong> ZMW ${order.total.toFixed(2)}</p>
    <p style="color:#888;font-size:12px;margin-top:24px">Order ID: ${order._id}</p>
    <p style="color:#444;margin-top:16px">Questions? Just reply to this email. 🌿</p>`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: order.email,
    subject: `📦 Your Green Hollow order is on its way!`,
    html: baseTemplate('Your order is fulfilled!', body),
  });
};

module.exports = {
  sendOrderConfirmation,
  sendAdminNewOrderAlert,
  sendFulfillmentNotification,
};
