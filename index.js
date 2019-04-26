const express = require('express')
const passport = require('passport')
const cookieParser = require('cookie-parser');
const bodyParser  = require('body-parser')
const mongodb = require('./mongodb')
const passport_fb = require('passport-facebook').Strategy
const session = require('express-session')
const bcrypt = require('bcrypt');

const saltRounds = 10;

const app = express();

app.use(cookieParser());
app.use(bodyParser());
app.use('/static',express.static('publics'));
app.set('views', './views');
app.set('view engine', 'ejs');
app.use(session({secret:'31jda%4*/99=_)787'}))
app.use(passport.initialize());
app.use(passport.session());
app.listen(3000,()=>console.log("server opened in port 3000"));
app.get('/', function (req, res) {
  res.render("teamplate_site/index",{});
})


app.get('/doc',function(req,res,next){
  res.render("teamplate_site/doc",{});
})

app.get('/login',(req, res, next )=>{res.render('teamplate_site/login',{}) });

app.get('/auth/facebook', passport.authenticate("facebook",{scope:['email']}));

app.get('/auth/facebook/callbackfacebook', passport.authenticate('facebook',{
  failureRedirect:'/',successRedirect:'/'
}));

passport.use(new passport_fb({
  clientID: '2558575720823491',
  clientSecret:'5b67fb63e7012b76606658e1d778f5b5',
  callbackURL:'http://localhost:3000/auth/facebook/callbackfacebook',
  profileFields:['email','name','gender','birthday','locale']
},

(accessToken,refreshToken,profile,done)=>{
 
   mongodb.findOne({id:profile._json.id},(err,user)=>{
     if(err) return done(err);
     if(user) return done(null, user);
     var salt = bcrypt.genSaltSync(saltRounds);
     const newUser = new mongodb({
       id:profile._json.id,
       name:profile._json.name,
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
    mongodb.findOne({id}, (err,user)=>{
      done(null,user)
    })
})