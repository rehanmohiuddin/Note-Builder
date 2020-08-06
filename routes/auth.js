var express = require('express')
var router = express.Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const {check,validationResult} = require("express-validator");
const {signout,signup,signin,isSignedIn, signInwithGoogle} = require("../controllers/auth");
router.post("/signup",[
    check("name","name should be atleast 3 char").isLength({min:3}),
    check("email","email is required").isEmail(),
    check("password","password is required").isLength({min:3}),
],signup);

router.post("/signin",[
    check("email","email should be atleast 3 char").isLength({min:3}),
    check("password","password should be atleast 3 char").isLength({min:3}),
],signin);


router.get("/signout",signout);

router.get("/auth/google/redirect",passport.authenticate("google"),(req,res)=>{
    res.send(req.user);
    res.send("you reached the redirect URI");
  });

router.get("/testroute",isSignedIn,(req,res)=>{
    res.json(req.auth);
});

router.get("/auth/google", passport.authenticate("google", {
    scope: ["profile", "email"]
  }));


module.exports=router;
