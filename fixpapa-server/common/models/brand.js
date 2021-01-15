'use strict';
var disableAllMethods = require('../../server/disableMethods.js').disableAllMethods;
var msg = require("../messages/amc-msg.json");

module.exports = function(Brand) {

		disableAllMethods(Brand, ['find']);



	Brand.addBrand =function(name,cb){
		let data ={
			name         :     name
		}

		data.createdAt = new Date();
		data.updatedAt = new Date();

		Brand.findOne({
			where:{
				name:name
			}
		},function(error,brandInst){
			if(error) return cb(error,null);
			if(brandInst) return cb(new Error("Brand already exists"),null);
			Brand.create(data,function(err,success){
				if(err)
					return cb(err,null)
				else
				    cb(null,{data:success,msg:msg.addBrand});
			})
		})
			

	}

	Brand.remoteMethod('addBrand',{
		accepts:[
		{arg :"name",type :"string",http:{source:'form'}}
		//{arg :"value",type :"array",http:{source:'form'}}
		//{arg :"categoryId",type :"string",http:{source:'form'}}

		],
		returns :{arg:"success",type :"object"},
		http :{verb:'post'}

	})

	Brand.getAllBrands =function(cb){


		let filter ={
			order:"name ASC"
		}
		Brand.find(filter,function(err,success){
			if(err)
				return cb(err,null)
			else
			{
				cb(null,{data:success,msg:msg.getBrand});

			}
		})

	}

	

	Brand.remoteMethod('getAllBrands',{
		accepts:[
		//{arg :"categoryId",type :"string",http:{source:'form'}}
		],
		returns :{arg:"success",type :"object"},
		http :{verb:'get'}

	})

	Brand.edit =function(name,brandId,cb){

    let data ={

          name : name
          

            }
            data.updatedAt = new Date();

        Brand.findById(brandId, function(err, brandInst) {
        if (err) return cb(err, null);

        brandInst.updateAttributes(data,function(err,success){
        if(err)
          return cb(err,null)
        else
          cb(null,{data: success, msg: msg.editBrand});
      })
    })
  }


  Brand.remoteMethod("edit", {
  accepts: [
    { arg: "name", type: "string", http: { source: "form" } },
    { arg: "brandId", type: "string", http: { source: "form" } }
 ],
  returns: { arg: "success", type: "object" }
})


  Brand.getBrand =function(brandId,cb){

    Brand.findById(brandId,function(err,success){
      if(err)
         return cb(err,null)
       else
          cb(null,{data: success, msg: msg.getBrand});

    })
  }

    Brand.remoteMethod('getBrand',{

    accepts: [
      { arg: "brandId", type: "string", required : true }
      
    ],
    returns: { arg: "success", type: "object" },
    http :{verb:'get'}
  })






};
