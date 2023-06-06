var express = require('express');
var router = express.Router();
const User = require("../models/User");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get("/register",function(req,res){
  res.render("register");
})


router.post("/register",async function(req,res){
 const user = new User();
  user.name = req.body.name;
  user.email  = req.body.email;
  user.password  = req.body.password;
  const data  = await user.save();
  console.log(data);
  res.redirect("/login");
})

router.get("/login",function(req,res){
  res.render("login");
})

router.post("/login",async function(req,res){
  const user = await User.findOne({email:req.body.email});
  if(user != null && (req.body.password==user.password)){
    req.session.user = {id:user._id,name:user.name,email:user.email};
    res.redirect("/");
  }else{
    res.redirect("/login");
  }
})

router.get("/logout",function(req,res){
  req.session.destroy(function(){
    res.redirect("/");
  })
})

module.exports = router;
