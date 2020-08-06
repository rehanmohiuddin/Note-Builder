const express = require("express");
const router=express.Router();

const {isSignedIn,isAuthenticated,isAdmin}= require("../controllers/auth");
const {getUserById}=require("../controllers/user");
const { getNoteById, createNote, deleteNote, updateNote } = require("../controllers/note");

//all of params
router.param("userId",getUserById);
router.param("noteId",getNoteById);

//all of actual routes
//write route
router.post("/note/create/:userId",isSignedIn,isAuthenticated,createNote);

//read routes


//delete route
router.delete("/note/:noteId/:userId",isSignedIn,isAuthenticated,deleteNote);
//update route
router.put("/note/:noteId/:userId",isSignedIn,isAuthenticated,updateNote);
//listing route



module.exports =router;