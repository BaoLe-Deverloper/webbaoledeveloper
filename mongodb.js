const mongoose = require('mongoose')

mongoose.connect("mongodb://127.0.0.1:27017/website_Baole");

const userSchema = new mongoose.Schema({
    id:String,
    name:String,
    email:String,
    password:String
})

const user = mongoose.model('user', userSchema,'user')

module.exports= user 