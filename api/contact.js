import formidable from 'formidable';
import nodemailer from 'nodemailer';

// Parse form data
export const config = {
  api: {
    bodyParser: false, // Disable the default body parser to handle it ourselves
  },
};

export default function handler(req, res) {
  if (req.method === 'POST') {
    const form = new formidable.IncomingForm();

    form.parse(req, (err, fields, files) => {
      if (err) {
        res.status(500).json({ error: 'There was an error processing the form. Please try again.' });
        return;
      }

      const { name, email, phone, service, message } = fields;

      const transporter = nodemailer.createTransport({
        service: 'gmail', // You can change this to other email providers
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS, // Use App Password if using Gmail
        },
      });

      const mailOptions = {
        from: email,
        to: process.env.RECIPIENT_EMAIL,  // Recipient email (your email)
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

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          res.status(500).json({ error: 'There was an error sending your message. Please try again.' });
        } else {
          res.status(200).json({ message: 'Your message has been sent successfully!' });
        }
      });
    });
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
