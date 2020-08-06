const Note = require("../models/notes");
const formidable =require("formidable");
const _=require("lodash");
const fs=require("fs");
var multer  = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
      cb(null, new Date().toISOString() + file.originalname);
    }
  });
  
  const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
  
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
  });

exports.getNoteById =(req,res,next,id)=>{
    Product.findById(id).exec((err,pro)=>{
        if(err){
            return res.status(400).json({
                error:"Note Not Found"
            });
        }
        req.product=pro;
        next();
    });
}

exports.createNote=(req,res)=>{
    const note = new Note(req.body)
    note.save((err,notE)=>{
        if(err){
            return res.status(400).json({
                error:err
            })
        }
        res.json({notE})
    });

}




exports.deleteNote =(req,res)=>{
    let product = req.body;
    product.remove((err,deletednote)=>{
        if(err){
            return res.status(400).json({
                error:"Failed To Delete The Note"
            });
        }
        res.json({
            message:"Deleted Note",deletednote
        })
    })
}

exports.updateNote =(req,res)=>{
    
     let note = req.body

        note.save((err,note)=>{
            if (err){
                return res.status(400).json({
                    error:"Saving Failed"
                })
            }
            res.json(note);
        })

}



