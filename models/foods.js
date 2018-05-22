var mongoose = require("mongoose");
var db = require("../lib/mongoose");
//创建饮食推荐模型
var FoodsSchema = new mongoose.Schema({
	type       :  {type:Number,default:0},//0表示早餐 1表示中餐 2表示晚餐 
	title      :  {type:String},
	content    :  {type:String},
	detail     :  {type:String},//详情描述
	cover      :  {type:String },
	createtime :  {type:Date, default:Date.now},
	grade      :  {type:Number,default:5},//根据健康情况分为1-10十个等级
	views      :  {type:Number,default:0},//被浏览的次数
	shares     :  {type:Number,default:0},//被分享次数
	season     :  {type:Number},//季节 0春天1夏天3秋天4冬天
	case       :  {type:Number}//所属系列 1水果 2蔬菜 3五谷 4面食 5 肉食 6火锅
});
//创建饮食推荐model
var FoodsModel = db.model("foods",FoodsSchema);
module.exports = FoodsModel;
