const mongoose = require('mongoose');
const dateFormat = require('dateformat');
const databaseconfig = require('./../config/database');
const postSchema = new mongoose.Schema({
    id:String,
    title:String,
    url:String,
    body:String,
    author:String,
    category:String,
    introduce:String,
    created_date: {type:Date,default:dateFormat(Date.now(), "yyyy-mm-dd HH:MM:ss")},
  	updated_date: {type:Date,default:dateFormat(Date.now(), "yyyy-mm-dd HH:MM:ss")},
    comments:[{username:String,body:String,datecrearte:{type:Date,default:dateFormat(Date.now(), "yyyy-mm-dd HH:MM:ss")}}],
    status:Boolean,
    viewcount:Number
});
module.exports = mongoose.model('posts', postSchema,databaseconfig.collection_posts);
  /*=======================================================*/