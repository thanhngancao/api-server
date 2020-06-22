const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const identifyUserLogin = require('../middleware/identifyUserLogin');
const Post = mongoose.model("Post")

//make create post schema and post route
//@route POST /createnewsfeed
//@desc post picture, title, body newsfeed
//access Private
router.post('/createnewsfeed',(req, res, next) => { //Create new review
    const { title, body, pic} = req.body
    console.log(req.body);
    if(!title || !body || !pic ){
        return res.status(400).json({error: 'Please add into fields'});
    }
    //make no have password respone'
    console.log(req.user,'asdas')
    const post = new Post({
        title,
        body,
        picture:pic,
        postedBy:req.body.user
    })
    console.log(post,'asdasd')
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

router.get('/mynewsfeed',identifyUserLogin, (req, res, next) => {
    Post.find({postedBy:req.user})
    .populate("postedBy", "_id name")
    .then(mynewsfeed => {
        res.json({mynewsfeed})
    })
    .catch(err => {
        console.log(err)
    })
})

router.put('/comment', identifyUserLogin, (req,res, next)=> { // comment 
    const comment = {
        text: req.body.text,
        postedBy: req.user
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

router.delete('/deletepost/:postid', identifyUserLogin, (req, res) => { //delete review
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