var express = require('express');
var router = express.Router();
const multer = require("multer");
const upload = multer({dest:"public/images/uploads"});
const Post = require("../models/Post");

/* GET users listing. */
const checkUser = function(req,res,next){
  if(req.session.user){
    next();
  }else{
    res.redirect("/login");
  }
}

router.get('/',checkUser,function(req, res, next) {
  res.send('respond with a resource');
});


router.get("/postupload",checkUser,function(req,res){
  res.render("user/postupload");
})

router.post("/postupload",checkUser,upload.single("image"),async function(req,res){
  const post = new Post();
  post.title = req.body.title;
  post.content = req.body.content;
  post.author = req.session.user.id;
  if(req.file) post.image = "/images/uploads/"+req.file.filename;
  const data = await post.save();
  console.log(data);
  res.redirect("/user/postlist");
})

router.get("/postlist",checkUser,async function(req,res){
  const posts = await Post.find({});
  res.render("user/postlist",{posts:posts});
})

router.get("/postdetail/:id",checkUser,async function(req,res){
  const post = await Post.findById(req.params.id).populate("author");
  res.render("user/postdetail",{post:post});
});

module.exports = router;
