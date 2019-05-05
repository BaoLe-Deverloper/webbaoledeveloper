const admin_controllers = require("./../controllers/admin");
const home_controllers = require("./../controllers/site");



/*===================router for website =========================*/
module.exports = function (app, passport) {
  app.get('/', home_controllers.home_get);
  app.get('/home', home_controllers.home_get);
  app.get('/doc/:url', home_controllers.doc_get);
  app.get('/login', home_controllers.login_get);
  app.get('/auth/facebook', passport.authenticate("facebook", { scope: ['email'] }));
  app.get('/auth/facebook/callbackfacebook', passport.authenticate('facebook', { failureRedirect: '/login' }), function (req, res) {
    req.session.user = req.session.passport.user;
    res.redirect('/');
  });
  app.get("/logout", home_controllers.logout_get);
  app.get("/signup", home_controllers.signup_get);


  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/home', // redirect to the secure profile section
    failureRedirect: '/signup', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/home', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  /*==============================================================*/


  /*===============router for Admin_page =========================*/

  app.get("/admin/login", (req, res, next) => {
    res.render("admin/login", {
      error: req.flash("error"),
      success: req.flash("success"),
      session: req.session
    });
  }).post("/admin/login", admin_controllers.login_post);
  app.use((req, res, next) => {
    if (req.session.Admin) {
      next();
    }
    else
      res.redirect("/admin/login");
  });
  app.get('/admin', admin_controllers.home_get);
  app.get("/admin/logout", admin_controllers.logout_get);
  app.get("/admin/api/post_loadtable", admin_controllers.loadPosts_get);
  app.post('/admin/api/post_delete', admin_controllers.deletePost_post);
  app.post("/admin/addpost", admin_controllers.createPosts_post);
  app.post('/admin/api/post_status', admin_controllers.changeStatusPost_post);
  app.post('/admin/api/getPost_byID', admin_controllers.getPost_byID)

  app.post("/admin/add_category", admin_controllers.addOrUpdate_category)
  app.get('/admin/api/category_loadtable', admin_controllers.category_loadtable_get)
  app.post('/admin/api/post_delete_category', admin_controllers.category_delete)
  app.post('/admin/api/getCategory_byID', admin_controllers.getCategory_byID)

  app.use(function (req, res, next) {
    res.status(404).render('404');
  });

  app.use(function (req, res, next) {
    res.status(500).render('404');
  });

};
  /*==============================================================*/