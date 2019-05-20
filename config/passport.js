
const passport = require('passport')
const passport_fb = require('passport-facebook').Strategy
const passport_local = require('passport-local').Strategy
var dateFormat = require('dateformat');
const User = require("./../models/user")
const constants = require("./constants")
var bcrypt = require('bcrypt-nodejs');
const generateSafeId = require('generate-safe-id');

module.exports = function (passport) {



  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  // used to deserialize the user
  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

  /*==============facebook authentication =======================*/

  passport.use(new passport_fb({
    clientID: constants.clientID,
    clientSecret: constants.clientSecret,
    callbackURL: constants.callbackURL,
    profileFields: ['email', 'name', 'gender', 'birthday', 'locale']
  },
    (accessToken, refreshToken, profile, done) => {

      User.findOne({ _id: profile._json.id }, (err, user) => {

        if (err) return done(err);
        if (user) {

          return done(null, user);
        }
        // var salt = bcrypt.genSaltSync(saltRounds);
        var day = dateFormat(Date.now(), "yyyy-mm-dd HH:MM:ss");
        const newUser = new User({
          _id: profile._json.id,
          mail: profile._json.email,
          password: null,
          name: profile._json.name || profile._json.last_name + ' ' + profile._json.first_name,
          created_date: day,
          updated_date: day,
          status: 'active',
          active_hash: "Auth_Facebook"
        })
        newUser.save((err) => {

          return done(null, newUser);
        })
      })
    }
  ));

  /*======================== local ===============================*/


  // =========================================================================
  // LOCAL SIGNUP ============================================================
  // =========================================================================
  passport.use('local-signup', new passport_local({
    // by default, local strategy uses username and password, we will override with email
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true // allows us to pass back the entire request to the callback
  },
    (req, email, password, done) => {

      // // g-recaptcha-response is the key that browser will generate upon form submit.
      // // if its blank or null means user has not selected the captcha, so return the error.
      // if (req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
      //   return done(null, false, req.flash('error',  "Please select captcha"));
      // }
      // // Put your secret key here.
      // var secretKey = "6LeHEaMUAAAAAOPo-Ya6-3e6zGN7wtjlIL_l0zpT";
      // // req.connection.remoteAddress will provide IP address of connected user.
      // var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
      // // Hitting GET request to the URL, Google will respond with success or error scenario.
      // request(verificationUrl, function (error, response, body) {
      //   body = JSON.parse(body);
      //   // Success will be true or false depending upon captcha validation.
      //   if (body.success !== undefined && !body.success) {
      //     return done(null, false, req.flash('error',   "Failed captcha verification" ));
      //   }
        
      // });

      // asynchronous
      // User.findOne wont fire unless data is sent back
      process.nextTick(function () {

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'mail': email }, function (err, user) {
          // if there are any errors, return the error
          if (err)
            return done(err);

          // check to see if theres already a user with that email
          if (user) {
            return done(null, false, req.flash('error', 'That email is already taken.'));
          } else {


            User.find().sort([['_id', 'descending']]).limit(1).exec(function (err, userdata) {


              // if there is no user with that email
              // create the user
              var newUser = new User();

              // set the user's local credentials

              var day = dateFormat(Date.now(), "yyyy-mm-dd HH:MM:ss");

              var active_code = bcrypt.hashSync(Math.floor((Math.random() * 99999999) * 54), null, null);

              newUser._id = generateSafeId();
              newUser.mail = email;
              newUser.password = newUser.generateHash(password);
              newUser.name = req.body.username;
              newUser.created_date = day;
              newUser.updated_date = day;
              newUser.status = 'No_active'; //inactive for email actiavators
              newUser.active_hash = active_code;



              // save the user
              newUser.save(function (err) {
                if (err)
                  throw err;
                console.log('ok0');
                var email = require('./sendMailHelper');
            
                email.activate_email(req.body.username, email, active_code);
                var email = require('./sendMailHelper');
                return done(null, newUser, req.flash('success', 'Account Created Successfully,Please Check Your Email For Account Confirmation.'));
                //req.session.destroy();

              });

            });


          }

        });

      });
    }));
  //=========================================================================
  //  ===========================LOCAL LOGIN==================================
  // =========================================================================

  passport.use('local-login', new passport_local({
    // by default, local strategy uses username and password, we will override with email
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true // allows us to pass back the entire request to the callback
  },

    (req, email, password, done) => { // callback with email and password from our form


      // find a user whose email is the same as the forms email
      // we are checking to see if the user trying to login already exists
      User.findOne({ 'mail': email }, function (err, user) {
        // if there are any errors, return the error before anything else

        if (err)
          return done(null, false, req.flash('error', err)); // req.flash is the way to set flashdata using connect-flash


        // if no user is found, return the message
        if (!user)
          return done(null, false, req.flash('error', 'Sorry Your Account Not Exits ,Please Create Account.')); // req.flash is the way to set flashdata using connect-flash
        if (!user.password)
          return done(null, false, req.flash('error', 'Sorry your email has been verified by facebook!'));

        // if the user is found but the password is wrong
        if (!user.validPassword(password))
          return done(null, false, req.flash('error', 'Email and Password Does Not Match.')); // create the loginMessage and save it to session as flashdata

        if (user.status === 'inactive')
          return done(null, false, req.flash('error', 'Your Account Not Activated ,Please Check Your Email')); // create the loginMessage and save it to session as flashdata


        // all is well, return successful user
        req.session.user = user;

        return done(null, user);
      });

    }));

};

