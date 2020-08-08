const Note = require("../models/notes");

exports.getNoteById =(req,res,next,id)=>{
    Note.findById(id).exec((err,not)=>{
        if(err){
            return res.status(400).json({
                error:"Note Not Found"
            });
        }
        req.note=not;
        next();
    });
}

exports.createNote=(req,res)=>{
    const note = new Note(req.body)
    note.save((err,notE)=>{
        if(err){
            console.log(err)
            return res.status(400).json({
                error:err
            })
        }
        res.json({notE})
    });

}




exports.deleteNote =(req,res)=>{
    let note = req.note;
    note.remove((err,deletednote)=>{
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
    
     let note = req.note
     console.log('note',req.body.description)
     note.title=req.body.title
     note.description=req.body.description

        note.save((err,noteUpdated)=>{
            if (err){
                console.log(err)
                return res.status(400).json({
                    error:err
                })
            }
            res.json(noteUpdated);
        })

}



