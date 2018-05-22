var express = require('express');
var router = express.Router();
//用户数据集合
var objectModel = require("../models/users");
//monogoose 操作封装
var api = require("../lib/api");
//公共函数库
var library = require("../lib/lib");

/**登录接口
 * 以下状态码代表相应的结果返回
   * status   code
   * noUser   3000
   * success  4000
   * error    5000
   */
router.post('/login', function(req, res, next) {
	//解析body内容
	//加密密码 并对比
	var secretPwd,newobj=null;
	if(req.body.password){
		secretPwd = library.serect(req.body.password);
	}
	var user = {
		username:req.body.username,
	}
  //查询用户
  api.findOne(objectModel,user).then(function(result){//成功得到数据
  	//没有用户
  	if(result==null){
  		 status = library.statusText("没有此用户",-1000);
  		 library.returnData(req,res,status);
  	}else if(secretPwd){
  		//存在用户
  		if(secretPwd!=result.password){
	  		newobj = {
	  		 	result:result,
	  		 	status:'密码错误',
	  		 	code:-1000
	  		}
  		}else{
	  		newobj = {
	  		 	result:result,
	  		 	status:'登录成功',
	  		 	code:4000
	  		}
  		}
  	}else{
  		newobj = {
	  		 	result:result,
	  		 	status:'缺少参数!',
	  		 	code:-1000
	  		}
  	}
  	 library.returnData(req,res,newobj);
  },function(){	//数据库错误
  	status = library.statusText("服务器错误",-5000);
  	library.returnData(req,res,status);
  })
});
/*
 *注册接口
 *以下状态码代表相应的返回结果
 * status    code
 * 不成功                  小于0
 * 成功                      大于0
 * */
router.post('/reg', function(req, res, next) {
	if(req.body.password&&req.body.username){
		//解析http post内容
	var password = req.body.password;
	//对密码加密
	var secretPwd =library.serect(password);
	var data = {
		username : req.body.username,
		password : secretPwd,
		sex      : req.body.sex||-1,
		nick     : req.body.nick||null,
		sign     : req.body.sign||null
	}
  //注册 先去查询是否存在 不存在在继续向下添加
  api.findOne(objectModel,{username : req.body.username}).then(function(result){
			//存在用户
  	if(result){
	  	status = library.statusText("已存在",-1000);
	  	library.returnData(req,res,status);
  	}else{
  		//不存在
	  	api.save(objectModel,data).then(function(result){
		  	status = library.statusText("注册成功",1000);
	  		library.returnData(req,res,status);
	  	},function(){
	  		status = library.statusText("服务器错误",-5000);
	  		library.returnData(req,res,status);
	  	});
  	}
  	
  });
	}else{
		status = library.statusText("参数不完整",-5000);
	  	library.returnData(req,res,status);	
	}
});
/**
 * 修改个人个人资料
 * status   code
 * 成功                    大于0
 * 失败                    小于0
 * */
router.post("/Modify",function(req,res,next){
	//判断参数是否完整当前用户
	if(req.body.username){
		//接受的数据做相应的判断
		var modify=null;
		//修改头像
		if(req.body.avatar){
			modify = {
				avatar:req.body.avatar
			}
			//修改昵称
		}else if(req.body.nick){
			modify = {
				nick :req.body.nick
			}
			//修改性别
		}else if(req.body.sex){
			modify = {
				sex : req.body.sex
			}
		}else if(req.body.birthday){
			modify = {
				birthday : req.body.birthday
			}
		}else if(req.body.sign){
			modify = {
				sign : req.body.sign
			}
		}
		//信息修改实现
 		api.update(objectModel,{username:req.body.username},{$set:modify}).then(function(result){//成功
			status = library.statusText("修改成功",1000);
			library.returnData(req,res,status);
 		},function(){//失败
 			status = library.statusText("修改失败",-1000);
 			library.returnData(req,res,status);
 		});
 		//修改
	}else{
		status = library.statusText("参数不完整",-1000);
		library.returnData(req,res,status);
	}
});
/*
 *修改用户名
 *修改密码 
 * */
router.post("/Modify/phone",function(req,res,next){
	if(req.body.username){
		api.findOne(objectModel,{username:req.body.username}).then(function(){
			/*存在当前手机号
			 *如果需要验证码，这里实现发送逻辑 
			 * */
			api.update(objectModel,{username:req.body.username},{$set:{username:req.body.newUsername}}).then(function(){
				/*
				 * 修改成功
				 * */
				status = library.statusText("修改成功",1000);
				library.returnData(req,res,status);
			},function(){
				/*
				 *修改失败 
				 * 
				 * */
				status = library.statusText("修改失败",-1000);
				library.returnData(req,res,status);
			});
		},function(){
			/*
				 *无用户 
				 * 
				 * */
				status = library.statusText("查无用户",-1000);
				library.returnData(req,res,status);
		});
	}
	
});
/*
 *修改密码 
 * */
router.post("/Modify/password",function(req,res,next){
	var user = {
		username : req.body.username,
		password : library.serect(req.body.password)
	}
	if(req.body.username){
		api.findOne(objectModel,user).then(function(){
			/*存在当前手机号
			 *如果需要验证码，这里实现发送逻辑 
			 * */
			api.update(objectModel,{username:req.body.username},{$set:{password:library.serect(req.body.newPassword)}}).then(function(){
				/*
				 * 修改成功
				 * */
				status = library.statusText("修改成功",1000);
				library.returnData(req,res,status);
			},function(){
				/*
				 *修改失败 
				 * 
				 * */
				status = library.statusText("修改失败",-1000);
				library.returnData(req,res,status);
			});
		},function(){
			/*
				 *原密码错误 
				 * 
				 * */
				status = library.statusText("原密码错误",-1000);
				library.returnData(req,res,status);
		});
	}
	
	
});

module.exports = router;
