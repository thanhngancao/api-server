const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const identifyUserLogin = require('../middleware/identifyUserLogin');
const Post = mongoose.model("Post")

//make create post schema and post route
//@route POST /createnewsfeed
//@desc post picture, title, body newsfeed
//access Private
router.post('/createreview',(req, res, next) => { //Create new review
    const { title, body, pic} = req.body
    
    if(!title || !body || !pic ){
        return res.status(400).json({error: 'Please add into fields'});
    }
    //make no have password respone
    const post = new Post({
        title,
        body,
        picture:pic,
        postedBy:req.user
    })
    post.save()
        .then(result => {
            res.json({post:result})
        })
        .catch(err => {
            console.log(err)
        })
})

router.get('/newsfeed', (req, res, next) => {
    Post.find()
        // populate use for get user id and user name post newfeed
        .populate("postedBy","_id name") 
        .populate("comments.postedBy", "_id name")
        .then(posts => {
            res.json({posts})
        })
        .catch(err => {
            console.log(err)
        })
})

router.get('/homeuser',identifyUserLogin, (req, res, next) => {
    Post.find({postedBy:req.user._id})
    .populate("postedBy", "_id name")
    .then(homeuser => {
        res.json({homeuser})
    })
    .catch(err => {
        console.log(err)
    })
})

router.put('/comment', identifyUserLogin, (req,res, next)=> { // comment 
    const comment = {
        text: req.body.text,
        postedBy: req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId, {
        $push:{comments:comment}
    },{
        new:true
    })
    .populate("comments.postedBy","_id name")
    .populate("postedBy","_id name")
    .exec((err,result) => {
        if(err){
            return res.status(401).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.delete('/deletepost/:postid', (req, res) => { //delete review
    console.log(req.path);
    Post.findOne({_id:req.params.postid})
    .populate("postedBy","_id")
    .exec((err,post) => {
        //console.log(post)
        if(err||!post){
            return res.status(400).json({error:err})
        }
        // console.log(req.user, 'user')
        // console.log(post.postedBy._id, 'post')
        if(post.postedBy._id.toString() === req.user._id.toString()){
            post.remove()
            .then(result => {
                res.json(result)
            }).catch(err => {
                console.log(err)
            })
        }
    })
})

module.exports = router;