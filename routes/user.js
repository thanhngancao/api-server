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
        res.status(402).json({error:"User does't exit"})
    })
})

router.put('/follow',identifyUserLogin, (req,res) => {
    User.findByIdAndUpdate(req.body.followId,{
        $push:{followers:req.user._id}
    },{
        new:true
    },(err, result) => {
        if(err){
            return res.status(422).json({error:err})
        }
        User.findByIdAndUpdate(req.user._id,{
            $push:{following:req.body.followId}
        },{new:true})
        .select("-password")
        .then(result => {
            res.json(result)
        }).catch(err => {
            return res.status(422).json({error:err})
        })
    })
})

router.put('/unfollow',identifyUserLogin, (req,res) => {
    User.findByIdAndUpdate(req.body.unfollowId,{
        $pull:{followers:req.user._id}
    },{
        new:true
    },(err, result) => {
        if(err){
            return res.status(422).json({error:err})
        }
        User.findByIdAndUpdate(req.user._id,{
            $pull:{following:req.body.unfollowId}
        },{new:true})
        .select("-password")
        .then(result => {
            res.json(result)
        }).catch(err => {
            return res.status(422).json({error:err})
        })
    })
})

module.exports = router