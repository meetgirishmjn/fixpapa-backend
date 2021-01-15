'use strict';

var disableAllMethods = require('../../server/disableMethods.js').disableAllMethods;


module.exports = function(Hsncode) {

		disableAllMethods(Hsncode, ['find','deleteById']);

		Hsncode.addCode =function(productName,code,taxRate,servicesOffered,cb){
		
		let data={

			productName     :      productName,
			code            :      code,
			taxRate         :      taxRate,
			servicesOffered :      servicesOffered,
			createdAt       :      new Date()
		}

		  Hsncode.create(data,function(err,success){
		  	if(err)
		  		return cb(err,null)
		  	else
		  		return cb(null,{data:success,msg:"Hsn code added!!"})
		  })



    	}

	Hsncode.remoteMethod('addCode',{
		accepts:[
	   { arg: 'productName', type: 'string', http: { source: 'form' } },
	   { arg: 'code', type: 'string', http: { source: 'form' } },
	   { arg: 'taxRate', type: 'number', http: { source: 'form' } },
	   { arg: 'servicesOffered', type: 'boolean', http: { source: 'form' } }

		],
		returns :{arg:"success",type :"object"},
		http :{verb:'post'}

	})


	Hsncode.getCode =function(cb){

		Hsncode.find(function(err,success){
			if(err)
				return cb(err,null)
			else
				return cb(null,{data:success,msg:"successfully done!!"})
		})
	}

	Hsncode.remoteMethod('getCode',{
		accepts:[
	 	],
		returns :{arg:"success",type :"object"},
		http :{verb:'get'}

	})







};