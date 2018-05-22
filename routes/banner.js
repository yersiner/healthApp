var express = require('express');
var router = express.Router();
var fs = require("fs");
//图片上传
var ModelBanner = require("../models/banner");
var api = require("../lib/api");
//公共函数库
var library = require("../lib/lib");

router.post("/addBanner",function(req,res,next){
	var condition = {};
	if(req.body.newtype){
		condition = {
			type  : req.body.type,  
			title : req.body.title, 
			detail: req.body.detail,
			grade : req.body.grade,  
			newstype:{
				subtype:req.body.newtype,
				avator:req.body.avator
			}
		}
	}else{
		condition ={
			type  : req.body.type,   
			title : req.body.title,  
			detail: req.body.detail, 
			grade : req.body.grade, 
			newstype:{
				avator:req.body.avator
			}
		}
	};
	api.save(ModelBanner,condition).then(function(ret){
		var text = library.statusText("添加成功",1000);
		library.returnData(req,res,text);
	},function(){
		var text = library.statusText("添加失败",-1000);
		library.returnData(req,res,text);
	});
});
//得到banner
router.post("/bannerList",function(req,res,next){
	var condition = {};
	if(req.body.type){
		if(req.body.type==0){
			condition = {type:"新闻资讯"}
		}else{
			condition = {type:"饮食推荐"}
		}
	api.find(ModelBanner,condition,{detail:0},{limit:4,sort:{createtime:-1}}).then(function(result){
		library.returnData(req,res,result);		
	},function(){
		var text = library.statusText("网络错误",-1000);
		library.returnData(req,res,text);
	});
	}else{
		var text = library.statusText("缺少参数",-1000);
		library.returnData(req,res,text);
	};
});

router.post("/bank",function(req,res,next){
	//随机题库
	var bankNum = Math.floor(Math.random()*10);
	var num = bankNum==0?1:bankNum;
	fs.readFile("qestionBank/bank_"+num+".json","utf-8",function(error,data){
		if(error){
		 library.statusText("获取题库失败，请稍后再试",-1000);
		}
		var reason = {
			num:num,
			result:data
		}
		library.returnData(req,res,reason);
	});
});





module.exports = router;

