
const sendTestEmail = async () => {
  const emailData = {
    to: 'adarsh.224386101@vcet.edu.in', // Replace with the recipient's email address
    subject: 'Hello from Node.js Test Script',
    text: 'This is a test email sent from the test script.',
    html: '<b>This is a test email sent from the test script.</b>',
  };

  try {
    const response = await fetch('https://mails--glamail.netlify.app/send-email-adarsh9876', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    const result = await response.json();
    console.log('Email sent response:', result);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

sendTestEmail();
