var express = require('express');
var router = express.Router();

/* GET home page. */
//登录
router.get('/login', function(req, res, next) {
  res.render("login",{title:"登录"});
});
//注册
router.get('/reg', function(req, res, next) {
  res.render("reg",{title:"注册"});
});
//进入主页
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
//进入资讯添加
router.get("/module_one_add",function(req,res,next){
	res.render("news/module_one_add",{title:"资讯添加"})
});
//进入资讯管理
router.get("/module_one_managment",function(req,res,next){
	res.render("news/module_one_managment",{title:"资讯添加"})
});
//进入饮食推荐添加
router.get("/foodsAdd",function(req,res,next){
	res.render("foods/foods_add",{title:"推荐添加"});
});
router.get("/foodsManagment",function(req,res,next){
	res.render("foods/foods_managment",{title:"推荐添加"});
});
router.get('/edit',function(req,res,next){
	res.render("edit");
});
/*目标管理*/
router.get("/bannerAdd",function(req,res,next){
	res.render("banner/banner",{title:"banner添加"});
});
router.get('/foodsReason',function(req,res,next){
	res.render("banner/foodsReason",{title:"季节推荐添加"});
});
/*目标管理*/
router.get("/testAdd",function(req,res,next){
	res.render("tests/testAdd",{title:"推荐添加"});
});
router.get('/testManagment',function(req,res,next){
	res.render("tests/testManagment");
});
module.exports = router;
