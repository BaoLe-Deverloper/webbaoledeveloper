/*====================Import module==================*/
const express = require('express')
const passport = require('passport')
const cookieParser = require('cookie-parser');
const bodyParser  = require('body-parser')
const mongodb = require('./mongodb')
const passport_fb = require('passport-facebook').Strategy
const session = require('express-session')
const bcrypt = require('bcrypt');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

const Admincontrollers = require("./controllers/admin");
const Sitecontrollers = require("./controllers/site");

const saltRounds = 10;
const app = express();
const generateSafeId = require('generate-safe-id');

app.use(cookieParser());
app.use(bodyParser());
app.use('/static',express.static('publics'));
app.set('views', './views');
app.set('view engine', 'ejs');
app.use(session({secret:'31jda%4*/99=_)787'}))
app.use(passport.initialize());
app.use(passport.session());

app.listen(3000,()=>console.log("server opened in port 3000"));
/*==============================================================*/


/*===================router for website =========================*/

app.get('/', function (req, res) {
 
  
  res.render("teamplate_site/index",{user:session.user});
})
app.get('/doc',function(req,res,next){
  res.render("teamplate_site/doc",{});
})

app.get('/login',(req, res, next )=>{res.render('teamplate_site/login',{})});

app.get('/auth/facebook',Sitecontrollers.authfacebook);

app.get('/auth/facebook/callbackfacebook',Sitecontrollers.callbackfacebook,function(req, res) {
  session.user = req.session.passport.user.name;
  res.redirect('/');
});

app.post('/login',(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      
        }
    else {
      
    }
})
app.get("/logout",(req,res)=>{
  session.user = null;
  res.redirect('/');
})

app.get("/signup",(req,res)=>res.render("teamplate_site/signup"))

/*==============================================================*/


/*===============router for Admin_page =========================*/


app.get('/admin/',(req,res,next)=>{

  if(session.useradmin){
   
      mongodb.categories.find((err,result)=>{
        mongodb.posts.find((err,resultP)=>{
          res.render("admin/index",{categories :result,posts:resultP});
        })
      });

    

     
      
  }
  else 
    res.redirect("/admin/login");  
})

app.get("/admin/login", (req,res,next)=>{
  res.render("admin/login",{});
})

app.post("/admin/login", Admincontrollers.login )

app.post("/admin/addpost",(req,res)=>{

  const newPost = new mongodb.posts({
    id:generateSafeId(),
    title:req.body.title,
    body:req.body.content,
    author:session.user,
    categry:req.body.categry,
    status:req.body.status? false:true,
    viewcount:0
  })
  newPost.save((err)=>{
    if(!err) res.redirect("/admin");
  });
})
/*==============================================================*/

