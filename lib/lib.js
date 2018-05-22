var crypto = require("crypto");

var lib = {
	//数据返回
	returnData : function(req,res,obj){
		var __callback = req.query.callback;
		console.log(__callback)
		if(__callback){
			res.type("text/javascript");
			res.send(__callback + "("+JSON.stringify(obj)+")");
		}else{
			res.send(obj);
		}
	},
	//加密
	serect : function(obj){
		var __md5 = crypto.createHash("md5");
		__md5.update(obj);
		var secretContent = __md5.digest('hex');
		return secretContent;
	},
	statusText : function(text,code){
		var _status ={
			status:text,
			code : code||-1,
			timed : Date.now()
		}
		return _status;
	},
	getTimeDeffer : function(obj){
		var timeDeffer=0;
		if(obj=="hour"){
			var __basetime = 6;
			var __currentTime = new Date().getHours();
			timeDeffer = __currentTime - __basetime;
		}
		if(obj=="mouth"){
			if(!arguments[1]){
				var __baseMouth = 1;
				var __currentMouth = new Date().getMonth()+1;
				timeDeffer = __currentMouth - __baseMouth;
			}else{
				timeDeffer = new Date(arguments[1]).getMonth()+1;
			}
		}
		if(obj=="day"){
			var __day = new Date(arguments[1]).getDate();
			timeDeffer = __day;
		}
		return timeDeffer;
	},
}

module.exports = lib;