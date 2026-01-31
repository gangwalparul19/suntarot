const nodemailer = require('nodemailer');

// Email Templates
const emailTemplates = {
    bookingConfirmation: (booking) => ({
        subject: `✨ Booking Confirmed - ${booking.serviceName}`,
        html: `
            <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #f5f5f5; border: 1px solid #d4a95d; border-radius: 10px; overflow: hidden;">
                <div style="background: linear-gradient(135deg, #d4a95d, #c9a227); padding: 30px; text-align: center;">
                    <h1 style="margin: 0; color: #0a0a0a; font-size: 28px;">☀️ Sun Tarot</h1>
                    <p style="margin: 10px 0 0; color: #0a0a0a; font-size: 16px;">Your Reading is Confirmed</p>
                </div>
                <div style="padding: 30px;">
                    <h2 style="color: #d4a95d; margin-top: 0;">Hello ${booking.userName}! 🌟</h2>
                    <p style="font-size: 16px; line-height: 1.6;">Your tarot reading has been successfully booked. We're excited to guide you on your spiritual journey!</p>
                    
                    <div style="background: #141414; border: 1px solid #d4a95d; border-radius: 8px; padding: 20px; margin: 20px 0;">
                        <h3 style="color: #d4a95d; margin-top: 0;">📅 Booking Details</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 8px 0; color: #a3a3a3;">Service:</td>
                                <td style="padding: 8px 0; color: #f5f5f5; font-weight: bold;">${booking.serviceName}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #a3a3a3;">Date:</td>
                                <td style="padding: 8px 0; color: #f5f5f5; font-weight: bold;">${booking.date}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #a3a3a3;">Time:</td>
                                <td style="padding: 8px 0; color: #f5f5f5; font-weight: bold;">${booking.time}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #a3a3a3;">Duration:</td>
                                <td style="padding: 8px 0; color: #f5f5f5; font-weight: bold;">${booking.duration} minutes</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #a3a3a3;">Price:</td>
                                <td style="padding: 8px 0; color: #d4a95d; font-weight: bold; font-size: 18px;">Rs. ${booking.price}</td>
                            </tr>
                        </table>
                    </div>

                    ${booking.notes ? `<p style="background: #141414; padding: 15px; border-radius: 8px; border-left: 3px solid #d4a95d;"><strong style="color: #d4a95d;">Your Notes:</strong><br>${booking.notes}</p>` : ''}

                    <div style="background: #141414; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #d4a95d; margin-top: 0;">📝 What to Prepare</h3>
                        <ul style="line-height: 1.8; color: #a3a3a3;">
                            <li>Find a quiet, comfortable space</li>
                            <li>Prepare any questions you'd like to explore</li>
                            <li>Have an open mind and heart</li>
                            <li>Join via WhatsApp at the scheduled time</li>
                        </ul>
                    </div>

                    <div style="text-align: center; margin: 30px 0;">
                        <a href="https://wa.me/917378300086" style="display: inline-block; background: linear-gradient(135deg, #d4a95d, #c9a227); color: #0a0a0a; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">💬 Contact on WhatsApp</a>
                    </div>

                    <p style="color: #a3a3a3; font-size: 14px; text-align: center; margin-top: 30px;">Need to reschedule? Contact us at least 24 hours in advance.</p>
                </div>
                <div style="background: #141414; padding: 20px; text-align: center; border-top: 1px solid #d4a95d;">
                    <p style="margin: 0; color: #a3a3a3; font-size: 12px;">© 2025 Sun Tarot. All rights reserved.</p>
                    <p style="margin: 10px 0 0; color: #a3a3a3; font-size: 12px;">
                        <a href="https://suntarot.web.app" style="color: #d4a95d; text-decoration: none;">Visit Website</a> | 
                        <a href="mailto:tarotsun555666@gmail.com" style="color: #d4a95d; text-decoration: none;">Contact Us</a>
                    </p>
                </div>
            </div>
        `
    }),

    bookingReminder: (booking) => ({
        subject: `⏰ Reminder: Your Reading Tomorrow - ${booking.serviceName}`,
        html: `
            <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #f5f5f5; border: 1px solid #d4a95d; border-radius: 10px; overflow: hidden;">
                <div style="background: linear-gradient(135deg, #d4a95d, #c9a227); padding: 30px; text-align: center;">
                    <h1 style="margin: 0; color: #0a0a0a; font-size: 28px;">☀️ Sun Tarot</h1>
                    <p style="margin: 10px 0 0; color: #0a0a0a; font-size: 16px;">Your Reading is Tomorrow!</p>
                </div>
                <div style="padding: 30px;">
                    <h2 style="color: #d4a95d; margin-top: 0;">Hello ${booking.userName}! 🔮</h2>
                    <p style="font-size: 16px; line-height: 1.6;">This is a friendly reminder that your tarot reading is scheduled for tomorrow.</p>
                    
                    <div style="background: #141414; border: 1px solid #d4a95d; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
                        <h3 style="color: #d4a95d; margin-top: 0;">📅 Tomorrow's Session</h3>
                        <p style="font-size: 24px; color: #f5f5f5; margin: 10px 0;"><strong>${booking.date}</strong></p>
                        <p style="font-size: 32px; color: #d4a95d; margin: 10px 0;"><strong>${booking.time}</strong></p>
                        <p style="color: #a3a3a3; margin: 10px 0;">${booking.serviceName}</p>
                    </div>

                    <div style="background: #141414; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #d4a95d; margin-top: 0;">✨ Quick Reminders</h3>
                        <ul style="line-height: 1.8; color: #a3a3a3;">
                            <li>Set aside ${booking.duration} minutes in a quiet space</li>
                            <li>Have your questions ready</li>
                            <li>We'll contact you on WhatsApp at the scheduled time</li>
                            <li>Keep your phone nearby</li>
                        </ul>
                    </div>

                    <div style="text-align: center; margin: 30px 0;">
                        <a href="https://wa.me/917378300086" style="display: inline-block; background: linear-gradient(135deg, #d4a95d, #c9a227); color: #0a0a0a; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">💬 Message Us</a>
                    </div>

                    <p style="color: #a3a3a3; font-size: 14px; text-align: center; margin-top: 30px;">Looking forward to connecting with you! 🌟</p>
                </div>
                <div style="background: #141414; padding: 20px; text-align: center; border-top: 1px solid #d4a95d;">
                    <p style="margin: 0; color: #a3a3a3; font-size: 12px;">© 2025 Sun Tarot. All rights reserved.</p>
                </div>
            </div>
        `
    }),

    bookingCancellation: (booking) => ({
        subject: `❌ Booking Cancelled - ${booking.serviceName}`,
        html: `
            <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #f5f5f5; border: 1px solid #e74c3c; border-radius: 10px; overflow: hidden;">
                <div style="background: #e74c3c; padding: 30px; text-align: center;">
                    <h1 style="margin: 0; color: #fff; font-size: 28px;">☀️ Sun Tarot</h1>
                    <p style="margin: 10px 0 0; color: #fff; font-size: 16px;">Booking Cancelled</p>
                </div>
                <div style="padding: 30px;">
                    <h2 style="color: #e74c3c; margin-top: 0;">Hello ${booking.userName},</h2>
                    <p style="font-size: 16px; line-height: 1.6;">Your booking has been cancelled as requested.</p>
                    
                    <div style="background: #141414; border: 1px solid #e74c3c; border-radius: 8px; padding: 20px; margin: 20px 0;">
                        <h3 style="color: #e74c3c; margin-top: 0;">Cancelled Booking</h3>
                        <p><strong>Service:</strong> ${booking.serviceName}</p>
                        <p><strong>Date:</strong> ${booking.date}</p>
                        <p><strong>Time:</strong> ${booking.time}</p>
                    </div>

                    <p style="font-size: 16px; line-height: 1.6;">We hope to see you again soon! Feel free to book another session whenever you're ready.</p>

                    <div style="text-align: center; margin: 30px 0;">
                        <a href="https://suntarot.web.app/booking.html" style="display: inline-block; background: linear-gradient(135deg, #d4a95d, #c9a227); color: #0a0a0a; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">📅 Book Again</a>
                    </div>
                </div>
                <div style="background: #141414; padding: 20px; text-align: center; border-top: 1px solid #e74c3c;">
                    <p style="margin: 0; color: #a3a3a3; font-size: 12px;">© 2025 Sun Tarot. All rights reserved.</p>
                </div>
            </div>
        `
    }),

    adminNotification: (booking) => ({
        subject: `✨ New Booking: ${booking.serviceName} - ${booking.userName}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f5f5f5; padding: 20px; border-radius: 10px;">
                <h2 style="color: #d4a95d; border-bottom: 2px solid #d4a95d; padding-bottom: 10px;">🔔 New Booking Received!</h2>
                <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #333; margin-top: 0;">Customer Details</h3>
                    <p><strong>Name:</strong> ${booking.userName}</p>
                    <p><strong>Email:</strong> ${booking.userEmail}</p>
                    <p><strong>Service:</strong> ${booking.serviceName}</p>
                    <p><strong>Date & Time:</strong> ${booking.date} at ${booking.time}</p>
                    <p><strong>Duration:</strong> ${booking.duration} minutes</p>
                    <p><strong>Price:</strong> Rs. ${booking.price}</p>
                    <p><strong>Payment Status:</strong> ${booking.paymentStatus === 'Y' ? '✅ Paid' : '⏳ Pending'}</p>
                    ${booking.notes ? `<p><strong>Notes:</strong><br>${booking.notes}</p>` : ''}
                </div>
                <div style="text-align: center; margin: 20px 0;">
                    <a href="https://suntarot.web.app/admin.html" style="display: inline-block; background: #d4a95d; color: #0a0a0a; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">View in Admin Dashboard</a>
                </div>
                <p style="color: #666; font-size: 12px; text-align: center;">This is an automated notification from Sun Tarot booking system.</p>
            </div>
        `
    })
};

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { type, booking, adminEmail } = req.body;

    if (!booking || !type) {
        return res.status(400).json({ message: 'Missing required fields: type and booking' });
    }

    // Configure Nodemailer with Gmail
    // REQUIRES: GMAIL_USER and GMAIL_APP_PASSWORD in Vercel Env Vars
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

        let mailOptions;
        const template = emailTemplates[type];

        if (!template) {
            return res.status(400).json({ message: 'Invalid email type' });
        }

        const emailContent = template(booking);

        // Determine recipient based on type
        if (type === 'adminNotification') {
            mailOptions = {
                from: `"Sun Tarot Booking" <${process.env.GMAIL_USER}>`,
                to: adminEmail || process.env.GMAIL_USER,
                subject: emailContent.subject,
                html: emailContent.html
            };
        } else {
            // Customer emails
            mailOptions = {
                from: `"Sun Tarot" <${process.env.GMAIL_USER}>`,
                to: booking.userEmail,
                subject: emailContent.subject,
                html: emailContent.html
            };
        }

        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);

        return res.status(200).json({ 
            message: 'Email sent successfully', 
            id: info.messageId,
            type: type
        });

    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ 
            message: 'Failed to send email', 
            error: error.message 
        });
    }
}
