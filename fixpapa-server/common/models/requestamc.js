'use strict';
var disableAllMethods = require('../../server/disableMethods.js').disableAllMethods;
var msg = require("../messages/amc-msg.json");

module.exports = function(Requestamc) {

	disableAllMethods(Requestamc, ['find']);
	Requestamc.validatesInclusionOf('status', { in: ['requested', 'accepted', 'canceled', 'deleted'] });
	//Requestamc.validatesInclusionOf('userType', { in: ['Home User','Office User','Industry / College User'] });
	Requestamc.validatesInclusionOf('typeOfAmc', { in: ['Comprehensive','Non-comprehensive'] });


	Requestamc.createAmc =function(req,amcDetail,typeOfAmc,description,estiBudget,address,amcId,cb){
		let peopleId = req.accessToken.userId;
		let data ={
			peopleId	   :    peopleId,
			//userType	   :    userType,
			//categoryId   :    categoryId,
			//noOfUnits	   :    noOfUnits,
			//amcDetail	   :    amcDetail,
								//noOfUnits}],
			typeOfAmc      :    typeOfAmc,
			description    :    description,
			estiBudget     :    estiBudget,
			address        :    address,
			status		   :    "requested",
			amcId		   :    amcId,
			createdAt      :    new Date(),
        	updatedAt      :    new Date()
		}




		/*Requestamc.create(data,function(err,success){
			if(err)
			return cb(err,null);
			cb(null,{data:success,msg:msg.createAmc});

		})*/
		Requestamc.create(data,function(error,request){
      		if(error) return cb(error,null);
	        amcDetail.forEach(function(detail){
	            request.amcDetails.create(detail,function(err,success){});
	        })

	        cb(null,{data:request,msg:msg.createAmc});
        
      
      	// console.log(error,success)
    	});
	}

	Requestamc.remoteMethod("createAmc", {
		accepts: [
		  	{ arg: "req", type: "object", http: { source: "req" } },
			//{ arg: "userType", type: "string", http: { source: "form" } },
		    //{ arg: "categoryId", type: "string", http: { source: "form" } },
		    { arg: "amcDetail", type: "array",required:true, http: { source: "form" } },
			{ arg: "typeOfAmc", type: "string",required:true, http: { source: "form" } },
		    { arg: "description", type: "string", http: { source: "form" } },
		    { arg: "estiBudget", type: "number", http: { source: "form" } },
		    { arg: "address", type: "string", http: { source: "form" } },
		    { arg: "amcId", type: "string", http: { source: "form" } }
			
		],
	  	returns: { arg: "success", type: "object" }
    });

	Requestamc.getAllAmcReq =function(skip,limit,cb){
		limit = limit || 10;
        let aggregate ={  
	       	aggregate:[
		       	{
		       		$unwind :{
		       			path :"$amcDetail",
		       			preserveNullAndEmptyArrays: false
		       		}
		       	},
		       	{
					 $lookup:{
			           from: "Category",
			           localField: "amcDetail.categoryId",
			           foreignField: "_id",
			           as: "amcDetail.category"
			         }
				},
				{
		       		$unwind :{
		       			path :"$amcDetail.category",
		       			preserveNullAndEmptyArrays: false
		       		}
		       	},
		       	{
					 $lookup:{
			           from: "People",
			           localField: "peopleId",
			           foreignField: "_id",
			           as: "people"
			         }
				},
				{
		       		$unwind :{
		       			path :"$people",
		       			preserveNullAndEmptyArrays: false
		       		}
		       	},
		       	{
					$project:{
						"_id"                  : 1,
						"address"              : 1,
						"typeOfAmc"            : 1,
						"description"          : 1,
						"estiBudget"           : 1,
						"status"               : 1,
						"amcId"                : 1,
						"peopleId"             : 1,
						"createdAt"            : 1,
						"updatedAt"            : 1,
						"people.realm"         : "$people.realm",
						"people.fullName"      : "$people.fullName",
						"people.email"         : "$people.email",
						"people.mobile"        : "$people.mobile",
						"people.image"         : "$people.image",
						"category.name"        : "$amcDetail.category.name",
          				"category.image"       : "$amcDetail.category.name",
          				"category.image"       : "$amcDetail.category.name",
          				"category.noOfUnits"   : "$amcDetail.noOfUnits",
          				"category.categoryId"  :"$amcDetail.category._id",
					}
				},
				{
					$group:{
						"_id"             : "$_id",
						"address"         : {$first:"$address"},
						"typeOfAmc"       : {$first:"$typeOfAmc"},
						"description"     : {$first:"$description"},
						"estiBudget"      : {$first:"$estiBudget"},
						"status"          : {$first:"$status"},
						"amcId"           : {$first:"$amcId"},
						"peopleId"        : {$first:"$peopleId"},
						"createdAt"       : {$first:"$createdAt"},
						"updatedAt"       : {$first:"$updatedAt"},
						"people"          : {$first:"$people"},
						"amcDetails"      : {$push:"$category"}
          			
					}
				}
		    ]
		};
      	Requestamc.aggregate(aggregate,{},function(error,requests){
      		if(error) return cb(error,null);
      		let arr  = [];
		    skip = skip || 0;
	        arr = requests.slice(skip,skip+limit);  
      		cb(null, { data: arr,count:requests.length, msg: msg.getAllAmcReq });
	    });
	};
	Requestamc.remoteMethod('getAllAmcReq', {
	    accepts: [
		    {arg :"skip",type :"number"},
		    {arg :"limit",type :"number"}
		],
	    returns: {arg: 'success',type: 'object'},
	    http: { verb: 'get' }
	});




	Requestamc.getAmcReq =function(req,cb){
		let peopleId= req.accessToken.userId;
		let aggregate =[{
      $match: {

        categoryId : "categoryId"

      },
      $group: {
        _id: "$categoryId",
        categoryName: "name"
      		}
    	}]

		Requestamc.find(peopleId,function(err,peopleInst){
		if(err)
			return cb(err,null);
			
    	Requestamc.aggregate(aggregate,function(error,requests){
          if(error) return cb(error,null);

          cb(null,{data:requests,msg:msg.getAllAmcReq});
        })

		
	  })

	}

	Requestamc.remoteMethod("getAmcReq",{
    accepts : [
      {arg:"req",type:"object",http:{source:"req"}}
	],
    returns : {arg:"success",type:"object"},
    http:{verb:"get"}
  })











};
