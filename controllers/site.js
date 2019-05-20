
const post = require('./../models/post');
const category = require('./../models/category');
module.exports.login_get =  (req, res, next) => { 
res.render('teamplate_site/login', {	error : req.flash("error"),
success: req.flash("success"),
session:req.session
})};

module.exports.signup_get = (req, res) => {

	if (req.session.user) {

		res.redirect('/home');

	} else {

		res.render('teamplate_site/signup', {
			error : req.flash("error"),
			success: req.flash("success"),
			session:req.session
		});
	}

};
module.exports.home_get = (req, res) => {

  res.render("teamplate_site/index", { 
    user: req.session.user,
    error : req.flash("error"),
    success: req.flash("success")
   });
};

module.exports.doc_get = (req, res,next) =>{


	let id = req.params.url ;
	post.findOne(url,(error,post)=>{
		if(error)
		res.status(404).render('404');
		else
	  	res.render("teamplate_site/doc", {post:post});	
	})
	console.log(id);
 
};

module.exports.logout_get =  (req, res) => {
  req.session.user = null;
  res.redirect('/');
};

module.exports.getCategories = (req,res)=>{
	
    category.find({parent:req.params.id},(err,result)=>{
		if(!err){
          res.status(200).send(result);
		}else{
		  res.status(404).send("error system !")
		}
	})
}
module.exports.Active_account =(req,res)=>{

	console.log(req.params.email+ '  ' +req.params.active_link);
}