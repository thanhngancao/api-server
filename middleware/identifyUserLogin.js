//import jsonwebtoken
const jwt = require('jsonwebtoken');
//import config to link with mongo
const config = require('config');
const mongoose = require('mongoose');
const User = mongoose.model("User");
//const bcrypt = require('bcryptjs');

module.exports = (req, res, next ) => {
    const {authorization} = req.headers
    if(!authorization){
        return res.status(401).json({error: "You must be login"})
    }
    //strint of token begin with "token"
    const token = authorization.replace("","")
    jwt.verify(token, config.get('jwtSecret'), (err, payload) => {
        if(err){
            return res.status(401).json({error: "You must be login"})
        }
        const {_id} = payload
        User.findById(_id)
            .then(userData => {
                req.user = userData
                next();
            })
    })

}
