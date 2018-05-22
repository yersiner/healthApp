var mongoose = require("mongoose");
var db = require("../lib/mongoose");
//创建添加目标数据表
var TargetSchema = new mongoose.Schema({
	username   : {type:String},
	createtime : {type:Date,default:Date.now},
	type       : {type:Number,default:0},//0表示跑步，1表示慢走，2表示爬山，3表示游泳，4表示打球。
	content    : {type:Object},
	state      : {type:Number,default:0}//0表示没有完成，1表示完成。
});
//创建添加目标数据模型
var TargetModel = db.model("target",TargetSchema);

module.exports = TargetModel;

