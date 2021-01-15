'use strict';

var disableAllMethods = require('../../server/disableMethods.js').disableAllMethods;
var msg = require("../messages/category-msg.json");
var async = require("async");


module.exports = function(Category) {

	disableAllMethods(Category, ['find']);

  Category.allData =function(cb){
    let tasks = [];
    tasks.push(function(cbLocal){
      Category.getAllCategories({},cbLocal);
    });
     tasks.push(function(cbLocal){
      Category.app.models.Newpurchase.getAllPurchases({},cbLocal);
    });
     tasks.push(function(cbLocal){
      Category.app.models.AMC.getAllAmc({},cbLocal);
    });
    tasks.push(function(cbLocal){
      Category.app.models.Bid.getAllBid({},cbLocal);
    });
    tasks.push(function(cbLocal){
      Category.rentData(cbLocal);
    });
     /*tasks.push(function(cbLocal){
      Category.app.models.Rent.getAllPurchases(cbLocal);
    });*/

    async.parallel(tasks,function(error,result){
      if(error) return cb(error,null);

      let data = {
        categories : result[0].data,
        newpurchases : result[1].data,
        amc:result[2].data,
        bid:result[3].data,
        rent:result[4].data


      }

      //return cb(null,result);
        return cb(null,{data:data,msg:msg.AllData});


    }) 
  }

  Category.remoteMethod("allData",{
    accepts : [],
    returns : {arg:"success",type:"object"},
    http:{verb:"get"}
  })


	Category.addCategory =function(req,res,cb){

	  function uploadFile() {
      Category.app.models.Container.imageUpload(req, res, { container: 'images' }, function(err, success) {
        if (err)
          cb(err, null);
        else
          if (success.data) {
          success.data = JSON.parse(success.data);
          createCategory(success);
        } else {
          cb(new Error("data not found"), null);
        }
          
      })
    }

    function createCategory(obj) {
      let categoryId = req.query.categoryId;
      var data = {
        name: obj.data.name,
        isAvailableForRent : false,
        deleted            : false
        }

      
      data.createdAt = new Date();
      data.updatedAt = new Date();
     
      
      if (obj.files) {
        if (obj.files.image)
          data.image = obj.files.image[0].url;
        }

    if(!categoryId)
      {
       Category.create(data, function(err, success) {
        if (err)
          cb(err, null);
        else
           cb(null,{data:success,msg:msg.addCategory});
     
      })
     }
     else{
      Category.findById(categoryId, function(err, categoryInst) {
        
        if (err) return cb(err, null);

        data.updatedAt = new Date();
      categoryInst.updateAttributes(data, function(err, success) {
        if (err)
          cb(err, null);
        else
           cb(null,{data:success,msg:msg.editCategory});
        
           })
      })
    }
  }
  uploadFile();
  }

	Category.remoteMethod('addCategory', {
    description: 'adding categories',
    accepts: [
     { arg: 'req', type: 'object', http: { source: 'req' } },
     { arg: 'res', type: 'object', http: { source: 'res' } }
     
    ],
    returns: {
      arg: 'success',type: 'object'},
    http: { verb: 'post' },
  });

    
    Category.getAllCategories =function(filter,cb){
        
      if (!filter)
          filter = {};
      if (!filter.where)
          filter.where = {};
      
      filter.where.deleted = {neq:true};
      filter.order = "name ASC";
      filter.include = [{
        relation: 'problems', 
        scope: { 
           //fields: {"id":true ,"probContent":true,"price":true,"categoryId":true}, 
          }
        },{ 
          relation: 'products', 
          
          scope: {
            
            //fields: {"id":true ,"name":true,"values":true,"brandIds":true},
            include: { 
              relation: 'brand', 
              scope: {
               // fields:{"id":true ,"name":true} 
              }
            }
          }
      }]

      Category.find(filter, function(error, success) {
        if (error)
           return  cb(error, null);

        let arr = [];

        success.forEach(function(value){
          let data = value.toJSON();
          if(data.products.length && data.problems.length){
            let idx = -1;
            data.products.forEach(function(element,i){
              if((element.name.toLowerCase()).trim() == "other"){
                idx = i;
              }
            })
            if(idx>-1){
              let obj = data.products[idx];
              data.products.splice(idx,1);
              data.products.push(obj);  
            }
            

            arr.push(data);
          }
        }) 

        cb(null, { data: arr, msg: msg.getCategories });

      })
    }

    Category.remoteMethod("getAllCategories", {
      accepts: [
          { "arg": "filter", "type": "object" }
      ],
      returns: { "arg": "success", "type": "object" },
      http: { "verb": "get" }
    })


    Category.getAllCategoriesByAdmin =function(filter,cb){
        
      if (!filter)
          filter = {};
      if (!filter.where)
          filter.where = {};
      
      filter.where.deleted = {neq:true};
      
      filter.include = [{
        relation: 'problems', 
        scope: { 
           //fields: {"id":true ,"probContent":true,"price":true,"categoryId":true}, 
          }
        },{ 
          relation: 'products', 
          scope: {
            //fields: {"id":true ,"name":true,"values":true,"brandIds":true},
            include: { 
              relation: 'brand', 
              scope: {
               // fields:{"id":true ,"name":true} 
              }
            }
          }
      }]

      Category.find(filter, function(error, success) {
        if (error)
           return  cb(error, null);

        /*let arr = [];

        success.forEach(function(value){
          let data = value.toJSON();
          if(data.products.length && data.problems.length){
            arr.push(data);
          }
        })*/ 

        cb(null, { data: success, msg: msg.getCategories });

      })
    }

    Category.remoteMethod("getAllCategoriesByAdmin", {
      accepts: [
          { "arg": "filter", "type": "object" }
      ],
      returns: { "arg": "success", "type": "object" },
      http: { "verb": "get" }
    })






  Category.addProducts = function(categoryId,productsIds,cb){

    let data = {
            productsIds  :   productsIds
            }

      Category.findById(categoryId, function(err, categoryInst) {
        if (err) return cb(err, null);

        categoryInst.updateAttributes(data,function(err,success){
        if(err)
          return cb(err,null)
        else
          cb(null,{data: success, msg: msg.addProducts});
      })
    })
  }

  Category.remoteMethod('addProducts',{
    accepts:[
    {arg :"categoryId",type :"string",http:{source:'form'}},
    {arg :"productsIds",type :"array",http:{source:'form'}}

    ],
    returns :{arg:"success",type :"object"},
    http :{verb:'post'}

  })


  Category.edit =function(req,res,cb){

    console.log(req.query);
        //cb(null,req.query);
        if(!req.query.categoryId)
          return cb(new Error("Category is not defined"),null);
        else
        {
          Category.addCategory(req,res,cb);
        }
  }


  Category.remoteMethod("edit", {
  accepts: [
    { arg: "res",type: "object", http: { source: "req" } },
    { arg: "req", type: "object", http: { source: "res" } }
  
  ],
  returns: { arg: "success", type: "object" }
})


/*
  Category.updateImage = function(req, res, cb){
  
  function uploadFile() {
    Category.app.models.Container.imageUpload(req, res, { container: 'images' }, function(err, success) {
      if (err)
        cb(err, null);
      else {
        editImage(success);
      }
    })
  }

  function editImage(passObj) {
    var data = {};
    if (passObj.files) {
      if (passObj.files.categoryImage)
        data.categoryImage = passObj.files.categoryImage[0].url;
    }

    if(!data.categoryImage)
      return cb(new Error("No image found"),null);

    Category.findById(categoryId,function(error, categoryInst){
      if(error) return cb(error,null);

      categoryInst.updateAttributes(data, function(err, success) {
        if (err) return cb(err, null);
        cb(null, { data: success, msg: msg.uploadProfilePic });
      })
    })
  }  

  uploadFile();

}

Category.remoteMethod("editImage",{
  accepts : [
    { arg:"req", type:"object", http:{source:"req"}},
    { arg:"res", type:"object", http:{source:"res"}},
    { arg:"categoryId", type:"string", http:{source:"form"}},

  ],
  returns : {arg:"success", type:"object"}
})*/


  Category.getCategory =function(categoryId,cb){

    Category.findById(categoryId,
      {
      include: [{
        relation: 'problems', 
        scope: { 
          //fields: {"id":true ,"probContent":true,"price":true,"categoryId":true}, 
        
        }
      }, { 
          relation: 'products', 
          scope: {
        // fields: {"id":true ,"name":true,"values":true,"brandIds":true},
           include: { 
        relation: 'brand', 
        scope: {
          //fields:{"id":true ,"name":true} 
        }
      }
    }
  }
    ]
    },function(err,success){
          if(err)
            return cb(err,null)
          else
          {
            cb(null,{data:success,msg:msg.getCategory});

          }
        })

      }

    Category.remoteMethod('getCategory',{

    accepts: [
      { arg: "categoryId", type: "string",required: true }
      
    ],
    returns: { arg: "success", type: "object" },
    http :{verb:'get'}

  })

    Category.updateForRent =function(categoryId,isAvailableForRent,cb){

      Category.findById(categoryId,function(err,categoryInst){
        if(err)
          return cb(err,null);
       if(!categoryInst) return cb(new Error("No category found"),null);
          
           categoryInst.isAvailableForRent = isAvailableForRent;

            categoryInst.save(function(err, success) {
            if (err) 
              return cb(error, null);
                
              cb(null, {data:success, msg: msg.updateRentStatus });

           })

      })
    }

    Category.remoteMethod("updateForRent",{
    accepts : [
      {arg:"categoryId",type:"string",http:{source:"form"}},
      {arg: "isAvailableForRent", type: "Boolean", required:true, http: { source: "form" } },
      ], 
      returns : {arg:"success",type:"object"}
    })


    Category.rentData =function(cb){
      Category.find({where: {isAvailableForRent:true,deleted :{neq:true}}},function(err,success){
          if(err)
            return cb(err,null)
          else
          {
            cb(null,{data:success,msg:msg.getCategories});

          }
        })

      }

  Category.remoteMethod("rentData", {
    returns: { arg: "success", type: "object" },
    http: { verb: "get" }
  })


  Category.delete = function(categoryId, req, cb) {
        Category.findById(categoryId, function(error, categoryInst) {
            if (error)
                cb(error, null);
            else {
                if (categoryInst) {
                    if (!categoryInst.deleted) {
                        categoryInst.deleted = true;
                        categoryInst.deletedDate = new Date();
                        categoryInst.save(function(error, inst) {
                            if (error)
                                cb(error, null);
                            else
                                cb(null, {data: inst, msg: msg.categoryDelete });
                        })
                    } else {
                        cb(new Error("Aready deleted"), null);
                    }
                } else {
                    cb(new Error("No instance found"), null);
                }
            }
        })
    }

    Category.remoteMethod("delete", {
        accepts: [
            { arg: "categoryId", type: "string", require: true },
            { arg: "req", type: "object", http: { source: "req" } }
        ],
        returns: { arg: "success", type: "object" }
    })


    







    







};
