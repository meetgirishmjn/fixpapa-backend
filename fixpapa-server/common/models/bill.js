'use strict';
var disableAllMethods = require('../../server/disableMethods.js').disableAllMethods;
var dateFormat = require('dateformat');
let date = require('date-and-time');
var pdf = require('html-pdf');
var fs = require('fs');
var path = require("path");
var loopback = require('loopback');
var config = require("../../server/config.json");

module.exports = function(Bill) {

	disableAllMethods(Bill, ['find','deleteById']);
  Bill.createBill =function(obj,cb){
          
          let data = {};
          data = obj;
          let pdfName;
         // console.log("job data :-",data);
         // data.generateAt = new Date().toISOString();
         data.generateAt =new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
          if(data.generatedBy =="vendor"){
             pdfName = data.vendorInvoiceNo+"-Invoice";
          }
          else{
            pdfName = data.customerInvoiceNo+"-Invoice";
          }

          
          Bill.app.models.Requestjob.findById(data.requestjobId,function(err,jobInst){
            if(err) return cb(err,null)
            if(!jobInst)
              return cb(new Error("job not found,can't create bill!!"),null)
            else{
              //console.log("job :",jobInst.venToAdmin);
              jobInst.venToAdmin=true;

              jobInst.save(function(err,updated){
                if(err) return cb(err,null)
                console.log("job :",updated.vendorToadmin);
              });
              let optionBody = {
                template : path.resolve(__dirname,'../../server/views/vendorToadmin.ejs'),
                bill :  data 
              }
              createVerificationEmailBody(optionBody, undefined, function(err, html) {
                if(err) return cb(err,null);
                var options = { 
                 format: "Tabloid" ,
                 height: "20in",        // allowed units: mm, cm, in, px
                 width: "15in",            // allowed units: mm, cm, in, px
                 orientation: "portrait", // portrait or landscape
                 border: {
                      "top": "1in",            // default is 0, units: mm, cm, in, px
                      "right": "1in",
                      "bottom": "1in",
                      "left": "1in"
                    }
                };
                
                pdf.create(html, options).toFile(path.resolve(__dirname,'../../server/storage/pdf/'+pdfName+'.pdf'), function(err, res) {
                    if (err) return cb(err,null);
                    Bill.create(data,function(err,bill){
                      if(err)
                        return cb(err,null)

                      cb(null, {data:bill,msg: "Invoice generated"});
                      Bill.sendReceipt(bill,function(){});
                      Bill.app.models.Requestjob.findById(data.requestjobId,function(err,jobInst){
                        if(err) return cb(err,null)
                        if(!jobInst)
                          return cb(new Error("job not found"),null)
                        else{
                           let url = "/api/Containers/container/download/";
                          jobInst.vendorToadminInvoice = url+pdfName+".pdf";
                          jobInst.save(function(){})
                        }

                      }) 
                      console.log("result pdf :--",res); // { filename: '/app/businesscard.pdf' }
                    });
               

                })
              // var html = fs.readFileSync(path.resolve(__dirname,'../../server/views/vendorToadmin.ejs'), 'utf8');
             
              
              })
            }  
            
            })
         
        }

          Bill.remoteMethod("createBill",{
      accepts : [
        { arg: 'obj', type: 'object',required:true,http: { source: 'form' }},
        
        ], 
        returns : {arg:"success",type:"object"}
        
      })


     
    Bill.sendReceipt = function(bill,cb) {

       let pdfName;
        
        if(bill.generatedBy =="vendor"){
             pdfName = bill.vendorInvoiceNo+"-Invoice";
          }
          else{
            pdfName = bill.vendorInvoiceNo+"-Invoice";
          }


        let verifyOptions = {
            to: 'fixpapa.jp@gmail.com',
            from: 'info@fixpapa.com',
            subject: 'Invoice',
            // bill   : bill,
            //template: path.resolve(__dirname, '../../server/'+pdfName+'.pdf/'),
            attachments: [
            {
              // utf-8 string as an attachment
              path: path.resolve(__dirname, '../../server/storage/pdf/'+pdfName+'.pdf'),
              filename: "Invoice.pdf",
              content: 'Invoice'
            }
          ]
           
        }


         
        // createVerificationEmailBody(verifyOptions, undefined, function(err, html) {
        //   if (err) return cb(err);
          
        //   verifyOptions.html = html;


          Bill.app.models.Email.send(verifyOptions, function(err, mail) {
            // console.log('email sent!',mail);

            if(err)
              {console.log(err);
            cb(err);
          }else
          
            console.log("email sent");
          });

        // });


    //})
  }
  


   Bill.remoteMethod('sendReceipt',{
    accepts:[
     { arg: 'bill', type: 'object'}
     ],
    returns :{arg:"success",type :"object"},
    http :{verb:'post'}

  })




  function createVerificationEmailBody(verifyOptions, options, cb) {
    var template = loopback.template(verifyOptions.template);
    var body = template(verifyOptions);
    cb(null, body);
  }



  Bill.getBill =function(generatedBy,cb){
    
    Bill.find({where:{generatedBy:generatedBy}},function(err,success){
      if(err)
        return cb(err,null)
      cb(null,{data:success,msg:"all bills"});
    })
  }


  Bill.remoteMethod('getBill',{
    accepts:[
    { arg: 'generatedBy', type: 'string',http:{source:'query'}}
     ],
    returns :{arg:"success",type :"object"},
    http :{verb:'get'}

  })



   Bill.getBillById =function(billId,cb){
    
    Bill.findById(billId,function(err,success){
      if(err)
        return cb(err,null)
      cb(null,{data:success,msg:"bill"});
    })
  }


  Bill.remoteMethod('getBillById',{
    accepts:[
     { arg: 'billId', type: 'string',required:true,http:{source:'query'}}
     ],
    returns :{arg:"success",type :"object"},
    http :{verb:'get'}

  })




  /////////////////////////////////admin bil////////////////////////////////////////////////////////


  Bill.createBillAdmin =function(obj,cb){
          
          let data = {};
          data = obj;
         // data.generateAt= new Date().toDateString();
          data.generateAt =new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
          //generateAt = dateFormat(generateAt,"dddd, mmmm dS, yyyy, h:MM:ss TT");

          let pdfName = data.customerInvoiceNo+"-Invoice";
        
          Bill.app.models.Requestjob.findById(data.requestjobId,function(err,jobInst){
            if(err) return cb(err,null)
            if(!jobInst)
              return cb(new Error("job not found,cant create bill!!"),null)
            else{
              //console.log("job :",jobInst.adminToCust);
              jobInst.adminToCust=true;
              jobInst.save(function(err,updated){
                if(err) return cb(err,null)
                console.log("job :",updated.adminToCust);
              });
              let optionBody = {
                template : path.resolve(__dirname,'../../server/views/adminToCust.ejs'),
                bill :  data 
              }
              createVerificationEmailBody(optionBody, undefined, function(err, html) {
                if(err) return cb(err,null);
                var options = { format: "Tabloid" ,
                 height: "20in",        // allowed units: mm, cm, in, px
                 width: "15in",            // allowed units: mm, cm, in, px
                 orientation: "portrait", // portrait or landscape
                 border: {
                      "top": "1in",            // default is 0, units: mm, cm, in, px
                      "right": "1in",
                      "bottom": "1in",
                      "left": "1in"
                    }
                };
                
                pdf.create(html, options).toFile(path.resolve(__dirname,'../../server/storage/pdf/'+pdfName+'.pdf'), function(err, res) {
                  if (err) return cb(err,null);
                  Bill.create(data,function(err,bill){
                    if(err)
                      return cb(err,null)

                    cb(null, {data:bill,msg: "Invoice generated"});
                    Bill.sendReceiptReturns(bill,function(){});
                      Bill.app.models.Requestjob.findById(data.requestjobId,function(err,jobInst){
                        if(err) return cb(err,null)
                        if(!jobInst)
                          return cb(new Error("job not found"),null)
                        else{
                           let url = "/api/Containers/pdf/download/";
                          jobInst.adminToCustInvoice = url+pdfName+".pdf";
                          jobInst.save(function(){})
                        }

                      }) 

                  }) 
                  console.log("result pdf :--",res); // { filename: '/app/businesscard.pdf' }
                });
                

                

              })
              // var html = fs.readFileSync(path.resolve(__dirname,'../../server/views/vendorToadmin.ejs'), 'utf8');
             
              
            }
            
          })
         
        }

          Bill.remoteMethod("createBillAdmin",{
      accepts : [
        { arg: 'obj', type: 'object',required:true,http: { source: 'form' }},
        
        ], 
        returns : {arg:"success",type:"object"}
        
      })




    Bill.sendReceiptReturns = function(bill,cb) {

       let pdfName = bill.customerInvoiceNo+"-Invoice";
       console.log("bill custumer email::",bill.custEmail)
        


        let verifyOptions = {
            to: [bill.custEmail,"chetan@fixpapa.com"],
            from: 'info@fixpapa.com',
            subject: 'Invoice',
            // bill   : bill,
            //template: path.resolve(__dirname, '../../server/'+pdfName+'.pdf/'),
            attachments: [
            {
              // utf-8 string as an attachment
              path: path.resolve(__dirname, '../../server/storage/pdf/'+pdfName+'.pdf'),
              filename: "Invoice.pdf",
              content: 'Invoice'
            }
          ]
           
        }


         
          Bill.app.models.Email.send(verifyOptions, function(err, mail) {
            // console.log('email sent!',mail);

            console.log(err);
            cb(err);

          });

        // });


    //})
  }
  


   Bill.remoteMethod('sendReceiptReturns',{
    accepts:[
     { arg: 'bill', type: 'object'}
     ],
    returns :{arg:"success",type :"object"},
    http :{verb:'post'}

  })























};
