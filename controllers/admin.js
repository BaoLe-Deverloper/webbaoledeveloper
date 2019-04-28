
const cookieParser = require('cookie-parser');
const bodyParser  = require('body-parser')
const mongodb = require('./../mongodb')
const session = require('express-session')
const bcrypt = require('bcrypt');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');


module.exports.login = (req,res,next)=>{
    var userreq = req.body;
    
    mongodb.useradmin.findOne({email:userreq.email},(err,user)=>{
      if(err||!user) res.redirect("/admin/login");
      else{
        bcrypt.compare(userreq.password,user.password, function(err, result) {
          if(err||!result) res.redirect("/admin/login");
          else
          {
            session.useradmin = user.id;
            res.redirect("/admin/");
       
          }
        });
        console.log("ok")
      }
      
     
    });
   };

