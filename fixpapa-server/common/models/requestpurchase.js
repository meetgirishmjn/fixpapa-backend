'use strict';
var disableAllMethods = require('../../server/disableMethods.js').disableAllMethods;
var msg = require("../messages/newpurchase-msg.json");

module.exports = function(Requestpurchase) {
		disableAllMethods(Requestpurchase, ['find','deleteById']);
		Requestpurchase.validatesInclusionOf('status', { in: ['requested', 'accepted', 'canceled', 'deleted'] });

		Requestpurchase.createPurchase =function(req,newpurchaseId,productId,brandId,values,title,purchaseDate,modelNumber,noOfUnits,configuration,other,priceBudget,deliveryAdd,modeOfPayment,cb){
			let peopleId = req.accessToken.userId;
			let data = {

				peopleId        :     peopleId,
				newpurchaseId	:     newpurchaseId,
				productId       :     productId,
				brandId         :     brandId,
				values          :     values,
				title           :     title,
				purchaseDate    :     purchaseDate,     
				modelNumber		:     modelNumber,
				noOfUnits		:     noOfUnits,
				configuration	:     configuration,
				other			:     other,
				priceBudget	 	:     priceBudget,
				deliveryAdd		:     deliveryAdd,
				modeOfPayment	:     modeOfPayment,
				status		   	:     "requested",
				createdAt      	:     new Date(),
        		updatedAt      	:     new Date()
			}

			Requestpurchase.create(data,function(err,success){
				if(err)
					return cb(err,null)
				else
				cb(null,{data:success,msg:msg.createPurchaseReq});
			})
		}

		Requestpurchase.remoteMethod('createPurchase', {
   
	    	accepts: [
			    { arg: 'req', type: 'object', http: { source: 'req' } },
			    { arg: 'newpurchaseId', type: 'string', http: { source: 'form' } },
			    { arg: 'productId', type: 'string', http: { source: 'form' } },
			    { arg: 'brandId', type: 'string', http: { source: 'form' } },
			    { arg: 'values', type: 'array', http: { source: 'form' } },
			    { arg: 'title', type: 'string', http: { source: 'form' } },
			    { arg: 'purchaseDate', type: 'Date', http: { source: 'form' } },
				{ arg: 'modelNumber', type: 'string', http: { source: 'form' } },
			    { arg: 'noOfUnits', type: 'number', http: { source: 'form' } },
			    { arg: 'configuration', type: 'string', http: { source: 'form' } },
			    { arg: 'other', type: 'string', http: { source: 'form' } },
		  		{ arg: 'priceBudget', type: 'number', http: { source: 'form' } },
			    { arg: 'deliveryAdd', type: 'string', http: { source: 'form' } },
			    { arg: 'modeOfPayment', type: 'string', http: { source: 'form' } }
	    	],
		    returns: {arg: 'success',type: 'object'},
		    http: { verb: 'post' },
	   });

		
		Requestpurchase.getAllPurchases =function(skip,limit,cb){
		    //let peopleId = req.accessToken.userId;
		    let filter = {};
		    filter.skip = skip;
		    filter.limit = limit;
		    if (!filter.where)
		        filter.where = {};
	        
	        //filter.where.peopleId = peopleId;
	        filter.order = "createdAt DESC";

	      
	        filter.include = [
		        {
		            relation: "newpurchase"
		        },
		        {
		            relation: "product"
		        },
		        {
		            relation: "brand"
		        },
				{
	            	relation:"people",
	            	scope:{
	              		fields:{fullName:true,mobile:true,email:true,image:true}
	            	}
	          	}
          	];
            Requestpurchase.find(filter,function(err,success){
		        if(err)
		            return cb(err,null);
		      	else {
		            Requestpurchase.count(filter.where,function (err,totalCount) {
			            if(err)
			              return cb(err,null);
			            cb(null, { data: success,count:totalCount, msg: msg.getAllPurchaseReq });
		            });
		        }
        
        		//cb(null, { data: success, msg: msg.getAllPurchaseReq });
      		});	
    };
    
      Requestpurchase.remoteMethod("getAllPurchases",{
        accepts : [
        {arg :"skip",type :"number"},
        {arg :"limit",type :"number"}

        ],
        returns : {arg:"success",type:"object"},
        http:{verb:"get"}
      })

	





				




};
