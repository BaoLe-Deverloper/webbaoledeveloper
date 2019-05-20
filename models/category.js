const mongoose = require('mongoose');
const databaseconfig = require('./../config/database');
/*==============================================================*/
const CategorySchema = new mongoose.Schema({
    parent:String,
    picture:String,
    name:String,
    key:String,
    number_Posts : {type:Number, default:0},
    view:  {type:Number, default:0}
});
module.exports = mongoose.model('categories', CategorySchema,databaseconfig.collection_categories);
/*==============================================================*/