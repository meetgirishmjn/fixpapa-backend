'use strict';

var disableAllMethods = require('../../server/disableMethods.js').disableAllMethods;
var msg = require("../messages/category-msg.json");
 
 module.exports = function(Requestrent) {

 	disableAllMethods(Requestrent, ['find','deleteById']);
	Requestrent.validatesInclusionOf('status', { in: ['requested', 'accepted', 'canceled', 'deleted'] });

	Requestrent.createRentReq =function(req,rentDetail,description,estiBudget,address,cb){

		let peopleId = req.accessToken.userId;

		let data ={
			peopleId	 :      peopleId,
			description	 :      description,
			estiBudget	 :      estiBudget,
			address      :      address,
			status		 :      "requested",
			createdAt    :      new Date(),
        	updatedAt    :      new Date()
		};
			

		Requestrent.create(data,function(error,request){
      		if(error) return cb(error,null);
	        rentDetail.forEach(function(detail){
	            request.rentDetails.create(detail,function(err,success){});
	        });

	        cb(null,{data:request,msg:msg.createRent});
        
    	});
	};

	Requestrent.remoteMethod("createRentReq", {
	    accepts: [
		    { arg: "req", type: "object", http: { source: "req" } },
			{ arg: "rentDetail", type: "array",required:true, http: { source: "form" } },
			{ arg: "description", type: "string", http: { source: "form" } },
		    { arg: "estiBudget", type: "number", http: { source: "form" } },
		    { arg: "address", type: "string",required:true, http: { source: "form" } }
		],
  		returns: { arg: "success", type: "object" }
    });

	Requestrent.getAllRentReq =function(skip,limit,cb){
		limit = limit || 10;
    	
        let aggregate = {  
	       	aggregate:[
		       	{
		       		$unwind :{
		       			path :"$rentDetail",
		       			preserveNullAndEmptyArrays: false
		       		}
		       	},
		       	{
					$lookup:{
			           from: "Category",
			           localField: "rentDetail.categoryId",
			           foreignField: "_id",
			           as: "rentDetail.categories"
			        }
				},
				{
		       		$unwind :{
		       			path :"$rentDetail.categories",
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
						"rentId"              : "$_id",
						"typeOfAmc"           : 1,
						"description"         : 1,
						"estiBudget"          : 1,
						"address"             : 1,
						"status"              : 1,
						"amcId"               : 1,
						"createdAt"           : 1,
						"updatedAt"           : 1,
						"people.realm"        : "$people.realm",
						"people.fullName"     : "$people.fullName",
						"people.email"        : "$people.email",
						"people.mobile"       : "$people.mobile",
						"people.image"        : "$people.image",
						"category.id"         : "$rentDetail.categories._id",
          				"category.name"       : "$rentDetail.categories.name",
          				"category.image"      : "$rentDetail.categories.image",
          				"category.noOfUnits"  : "$rentDetail.noOfUnits",
          				"category.timePeriod" : "$rentDetail.noOfUnits",
					}
				},
				{ 
					$group: { 
						_id: "$rentId", 
						"rentId"       : { $first : "$rentId" },  
						"typeOfAmc"    : { $first : "$typeOfAmc" },
						"description"  : { $first : "$description" },
						"estiBudget"   : { $first : "$estiBudget" },
						"address"      : { $first : "$address" },
						"status"       : { $first : "$status" },
						"amcId"        : { $first : "$amcId" },
						"people"       : { $first : "$people" },
						"createdAt"    : { $first : "$createdAt" },
						"updatedAt"    : { $first : "$updatedAt" },
						"rentDetail"   : { $push : "$category" }

					} 
				},
				{
					$sort : {createdAt :-1}
				}
				/*{
					$project:{
						"_id": 1,
						"typeOfAmc":1,
						"description":1,
						"estiBudget":1,
						"address":1,
						"status":1,
						"amcId":1,
						"createdAt":1,
						"updatedAt":1,
						"category.id": "$category._id",
          				"category.name": "$category.name"
					}
				}*/
		    ]
		};
        Requestrent.aggregate(aggregate,{},function(error,requests){
      		if(error) return cb(error,null);

      		let arr  = [];
		    skip = skip || 0;
	        arr = requests.slice(skip,skip+limit);  
	        cb(null, { data: arr,count:requests.length, msg: msg.getCategories});
    	});
	 
    };
	

	Requestrent.remoteMethod('getAllRentReq', {
    accepts: [
	    {arg :"skip",type :"number"},
	    {arg :"limit",type :"number"}
    ],
    returns: {arg: 'success',type: 'object'},
    http: { verb: 'get' },
  });


};
