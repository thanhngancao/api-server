const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
//const identifyUserLogin = require('../middleware/identifyUserLogin');
const User = mongoose.model("User");

router.post('/register', (req,res, next) => {
    const {name, email, password, pic} = req.body

    // check dieu kien dien thong tin co du hay khoong
    if(!name||!email || !password) {
        return res.status(400).json({error: 'Please enter all fileds'});
    }
    // Check user already exits by email
    // If not will create new user
    // Hash Password to store mongodb
    User.findOne({email:email})
        .then((userReady) => {
            if(userReady){
                return res.status(400).json({error: 'User already exits'});
            }
            bcrypt.hash(password, 12)
            .then(hashedpassword => {
                const user = new User({
                    name,
                    email,
                    password:hashedpassword,
                    pic
                })
                user.save()
                    .then(user => {
                        res.json({message:" Saved user successfuly"})
                    })
                    .catch(err => {
                        console.log(err)
                })    
            })  
           .catch(err => {
               console.log(err)
           })
        })        
})

//make a login 
//@route POST /login
//@desc post user
//access Private
router.post('/login', (req, res, next) => {
    const {email, password} = req.body
    if(!email || !password){
        return res.status(400).json({error: 'Please enter email and password'});
    }
    User.findOne({email:email})
        .then(userReady => {
            if(!userReady){
                return res.status(400).json({error: "Invalid credentials"})
            }
            bcrypt.compare(password, userReady.password)
            .then(Match => {
                if(Match){
                    //res.json({message: "Login Success"})
                    const token = jwt.sign({_id:userReady._id}, config.get('jwtSecret'))
                    const {_id, name, email, followers, following, pic} = userReady
                    res.json({token, user:{_id, name, email, followers, following, pic}})
                }
                else{
                    return res.status(400).json({error: 'Invalid credentials password'});
                }
            })
            .catch(err => {
                console.log(err)
            })
        })
})
module.exports = router;