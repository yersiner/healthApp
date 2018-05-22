var express = require('express');
var router = express.Router();
//健康资讯数据集合
var ModelNews = require("../models/news");
//饮食推荐
var ModelFoods = require("../models/foods");
//用户表
var ModelUsers = require("../models/users");
//monogoose 操作封装
var api = require("../lib/api");
//公共函数库
var library = require("../lib/lib");

/**
 * 添加资讯
 * **/
router.post("/addNews",function(req,res,next){
	var data = {
		type    : req.body.type,
		title   : req.body.title,
		grade   : req.body.grade,
		content : req.body.content,
		detail  : req.body.detail,
		cover   : req.body.cover
	};
	api.save(ModelNews,data).then(function(){//添加成功
		status = library.statusText("添加成功",1000);
		library.returnData(req,res,status);
	},function(){//添加失败
		status = library.statusText("添加失败",-1000);
		library.returnData(req,res,status);
	});
	
});
/**
 * 健康资资讯列表查询
 * 必须参数
 * @params {String} username    当前登录的用户
 * 可传参数
 * @params {Int}    type        当前的类型
 * @params {String} currentPage 当前页
 * @params {String} count       每页的数量  默认6 
 * @params {String} lastrecord  最后一次健康测试的评估等级
 * 
 * **/
router.post("/newsList",function(req,res,next){
		//得到当前的页数
		var currentPage = req.body.currentPage||1;
		//分页条数
		var count = req.body.count || 6;
		//返回的每页的内容
		var page = (currentPage-1)*count;
		//不存在健康测试记录也不是单模块的时候
		var recoder = {};
		//存在健康测试记录
		if(req.body.lastrecord){
			recoder ={
				grade:req.body.lastrecord
			}
		}
		//不存在健康记录
		if(req.body.type){
			recoder ={
				type :req.body.type
			}
		}
		//查询数据库
		api.find(ModelNews,recoder,{"detail":0},{sort:{shares:1},limit:count,skip:page}).then(function(result){
			var data = result;
			if(req.body.username){
				api.find(ModelUsers,{username:req.body.username},{unlike:1,_id:0}).then(function(ret){//成功
					var obj =ret[0].unlike;
					//过滤当前用户不喜欢的文章
					for(var i=0;i<obj.length;i++){
						for(var j=0;j<data.length;j++){
							if(obj[i]==data[j]._id){
								data.splice(j,1);
							}
						}
					}
					library.returnData(req,res,data);
				},function(){//失败
					library.returnData(req,res,result);
				});
			}else{
				library.returnData(req,res,result);
			}
		},function(){
			var status = library.statusText("请求失败!!",-1000);
			library.returnData(req,res,status);
		});
});


/*健康资讯资讯列表删除
 *必须参数
 *@parmas {String} username 当前的用户名
 *@parmas {String} id       文章ID 
 * */
router.post("/newsDelete",function(req,res,next){
	//判断参数是否完整
	console.log(req.body.username)
	console.log(req.body.id)
	if(req.body.username&&req.body.id){
		api.update(ModelUsers,{username:req.body.username},{$addToSet:{unlike:req.body.id}}).then(function(){
			var status = library.statusText("删除成功!!",1000);
			library.returnData(req,res,status);
		},function(){
			var status = library.statusText("删除失败!!",-1000);
			library.returnData(req,res,status);
		});
	}else{
		var status = library.statusText("缺少参数!!",-1000);
		library.returnData(req,res,status);
	}
});
/**
 *资讯搜索
 *@params {String} keyword 需要搜索的关键字
 *@params {String} type 用户ID
 *这里可显示当前用户不喜欢的文章 
 * **/
router.post("/search",function(req,res,next){
	if(req.body.keyword&&req.body.type){
		//得到当前的页数
		var currentPage = req.body.currentPage||1;
		//分页条数
		var count = req.body.count || 6;
		//返回的每页的内容
		var page = (currentPage-1)*count;
		var searchType =null;
		if(req.body.type=="news"){
			searchType = ModelNews; 
		}
		if(req.body.type=="foods"){
			searchType = ModelFoods
		}
		var key = req.body.keyword;
		api.find(searchType,{$or:[{title:{$regex:key}},{content:{$regex:key}},{detail:{$regex:key}}]},{detail:0},{limit:count,skip:page}).then(function(result){
			library.returnData(req,res,result);
		},function(){
			var status = library.statusText("数据异常!!",-1000);
			library.returnData(req,res,status);
		});
	}else{
		var status = library.statusText("缺少参数!!",-1000);
		library.returnData(req,res,status);
	}
});

