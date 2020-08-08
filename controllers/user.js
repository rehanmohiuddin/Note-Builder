const User = require("../models/user");

const Note = require('../models/notes')

exports.getUserById = (req,res,next,id) =>{
    User.findById(id).exec((err,user)=>{
        if(err || !user){
            return res.status(400).json({
                error:"No User Found In Our DB"
            });
        }
        req.profile = user;
        next();
    });
};

exports.getUser = (req,res)=>{
    //TODO: Get back for password
    req.profile.salt =undefined;
    req.profile.encry_password=undefined;
    req.profile.createdAt=undefined;
    req.profile.updatedAt=undefined;
    return res.json(req.profile);
}
exports.updateUser=(req,res)=>{
    User.findByIdAndUpdate(
        {_id:req.profile._id},
        {$set:req.body},
        {new:true,useFindAndModify:false},
        (err,user)=>{
            if(err){
                return res.status(400).json({
                    error:"You Are Not Authorozed"
                })
            }
            
            res.json(user)
        }
    )
}

exports.getUserNotes=(req,res)=>{
    Note.find({userId:req.params.userId})
    .exec((err,note)=>{
        if(err || !note){
            return res.status(400).json({
                error:'No Found'
            })
        }
        res.json(note)
    })
}


