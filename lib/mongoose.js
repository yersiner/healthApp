var mongoose = require("mongoose");
var db = mongoose.connect("mongodb://localhost:27017/myapp");
module.exports = db;
