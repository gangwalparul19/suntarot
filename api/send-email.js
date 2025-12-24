const nodemailer = require('nodemailer');

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { booking, adminEmail } = req.body;

    if (!booking) {
        return res.status(400).json({ message: 'Missing booking details' });
    }

    // Configure Nodemailer with Gmail
    // REQURES: GMAIL_USER and GMAIL_APP_PASSWORD in Vercel Env Vars
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD
        }
    });

    try {
        // Verify connection
        await transporter.verify();

        // Email content
        const mailOptions = {
            from: `"Sun Tarot Booking" <${process.env.GMAIL_USER}>`,
            to: adminEmail || process.env.GMAIL_USER, // Send to admin
            subject: `✨ New Booking: ${booking.serviceName} - ${booking.userName}`,
            html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h2 style="color: #d4a95d;">New Booking Received!</h2>
                    <p><strong>Customer:</strong> ${booking.userName} (${booking.userEmail})</p>
                    <p><strong>Service:</strong> ${booking.serviceName}</p>
                    <p><strong>Date & Time:</strong> ${booking.date} at ${booking.time}</p>
                    <p><strong>Price:</strong> ₹${booking.price}</p>
                    <p><strong>Notes:</strong> ${booking.notes || 'None'}</p>
                    <hr>
                    <p>Please login to the Admin Dashboard to manage this booking.</p>
                </div>
            `
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);

        return res.status(200).json({ message: 'Email sent successfully', id: info.messageId });

    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Failed to send email', error: error.message });
    }
}
