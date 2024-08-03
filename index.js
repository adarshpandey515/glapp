const express = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Create a transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password or app-specific password
  },
});

// Endpoint to send email
app.post('/send-email-adarsh9876', (req, res) => {
  const { to, subject, text, html } = req.body;

  // Setup email data
  let mailOptions = {
    from: `"Your Name" <${process.env.EMAIL_USER}>`, // Sender address
    to: to, // List of receivers
    subject: subject, // Subject line
    text: text, // Plain text body
    html: html, // HTML body
  };

  // Send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error.message);
      return res.status(500).json({ error: error.message });
    }
    res.status(200).json({ message: 'Email sent successfully!', messageId: info.messageId });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
