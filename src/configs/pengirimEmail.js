const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: process.env.NODEMAILER_SERVICE,
    auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASSWORD,
    },
});

module.exports = (input) => new Promise((resolve, reject) => {
    try {
        transporter.sendMail(input, (error, info) => {
            if (error) reject(error);
            else resolve(info);
        });
    } catch(error) {
        reject(error);
    };
});