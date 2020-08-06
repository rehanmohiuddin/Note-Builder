const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('./config/keys');
const User = require("../models/user");


exports.googleSignIn=()=>{
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
}