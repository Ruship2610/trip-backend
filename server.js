
const express = require("express");
const Stripe = require("stripe");
const cors = require("cors");
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const emailjs = require('emailjs-com');
const { Resend } = require('resend');

const app = express();
const stripe = Stripe("sk_test_51RDi9YRt1WZTAgkGUDOjzX3pseE1l60Ofohbfl4YUU0gO2R8MfF8FcGiLFkasnpuKZ0zqgTzUR0rB3SSpQWOUkgL005AZfpH4G");
const resend = new Resend("re_3iv4y6R3_WMZxv1C2uwgtzgzEjuDgN7oj")

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.post("/create-payment-intent", async (req, res) => {
  const { amount, currency  } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: {
        enabled: true, 
      },
    });
    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.post('/send-email', async (req, res) => {
  const { guest_name, hotel_name, check_in, check_out, guests, total_price, support_email } = req.body;

  try {
    const result = await resend.emails.send({
      from: 'delivered@resend.dev',  // must be a verified sender/domain
      to: 'rushipatel2610@gmail.com',
      subject: 'Hotel Booking Confirmed ✅',
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Hello ${guest_name},</h2>
          <p>Your booking at <strong>${hotel_name}</strong> is confirmed!</p>
          <ul>
            <li>Check-in: ${check_in}</li>
            <li>Check-out: ${check_out}</li>
            <li>Guests: ${guests}</li>
            <li>Total Price: ₹${total_price}</li>
          </ul>
          <p>Contact ${support_email} for support.</p>
          <p>Trip It Team</p>
        </div>
      `
    });

    res.status(200).json({ message: 'Email sent successfully', result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to send email', error });
  }
});



// re_3iv4y6R3_WMZxv1C2uwgtzgzEjuDgN7oj


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
