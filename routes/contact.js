const express = require('express');
const router = express.Router()
const nodemailer = require("nodemailer");

router.get('/', function (req, res, next) {
    res.render("site/contact");
});
router.post('/email', function (req, res, next) {
    const outputHTML = `
    <div class="container">
    <h1>Node Mail From Teknohex</h1>
    <h2>Hi Developer 🙂🙂👏👏💖💖</h2>
    <p>This is a test message;;</p>
    <hr>
    <br>
    <h4>Static Parts</h4>
    <h6>Name: ${req.body.name}</h6>
    <h6>${req.body.email}</h6>
    <h6>${req.body.message}</h6>
    <br>
    <hr>
    <small>ouz-dev-2020</small>
    </div>
    `
    // async..await is not allowed in global scope, must use a wrapper
    async function main() {
        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        let testAccount = await nodemailer.createTestAccount();
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: "mail", // generated ethereal user
                pass: "pass" // generated ethereal password
            },
        });
        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"Teknohex " <>', // sender address
            to: "", // list of receivers
            subject: "Test", // Subject line
            text: "Hello world?", // plain text body
            html: outputHTML, // html body
        });
        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        res.redirect("/contact");
    }

    main().catch(console.error);


});


module.exports = router