/*
 *资讯详情
 * @params {String} id（必需）
 * @params {String} username (必需)
 * */
router.post("/newsDetail",function(req,res,next){
	if(req.body.id&&req.body.username){
		api.findById(ModelNews,{_id:req.body.id}).then(function(result){
			var data = result;
			//当此接口调用的时候 为他的增加浏览次数 不需要返回
			api.update(ModelNews,{_id:req.body.id},{$inc:{views:1}}).then(function(){
				var keywords = data.title.substring(data.title.length-3,data.title.length-1);
				api.find(ModelNews,{$or:[{title:{$regex:keywords}},{content:{$regex:keywords}},{detail:{$regex:keywords}}]},{detail:0},{limit:2}).then(function(result){
					var ret = result;
					api.update(ModelUsers,{username:req.body.username},{$addToSet:{newsreaded:[req.body.id]}}).then(function(){
						var newObj = {
							result:data,
							recommed:ret
						};
						library.returnData(req,res,newObj);
					},function(){
						var newObj = {
							result:data,
							recommed:ret
						};
						library.returnData(req,res,newObj);
					});
					
				},function(){
					console.log(req.body.id + "remmend error");
					library.returnData(req,res,data);
				});
			},function(){
				console.log(req.body.id + "views add error");
				library.returnData(req,res,data);
			});
		},function(){
			var status = library.statusText("数据异常!!",-1000);
			library.returnData(req,res,status);
		});
		
	}else{
		var status = library.statusText("缺少参数!!",-1000);
		library.returnData(req,res,status);
	}
});
/*资讯推荐分享接口
 *@params {String} id(必需)
 * 
 * */
router.post("/newsShare",function(req,res,next){
	if(req.body.id){
		api.update(ModelNews,{_id:req.body.id},{$inc:{shares:1}}).then(function(result){
			var status = library.statusText("成功!!",1000);
			library.returnData(req,res,status);
		});
		
	}else{
		var status = library.statusText("缺少参数!!",-1000);
		library.returnData(req,res,status);
	}
});


/**
 * 添加推荐饮食
 * **/
router.post("/addFoods",function(req,res,next){
	var data = {
		type    : req.body.type,
		case    : req.body.case,
		season  : req.body.season,
		title   : req.body.title,
		grade   : req.body.grade,
		content : req.body.content,
		detail  : req.body.detail,
		cover   : req.body.cover
	};
	api.save(ModelFoods,data).then(function(){//添加成功
		status = library.statusText("添加成功",1000);
		library.returnData(req,res,status);
	},function(){//添加失败
		status = library.statusText("添加失败",-1000);
		library.returnData(req,res,status);
	});
	
});
/**
 * 饮食推荐-》早中餐推荐
 * @params {String} lastrecord  最后一次健康测试的评估等级
 * **/
router.post("/foodsRecommed",function(req,res,next){
	var condition = {};
	//返回条数
	var count = 0;
	//判断是否存在测试记录
	if(req.body.lastrecord){
		condition = {
			grade : req.body.lastrecord
		}
	};
	//根据时间差返回调节返回的条数
	var time = library.getTimeDeffer("hour");
	if(time<6){
		count = 1;
	}else if(time<14){
		count = 2;
	}else if(time<24||time<0){
		count =3;
	};
	//数据库查询
	api.find(ModelFoods,condition,{detail:0,content:0},{limit:count}).then(function(result){
		var data = result;
		//查询推荐
		api.find(ModelFoods,{},{detail:0},{sort:{season:1}}).then(function(result){
			var statiac = result;
			var newObj = {
				result:data,
				recommed:statiac
			};
			library.returnData(req,res,newObj);
		},function(){
			console.log("aggregate error");
			library.returnData(req,res,data);
		});
	},function(){
		var status = library.statusText("数据异常",-1000);
		library.returnData(req,res,status);
	});
	
});
/*获取相应的餐饮列表推荐
 *@params {Int} type 餐饮类型(必需)
 * */
router.post("/getMealList",function(req,res,next){
	/*if(req.body.type){
		var condition = {};
		condition = {
			type : req.body.type
		};
		//判断是否存在测试记录
		if(req.body.lastrecord){
			condition = {
				grade : req.body.lastrecord,
				type : req.body.type
			}
		};	
		//读取数据库内容
		api.find(ModelFoods,condition,{detail:0,content:0},{sort:{createtime:1}}).then(function(result){
			library.returnData(req,res,result);
		},function(){
			var status = library.statusText("服务器异常",-1000);
			library.returnData(req,res,status);			
		});
		
	}else{
		var status = library.statusText("接口参数不完整",-1000);
		library.returnData(req,res,status);
	}*/
});
/*
 *季节餐饮推荐
 *@params {Int} season 季节类型 (必需)
 *@params {Int} currentPage 
 *@params {Int} count 
 * */
