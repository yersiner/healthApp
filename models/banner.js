var mongoose = require("mongoose");
var db = require("../lib/mongoose");

var bannerSchema = new mongoose.Schema({
	type     : {type:String},
	title    : {type:String},
	detail   : {type:String},
	grade    : {type:Number,default:10},
	createtime:{type:Date,defualt:Date.now},
	newstype : {type:Object} 
});

var bannerModel = db.model("banners",bannerSchema);
module.exports = bannerModel;
