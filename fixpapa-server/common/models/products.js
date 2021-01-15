'use strict';
var disableAllMethods = require('../../server/disableMethods.js').disableAllMethods;
var msg = require("../messages/product-msg.json");


module.exports = function(Products) {

	disableAllMethods(Products, ['find']);



	Products.addProduct =function(name,values,brandIds,cb){

		let data = {
				name       : name,
				values     : values,
				brandIds   : brandIds
				//categoryId	:   categoryId

				}
			data.createdAt = new Date();
			data.updatedAt = new Date();


			console.log(data);
			


			Products.create(data,function(err,success){
				if(err)
					return cb(err,null)
				else
				    cb(null,{data:success,msg:msg.addProduct});



			})
		}

		Products.remoteMethod('addProduct',{
		accepts:[
		{arg :"name",type :"string",http:{source:'form'}},
		{arg :"values",type :"array",http:{source:'form'}},
		{arg :"brandIds",type :"array",http:{source:'form'}}

		],
		returns :{arg:"success",type :"object"},
		http :{verb:'post'}

	})


	Products.getAllProducts =function(cb){
		let filter ={};
		filter.include = [{
      relation: "brand",
      scope: {
        
        fields: {"name":true}
      } 

      }]

		Products.find(filter,function(err,success){
			if(err)
				return cb(err,null)
			else
			{
				cb(null,{data:success,msg:msg.getProducts});
			}
		})
	}

	Products.remoteMethod('getAllProducts',{
		accepts:[
		//{arg :"categoryId",type :"string",http:{source:'form'}}
		],
		returns :{arg:"success",type :"object"},
		http :{verb:'get'}

	})


	Products.getProduct =function(productId,cb){

    Products.findById(productId,function(err,success){
      if(err)
         return cb(err,null)
       else
          cb(null,{data: success, msg: msg.getProduct});

    })
  }

    Products.remoteMethod('getProduct',{

    accepts: [
      { arg: "productId", type: "string", required: true}
      
    ],
    returns: { arg: "success", type: "object" },
    http :{verb:'get'}


  })

    Products.edit =function(name,values,brandIds,productId,cb){

    let data ={

          name 		: 	name,
          values    :   values,
          brandIds   : brandIds

            }
            data.updatedAt = new Date();

        Products.findById(productId, function(err, productInst) {
        if (err) return cb(err, null);

        productInst.updateAttributes(data,function(err,success){
        if(err)
          return cb(err,null)
        else
          cb(null,{data: success, msg: msg.editProduct});
      })
    })
  }


  Products.remoteMethod("edit", {
  accepts: [
    { arg: "name", type: "string", http: { source: "form" } },
    { arg: "values", type: "array", http: { source: "form" } },
    { arg: "brandIds", type: "array", http: { source: "form" } },
	{ arg: "productId", type: "string", required: true}
  
  ],
  returns: { arg: "success", type: "object" }
})






};
