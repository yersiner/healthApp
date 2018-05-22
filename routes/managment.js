var express = require('express');
var router = express.Router();
//用户数据集合
var ModelTest = require("../models/testing");
var ModelTarget = require("../models/target");
var ModelUser = require("../models/users");
//monogoose 操作封装
var api = require("../lib/api");
//公共函数库
var library = require("../lib/lib");

/**
 * 添加个人目标
 * @param {String} username (必需)
 * @param {String} type (必需)
 * @param {String} content (必需)
 * */
router.post("/targetsAdd",function(req,res,next){
	if(req.body.username&&req.body.type&&req.body.value&&req.body.unit){
		var data = {
			username:req.body.username,
			type:req.body.type,
			content:{
				value:req.body.value,
				unit:req.body.unit
			}
		}
		api.save(ModelTarget,data).then(function(){
			var status = library.statusText("成功",1000);		
			library.returnData(req,res,status);	
		},function(){
			var status = library.statusText("数据异常",-1000);		
			library.returnData(req,res,status);	
		});
	}else{
		var status = library.statusText("参数不完整",-1000);		
		library.returnData(req,res,status);	
	}
});
/*标记是否完成
 *@param {String} id (必需)
 *@param {String} state (必需)
 * */
router.post('/markCompleted',function(req,res,next){
	if(req.body.id&&req.body.state){
		api.update(ModelTarget,{_id:req.body.id},{$set:{state:req.body.state}}).then(function(){
			var status = library.statusText("成功",1000);		
			library.returnData(req,res,status);
		},function(){
			var status = library.statusText("失败",-1000);		
			library.returnData(req,res,status);
		})
	}else{
		var status = library.statusText("参数不完整",-1000);		
		library.returnData(req,res,status);
	}
});

router.post('/targetDelete',function(req,res,next){
	if(req.body.id){
		api.remove(ModelTarget,{_id:req.body.id}).then(function(){
			var status = library.statusText("成功",1000);		
			library.returnData(req,res,status);
		},function(){
			var status = library.statusText("失败",-1000);		
			library.returnData(req,res,status);
		})
	}else{
		var status = library.statusText("参数不完整",-1000);		
		library.returnData(req,res,status);
	}
});

router.post('/testDelete',function(req,res,next){
	if(req.body.id){
		api.remove(ModelTest,{_id:req.body.id}).then(function(){
			var status = library.statusText("成功",1000);		
			library.returnData(req,res,status);
		},function(){
			var status = library.statusText("失败",-1000);		
			library.returnData(req,res,status);
		})
	}else{
		var status = library.statusText("参数不完整",-1000);		
		library.returnData(req,res,status);
	}
});
/*添加测试记录
 *@param {String} username (必需)
 *@param {String} type (必需)
 *@param {String} number (必需)
 *@param {String} grade (必需)
 *@param {String} score (必需)
 * */
router.post("/addTest",function(req,res,next){
	if(req.body.username&&req.body.type){
		var data = {
			username:req.body.username,
			type:req.body.type,
			BMI:{
				weigth:req.body.weight,
				height:req.body.height,
				index :req.body.index,
				sex:req.body.sex
			},
			syn:{
				score:req.body.score,
				grade:req.body.grade,
				number:req.body.number
			}
		};
		api.save(ModelTest,data).then(function(){
			api.update(ModelUser,{username:req.body.username},{$set:{score:req.body.score,weigth:req.body.weight}}).then(function(){
				var status = library.statusText("成功",1000);		
				library.returnData(req,res,status);	
			},function(){
				var status = library.statusText("成功",1000);		
				library.returnData(req,res,status);	
			});
		},function(){
			var status = library.statusText("数据异常",-1000);		
			library.returnData(req,res,status);	
		});
	}else{
		var status = library.statusText("参数不完整",-1000);		
		library.returnData(req,res,status);	
	}
});
/**
 * 个人目标今日列表
 * @param {String} username (必需)
 * */
router.post("/targetNow",function(req,res,next){
	if(req.body.username){
		api.find(ModelTarget,{username:req.body.username},null,{sort:{createtime:-1}}).then(function(result){
			var data = result;
			var currentDay = new Date().getDate();
			for(var i=0;i<data.length;i++){
				var time = library.getTimeDeffer("day",data[i].createtime);
				if(parseInt(time)==currentDay-1||parseInt(time)==parseInt(currentDay)){
					continue;
				}else{
					 result.splice(i,1);
				}
			}
			library.returnData(req,res,data);
		},function(){
			var status = library.statusText("数据异常",-1000);		
			library.returnData(req,res,status);
		});
	}else{
		var status = library.statusText("参数不完整",-1000);		
		library.returnData(req,res,status);
	}
});
/**
 * 个人目标列表
 * @param {String} username (必需)
 * */
router.post("/targetList",function(req,res,next){
	if(req.body.username){
		//得到当前的页数
		var currentPage = req.body.currentPage||1;
		//分页条数
		var count = req.body.count || 4;
		//返回的每页的内容
		var page = (currentPage-1)*count;
		api.find(ModelTarget,{username:req.body.username},null,{sort:{createtime:-1},limit:count,skip:page}).then(function(result){
			library.returnData(req,res,result);
		},function(){
			var status = library.statusText("数据异常",-1000);		
			library.returnData(req,res,status);
		});
	}else{
		var status = library.statusText("参数不完整",-1000);		
		library.returnData(req,res,status);
	}
});

/**
 * 查询健康测试记录
 * @param {String} username (必需)
 * @params {String} currentPage 当前页
 * @params {String} count       每页的数量  默认6 
 * **/
router.post("/testList",function(req,res,next){
	if(req.body.username){
		//得到当前的页数
		var currentPage = req.body.currentPage||1;
		//分页条数
		var count = req.body.count || 6;
		//返回的每页的内容
		var page = (currentPage-1)*count;
		api.find(ModelTest,{username:req.body.username},null,{sort:{createtime:1},limit:count,skip:page}).then(function(result){
			library.returnData(req,res,result);
		},function(){
			var status = library.statusText("数据异常",-1000);		
			library.returnData(req,res,status);
		});
	}else{
		var status = library.statusText("参数不完整",-1000);		
		library.returnData(req,res,status);
	}
});

module.exports = router;