const nodemailer = require('nodemailer');
const querystring = require('querystring');

export default async function handler(req, res) {
  // Check if the request method is POST
  if (req.method === 'POST') {
    // Parse body if content is form-data
    const body =
      req.headers['content-type'] === 'application/x-www-form-urlencoded'
        ? querystring.parse(req.body)
        : req.body;

    const { name, email, phone, service, message } = body;

    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // You can change this to other providers like SendGrid
      auth: {
        user: process.env.EMAIL_USER, // Store email in environment variable
        pass: process.env.EMAIL_PASS, // Store password in environment variable
      },
    });

    const mailOptions = {
      from: email,
      to: process.env.RECIPIENT_EMAIL, // Set recipient email in environment variable
      subject: `New Appointment Request from ${name}`,
      html: `
        <h2>New Appointment Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Service:</strong> ${service}</p>
        <p><strong>Message:</strong><br>${message}</p>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'Your message has been sent successfully!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'There was an error sending your message. Please try again.' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
