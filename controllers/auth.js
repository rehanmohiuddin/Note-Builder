const User=require("../models/user");
const Code = require("../models/code")
const {check,validationResult} = require("express-validator");
var jwt =require("jsonwebtoken");
var expressjwt=require("express-jwt");

const sgMail = require('@sendgrid/mail');

const nodemailer = require('nodemailer');

sgMail.setApiKey("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");
exports.signup =(req,res)=>{
    const user=new User({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password
    });
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()){
        return res.status(422).json({
            error:errors.array()[0].msg,
            error:errors.array()[0].param
        })
    }
    console.log(req.body.code)
    Code.findOneAndDelete({ code: req.body.code}, function (err, docs) {
        if(err){
            return res.status(400).json({
                error:"Error"
            });
        }
        if(docs===null){
            return res.json({
                Error:"Code Not Found"
            })
        }
  
     else{
        console.log(docs)
        user.save((err,user) =>{
            if(err){
                return res.status(400).json({
                    err:"Not ABle To Save in DB"
                })
            }
            res.json({
                name:user.name,
                email:user.email,
                id:user._id
            });
    
          
        });
     }
       
    })
};

exports.verify=(req,res)=>{
    const cd= Math.random().toString(36).substring(7);
    const code = new Code({
        code:cd
    })
    code.save((err,code)=>{
        if(err){
            return res.status(400).json({
                err:"Not ABle To Save Code in DB"
            })
        }
        console.log(req.body)
        const msg = {
            to: `${req.body.email} <${req.body.email}>`,
            from: 'mohiuddinrehan40@gmail.com',
            subject: `Conformation Code ${cd}`,
            html: `Conformation Code ${cd}`
          };
    
          sgMail.send(msg)
       .then(()=>{
            console.log("Email Sent")
            res.json({
                Message:"Success"
            })
        })
        .catch((err)=>{
            console.log(err)
        })
    })
}

exports.signin = (req,res) => {
    const errors = validationResult(req);
    const {email,password}=req.body;
   
    
    if(!errors.isEmpty()){
        return res.status(422).json({
            error:errors.array()[0].msg,
        });
    }

    User.findOne({email},(err,user)=>{
        if(err){
            res.status(400).json({
                error:"User Doesnt Exists"
            })
        }
        if(!user.authenticate(password)){
            return res.status(401).json({
                error:"Email and Password Do Not Match"
            })
        }

        const token = jwt.sign({_id:user._id},process.env.SECRET);

        res.cookie("token",token,{expire:new Date()+9999});
        const {_id,name,email,role}=user;
        return res.json({token,user:{_id,name,email,role}});
    });
};


exports.signout = (req,res) =>{
    res.clearCookie("token");
    res.json({
        message:"User signout SuccessFul"
    });
};


//protected rouutes
exports.isSignedIn=expressjwt({
    secret:process.env.SECRET,
    userProperty:"auth"
});

//custom middlewares

exports.isAuthenticated=(req,res,next)=>{
    let checker=(req.profile && req.auth && req.profile._id) == req.auth._id;
    if(!checker){
        return res.status(403).json({
            error:"Access Denied"
        })
    }
    next();
};
exports.isAdmin=(req,res,next)=>{
    if(req.profile.role === 0){
        return res.status(403).json({
            error:"You are Not Admin"
        });
    }
    next();
};