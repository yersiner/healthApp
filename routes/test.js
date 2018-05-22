var express = require('express');
var router = express.Router();

router.post('/getImg',function(req,res,next){
	console.log(req.body);
	res.json({code:200,result:'success'});
});

module.exports = router;
