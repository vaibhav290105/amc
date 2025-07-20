const cron = require('node-cron');
const nodemailer = require('nodemailer');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function sendEmail(to, subject, text) {
  return transporter.sendMail({
    from: `"IGL AMC Tracker" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  });
}

exports.scheduleReminders = () => {
  cron.schedule('0 9 * * *', async () => {
    const today = new Date();
    const in7Days = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    const assets = await prisma.asset.findMany({
      where: {
        OR: [
          { warrantyExpiry: { lte: in7Days } },
          { licenseExpiry: { lte: in7Days } },
        ],
      },
    });

    for (const asset of assets) {
      await sendEmail(
        'admin@igl.com',
        `Reminder: Asset ${asset.serialNumber} is expiring soon`,
        `Asset ${asset.serialNumber} at ${asset.location} has an expiry (License/Warranty) within 7 days. Please check AMC system.`
      );
    }

    console.log('✅ Reminder emails sent for expiring assets.');
  });
};
