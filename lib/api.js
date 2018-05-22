

module.exports ={
	/*添加数据
	 * @param  {Object}  data 需要保存的数据。
	 * */
	save(objectModel,data){
		return new Promise(function(resolve,reject){
			objectModel.create(data,function(error,doc){
				if(error){
					reject(error);
				}else{
					resolve(doc);
				}
			});
		})
	},
	find(objectModel,data = {},fields=null,option={}){
		return new Promise(function(resolve,reject){
			objectModel.find(data,fields,option,function(error,doc){
				if(error){
					reject(error);
				}else{
					resolve(doc);
				}
			})
		});
	},
	findOne(objectModel,data){
		return new Promise(function(resolve,reject){
			objectModel.findOne(data,function(error,doc){
				if(error){
					reject(error);
				}else{
					resolve(doc);
				}
			});
		});
		
	},
	findById(objectModel,data){
		return new Promise(function(resolve,reject){
			objectModel.findById(data,function(error,doc){
				if(error){
					reject(error);
				}else{
					resolve(doc);
				}
			});
		});
	},
	update(objectModel,conditions, update){
		return new Promise(function(resolve,reject){
			objectModel.update(conditions,update,function(error,doc){
				if(error){
					reject(error);
				}else{
					resolve(doc);
				}
			});
		});
	},
	remove(objectModel,conditions){
		return new Promise(function(resolve,reject){
			objectModel.remove(conditions,function(error,doc){
				if(error){
					reject(error);
				}else{
					resolve(doc);
				}
			});
		});
	},
	aggregate(objectModel,conditions,update){
		return new Promise(function(resolve,reject){
			objectModel.aggregate(conditions,function(error,doc){
				if(error){
					reject(error);
				}else{
					resolve(doc);
				}
			});
			
		});
	}
	
	
}
