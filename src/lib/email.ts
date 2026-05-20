import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface OrderEmailProps {
  to: string
  customerName: string
  orderNumber: string
  items: { name: string; size: string; quantity: number; price_inr: number }[]
  subtotal: number
  deliveryCharge: number
  total: number
  paymentMethod: string
  shippingAddress: {
    address: string; city: string; state: string; pincode: string
  }
}

export async function sendOrderConfirmationEmail(props: OrderEmailProps) {
  const { to, customerName, orderNumber, items, subtotal, deliveryCharge, total, paymentMethod, shippingAddress } = props

  const itemRows = items.map(i =>
    `<tr>
      <td style="padding:10px 0;border-bottom:1px solid #f0ebe3">${i.name} — ${i.size}</td>
      <td style="padding:10px 0;border-bottom:1px solid #f0ebe3;text-align:center">${i.quantity}</td>
      <td style="padding:10px 0;border-bottom:1px solid #f0ebe3;text-align:right">₹${(i.price_inr * i.quantity).toLocaleString('en-IN')}</td>
    </tr>`
  ).join('')

  await resend.emails.send({
    from: 'AMANI <orders@yourdomain.com>',
    to,
    subject: `Order Confirmed — #${orderNumber}`,
    html: `
    <div style="font-family:'DM Sans',Arial,sans-serif;max-width:600px;margin:0 auto;color:#2c2c2c">
      <div style="background:#1a1a1a;padding:32px;text-align:center">
        <h1 style="font-family:Georgia,serif;color:#fff;letter-spacing:10px;font-weight:300;font-size:28px;margin:0">AMANI</h1>
      </div>
      <div style="padding:40px 32px;background:#fff">
        <p style="font-size:13px;color:#888;letter-spacing:3px;text-transform:uppercase;margin-bottom:8px">Order Confirmed</p>
        <h2 style="font-family:Georgia,serif;font-size:28px;font-weight:300;margin-bottom:24px">Thank you, ${customerName}</h2>
        <p style="font-size:13px;color:#888;margin-bottom:32px">Your order <strong style="color:#B8952A">#${orderNumber}</strong> has been placed successfully.</p>

        <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
          <thead>
            <tr style="border-bottom:2px solid #B8952A">
              <th style="text-align:left;padding:8px 0;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#888">Item</th>
              <th style="text-align:center;padding:8px 0;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#888">Qty</th>
              <th style="text-align:right;padding:8px 0;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#888">Price</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
        </table>

        <div style="border-top:1px solid #e8e0d0;padding-top:16px">
          <div style="display:flex;justify-content:space-between;margin-bottom:8px">
            <span style="font-size:13px;color:#888">Subtotal</span>
            <span style="font-size:13px">₹${subtotal.toLocaleString('en-IN')}</span>
          </div>
          <div style="display:flex;justify-content:space-between;margin-bottom:8px">
            <span style="font-size:13px;color:#888">Delivery</span>
            <span style="font-size:13px">₹${deliveryCharge.toLocaleString('en-IN')}</span>
          </div>
          <div style="display:flex;justify-content:space-between;border-top:1px solid #e8e0d0;padding-top:12px;margin-top:8px">
            <span style="font-size:15px;font-weight:500">Total</span>
            <span style="font-size:15px;font-weight:500;color:#B8952A">₹${total.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div style="margin-top:32px;padding:20px;background:#FAFAF7;border:1px solid #e8e0d0">
          <p style="font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#B8952A;margin-bottom:12px">Shipping To</p>
          <p style="font-size:13px;margin:0;line-height:1.8">${shippingAddress.address}<br/>${shippingAddress.city}, ${shippingAddress.state} — ${shippingAddress.pincode}</p>
        </div>

        <p style="margin-top:24px;font-size:13px;color:#888">Payment: <strong style="color:#2c2c2c;text-transform:capitalize">${paymentMethod}</strong></p>
      </div>
      <div style="background:#1a1a1a;padding:24px;text-align:center">
        <p style="font-size:11px;color:#555;letter-spacing:2px;text-transform:uppercase;margin:0">Crafted with ♡ for the modern woman</p>
      </div>
    </div>
    `
  })
}
