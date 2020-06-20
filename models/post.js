const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types

const Schema = mongoose.Schema;

const postSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    body:{
        type: String,
        required: true
    },
    picture:{
        type: String,
        required:true
    },
    comments:[{
        text: String,
        postedBy:{
            type:ObjectId,
            ref:"User"
        }
    }],
    postedBy:{ 
        type: ObjectId,
        ref:"User"
    }
})
module.exports = mongoose.model("Post", postSchema)