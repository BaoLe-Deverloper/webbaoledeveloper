const mongoose = require('mongoose');
const databaseconfig = require('./../config/database');
/*==============================================================*/
const CategorySchema = new mongoose.Schema({
    parent:String,
    name:String,
    key:String
});
module.exports = mongoose.model('categories', CategorySchema,databaseconfig.collection_categories);
/*==============================================================*/