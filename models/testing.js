var mongoose = require("mongoose");
var db = require("../lib/mongoose");
//创建添加目标数据表
var TestingSchema = new mongoose.Schema({
	username   : {type:String},
	createtime : {type:Date,default:Date.now},
	type       : {type:Number,default:0},//0表示IBM测试，1表示综合测试
	BMI	       : {type:Object},
	syn        : {type:Object} 
});
//创建添加目标数据模型
var TestingModel = db.model("testing",TestingSchema);

module.exports = TestingModel;

