var mongoose = require("mongoose");
var db = require("../lib/mongoose");
//创建健康资讯表
var NewsSchema = new mongoose.Schema({
	type       :  {type:Number,default:0},//0表示健康常识 1表示健康养生3表示休闲娱乐4表示更多
	title      :  {type:String},
	content    :  {type:String},
	detail     :  {type:String},//详情描述
	cover      :  {type:String},
	createtime :  {type:Date, default:Date.now},
	grade      :  {type:Number,default:5},//根据健康情况分为1-10十个等级
	views      :  {type:Number,default:0},//被浏览的次数
	shares     :  {type:Number,default:0},//被分享次数
});
//创建健康资讯model
var NewsModel = db.model("News",NewsSchema);
module.exports = NewsModel;
