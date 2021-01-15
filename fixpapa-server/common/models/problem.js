'use strict';

var disableAllMethods = require('../../server/disableMethods.js').disableAllMethods;
var msg = require("../messages/problem-msg.json");


module.exports = function(Problem) {

	    disableAllMethods(Problem, ['find']);


	Problem.addProblem =function(probContent,price,categoryId,cb){

		let data ={
					probContent   :    probContent,
					price		  :    price,
					categoryId	  :    categoryId
					
					
				}
				data.createdAt = new Date();
				data.updatedAt = new Date();

				

		Problem.create(data, function(err,success){
			if(err)
				return cb(err,null)
			else
				cb(null,{data:success,msg:msg.addProb});

		})
	}

	Problem.remoteMethod('addProblem', {
    description: 'adding problems',
    accepts: [
      { arg: 'probContent', type: 'string', http: { source: 'form' } },
     // { arg: 'probDes', type: 'string', http: { source: 'form' } },
	  { arg: 'price', type: 'number', http: { source: 'form' } },
      { arg: 'categoryId', type: 'string', http: { source: 'form' } }
      
    ],
    returns: {
      arg: 'success',type: 'object'},
      http: { verb: 'post' },
  });


	Problem.getProb =function(problemId,cb){

		Problem.find({where: problemId},function(err,success){
			if(err)
				return cb(err,null)
			else
			{
				cb(null,{data:success,msg:msg.getProb});

			}
		})
	} 

	Problem.remoteMethod('getProb',{
		accepts:[
		{arg :"problemId",type :"string",required:true}
		],
		returns :{arg:"success",type :"object"},
		http :{verb:'get'}

	})





	Problem.getAllProb =function(cb){


		Problem.find(function(err,success){
			if(err)
				return cb(err,null)
			else
			{
				cb(null,{data:success,msg:msg.getProb});

			}
		})

	}

	

	Problem.remoteMethod('getAllProb',{
		accepts:[
		//{arg :"categoryId",type :"string",http:{source:'form'}}
		],
		returns :{arg:"success",type :"object"},
		http :{verb:'get'}

	})


	Problem.edit =function(probContent,price,problemId,cb){

    let data ={

          probContent 	: 	probContent,
          price			:   price
         // categoryId	:   categoryId
            }
            data.updatedAt = new Date();

        Problem.findById(problemId, function(err, problemInst) {
        if (err) return cb(err, null);

        problemInst.updateAttributes(data,function(err,success){
        if(err)
          return cb(err,null)
        else
          cb(null,{data: success, msg: msg.editProblem});
      })
    })
  }


  Problem.remoteMethod("edit", {
  accepts: [
    { arg: "probContent", type: "string", http: { source: "form" } },
    { arg: "price", type: "number", http: { source: "form" } },
	//{ arg: "name", type: "string", http: { source: "form" } },
	{ arg: "problemId", type: "string", required: true}
  
  ],
  returns: { arg: "success", type: "object" }
})













};
