const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const identifyUserLogin = require('../middleware/identifyUserLogin');
const Post = mongoose.model("Post")

//make create post schema and post route
//@route POST /createnewsfeed
//@desc post picture, title, body newsfeed
//access Private
router.post('/createnewsfeed',identifyUserLogin,(req, res, next) => {
    const { title, body, pic} = req.body
    
    if(!title || !body || !pic ){
        return res.status(400).json({error: 'Please add into fileds'});
    }
    //make no have password respone
    req.user.password=undefined
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

router.get('/subnewsfeed', (req, res, next) => {
    // if postedBy in following 
    Post.find({postedBy:{$in:req.user.following}})
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

router.get('/mynewsfeed',identifyUserLogin, (req, res, next) => {
    Post.find({postedBy:req.user._id})
    .populate("postedBy", "_id name")
    .then(mynewsfeed => {
        res.json({mynewsfeed})
    })
    .catch(err => {
        console.log(err)
    })
})

router.put('/comment', identifyUserLogin, (req,res, next)=> {
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

router.delete('/deletepost/:postid',identifyUserLogin, (req, res) => {
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

router.get('/posts/:postId', identifyUserLogin, (req, res) => {
    Post.findById(req.params.postId)
        .then(post => {
            if(post) {
                res.status(200).json(post);
            }
        })
        .catch((e => res.status(500).json(e)));
})

router.put('/posts/:postId', identifyUserLogin, async (req, res) => {
    try{
        console.log(req.body);
        const post = await Post.findById(req.params.postId);
        const { title, body, pic} = req.body
        if(!post){
            return res.status(400).json({error: 'Post not Found!'});
        }
        //make no have password respone
        post.title = title;
        post.body = body;
        if(pic) {
            post.picture = pic;
        }
        console.log(post);
        await post.save(); 
        
        return res.status(200).json(post);
    } catch(e) {
        console.log(e)
        res.status(500).json({
            error: 'Server error'
        })
    }
    
})

module.exports = router;