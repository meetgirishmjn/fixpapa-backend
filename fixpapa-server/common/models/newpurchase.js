'use strict';
var disableAllMethods = require('../../server/disableMethods.js').disableAllMethods;
var msg = require("../messages/newpurchase-msg.json");


module.exports = function(Newpurchase) {
	disableAllMethods(Newpurchase, ['find']);

	Newpurchase.addItem =function(req,res,cb){
     function uploadFile() {
      Newpurchase.app.models.Container.imageUpload(req, res, { container: 'images' }, function(err, success) {
        if (err)
          cb(err, null);
        else
          if (success.data) {
          success.data = JSON.parse(success.data);
          createItem(success);
        } else {
          cb(new Error("data not found"), null);
        }
          
      })
    }

    function createItem(obj) {
      let newpurchaseId = req.query.newpurchaseId;
      var data = {
        name: obj.data.name,
        productsIds: obj.data.productsIds,
        configuration: obj.data.configuration,
        deleted       : false

        }

      
      data.createdAt = new Date();
      data.updatedAt = new Date();
     
      
      if (obj.files) {
        if (obj.files.image)
          data.image = obj.files.image[0].url;
        }

    if(!newpurchaseId)
      {
       Newpurchase.create(data, function(err, success) {
        if (err)
          cb(err, null);
        else
           cb(null,{data:success,msg:msg.addItem});
          
          //cb(null,success)
      })
     }
     else{
      Newpurchase.findById(newpurchaseId, function(err, newpurchaseInst) {
        
        if (err) return cb(err, null);
        data.updatedAt =new Date();
      newpurchaseInst.updateAttributes(data, function(err, success) {
        if (err)
          cb(err, null);
        else
           cb(null,{data:success,msg:msg.editPurchase});
          })
      })
    }
  }
  uploadFile();
  }


  Newpurchase.remoteMethod('addItem', {
    description: 'adding items',
    accepts: [
     { arg: 'req', type: 'object', http: { source: 'req' } },
      { arg: 'res', type: 'object', http: { source: 'res' } }
     
    ],
    returns: {
      arg: 'success',type: 'object'},
    http: { verb: 'post' },
  });



  

  /*Newpurchase.getAllPurchases = function(cb) {
    Newpurchase.find({
        include:{
          relation:"products",
          scope:{
            include:"brand"
          }
        }
    },function(err, success) {

      if (err) {
        cb(err, null)
      } else {
         
        cb(null, { data: success, msg: msg.getCategories});
      }
    })
  }

  Newpurchase.remoteMethod("getAllPurchases", {
    returns: { arg: "success", type: "object" },
    http: { verb: "get" }
  })*/


    Newpurchase.getAllPurchases = function(filter,cb) {        
        if (!filter)
            filter = {};
        if (!filter.where)
            filter.where = {};
        
        filter.where.deleted = {neq:true};
        filter.order = "name ASC";
        filter.include = {
        
          relation:"products",
          scope:{
            include:"brand"
            }
          }
        

        Newpurchase.find(filter, function(error, success) {
            if (error)
               return  cb(error, null);
            cb(null, { data: success, msg: msg.getpurchases });

        })
    }

        Newpurchase.remoteMethod("getAllPurchases", {
        accepts: [
            { "arg": "filter", "type": "object" }
        ],
        returns: { "arg": "success", "type": "object" },
        http: { "verb": "get" }
    })


   Newpurchase.getPurchase =function(newpurchaseId,cb){

    Newpurchase.findById(newpurchaseId,{
        include:{
          relation:"products",
          scope:{
            include:"brand"
          }
        }
    },function(err,success){
      if(err)
         return cb(err,null)
       else
          cb(null,{data: success, msg: msg.getpurchase});

    })
  }

    Newpurchase.remoteMethod('getPurchase',{

    accepts: [
      { arg: "newpurchaseId", type: "string" }
      
    ],
    returns: { arg: "success", type: "object" },
    http :{verb:'get'}
 })


    Newpurchase.edit =function(req,res,cb){

     console.log(req.query);
        //cb(null,req.query);
        if(!req.query.newpurchaseId)
          return cb(new Error("Newpurchase is not defined"),null);
        else
        {
          Newpurchase.addItem(req,res,cb);
        }
    }


  Newpurchase.remoteMethod("edit", {
  accepts: [
    { arg: "req", type: "object", http: { source: "req" } },
    { arg: "res",type:"object", http: { source: "res" } }
  ],
  returns: { arg: "success", type: "object" }
})


  Newpurchase.delete = function(newpurchaseId, req, cb) {
        Newpurchase.findById(newpurchaseId, function(error, newpurchaseInst) {
            if (error)
                cb(error, null);
            else {
                if (newpurchaseInst) {
                    if (!newpurchaseInst.deleted) {
                        newpurchaseInst.deleted = true;
                        newpurchaseInst.deletedDate = new Date();
                        newpurchaseInst.save(function(error, inst) {
                            if (error)
                                cb(error, null);
                            else
                                cb(null, {data: inst, msg: msg.deletePurchase });
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

    Newpurchase.remoteMethod("delete", {
        accepts: [
            { arg: "newpurchaseId", type: "string", require: true },
            { arg: "req", type: "object", http: { source: "req" } }
        ],
        returns: { arg: "success", type: "object" }
    })







	
	



};

