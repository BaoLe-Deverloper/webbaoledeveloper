
const User = require('./../models/useradmin');
const post = require('./../models/post');
const category = require('./../models/category');
const bcrypt = require('bcrypt');
const generateSafeId = require('generate-safe-id');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');


module.exports.home_get = (req, res) => {
  category.find((err, result) => {
    res.render("admin/index", {categories: result, user: req.session.Admin});
  });
};
module.exports.logout_get = (req, res) => {
  req.session.Admin = null;
  res.redirect("/admin/login");
};
module.exports.login_post = (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  User.findOne({ 'email': email }, function (err, user) {
    // if there are any errors, return the error before anything else
    if (err) {
      req.flash('error', err); // req.flash is the way to set flashdata using connect-flash
      res.redirect("/admin/login");
    } else if (!user) {
      req.flash('error', 'Sorry Your Account Not Exits ,Please Create Account.');
      res.redirect("/admin/login");
    } else if (!user.validPassword(password)) {
      req.flash('error', 'Email and Password Does Not Match.');
      res.redirect("/admin/login");
    } else {
      req.session.Admin = user;
      res.redirect("/admin");
    }
  });
};
module.exports.createPosts_post = (req, res) => {
  let adminname = null;
  let id = req.body.id;
  let key = req.body.key;
  let name = req.body.name;
  let status= req.body.status;
  let title= req.body.title;
  let introduce= req.body.introduce;
  let body= req.body.content;
  let category = req.body.category;
  let url = req.body.url;
  let dateCreate =  req.body.dateCreate;

  let newPost = new post({
    title:title,
    url:url,
    body:body,
    author:req.session.Admin.name,
    category:category,
    introduce:introduce,
    status:status,
    created_date:dateCreate,
    viewcount:0
  })
  if (id) {
    post.findByIdAndUpdate(id, {
      title:title,
      url:url,
      body:body,
      author:req.session.Admin.name,
      category:category,
      introduce:introduce,
      status:status,
      viewcount:0
    }, (err, result) => {
      if (!err)
      res.redirect('/admin');
    })
  } else {
    newPost.save((err) => {
      if (!err)
      res.redirect('/admin');  
    })
  } 
};

module.exports.deletePost_post = (req, res) => {
  post.findByIdAndDelete(req.body.id).exec();
  res.send(false);
};

module.exports.loadPosts_get = (req, res) => {
  post.find((err, posts) => {
    if (!err)
      res.status(200).send({ data: posts });
  })
};

module.exports.getPost_byID = (req,res)=>{
  let id = req.body.id;
  post.findById(id,(err,post)=>{
    if(!err)
    res.send(post);
  });
};

module.exports.changeStatusPost_post = (req, res) => {
  post.findById(req.body.id, (err, post) => {
    if (err) console.log(err);
    else {
      post.status = !post.status;
      post.save();
      res.send(false);
    }
  })
};



module.exports.category_loadtable_get = (req, res) => {
  category.find((err, categories) => {
    if (!err)
      res.status(200).send({ data: categories });
  })
}
module.exports.category_delete = (req, res) => {
  category.findByIdAndDelete(req.body.id).exec();
  res.send(false);
}



module.exports.addOrUpdate_category = (req, res) => {
  let id = req.body.id;
  let parent = req.body.parent;
  let key = req.body.key;
  let name = req.body.name;
  if (id) {
    category.findByIdAndUpdate(id, { "key": key,"parent":parent, "name": name }, (err, result) => {
      if (!err)
      res.redirect('/admin');
    })
  } else {
    let newCategory = new category({
      "key": key,
      "parent":parent,
      "name": name
    })
    newCategory.save((err) => {
      if (!err)
      res.redirect('/admin');
     
    })

  }
} 

module.exports.getCategory_byID = (req,res)=>{

  category.findById(req.body.id,(err, result)=>{
   
    if(!err)
      res.send(result);
  });
}