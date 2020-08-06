const User=require("../models/user");

const {check,validationResult} = require("express-validator");
var jwt =require("jsonwebtoken");
var expressjwt=require("express-jwt");

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../keys');



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
  
        user.save((err,user) =>{
            if(err){
                return res.status(400).json({
                    err:err
                })
            }
            res.json({
                name:user.name,
                email:user.email,
                id:user._id
            });
    
          
        });
     
       
   
};


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

exports.signInwithGoogle=(req,res)=>{
    passport.use(
        new GoogleStrategy({
            clientID: keys.google.clientID,
            clientSecret: keys.google.clientSecret,
            callbackURL: '/auth/google/redirect'
        }, (accessToken, refreshToken, profile, done) => {
            // passport callback function
            //check if user already exists in our db with the given profile ID
            User.findOne({googleId: profile.id}).then((currentUser)=>{
              if(currentUser){
                //if we already have a record with the given profile ID
                done(null, currentUser);
              } else{
                   //if not, create a new user 
                  new User({
                    googleId: profile.id,
                  }).save().then((newUser) =>{
                    done(null, newUser);
                  });
               } 
            })
          })
          
      );
      
}
