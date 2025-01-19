import { IncomingForm } from 'formidable';
import nodemailer from 'nodemailer';

// Disable the default body parser to handle form data ourselves
export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req, res) {
  if (req.method === 'POST') {
    const form = new IncomingForm();  // Correct usage for version 3.x+

    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error('Form parsing error:', err);
        return res.status(500).json({ error: 'There was an error processing the form.' });
      }

      // Log the fields to ensure we're receiving them correctly
      console.log('Form fields:', fields);

      const { name, email, phone, service, message } = fields;

      // Check if any field is missing
      if (!name || !email || !service || !message) {
        return res.status(400).json({ error: 'Missing required fields.' });
      }

      const transporter = nodemailer.createTransport({
        service: 'gmail',  // You can change this if you're using another email provider
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,  // Use App Password for Gmail
        },
      });

      const mailOptions = {
        from: email,
        to: process.env.RECIPIENT_EMAIL,  // The email where you want to receive the form submissions
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

      // Send email using Nodemailer
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
          return res.status(500).json({ error: 'There was an error sending your message.' });
        }

        console.log('Email sent:', info.response);
        res.status(200).json({ message: 'Your message has been sent successfully!' });
      });
    });
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