router.post("/getReasonList",function(req,res,next){
	if(req.body.season){
		console.log(req.body.season);
		//得到当前的页数
		var currentPage = req.body.currentPage||1;
		//分页条数
		var count = req.body.count || 6;
		//返回的每页的内容
		var page = (currentPage-1)*count;
		//不存在健康测试记录也不是单模块的时候
		api.find(ModelFoods,{season:req.body.season},{detail:0,content:0},{sort:{createtime:1},limit:count,skip:page}).then(function(result){
			library.returnData(req,res,result);
		},function(){
			var status = library.statusText("服务器异常",-1000);
			library.returnData(req,res,status);
		});
	};
});
/*
 *饮食推荐详情
 * @params {String} id（必需）
 * @params {String} username(必需)
 * */
router.post("/foodsDetail",function(req,res,next){
	if(req.body.id&&req.body.username){
		api.findById(ModelFoods,{_id:req.body.id}).then(function(result){
			var data = result;
			//当此接口调用的时候 为他的增加浏览次数 不需要返回
			api.update(ModelFoods,{_id:req.body.id},{$inc:{views:1}}).then(function(){
				var keywords = data.title.substring(data.title.length-3,data.title.length-1);
				api.find(ModelFoods,{$or:[{title:{$regex:keywords}},{content:{$regex:keywords}},{detail:{$regex:keywords}}]},{detail:0},{limit:2}).then(function(result){
					var ret = result;
					for(var i=0;i<ret.length;i++){
						if(ret[i]._id==req.body.id){
							ret.splice(i,1);
						}
					}
					var newObj = {
						result:data,
						recommed:ret
					}
					api.update(ModelUsers,{username:req.body.username},{$addToSet:{foodsreaded:[req.body.id]}}).then(function(){
						library.returnData(req,res,newObj);
					},function(){
						console.log(req.body.id + "foodsreads error");
						library.returnData(req,res,newObj);
					});
				},function(){
					console.log(req.body.id + "remmend error");
					library.returnData(req,res,data);
				});
			},function(){
				console.log(req.body.id + "views add error");
				library.returnData(req,res,data);
			});
		},function(){
			var status = library.statusText("数据异常!!",-1000);
			library.returnData(req,res,status);
		});
		
	}else{
		var status = library.statusText("缺少参数!!",-1000);
		library.returnData(req,res,status);
	}
});
/*饮食推荐分享接口
 *@params {String} id(必需)
 * 
 * */
router.post("/foodsShare",function(req,res,next){
	if(req.body.id){
		api.update(ModelFoods,{_id:req.body.id},{$inc:{shares:1}}).then(function(result){
			var status = library.statusText("成功!!",1000);
			library.returnData(req,res,status);
		});
		
	}else{
		var status = library.statusText("缺少参数!!",-1000);
		library.returnData(req,res,status);
	}
});
/**
 * 获取阅读过的所有文章列表
 * @params {String} username(必需)
 * **/
router.post("/readed",function(req,res,next){
	if(req.body.username){
		//得到当前的页数
		var currentPage = req.body.currentPage||1;
		//分页条数
		var count = req.body.count || 3;
		//返回的每页的内容
		var page = (currentPage-1)*count;
		api.find(ModelUsers,{username:req.body.username},{_id:0,newsreaded:1,foodsreaded:1}).then(function(result){
			var news = result[0].newsreaded;
			var foods = result[0].foodsreaded;
			api.find(ModelFoods,{_id:foods},{detail:0},{limit:count,skip:page}).then(function(result){
				var foodsData = result;
				api.find(ModelNews,{_id:news},{detail:0},{limit:count,skip:page}).then(function(ret){
					var newData = ret;
					var newObj = {
						news:newData,
						foods:foodsData
					};
					library.returnData(req,res,newObj);
				},function(){
					library.returnData(req,res,foodsData);
				},function(){
					var status = library.statusText("数据异常!!",-1000);
					library.returnData(req,res,status);
				});
			});
		});
		
	}else{
		var status = library.statusText("缺少参数!!",-1000);
		library.returnData(req,res,status);
	}
	
});

module.exports = router;