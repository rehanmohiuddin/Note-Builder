
const {check,validationResult} = require("express-validator");
var jwt =require("jsonwebtoken");
var expressjwt=require("express-jwt");
const sgMail = require('@sendgrid/mail');

const nodemailer = require('nodemailer');

sgMail.setApiKey("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");
const sendConformationEmail = (user) =>{
    const token = jwt.sign({_id:user._id},process.env.SECRET);

    const url=`http://localhost:8000/conformation/${token}`
    console.log(user.email)
    const msg = {
        to: `${user.name} <${user.email}>`,
        from: 'mohiuddinrehan40@gmail.com',
        subject: 'Conformation Email',
        html: `Conformation Email <a href=${url}> ${url} </a>`
      };

      sgMail.send(msg)
   .then(()=>{
        console.log("Email Sent")
    })
    .catch((err)=>{
        console.log(err)
    })
}
exports.sendConformationEmail=sendConformationEmail;