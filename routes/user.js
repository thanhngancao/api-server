const express = require('express')
const router = express.Router()
const mongoose = require('mongoose');
const identifyUserLogin = require('../middleware/identifyUserLogin');
const Post = mongoose.model("Post")
const User = require('../models/user')

router.get('/user/:id', identifyUserLogin, (req, res, next) => {
    User.findOne({_id:req.params.id})
    .select("-password")
    .then(user => {
        Post.find({postedBy:req.params.id})
        .populate("postedBy", "_id name")
        .exec((err, posts)=> {
            if(err){
                return res.status(402).json({error:err})
            }
            res.json({user, posts})
        })
    }).catch(err => {
        res.status(402).json({error:"User doesn't exit"})
    })
})


module.exports = router