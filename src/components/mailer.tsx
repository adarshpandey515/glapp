export const sendTestEmail = async (
    client: string,
    ssubject: string,
    stext: string,
    shtml: string
  ): Promise<any> => {
    if (!client) return;
    const emailData = {
      to: client,
      subject: ssubject,
      text: stext,
      html: shtml,
    };
  
    try {
      const response = await fetch('https://glapp.onrender.com/send-email-adarsh9876', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });
  
      const result = await response.json();
      console.log('Email sent response:', result);
      return result;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  };
  