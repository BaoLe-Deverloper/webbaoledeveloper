const cookieParser = require('cookie-parser');
const bodyParser  = require('body-parser')
const mongodb = require('./../mongodb')
const session = require('express-session')
const bcrypt = require('bcrypt');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const passport = require('passport')
const passport_fb = require('passport-facebook').Strategy


module.exports.callbackfacebook = passport.authenticate('facebook', {failureRedirect: '/login' });


module.exports.authfacebook =  passport.authenticate("facebook",{scope:['email']});

 /*==============facebook authentication =======================*/
 passport.use(new passport_fb({
    clientID: '2558575720823491',
    clientSecret:'5b67fb63e7012b76606658e1d778f5b5',
    callbackURL:'http://localhost:3000/auth/facebook/callbackfacebook',
    profileFields:['email','name','gender','birthday','locale']
  },
  
  (accessToken,refreshToken,profile,done)=>{
   
     mongodb.user.findOne({id:profile._json.id},(err,user)=>{
       
       if(err) return done(err);
       if(user) return done(null, user);
       var salt = bcrypt.genSaltSync(saltRounds);
       const newUser = new mongodb.user({
         id:profile._json.id,
         name:profile._json.name||profile._json.last_name+' '+profile._json.first_name,
         email:profile._json.email,
         password: bcrypt.hashSync(profile._json.id+profile._json.email, salt)
       })
       newUser.save((err)=>{ return done(null,user)})
     })
  }
  ))
  
  passport.serializeUser((user,done)=>{
    done(null,user)
  })
  
  passport.deserializeUser((id,done)=>{
      mongodb.user.findOne({id}, (err,user)=>{
        done(null,user)
      })
  })
  /*=======================================================*/