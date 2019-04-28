const mongoose = require('mongoose')

mongoose.connect("mongodb://127.0.0.1:27017/website_Baole");

/*==============================================================*/
const userSchema = new mongoose.Schema({
    id:String,
    name:String,
    email:String,
    password:String
})
module.exports.user = mongoose.model('user', userSchema,'user');

/*==============================================================*/
const userAdminSchema = new mongoose.Schema({
    id:String,
    name:String,
    email:String,
    password:String
});
module.exports.useradmin = mongoose.model('useradmin', userAdminSchema,'useradmin');

/*==============================================================*/
const CategorySchema = new mongoose.Schema({
    id:String,
    name:String,
    key:String
});
module.exports.categories = mongoose.model('categories', CategorySchema,'categories');
/*==============================================================*/
const postSchema = new mongoose.Schema({
    id:String,
    title:String,
    body:String,
    author:String,
    category:String,
    datecreate:{type:Date,default:Date.now},
    comments:[{username:String,body:String,datecrearte:{type:Date,default:Date.now}}],
    status:Boolean,
    viewcount:Number
});
module.exports.posts = mongoose.model('posts', postSchema,'posts');