const mongoose = require('mongoose')

const UserModel = mongoose.model('User',new mongoose.Schema({
    name:{
        type:String,
        minlenght:3,
        maxlength:255,
        required:true
    },
    role:{
        type:String,
        enum:['ADMIN','USER'],
        required:true,
        default:'USER'
    }
    ,
    email:{
        type:String,
        unique:true,
        minlenght:5,
        maxlength:255,
        required:true
    },
    password:{
        type:String,
        minlenght:5,
        maxlength:1024,
        required:true
    }
},{timestamps:true}))

module.exports = UserModel