/*====================Import module==================*/
const express = require('express')
const passport = require('passport')
const cookieParser = require('cookie-parser');
const bodyParser  = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const bcrypt = require('bcrypt');
const path = require('path');
const flash = require('connect-flash');
const multer = require('multer');
const saltRounds = 10;
const app = express();
const generateSafeId = require('generate-safe-id');


app.set('port',process.env.post||3000);
app.disable('x-powered-by');
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(session({
  secret:'31jda%4*/99=_)787',
  resave: true,
  saveUninitialized: true
}));
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './publics/uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now()+".png");
  }
});
var upload = multer({ storage: storage })

app.use(passport.initialize());
app.use(passport.session());

app.use('/static',express.static('publics'));
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');
app.use(flash()); 
require('./config/passport')(passport);
require('./config/routers')(app, passport,upload);

app.listen( app.get('port'),()=>console.log("server opened in port " +app.get('port')));
/*==============================================================*/

/***************Mongodb configuratrion********************/

var configDB = require('./config/database');

mongoose.connect(configDB.url); // connect to our database
/******************************************************** */
exports = module.exports = app;