$(function(){
	var params = function(name){
		return function(){
			 var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
		     var r = window.location.search.substr(1).match(reg);
		    if(r!=null)return  unescape(r[2]); return null;
		}()
	}
	//对侧边栏进行展开和缩放
	var accodion = {
		eventBind:function(option){
			//如果参数为空，返回
			if(!params(option.param)){
				return ;
			}
			//否则进行下面操作
			$(option.id).children().find("ul").removeClass("in");
			$(option.id).children().eq(params(option.param)-1).find("ul").addClass("in");
		},
		init:function(option){
			this.eventBind(option);
		}
	};
	//执行操作
	accodion.init({
		id:"#accodion",
		param:"block"
	});
	
});
