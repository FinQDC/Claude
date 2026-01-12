const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Email configuration
// Voor productie gebruik, vervang deze waarden met je eigen SMTP configuratie
// of gebruik een service zoals SendGrid, Mailgun, etc.
const transporter = nodemailer.createTransport({
    // Gebruik een Gmail account (minder veilig, alleen voor testing)
    // Voor productie: gebruik een dedicated email service
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASSWORD || 'your-app-password'
    }
});

// Alternative: gebruik Ethereal voor testing (fake SMTP)
// async function createTestAccount() {
//     const testAccount = await nodemailer.createTestAccount();
//     return nodemailer.createTransport({
//         host: 'smtp.ethereal.email',
//         port: 587,
//         secure: false,
//         auth: {
//             user: testAccount.user,
//             pass: testAccount.pass
//         }
//     });
// }

app.post('/api/send-email', async (req, res) => {
    try {
        const { to, subject, text } = req.body;

        if (!to || !text) {
            return res.status(400).json({ error: 'Email en tekst zijn verplicht' });
        }

        const mailOptions = {
            from: process.env.EMAIL_USER || 'your-email@gmail.com',
            to: to,
            subject: subject || 'Voice Note',
            text: text,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #667eea;">🎙️ Voice Note</h2>
                    <p style="font-size: 14px; color: #666; margin-bottom: 20px;">
                        ${new Date().toLocaleString('nl-NL', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </p>
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; border-left: 4px solid #667eea;">
                        <p style="margin: 0; white-space: pre-wrap; line-height: 1.6;">${text}</p>
                    </div>
                    <p style="margin-top: 20px; font-size: 12px; color: #999;">
                        Verzonden via Voice Notes App
                    </p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);

        console.log('Email verzonden:', info.messageId);
        res.json({
            success: true,
            messageId: info.messageId,
            preview: nodemailer.getTestMessageUrl(info) // Alleen voor Ethereal testing
        });

    } catch (error) {
        console.error('Error verzenden email:', error);
        res.status(500).json({
            error: 'Er ging iets mis bij het verzenden van de email',
            details: error.message
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'voice-notes-api' });
});

// Serve index.html voor alle andere routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server draait op http://localhost:${PORT}`);
    console.log('Email service:', process.env.EMAIL_SERVICE || 'Niet geconfigureerd');
    console.log('\nVoor productie gebruik:');
    console.log('1. Configureer EMAIL_SERVICE, EMAIL_USER, EMAIL_PASSWORD als environment variables');
    console.log('2. Of gebruik een email service zoals SendGrid, Mailgun, etc.');
});
