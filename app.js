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


//my routes
const authRoutes=require("./routes/auth");
const userRoutes=require("./routes/user");
const noteRoutes=require("./routes/note");

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

  passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
      done(null, user);
    });
  });

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });


app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.get("/auth/google", passport.authenticate("google", {
    scope: ["profile", "email"]
  }));

app.use("/api", authRoutes);
app.use("/api",userRoutes);
app.use("/api",noteRoutes);

const port =process.env.PORT || 5000;
console.log(port);

app.listen(port,()=> {
    console.log(`app is running at ${port}`);
});
