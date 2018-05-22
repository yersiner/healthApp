 var mongoose = require("mongoose");
 var db = require("../lib/mongoose");
 //意见反馈数据表
 var SuggestSchema = new mongoose.Schema({
 	username    :  {type:String},
 	createtime  :  {type:Date,default:Date.now},
 	content     :  {type:String},
 	cover       :  {type:Array},
 	email       :  {type:String},
 	score       :  {type:Number,default:0} 
 });
 //创建意见反馈数据表模型
 var SuggestModel = db.model("suggest",SuggestSchema);
 module.exports = SuggestModel;
 
