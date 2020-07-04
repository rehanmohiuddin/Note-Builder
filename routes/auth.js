var express = require('express')
var router = express.Router();
const {check,validationResult} = require("express-validator");
const {signout,signup,signin,isSignedIn, verify} = require("../controllers/auth");
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
router.post("/verify",verify)

router.get("/testroute",isSignedIn,(req,res)=>{
    res.json(req.auth);
});


module.exports=router;
