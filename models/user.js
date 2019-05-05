const mongoose = require('mongoose')
const databaseconfig = require('./../config/database');
var bcrypt   = require('bcrypt-nodejs');
//define the schema for our user model

/*==============================================================*/
const userSchema = new mongoose.Schema({
	_id:String,
    name: String,
	mail: String,
	password: String,
	status: String,
	created_date: Date,
	updated_date: Date,
	active_hash: String,
	role_id: { type: Number, default: 2 }
})
//methods ======================
//generating a hash
userSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
   };
   
   //checking if password is valid
   userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.password);
   };
module.exports = mongoose.model('user', userSchema, databaseconfig.collection_user);
