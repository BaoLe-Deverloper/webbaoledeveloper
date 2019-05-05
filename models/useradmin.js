const mongoose = require('mongoose');
const dateFormat = require('dateformat');
const bcrypt = require('bcrypt');
const databaseconfig = require('./../config/database');
/*==============================================================*/
const userAdminSchema = new mongoose.Schema({
    id:String,
    name:String,
    email:String,
    password:String,
    status:Boolean,
    Datecreate:{type:Date,default:dateFormat(Date.now(), "yyyy-mm-dd HH:MM:ss")}
});
   //checking if password is valid
userAdminSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.password);
   };
module.exports= mongoose.model('useradmin', userAdminSchema, databaseconfig.collection_admin);

/*==============================================================*/