const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

require('dotenv').config();
const express = require("express");
const app=express();
const bodyParser=require("body-parser");
const cookieParser=require("cookie-parser");
const cors = require("cors");
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./keys');
const User = require("./models/user");
const cookieSession = require("cookie-session");


//my routes
const authRoutes=require("./routes/auth");
const userRoutes=require("./routes/user");
const noteRoutes=require("./routes/note");
const jwt = require('jsonwebtoken');

mongoose.connect(process.env.DATABASE,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true,
}).then(()=> {
    console.log("DB CONNECTED");
}).catch(
    console.log("DB NOT CONNECTED")
)



passport.use(
    new GoogleStrategy({
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret,
        callbackURL: '/auth/google/redirect'
    }, (accessToken, refreshToken, profile, done) => {
        // passport callback function
        //check if user already exists in our db with the given profile ID
        console.log('Profile',profile)
        User.findOne({googleId: profile.id}).then((currentUser)=>{
          if(currentUser){
            //if we already have a record with the given profile ID
            done(null, currentUser);
          } else{
               //if not, create a new user 
              new User({
                googleId: profile.id,
                name:profile.displayName,
                email:profile.emails[0].value
                
              }).save().then((newUser) =>{
                  console.log(newUser)

                  done(null,newUser)
  

              });
           } 
        })
      })
      
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
      done(null, user);
    });
  });

app.use(passport.initialize());
app.use(passport.session());
app.use(cookieSession({
    maxAge: 24*60*60*1000,
    keys:[process.env.SECRET]
  }));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.get("/api/auth/google", passport.authenticate("google", {
    scope: ["profile", "email"]
  }));
app.use("/api", authRoutes);
app.use("/api",userRoutes);
app.use("/api",noteRoutes);


app.get("/auth/google/redirect",passport.authenticate("google"),(req,res)=>{
    console.log(JSON.stringify(req.cookies).substring(17,37))
    
   return res.status(200).send({token:JSON.stringify(req.cookies).substring(17,37),user:req.user}); 

  });


const port =process.env.PORT || 5000;
console.log(port);

app.listen(port,()=> {
    console.log(`app is running at ${port}`);
});
