var express = require('express');
var router = express.Router();
//图片上传
var  formidable = require("formidable");
var fs = require("fs");
router.post('/upload',function(req,res,next){
	var UPLOAD_DIR = "public/upload";
	var DIR = "upload";
	var option = {
		uploadDir: UPLOAD_DIR,
		keepExtensions:true,
		type:true,
	}
	var form = new formidable.IncomingForm(option); //创建上传表单
     if (!fs.existsSync(UPLOAD_DIR)) {
        fs.mkdirSync(UPLOAD_DIR);
    }
    var displayUrl;
    form.parse(req, function(err, fields, files) {
        if (err) {
            res.json(err);
            return;
        }
        console.log(files);
        var extName = ''; //后缀名
        switch (files.upload.type) {
            case 'image/pjpeg':
                extName = 'jpg';
                break;
            case 'image/jpeg':
                extName = 'jpg';
                break;
            case 'image/png':
                extName = 'png';
                break;
            case 'image/x-png':
                extName = 'png';
                break;
        }
        if (extName.length === 0) {
            res.json({
                code: 202,
                msg: '只支持png和jpg格式图片'
            });
            return;
        } else {
            var avatarName = '/' + Date.now() + '.' + extName;
            var newPath = form.uploadDir + avatarName;
            displayUrl =DIR+ avatarName;
            fs.renameSync(files.upload.path, newPath); //重命名
            res.json({
                code: 200,
                msg: displayUrl
            });
        }
    });
	
	
});


module.exports = router;
