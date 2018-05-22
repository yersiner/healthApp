var mongoose = require("mongoose");
var db = require("../lib/mongoose");
//创建用户模型
var UserSchema = new mongoose.Schema({
	username   :  {type:String},
	password   :  {type:String},
	nick       :  {type:String},
	sign       :  {type:String},
	avatar     :  {type:String},
	createtime :  {type:Date, default:Date.now},
	sex        :  {type:Number,default:-1},//-1未知  1代表女 2代表男
	birthday   :  {type:Date, default:Date.now},
	weight     :  {type:Number,default:0},
	height     :  {type:Number,default:0},
	unlike     :  {type:Array},
	newsreaded :  {type:Array},
	foodsreaded:  {type:Array},
	lastrecord :  {type:Number,default:10}
});
//创建用户model
var UserModel = db.model("user",UserSchema);
module.exports = UserModel;
