'use strict';
/* jshint node: true ,esversion:6*/

var disableAllMethods = require('../../server/disableMethods.js').disableAllMethods;
var loopback = require("loopback");
var path = require("path");
var gf = require("../services/global-function");
var msg = require("../messages/people-msg.json");
var config = require("../../server/config.json");
//const clientID = "340700811205-8i5rcn2d62beug1s4vbo2nv1jc07n6td.apps.googleusercontent.com";
const clientID  =  ["677218008910-31lbla4iqcnaap6fn8evg34qajnkt821.apps.googleusercontent.com",
                    "677218008910-io0qvhoshcl5dinsn8nj3so2vn5gjoli.apps.googleusercontent.com",
                    "677218008910-qhchgm46fa6u1jn9df9og6lb192qr6j8.apps.googleusercontent.com"];
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(clientID);
const axios = require("axios");
var MAX_PASSWORD_LENGTH = 72;
var bcrypt;
try {
  // Try the native module first
  bcrypt = require('bcrypt');
  // Browserify returns an empty object
  if (bcrypt && typeof bcrypt.compare !== 'function') {
    bcrypt = require('bcryptjs');
  }
} catch (err) {
  // Fall back to pure JS impl
  bcrypt = require('bcryptjs');
}




module.exports = function(People) {

    disableAllMethods(People, ["find","deleteById", "login", "logout", "confirm", "changePassword","resetPassword","setPassword"]);
    People.validatesInclusionOf('realm', { in: ['admin','superAdmin','customer','vendor','engineer','staff'] });
    People.validatesInclusionOf('adminVerifiedStatus', { in: ['pending', 'rejected', 'approved'] });
    People.validate('customerType', typePof, { message: 'invalid customer type' }); 

   // People.validatesLengthOf('password', { min: 8, message: { min: 'Password is too short' } });



People.prototype.addFirebaseToken = function(token, ln, cb) {
  let self = this;
  if (typeof ln == 'function') {
    cb = ln;
    ln == "en";
  }
  cb(null, self);

  
}

People.googleLogin =function(firebaseToken,realm,access_token,cb){

  async function verify() {
  const ticket = await client.verifyIdToken({
      idToken: access_token,
      audience: clientID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];
  var provider = "google";
  var authScheme = "oAuth 2.0";
  var profile = { "provider": provider,
    "id": userid,
    "displayName": payload["name"],
    "name": { "familyName": payload["family_name"], "givenName": payload["given_name"], "middleName": "" },
    "gender": "",
    "emails": [ { "value": payload["email"] } ],
    "photos":[ { value: payload["picture"] } ]
  }  

  var credentials = {
    "accessToken":access_token,
    "refreshToken":""
  }
  var options = { 
    "provider": provider,
    "module": "google-plus-token",
    "clientID": clientID,
    clientSecret: '48af48488158c8899d1ceb314b6bb9d6',
    callbackPath: '/auth/facebook/token',
    failureFlash: true,
    strategy: 'GooglePlusTokenStrategy',
    json: true,
    session: false 
  }

  People.app.models.UserIdentity.login(provider, authScheme, profile, credentials,
                                 options,function(error,success,identity,token){
                                  if(error)
                                    return cb(error,null)
                                  ////console.log(error)
                                  //console.log(token);
                                  if(token.__data){
                                    token.__data.user = success;
                                    token.__data.access_token = token.id
                                  }  
                                  else{
                                    token.user = success;
                                    token.access_token = token.id
                                  }

                                  cb(null, {data :token});
                                  //console.log(success);

                                 })
  //console.log("payload",payload);
  //console.log("userid",userid);
  // If request specified a G Suite domain:
  //const domain = payload['hd'];
}
verify().catch(console.error);
 

}

People.remoteMethod("googleLogin", {
    accepts: [
      { arg: "firebaseToken", type: "string"},
      { arg: "realm", type: "string",required:true},
      { arg: "access_token", type: "string",required:true}
    ],
    returns: { arg: "success", type: "object" },
    http: { verb: "get"}
})



People.updateToken = function(req, firebaseToken, cb) {
  let accessToken = req.accessToken;
  accessToken.firebaseToken = firebaseToken;
  accessToken.save(function(error, success) {
    if (error) return cb(error, null);
    //cb(null, { data: success, msg: msg.accessToken });
    cb(null,success);

  })
}

People.remoteMethod("updateToken", {
  accepts: [
    { arg: "req", type: "object", http: { source: "req" } },
    { arg: "firebaseToken", type: "string", required: true, http: { source: "form" } }
  ],
  returns: { arg: "success", type: "object" }
})


//************************************************otp login************************************************************


People.userLogin =function(realm, mobile,cb){
  console.log("mobile******bfgddhgbf*********** number::",mobile)
      let data = {
        realm             : realm,
        mobile            : mobile,
        mobileVerified    : false,
        adminVerifiedStatus :  "approved"
        
      };

      if(mobile == "9999999999"){
        data.mobOtp = {
          createdAt : new Date(),
          expireAt  : new Date(),
          otp       : 1234
        };
      }else{
        data.mobOtp = {
          createdAt : new Date(),
          expireAt  : new Date(),
          otp       : gf.getOTP()
        };
      }
     
        data.mobOtp.expireAt.setMinutes(data.mobOtp.expireAt.getMinutes()+5); 
        People.findOne({where:{mobile:data.mobile,realm:data.realm}},function(err,success){
            if(err) return cb(err,null);
            if(!success){ 
              data.createdAt = new Date();
              data.updatedAt = new Date();
              //console.log("new user:::>",data);
              data.isProfileComplete = false;
              data.emailVerified = false;
              data.fullName      = "",
              data.customerType  = "home";
              data.email         = "";
              data.customerRating =  {};
              //data.active         = true
              People.create(data, function(err, success) {
                if (err) return cb(err, null);
                console.log("new user:::>",success);
                cb(null, { data: success, msg: msg.userLogin });
                success.addRole(success.realm, function(){});
              });
            }else{ 

        //if(data.realm != "customer") return cb(new Error("Account does not exists!"),null);

        //if(success.isDeactivated) return cb(new CustomError(errMsg.accountDeactivcated,ln));  
              if(!success.fullName)
                data.fullName ="";
                data.updatedAt = new Date();
                data.mobileVerified = true;
                delete data.mobile;
              //delete data.countryCode;

              success.updateAttributes(data, function(err, success) {
              if (err) return cb(err, null);
              console.log("old user :::>",success);
              cb(null, { data: success, msg: msg.userLogin });
          });
            }
        }); 
    };

  // **************************Login Apis****************************************

    People.afterRemote('userLogin', function(context, instance, nextUser) {
      var success = instance.success.data;
   
    People.app.models.Otp.sendSMS({otp:success.mobOtp.otp,mobile:success.mobile},function(){});
    nextUser();
  });

    People.remoteMethod("userLogin",{
    accepts : [
      //{arg:"ln", type:"string",required:true, http: lnTranslate.getLnFromHeader},
      {arg:"realm", type:"string", http: {source: "form"}},
      {arg:"mobile", type:"string", required:true, http: {source: "form"}}
      //{arg:"countryCode", type:"string", required:true, http: {source: "form"}}
    ],
    returns : {arg:"success", type:"object"},
    http: {verb: 'post'}
  });


  People.userOtpVerify = function(peopleId,otp, firebaseToken, cb){
    People.app.models.Notification.loginNoty(peopleId,function(){});
    
    People.findById(peopleId, function(err,peopleInst) {
      if (err) return cb(err,null);
      
      if (!peopleInst) return cb(new Error("userNotFound"),null);
      console.log("**********peopleInst******:::",peopleInst);

      let currentDate = new Date();
      
            if(peopleInst.mobOtp.expireAt < currentDate) return cb(new Error("Otp has expired!"),null);
      if(peopleInst.mobOtp.otp!=otp) return cb(new Error("Otp does not match!"),null);
      
      /*if(req.accessToken){
        People.app.models.AccessToken.destroyAll({userId: req.accessToken.userId}, function(){});
      }*/

      peopleInst.mobOtp = {};
      peopleInst.mobileVerified = true;
        
        peopleInst.createAccessToken(1209600, {firebaseToken:firebaseToken,userId :peopleInst.id}, function(errToken,token){
          if(errToken) return cb(errToken,null);
          // peopleInst.firebaseToken = firebaseToken;
           console.log("token crreated>>",token);
          peopleInst.save(function(errUp,updatedInst){
            if(errUp) return cb(errUp,null);
            updatedInst.accessToken = token.id;
          
          People.app.models.AccessToken.destroyAll({id: {neq:token.id},userId:token.userId}, function(errToken,successToken){
            
            if(errToken) return cb(errToken,null);
            cb(null,{data:updatedInst,msg:msg.mobileVerify});
          })
          });
        });
    });
    };

    People.remoteMethod('userOtpVerify',{
        accepts: [
           // {arg: "req", type:"object", required:true, http: {source: "req"}},
            //{arg: "ln", type:"string", required:true, http: lnTranslate.getLnFromHeader},
            {arg: 'peopleId', type: 'string', required: true, http: {source: 'form'}},
            {arg: 'otp', type: 'number', required: true, http: {source: 'form'}},
            {arg: 'firebaseToken', type: 'string', required: true, http: {source: 'form'}}
            //{arg: 'chatPublicKey', type: 'string', required: false, http: {source: 'form'}}
        ],
        returns : {arg:"success",type:"object","root":false},
        http: {verb: 'post'}
    });


    People.resendUserOtp = function(peopleId, cb){
      People.findById(peopleId,function(err, peopleInstance){
        if(err)
            cb(err,null);
        else{
            if(!peopleInstance) return cb(new Error("User not found!"),null);
                peopleInstance.mobOtp = {
                  createdAt : new Date(),
                  expireAt  : new Date(),
                  otp       : gf.getOTP()
              };

              peopleInstance.mobOtp.expireAt.setMinutes(peopleInstance.mobOtp.expireAt.getMinutes()+5);
              peopleInstance.save(function(err, success){
                if(err)
                    cb(err,null);
                else{
                    cb(null,{data:success,msg:msg.resendOtp});
                    
                    People.app.models.Otp.sendSMS({otp:success.mobOtp.otp,mobile:success.mobile},function(){});
                }
              });
          }
      });  
    };

    People.remoteMethod("resendUserOtp",{
      accepts : [
        //{arg:"ln", type:"string",required:true, http: lnTranslate.getLnFromHeader}, 
        {arg:'peopleId', type:"string", required:true, http:{source:"form"}}
      ],
      returns : {arg:"success",type:"object"}
    });



    People.editProfile = function(req, res, cb){
      let peopleId = req.accessToken.userId;
      //console.log("peopleId>>>",req.AccessToken.userId);
      console.log("**************");
      function uploadFile() {
        People.app.models.Container.imageUpload(req, res, { container: 'profileimages' }, function(err, success) {
          if (err)
            cb(err, null);
          else if (success.data) {
             success.data = JSON.parse(success.data);
             updateUser(success);
          } else {
             cb(new Error("data not found"), null);
          }
        })
      }

      function updateUser(obj) {
       
        console.log("obj::",obj.data);
        //let fName = obj.data.fullName;

        var person = {

            
            fullName: obj.data.fullName,
            email   : obj.data.email,
            customerType : obj.data.customerType,
            gstNumber   :  obj.data.gstNumber,
            companyName : obj.data.companyName,
            isProfileComplete : true
        }
       
    
        /*data.addresses = [];
        obj.data.addresses=obj.data.addresses||[];
        obj.data.addresses.forEach(function(value){
        data.addresses.push(value);
        })
*/
      console.log(person);
      
      person.emailVerified = false;
      person.updatedAt = new Date();
      
     
      if (obj.files) {
        if (obj.files.image)
          person.image = obj.files.image[0].url;
      }
      

     /* if(!data.image)
      return cb(new Error("Image not found!"),null);*/

     People.findById(peopleId,function(error, peopleInst){
      if(error) return cb(error,null);
      if(!peopleInst)
        return cb(new Error("User not found!"),null)

     peopleInst.updateAttributes(person, function(err, success) {
        if (err) return cb(err, null);
        cb(null, {data:success, msg: msg.editProfile});
        
      })
      })
     } 
     uploadFile();
    }


    People.afterRemote('editProfile', function(context, instance, nextUser) {
     ////console.log(instance.data);

        var userInstance = instance.success.data;
             //console.log(userInstance);
        if(userInstance.email){
            var options = {
              type: 'email',
              to: userInstance.email,
              from: 'info@fixpapa.com',
              subject: 'Thanks for registering.',
              redirect: '/verified',
              user: People,
              template: path.resolve(__dirname, '../../server/views/verify.ejs'),
             
            };
            if (!userInstance.emailVerified) {
              userInstance.verify(options, function(err, response, next) {
                if (err) return nextUser(err);
                //console.log('> verification email sent:', response);
                nextUser();
              });
            } else {
              nextUser();
            }
        }else{
          nextUser();
        }
    });
    People.remoteMethod("editProfile",{
      accepts : [
        
        { arg:"req", type:"object", http:{source:"req"}},
        { arg:"res", type:"object", http:{source:"res"}}
        //{arg:"ln", type:"string",required:true, http: lnTranslate.getLnFromHeader}
      ],
      returns : {arg:"success", type:"object"}
    })



    People.getUserSession = function(token,cb){
        //console.log(realm)
        People.app.models.AccessToken.findOne({
          where:{
            id:token
          }
        },function(error,accessToken){
          if(error) return cb(error,null);
          if(!accessToken)  return cb(new Error("USER_NOT_FOUND"),null);
          else{
            People.findById(accessToken.userId,function(error,success){
              if (error) return cb(error,null)
              cb(null,{data:success,msg:msg.getPeoples});
            })
          }
        })
      }

      People.remoteMethod("getUserSession",{
        accepts : [
          {arg:"token",type:"string",required:true,http:{source:"form"}}
        ],
        returns : {arg:"success",type:"object"},
        http:{verb:"post"}
      })



//**********************************************************end here*********************************************************



//************************************************otp login************************************************************


/*People.userLogin =function(realm, mobile,cb){
  console.log("mobile***************** number::",mobile)
      let data = {
        realm             : "customer",
        mobile            : mobile,
        mobileVerified    : true,
        adminVerifiedStatus :  "approved",
        customerRating      :  {},
        isProfileComplete : false,
        active            : true
    

      };
        if(data.mobile == 9999999999){
          console.log("if part")
          data.mobOtp = {
            createdAt : new Date(),
            expireAt  : new Date(),
            otp       : 1234
          };
        }else{
          console.log("else part")
          data.mobOtp = {
            createdAt : new Date(),
            expireAt  : new Date(),
            otp       : gf.getOTP()
          };
        }
        data.mobOtp.expireAt.setMinutes(data.mobOtp.expireAt.getMinutes()+5); 
        People.findOne({where:{mobile:data.mobile}},function(err,success){
            if(err) return cb(err,null);
            if(!success){ 
              data.createdAt = new Date();
              data.updatedAt = new Date();
              console.log("new user:::>",data);
              People.create(data, function(err, success) {
              if (err) return cb(err, null);
          cb(null, { data: success, msg: msg.userLogin });
          success.addRole(success.realm, function(){});
          });
            }else{ 

        if(success.realm != "customer") return cb(new Error("Account does not exists!"),null);

        //if(success.isDeactivated) return cb(new CustomError(errMsg.accountDeactivcated,ln));  

              data.updatedAt = new Date();
              data.emailVerified = true;
              delete data.mobile;
              //delete data.countryCode;

                success.updateAttributes(data, function(err, success) {
              if (err) return cb(err, null);
              console.log("old user :::>",success);
              cb(null, { data: success, msg: msg.userLogin });
          });
            }
        }); 
    };

  // **************************Login Apis****************************************

    People.afterRemote('userLogin', function(context, instance, nextUser) {
      var success = instance.success.data;
    //People.app.models.Otp.sendSMS({mobile:success.mobile,otp:success.mobOtp.otp},function(){});
    People.app.models.Otp.sendSMS({otp:success.mobOtp.otp,mobile:success.mobile},function(){});
    nextUser();
  });

    People.remoteMethod("userLogin",{
    accepts : [
      //{arg:"ln", type:"string",required:true, http: lnTranslate.getLnFromHeader},
      {arg:"realm", type:"string", http: {source: "form"}},
      {arg:"mobile", type:"string", required:true, http: {source: "form"}}
      //{arg:"countryCode", type:"string", required:true, http: {source: "form"}}
    ],
    returns : {arg:"success", type:"object"},
    http: {verb: 'post'}
  });
*/

 /* People.userOtpVerify = function(req,peopleId,otp,firebaseToken,cb){
    People.findById(peopleId, function(err,peopleInst) {
      if (err) return cb(err,null);
      if (!peopleInst) return cb(new Error("userNotFound"),null);
      
      let currentDate = new Date();
      
            if(peopleInst.mobOtp.expireAt < currentDate) return cb(new Error("Otp has expired!"),null);
      if(peopleInst.mobOtp.otp!=otp) return cb(new Error("Otp does not match!"),null);
      
      if(req.accessToken){
        People.app.models.AccessToken.destroyAll({userId: req.accessToken.userId}, function(){});
      }

      peopleInst.mobOtp = {};
      
        peopleInst.createAccessToken(1209600, {firebaseToken:firebaseToken}, function(errToken,token){
          if(errToken) return cb(errToken,null);
          // peopleInst.firebaseToken = firebaseToken;
          console.log("token crreated>>",token);
          peopleInst.save(function(errUp,updatedInst){
            if(errUp) return cb(errUp,null);
            updatedInst.accessToken = token.id;
          
          People.app.models.AccessToken.destroyAll({id: {neq:token.id},userId:token.userId}, function(errToken,successToken){
            if(errToken) return cb(errToken,null);
           // console.log("successToken>>",successToken);
            cb(null,{data:updatedInst,msg:msg.mobileVerify});
          })
          });
        });
    });
    };

    People.remoteMethod('userOtpVerify',{
        accepts: [
            {arg: "req", type:"object", required:true, http: {source: "req"}},
            //{arg: "ln", type:"string", required:true, http: lnTranslate.getLnFromHeader},
            {arg: 'peopleId', type: 'string', required: true, http: {source: 'form'}},
            {arg: 'otp', type: 'number', required: true, http: {source: 'form'}},
            {arg: 'firebaseToken', type: 'string', required: true, http: {source: 'form'}}
            //{arg: 'chatPublicKey', type: 'string', required: false, http: {source: 'form'}}
        ],
        returns : {arg:"success",type:"object","root":false},
        http: {verb: 'post'}
    });*/



    /*People.editProfile = function(req, res, cb){
      let peopleId = req.accessToken.userId;
      //console.log("peopleId>>>",req.AccessToken.userId);
      console.log("**************");
      function uploadFile() {
        People.app.models.Container.imageUpload(req, res, { container: 'profileimages' }, function(err, success) {
          if (err)
            cb(err, null);
          else {
            
            updateUser(success);

          }
        })
      }

      function updateUser(obj) {
       
        var data = {
            
            fullName: obj.data.fullName,
            email: obj.data.email,
            customerType : obj.data.customerType,
            gstNumber   :  obj.data.gstNumber,
            companyName : obj.data.companyName,
            isProfileComplete : true
        }
    
        data.addresses = [];
        obj.data.addresses=obj.data.addresses||[];
        obj.data.addresses.forEach(function(value){
        data.addresses.push(value);
        })

      ////console.log(data);
      
      data.emailVerified = false;
      data.updatedAt = new Date();
      
     
      if (obj.files) {
        if (obj.files.image)
          data.image = obj.files.image[0].url;
      }

      if(!data.image)
      return cb(new Error("Image not found!"),null);

     People.findById(peopleId,function(error, peopleInst){
      if(error) return cb(error,null);
      if(!peopleInst)
        return cb(new Error("User not found!"),null)

     peopleInst.updateAttributes(data, function(err, success) {
      if (err) return cb(err, null);
        cb(null, {data:success, msg: msg.editProfile});
       })
      })
     } 
     uploadFile();
    }


    People.afterRemote('editProfile', function(context, instance, nextUser) {
     ////console.log(instance.data);

        var userInstance = instance.success.data;
       //console.log(userInstance);


        var options = {
          type: 'email',
          to: userInstance.email,
          from: 'info@fixpapa.com',
          subject: 'Thanks for registering.',
          redirect: '/verified',
          user: People,
          template: path.resolve(__dirname, '../../server/views/verify.ejs'),
         
        };
        if (!userInstance.emailVerified) {
          userInstance.verify(options, function(err, response, next) {
            if (err) return nextUser(err);
            //console.log('> verification email sent:', response);
            nextUser();
          });
        } else {
          nextUser();
        }
    });
    People.remoteMethod("editProfile",{
      accepts : [
        
        { arg:"req", type:"object", http:{source:"req"}},
        { arg:"res", type:"object", http:{source:"res"}}
        //{arg:"ln", type:"string",required:true, http: lnTranslate.getLnFromHeader}
      ],
      returns : {arg:"success", type:"object"}
    })
*/

//*********************************************************ends here***********************************************************
People.signup = function(req, res, cb) {

    function uploadFile() {
      People.app.models.Container.imageUpload(req, res, { container: 'profileimages' }, function(err, success) {
        if (err)
          cb(err, null);
        else
          if (success.data) {
          success.data = JSON.parse(success.data);
          createUser(success);
        } else {
          cb(new Error("data not found"), null);
        }
          //createUser(success);
      })
    }

    function createUser(obj) {

      var data = {
        realm: obj.data.realm,
        fullName: obj.data.fullName,
        email: obj.data.email,
        mobile: obj.data.mobile,
        password: obj.data.password,
        adminVerifiedStatus:"pending",
        active     :    true,
        isProfileComplete : true
        //jobRating  : ""

     }
    
     data.addresses = [];
     obj.data.addresses=obj.data.addresses||[];
     obj.data.addresses.forEach(function(value){
      data.addresses.push(value);
     })

      ////console.log(data);
      
      data.emailVerified = false;
      data.createdAt = new Date();
      data.updatedAt = new Date();
      data.mobileVerified = false;
     
      data.mobOtp = {
      createdAt : new Date(),
      expireAt  : new Date(),
      otp       : gf.getOTP()
    }
    data.mobOtp.expireAt.setMinutes(data.mobOtp.expireAt.getMinutes()+5); 
    
      
      // user.otp = globalFunction.getOTP();
      if (obj.files) {
        if (obj.files.image)
          data.image = obj.files.image[0].url;
      }


      if (obj.data.realm == 'customer') {
  
        //data.alternateAddress   =   obj.data.alternateAddress;
        data.customerType       =   obj.data.customerType;
        data.gstNumber          =   obj.data.gstNumber;
        data.companyName        =   obj.data.companyName;
        data.adminVerifiedStatus=   "approved";
        data.customerRating     =   {};
      
      } else  {
      if (obj.data.realm == 'vendor') {
        //data.address            =     obj.data.address;
        data.noOfEngineers      =     0;
        data.activeEngineers    =     0;
        data.servicesIds        =     obj.data.servicesIds;
        data.newpurchaseIds     =     obj.data.newpurchaseIds;
        data.yearOfExp          =     obj.data.yearOfExp;
        data.gstNumber          =     obj.data.gstNumber;
        data.bankName           =     obj.data.bankName;
        data.firmName           =     obj.data.firmName;
        data.ifscCode           =     obj.data.ifscCode;
        data.accountNumber      =     obj.data.accountNumber;
        data.startTime          =     {value: obj.data.startTime,
                                      valueInMinute : gf.timeCoversion(obj.data.startTime) };
        data.endTime            =     {value: obj.data.endTime,
                                      valueInMinute : gf.timeCoversion(obj.data.endTime) };
        data.supportDays        =     obj.data.supportDays;
        data.adminVerifiedStatus=     "pending";
        data.isAvailable        =     true;
        data.active             =     true;
        data.vendorRating       =     {};

        if (obj.files.aadharImg)
         data.aadharImg = obj.files.aadharImg[0].url;

       if (obj.files.panImg)
         data.panImg = obj.files.panImg[0].url;

       if (obj.files.chequeImg)
         data.chequeImg = obj.files.chequeImg[0].url;

       if (obj.files.gstImg)
         data.gstImg = obj.files.gstImg[0].url;

      }
    }
     if(obj.data.realm == 'engineer') {
      
        //data.realm                =     "engineer"
        data.vendorId             =     obj.data.vendorId;
        data.expertiseIds         =     obj.data.expertiseIds;
        data.exp                  =     obj.data.exp;
        data.address              =     obj.data.address;
        data.adminVerifiedStatus  =     "approved";
        data.isJobAssigned        =     false;
        data.emailVerified        =     true;
        data.mobileVerified       =     true;
        data.engineerRating       =     {};

      }

      
//////////////////////////////// latest modifications
      
      if (!obj.data.peopleId) {
      People.create(data, function(err, success) {
        if (err)
          cb(err, null);
        else
          //cb(null, { data: success, msg: msg.signupSuccess });
          cb(null, { data: success, msg: msg.userSignup });

      })
    } else {
     // if{}
      People.findById(obj.data.peopleId, function(error, peopleInst) {
        if (error) return cb(error, null);
        if (!peopleInst) return cb(new Error("No user found"), null);
        //data.emailVerified = true;
        data.emailVerified =data.email==peopleInst.email ? true : false;
        if(!data.mobileVerified){
          peopleInst.updateAttributes(data, function(err, success) {
          if (err) return cb(err, null);
          if(success.emailVerified)
          {
           cb(null, { data: success, msg: msg.signupSuccess });
 
         }else{
          cb(null, { data: success, msg: msg.userSignup });
         }
          
        })
        }
        else{
          cb(new Error("User already registered"),null);
        }
       
      })
    }
  }
  uploadFile();
}



  People.afterRemote('signup', function(context, instance, nextUser) {
     ////console.log(instance.data);

   var userInstance = instance.success.data;
   //console.log(userInstance);


    var options = {
      type: 'email',
      to: userInstance.email,
      from: 'info@fixpapa.com',
      subject: 'Thanks for registering.',
      redirect: '/verified',
      user: People,
      template: path.resolve(__dirname, '../../server/views/verify.ejs'),
     
    };
      userInstance.mobOtp = userInstance.mobOtp || {};

  
    userInstance.addRole(userInstance.realm, function(error, success) {

    if(!userInstance.mobileVerified)
    People.app.models.Otp.sendSMS({otp:userInstance.mobOtp.otp,mobile:userInstance.mobile},function(error,success){});

    if (!userInstance.emailVerified) {
      userInstance.verify(options, function(err, response, next) {
        if (err) return nextUser(err);
        //console.log('> verification email sent:', response);
        nextUser();
      });
    } else {
      nextUser();
    }
    }); 
  });


  People.remoteMethod(
  'signup', {
    description: 'Signup users',
    accepts: [
      { arg: 'req', type: 'object', http: { source: 'req' } },
      { arg: 'res', type: 'object', http: { source: 'res' } }
    ],
    returns: {
      arg: 'success',type: 'object'},
    http: { verb: 'post' },
  });


  People.prototype.addRole = function(role, cb) {
  let self = this;
  People.app.models.Role.findOne({ where: { name: role } }, function(error, roleInst) {
    if (error)
      cb(err, null);
    else {
      if (roleInst) {
        function createRole() {
          People.app.models.RoleMapping.destroyAll({ principalId: self.id }, function(err, success) {
            if (err)
              return cb(err, null);

            roleInst.principals.create({
              principalType: People.app.models.RoleMapping.USER,
              principalId: self.id
            }, function(err, principal) {
              if (err) return cb(err, null);
              cb(null, principal);
              //console.log("role created");
            });
          })
        }
        createRole();
      } else {
        cb(new Error("No role found"), null);
      }
    }
  })
}


/*People.on('resetPasswordRequest', function(info) {
    var url = config.redirectUrl+ '/reset-password';
    var html = 'Click <a href="' + url + '/access_token=' +
      info.accessToken.id + '">here</a> to reset your password';
      
      //console.log(info.mail)
      //console.log(info.accessToken.id);


    People.app.models.Email.send({
      to: info.email,
      from: "info@fixpapa.com",
      subject: 'Password reset',
      html: html
    }, function(err) {
      if (err) return //console.log('> error sending password reset email');
      //console.log('> sending password reset email to:', info.email);
    });
  });
*/
  /*People.adminApprovalRequest =function(req,cb){
    peopleId = req.accessToken.userId;
    People.findById(peopleId,function(err,peopleInst){
      if(err)
        return cb(err,null)
      else
      {
        if(peopleInst)
          if(peopleInst.email)
          {
              ////console.log(peopleInst.email);
               People.app.models.Email.send({
      
              to: 'advocosoft3@gmail.com',
              from: peopleInst.email,
              subject: ' Approval request from vendor ',
              text: 'login in your admin panel',
              //html: 'my <em>html</em>'
              template: path.resolve(__dirname, '../../server/views/verify.ejs'),

            }, function(err, mail) {
              //console.log('email sent!');
      
         });
             
            }
      }  
    })
  }

   People.remoteMethod("adminApprovalRequest",{
    accepts : [
      {arg:"req",type:"object",http:{source:"req"}}
      
     ], 
    returns : {arg:"success",type:"object"}
  })*/


  People.adminApprove =function(peopleId,adminVerifiedStatus,cb)
  {
    People.findById(peopleId,function(err,peopleInst){
      if(err)
        return cb(err,null);
      else
      {
        if(!peopleInst) return cb(new Error("No user found"),null);
          
           peopleInst.adminVerifiedStatus = adminVerifiedStatus;

            peopleInst.save(function(err, success) {
            if (err) 
              return cb(err, null);
                
              cb(null, {data:success, msg: msg.adminVerified });

           })
            /*peopleInst.updateAttributes({adminVerifiedStatus: "approved"},function(err,success){
                if(err) return cb(err,null);
                
                cb(null,success)
              })*/
          }
        })
      }
  

   People.remoteMethod("adminApprove",{
    accepts : [
      {arg:"peopleId",type:"string",http:{source:"form"}},
      {arg: "adminVerifiedStatus", type: "string", required:true, http: { source: "form" } },
      ], 
      returns : {arg:"success",type:"object"}
    })



 

   People.getMyInfo = function(req, cb) {
      let peopleId = req.accessToken.userId;
      console.log("hello::::",peopleId)
       let filter = {};

      if (!filter.where)
        filter.where = {};
      //filter.where.peopleId == req.accessToken.userId;
      
      filter.include = [{
          relation: "services"
        },
        {
          relation:"newpurchase"
        },
        {
          relation:"expertise"
        }]
      People.findById(peopleId,filter, function(err, success) {
        if (err)
      cb(err, null);
      else
     cb(null, { data: success, msg: msg.getMyInfo });
      //cb(null,success)
  })
}

  People.remoteMethod("getMyInfo", {
    accepts: [
      { arg: "req", type: "object", http: { source: "req" } }
    ],
    returns: { arg: "success", type: "object" },
    http: { verb: "get"}
})

    People.getvendor = function(req,cb) {
      let peopleId = req.accessToken.userId;
      let filter = {};

      if (!filter.where)
        filter.where = {};
      //filter.where.peopleId == req.accessToken.userId;
      
      filter.include = [{
          relation: "services"
        },
        {
          relation:"newpurchase"
        }]
   

      People.findById(peopleId,filter, function(err, success) {
        if (err)
      cb(err, null);
      else
     cb(null, { data: success, msg: msg.getMyInfo });
      
  })
}


  People.remoteMethod("getvendor", {
    accepts: [
      { arg: "req", type: "object", http: { source: "req" } }
    ],
    returns: { arg: "success", type: "object" },
    http: { verb: "get" }
})


  
  /*People.findVendor = function(req,position,limit,cb) {
  // //console.log(position)
  let ownerId = req.accessToken.userId;
  skip = skip || 0;
  limit = limit || 1;
  People.findOne({
    fields: {
      id: true,
      realm: true,
      email: true,
      name: true,
      mobile: true,
      address: true,
      
    },
    where: {
      address: { near: position },
      realm: "vendor",
      adminVerifiedStatus:"approved"
    },
    include:{
      relation:"requestfordrivers",
      scope:{
        where:{
          ownerId:ownerId,
          vehicleId:vehicleId,
          status:"requested"
        }
      }
    },
    limit: limit,
    skip: skip
  }, function(err, nearbydrivers) {
    if (err) {
      cb(err, null);
    } else {
      let driverArr = [];
      nearbydrivers.forEach(function(driver){
        let d = driver;
        if(d.requestfordrivers.length){
          d.requestStatus = true;
        }else{
          d.requestStatus = false;
        }
        delete d.requestfordrivers;
        driverArr.push(d);
      })

      cb(null, { data: driverArr, msg: msg.findingDrivers });
    }
  })
}

People.remoteMethod("findNearDriver", {
  description: 'route details',
  accepts: [
    { arg: 'req', type: 'object', http: {source:"req"} },
    { arg: 'position', type: 'GeoPoint', required: true },
    { arg: 'skip', type: 'number' },
    { arg: 'limit', type: 'number' }
  ],
  returns: { arg: 'success', type: 'object' },
  http: { verb: 'get' },
});*/


   People.editCustomer = function(fullName, gstNumber, req, cb) {

  let data = {
          
          fullName     :           fullName,
          gstNumber    :           gstNumber
         
  }
          data.updatedAt = new Date();

  let peopleId = req.accessToken.userId;
  People.findById(peopleId, function(err, peopleInst) {
    if (err) return cb(err, null);
    
    peopleInst.updateAttributes(data, function(err, success) {
      if (err) return cb(err, null);

      cb(null, { data: success, msg: msg.editProfile });
    })

  })
}

People.remoteMethod("editCustomer", {
  accepts: [
   // { arg: "customerType", type: "string", http: { source: "form" } },
    { arg: "fullName", type: "string", http: { source: "form" } },
    { arg: "gstNumber", type: "string", http: { source: "form" } },
    { arg: "req", type: "object", http: { source: "req" } }
  ],
  returns: { arg: "success", type: "object" }
})


People.uploadProfilePic = function(req, res, cb){
  let peopleId = req.accessToken.userId;
  function uploadFile() {
    People.app.models.Container.imageUpload(req, res, { container: 'profileimages' }, function(err, success) {
      if (err)
        cb(err, null);
      else {
        updateUser(success);
      }
    })
  }

  function updateUser(passObj) {
    var data = {};
    if (passObj.files) {
      if (passObj.files.image)
        data.image = passObj.files.image[0].url;
    }

    if(!data.image)
      return cb(new Error("No image found"),null);

    People.findById(peopleId,function(error, peopleInst){
      if(error) return cb(error,null);

      peopleInst.updateAttributes(data, function(err, success) {
        if (err) return cb(err, null);
        cb(null, {data:success, msg: msg.uploadProfilePic });
      })
    })
  }  

  uploadFile();

}


People.remoteMethod("uploadProfilePic",{
  accepts : [
    { arg:"req", type:"object", http:{source:"req"}},
    { arg:"res", type:"object", http:{source:"res"}}
  ],
  returns : {arg:"success", type:"object"}
})



People.on('resetPasswordRequest', function(info) {
          var url;
          //var url = config.redirectUrl+'/reset-password';
          if(info.user.realm=="admin"||info.user.realm=="superAdmin"){
           url = config.redirectAdminUrl + '/reset-password/' + info.accessToken.id;
          }
          else{
            url = config.redirectUrl + '/reset-password/' + info.accessToken.id;
          }
          // var html = 'Click <a href="' + url + '/' +info.accessToken.id + '">here</a> to reset your password';
         // if(info.user.realm)
          createVerificationEmailBody({
              url: url,
              name: info.user.fullName,
              template: path.resolve(__dirname, '../../server/views/reset-password-email.ejs'),
          }, undefined, function(err, html) {

              if (err) return //console.log('> error sending password reset email');
              People.app.models.Email.send({
                  to: info.email,
                  from: "info@fixpapa.com",
                  subject: 'Password reset',
                  html: html
              }, function(err, success) {
                  //console.log(err);
                  if (err) return //console.log('> error sending password reset email');
                  //console.log('> sending password reset email to:', success);
              });
          });

        });

      function createVerificationEmailBody(verifyOptions, options, cb) {
          var template = loopback.template(verifyOptions.template);
          var body = template(verifyOptions);
          cb(null, body);
      }

      People.getAllUsers = function(filter, cb) {
          if (!filter)
              filter = {};
          if (!filter.where)
              filter.where = {};
            filter.order = "createdAt DESC";



          People.find(filter, function(error, peoples) {
              if (error)
                  cb(error, null);
              else {
                      People.count(filter.where,function (err,totalCount) {
                        if(err)
                          return cb(err,null);
                        else{
                          
                         cb(null, { data: peoples,count:totalCount});
                        }
                      });
                  
              }
          })
      }



      People.remoteMethod("getAllUsers", {
          accepts: [
              { "arg": "filter", "type": "object" }
              // { "arg": "skip", "type": "number" },
               // { "arg": "limit", "type": "number" }

          ],
          returns: { "arg": "success", "type": "object" },
          http: { "verb": "get" }
      })
      

      People.viewProfile = function(peopleId,realm,cb) {
        
        if(realm=="customer"){
         People.findById(peopleId,{
        include: {
          relation: 'requestjob',
          }
        },function(err,peopleInst){
        if(err)
          return cb(err,null)
        if(!peopleInst)
          return cb(new Error("Customer not found!!"),null)
        
          cb(null, { data: peopleInst, msg: msg.viewProfile })
       })      
      }
      else if(realm=="vendor"){
      let filter = {};

      if (!filter.where)
        filter.where = {};
        filter.include = [{
          relation: "services"
        },
        {
          relation:"newpurchase"
        },
        {
          relation : "requestjob"
        }]
        People.findById(peopleId,filter,function(err,peopleInst){
        if(err)
          return cb(err,null)
        if(!peopleInst)
          return cb(new Error("Vendor not found!!"),null)
        
          cb(null, { data: peopleInst, msg: msg.viewProfile })
       })  
      }
      else if(realm=="engineer")
      {
        let filter = {};

        if (!filter.where)
          filter.where = {};
         filter.include = [{
          relation: "expertise"
        },
        {
          relation:"requestjob"
        }]
        People.findById(peopleId,filter,function(err,peopleInst){
        if(err)
          return cb(err,null)
        if(!peopleInst)
          return cb(new Error("Engineer not found!!"),null)
        
          cb(null, { data: peopleInst, msg: msg.viewProfile })
       })
      }
      else
      
        return cb(new Error("realm not found"),null)
      }

      People.remoteMethod('viewProfile', {
        description: 'profile details',
        accepts: [
          { arg: 'peopleId', type: 'string', required:true},
          { arg: 'realm', type:'string', required:true}
        ],
        returns: { arg: "success", type: "object"},
        http: { verb: 'get' }
      })


      People.getPeoples = function(realm,cb){
        //console.log(realm)
        People.find({
          where:{
            realm:realm
          }
        },function(error,peoples){
          if(error) return cb(error,null);
          cb(null,{data:peoples,msg:msg.getPeoples});

        })
      }

      People.remoteMethod("getPeoples",{
        accepts : [
          {arg:"realm",type:"string",required:true}
        ],
        returns : {arg:"success",type:"object"},
        http:{verb:"get"}
      })


      People.getAllVendors = function(cb){
        ////console.log(realm)
        People.find({
          where:{
            realm:"vendor"
            }
        },function(error,vendors){
          if(error) return cb(error,null);
          cb(null,{data:vendors,msg:msg.getVendors});

        })
      }

      People.remoteMethod("getAllVendors",{
        accepts : [
          //{arg:"realm",type:"string",required:true,'http': { source: 'form' }}
        ],
        returns : {arg:"success",type:"object"},
        http:{verb:"get"}
      })


      People.editEngineer =function(fullName,email,mobile,password,exp,expertiseIds,address,engineerId,cb){
        
        let data = {
          
        fullName         :         fullName,
        email            :         email,
        mobile           :         mobile,
        password         :         password,
        exp              :         exp,
        expertiseIds     :         expertiseIds,
        address          :         address
         
        }
          data.updatedAt = new Date();


        
        People.findById(engineerId, function(err, engiInst) {
          if (err) return cb(err, null);
          
          engiInst.updateAttributes(data, function(err, success) {
            if (err) return cb(err, null);
            else{
              People.app.models.AccessToken.destroyAll({userId: engineerId});
              cb(null, { data: success, msg: msg.editProfile });
            }

          })

        })
      }

      People.remoteMethod("editEngineer", {
        accepts: [
          { arg: "fullName", type: "string", http: { source: "form" } },
          { arg: "email", type: "string", http: { source: "form" } },
          { arg: "mobile", type: "string", http: { source: "form" } },
          { arg: "password", type: "string", http: { source: "form" } },
          { arg: "exp", type: "number", http: { source: "form" } },
          { arg: "expertiseIds", type: "array", http: { source: "form" } },
          { arg: "address", type: "string", http: { source: "form" } },
          { arg: "engineerId", type: "string", required:true,http: { source: "form" } }
        ],
        returns: { arg: "success", type: "object" }
      })

      People.actInacEngineers =function( req,peopleId,active,cb){

        let authPerson  = req.accessToken.userId;
        let data ={
          
            active : active,
          authPerson : authPerson
          }



        People.findById(peopleId,function(err,peopleInst){
          if(err)
            return cb(err,null)
          if(!peopleInst)
            return cb(new Error("people  not found!!"),null)
          /*if(peopleInst.isJobAssigned == true)
            return cb(new Error("Engineer has job assigned,You cant make him inactive!!"),null)*/
          if(peopleInst.authPerson)
          {
            if(peopleInst.authPerson == authPerson.toString())
            {
              peopleInst.updateAttributes(data,function(err,success){
            
            if(err)
              return cb(err,null)
           
            cb(null, { data: success, msg: msg.inactiveEngineer });
          })
            }
            else
              return cb(new Error("!!you are unauthorized person!!"),null)
          }
            else
            {
               peopleInst.updateAttributes(data,function(err,success){
            
            if(err)
              return cb(err,null)
           
            cb(null, { data: success, msg: msg.inactiveEngineer });
          })
            } 
          
          
        })
      }
       
       People.remoteMethod("actInacEngineers", {
        accepts: [
          { arg: "req", type: "object", http: { source: "req" } },
          { arg: "peopleId", type: "string", http: { source: "form" } },
          { arg: "active", type: "boolean", required:true,http: { source: "form" } }
        ],
        returns: { arg: "success", type: "object" }
      })


      /*People.matchOtp = function(peopleId,mobOtp,cb){

        this.findById(peopleId, function(err,peopleInst) {
        if (err) 
          return cb(err,null);

        if (!peopleInst) {
        const err = new Error(`User ${userId} not found`);
        Object.assign(err, {
          code: 'USER_NOT_FOUND',
          statusCode: 401,
        });
        return cb(err);
      }
        if(inst.mobOtp==mobOtp)
      {
        peopleInst.mobOtp==null;
        peopleInst.mobileVerified=true;
        inst.save(function(err,success)
        {
          if(err)
          {
            cb(err,null);
          }
          else
          {
            cb(null,{data:success,msg: msg.matchOtp});

          }
        })
      }

     // inst.setPassword(newPassword, options, cb);
    });

    return cb(null,peopleInst);
  }

  People.remoteMethod('matchOtp',{
        accepts: [
            {arg: 'peopleId', type: 'string', required: true, http: {source: 'form'}},
            {arg: 'mobOtp', type: 'number', required: true, http: {source: 'form'}}
        ],
        returns : {arg:"success",type:"object","root":true},
        http: {verb: 'post'}
     });

*/

    People.verifyMobile = function(peopleId,otp,cb){
    People.app.models.People.findById(peopleId,function(errorP,peopleInst){
      if(errorP) return cb(errorP,null);
      
      if(!peopleInst) return cb(new Error("No user found"),null);
      if(peopleInst.mobileNumber)
      {
          peopleInst.mobile=peopleInst.mobileNumber;
          peopleInst.mobileNumber=null;
      }
          
      peopleInst.mobOtp = peopleInst.mobOtp || {}; 
      let currentDate = new Date();
      if(peopleInst.mobOtp.expireAt > currentDate){
        
        if(peopleInst.mobOtp.otp == otp){
          peopleInst.mobOtp = {};
          peopleInst.mobileVerified = true;

          peopleInst.save(function(errorUP,updatedInst){
            if(errorUP) return cb(errorUP,null);
            
            cb(null,{data:updatedInst,msg:msg.mobileVerify})
          })    
        }
        else{
          cb(new Error("Otp doesn't match"),null);
        }       
      }else{
        cb(new Error("otp expired, please resend otp"),null);
      }

    })
  }

  People.remoteMethod("verifyMobile",{
    accepts : [
      {arg:"peopleId",type:"string",required:true,http:{source:"form"}},
      {arg:"otp",type:"number",required:true,http:{source:"form"}}
    ],
    returns : {arg:"success",type:"object"}
  })


    People.resendOtp = function(peopleId,cb){
   
    People.findById(peopleId,function(err, peopleInstance){
      if(err)
        cb(err,null);
      else{

        if(!peopleInstance) return cb(new Error("No user found"),null);
            if(peopleInstance.mobileNumber)
            {
            peopleInstance.mobOtp = {
                createdAt : new Date(),
                expireAt  : new Date(),
                otp       : gf.getOTP()
              }

              peopleInstance.mobOtp.expireAt.setMinutes(peopleInstance.mobOtp.expireAt.getMinutes()+5);

              People.app.models.Otp.sendSMS({otp:peopleInstance.mobOtp.otp,mobile:peopleInstance.mobileNumber},function(error,success){});
            
              peopleInstance.save(function(err, peopleInst){
              if(err)
                cb(err,null);
              else{
               
                cb(null,{data:peopleInst,msg:msg.resendOtp});
              }
            })
      }

        else{
          peopleInstance.mobOtp = {
            createdAt : new Date(),
            expireAt  : new Date(),
            otp       : gf.getOTP()
          }

          peopleInstance.mobOtp.expireAt.setMinutes(peopleInstance.mobOtp.expireAt.getMinutes()+5);

          People.app.models.Otp.sendSMS({otp:peopleInstance.mobOtp.otp,mobile:peopleInstance.mobile},function(error,success){});
        
          peopleInstance.save(function(err, peopleInst){
          if(err)
            cb(err,null);
          else{
           
            cb(null,{data:peopleInst,msg:msg.resendOtp});
          }
         })
        }
          
      }
    })  
  }

  People.remoteMethod("resendOtp",{
    accepts : [
      {arg:'peopleId',type:"string",required:true},
      ],
    returns : {arg:"success",type:"object"}
  })


  


  

    

   People.editEmail =function(req,emailId,cb){
    let peopleId = req.accessToken.userId;
    let data={
      emailId:emailId,
    }
    data.otp=gf.getOTP();
          //console.log("emailId---",emailId)
    People.findById(peopleId,function(err,peopleInst){
      if(err) 
        return cb(err,null)
      else{
        if(!peopleInst)
          return cb(new Error("No user found"),null);
        People.findOne({where:{email:emailId}},function(error,user){
          if(error) return cb(error,null);
          if(user) return cb(new Error("Email already exists!!"),null);
          peopleInst.updateAttributes(data,function(err,success){
            if(err) return cb(err,null)
            cb(null,{data:success,msg:msg.editEmail});
          })
        })
        
      }
    })
  }
      

    People.afterRemote('editEmail', function(context, instance, nextUser) {
     ////console.log(instance.data);

   var userInstance = instance.success.data;
   ////console.log("heyya",userInstance);

    
    People.app.models.Email.send({
      to: userInstance.emailId,
      from: 'info@fixpapa.com',
      subject: 'Email updated',
      text: 'my text',
      html : `your OTP is ${userInstance.otp}`
    }, function(err, mail) {
      if(err)
      {
     // return nextUser(err,null);
      //console.log('error sent!',err);
      }
      else
      {
        //return nextUser(null,mail);
        //console.log("email sent!!");
      }
    

    });
    
    nextUser();


////////////////verification by link (code)/////////////
   /* var options = {
      type: 'email',
      to: userInstance.emailId,
      from: 'noreply@loopback.com',
      subject: 'Email updated',
      redirect: '/verified',
      user: People,
      apiUrl:'/api/People/edit-email-confirm',
      template: path.resolve(__dirname, '../../server/views/editemail.ejs')
     
    };
  
   
      userInstance.verify(options, function(err, response, next) {
        if (err) return nextUser(err);
        //console.log('> verification email sent:', response);
        nextUser();
      });*/
    });
   
  
     People.remoteMethod("editEmail",{
    accepts : [
      {arg:'req',type:"object",required:true,http:{source:"req"}},
      {arg:'emailId',type:"string",required:true,http:{source:"form"}}

      ],
    returns : {arg:"success",type:"object"}
  })



     People.editEmail_match_otp =function(req,otp,cb){
        //console.log("req : ",req.accessToken);
         //console.log("otp : ",otp);
          let peopleId = req.accessToken.userId;
        People.findById(peopleId,function(err,peopleInst){
          if(err)
          return cb(new Error("No user found"), null);

          if(peopleInst.otp==otp){
            peopleInst.otp=null;
            peopleInst.emailVerified=true;
            peopleInst.email=peopleInst.emailId;
            peopleInst.emailId=null;

            peopleInst.save(function(err,success) {
            if (err) 
              return cb(err,null);
            cb(null,{data:success,msg:msg.otp_Matched});
          })
          }else
          {
            return cb(new Error("wrong otp"),null);
          }
        })
      }

      People.remoteMethod("editEmail_match_otp",{
    accepts : [
      {arg:'req',type:"object",required:true,http:{source:"req"}},
      {arg:'otp',type:"number",required:true,http:{source:"form"}}
    ],
    returns : {arg:"success",type:"object"}
  })


    People.editMobile =function(req,mobileNumber,cb){
    let peopleId = req.accessToken.userId;
    let data={
            mobileNumber:mobileNumber
           // mobileVerified:false
          }

 
    People.findOne({where:{mobile : mobileNumber}},function(err,userInst){
      if(err)
        return cb(err,null)
           
           if(userInst)
                return cb(new Error("mobile number already exists!!"),null);
              
    People.findById(peopleId,function(err,peopleInst){
            
            data.mobOtp = {
              createdAt : new Date(),
              expireAt  : new Date(),
              otp       : gf.getOTP()
              }

            /* People.findById(peopleId,function(err,peopleInst){
              if(err) return cb(err,null)
              else{*/
                 data.mobOtp.expireAt.setMinutes(data.mobOtp.expireAt.getMinutes()+5);
          //if(!peopleInst.mobileVerified)
              People.app.models.Otp.sendSMS({otp:data.mobOtp.otp,mobile:data.mobileNumber},function(error,success){});
          //peopleInst.find({ "mobile": { $exists: false, $ne: null } })
          // People.validatesUniquenessOf({$where: "this.email" == "this.emailId"}, {message: 'Email already exists'});
            
              peopleInst.updateAttributes(data,function(err, success){
              if(err)
                return cb(err,null)
                cb(null,{data:success,msg:msg.mobileUpdated});
             })

        })
           //else{
           
           // }
         // })
       // }
       
    })
   
    }

     People.remoteMethod("editMobile",{
    accepts : [
      {arg:'req',type:"object",required:true,http:{source:"req"}},
      {arg:'mobileNumber',type:"string",required:true,http:{source:"form"}}

      ],
    returns : {arg:"success",type:"object"}
  })


     People.manageAddresses =function(req,addresses,cb){

        let peopleId = req.accessToken.userId;
        let data ={
          addresses :addresses,
          updatedAt:new Date()

        }
       
    People.findById(peopleId,function(err,peopleInst){
      if(err)
        return cb(err,null)
        if(!peopleInst)
          return cb(new Error("user not found"),null);
        //peopleInst.addresses = addresses;
       // peopleInst.updatedAt = new Date();
       // //console.log("heelo",addresses);
        peopleInst.updateAttributes(data,function(err,success){
          if(err)
            return cb(err,null)
         // //console.log(success);
          cb(null,{data:success,msg:msg.manageAddress});
        })
      })
    }

     People.remoteMethod("manageAddresses",{
    accepts : [
      {arg:'req',type:"object",http:{source:"req"}},
      {arg:'addresses',type:"array",required:true,http:{source:"form"}}

      ],
    returns : {arg:"success",type:"object"},
    http: { verb: 'post' }
  })

     People.getAddresses =function(req,cb){
      let peopleId = req.accessToken.userId;
    

      People.findById(peopleId,{ fields: {addresses: true} },function(err,success){
        if(err)
          return cb(err,null);
        cb(null,{data:success,msg:msg.getAddresses});
       })
     }

      People.remoteMethod('getAddresses', {
    accepts: [
      { arg: 'req', type: 'object', 'http': { source: 'req' } }
      ],
    returns: { arg: "success", type: "object" },
    http: { verb: 'get' }
  })




  People.editEmailConfirm = function(uid, token, redirect, fn) {
    fn = fn || utils.createPromiseCallback();
    this.findById(uid, function(err, user) {
      if (err) {
        fn(err);
      } else {
        if (user && user.verificationToken === token) {
          /*user.verificationToken = null;
          user.emailVerified = true;*/
          // user.email = user.emailId;
          // user.emailId= null;
          //console.log("this function is call or not")
          user.updateAttributes({
            verificationToken:null,
            emailVerified:true,
            emailId:null,
            email:user.emailId
          },function(err) {
            if (err) {
              fn(err);
            } else {
              fn();
            }
          });
        } else {
          if (user) {
            err = new Error('Invalid token');
            err.statusCode = 400;
            err.code = 'INVALID_TOKEN';
          } else {
            err = new Error('User not found');
            err.statusCode = 404;
            err.code = 'USER_NOT_FOUND';
          }
          fn(err);
        }
      }
    });
    return fn.promise;
  };

 People.afterRemote('editEmailConfirm', function(ctx, inst, next) {
      if (ctx.args.redirect !== undefined) {
        if (!ctx.res) {
          return next(new Error(g.f('The transport does not support HTTP redirects.')));
        }
        ctx.res.location(ctx.args.redirect);
        ctx.res.status(302);
      }
      next();
    });

People.remoteMethod(
      'editEmailConfirm',
      {
        description: 'Confirm a user registration with identity verification token.',
        accepts: [
          {arg: 'uid', type: 'string', required: true},
          {arg: 'token', type: 'string', required: true},
          {arg: 'redirect', type: 'string'},
        ],
        http: {verb: 'get', path: '/edit-email-confirm'},
      });



    People.addEngineer =function(req,res,cb){
    
    function uploadFile() {
      People.app.models.Container.imageUpload(req, res, { container: 'profileimages' }, function(err, success) {
        if (err)
          cb(err, null);
        else
          if (success.data) {
          success.data = JSON.parse(success.data);
          createEngineer(success);
        } else {
          cb(new Error("data not found"), null);
        }
          //createUser(success);
      })
    }

    function createEngineer(obj) {
      

      var data = {
        
        realm: "engineer",
        vendorId : obj.data.vendorId,
        fullName: obj.data.fullName,
        email: obj.data.email,
        mobile: obj.data.mobile,
        
        password: obj.data.password,
        adminVerifiedStatus:"approved",
        active    :   true

        }

      
      data.emailVerified = true;
      data.createdAt = new Date();
      data.updatedAt = new Date();
      data.mobileVerified = true;
      data.isJobAssigned        =     false;
      data.expertiseIds         =     obj.data.expertiseIds;
      data.exp                  =     obj.data.exp;
      data.address              =     obj.data.address;
     
      
      if (obj.files) {
        if (obj.files.image)
          data.image = obj.files.image[0].url;
    
      }

      if(!obj.data.peopleId){
          People.create(data, function(err, success) {
        if (err)
          cb(err, null);
        else{
           ////console.log(success)

          
          People.findById(data.vendorId,function(err,vendorInst){
            if(err) return cb(err,null)
              else
             // { let data1 ={noOfEngineers}
              vendorInst.noOfEngineers += 1;
              vendorInst.save(function(err,updated){})
              // vendorInst.updateAttributes(noOfEngineers++,function(err,updated){})
                
              
              })
           cb(null,{data:success,msg:msg.addEngineer});
          }
        
      })
      }
      else{
        People.findById(obj.data.peopleId,function(err,peopleInst){
          if(err) return cb(err,null)
          if (!peopleInst) return cb(new Error("No engineer found"), null);

          peopleInst.updateAttributes(data,function(err,success){
            if(err) return cb(err,null)
               cb(null,{data:success,msg:msg.engineerupdate});
          })
        })
      }
     
     }

    uploadFile();
  }
   People.afterRemote('addEngineer', function(context, instance, nextUser) {
     ////console.log(instance.data);

   var userInstance = instance.success.data;
   ////console.log(userInstance);


    userInstance.addRole(userInstance.realm, function(error, success) {});

     nextUser();

   });



  People.remoteMethod('addEngineer',{
    accepts:[
     { arg: 'req', type: 'object', http: { source: 'req' } },
     { arg: 'res', type: 'object', http: { source: 'res' } }
    ],
    returns :{arg:"success",type :"object"},
    http :{verb:'post'}

  })




  People.getEngineers =function(vendorId,cb){
   
    let filter = {};

    if (!filter.where)
      filter.where = {};
      filter.where = {
      "vendorId" : { "like" : vendorId},
      "realm":{"like":"engineer"}
    };
    filter.order = "date DESC";
    filter.include = [{
      relation: "expertise"
    }]
    
   
    People.find(filter,function(err,success){
      if(err)
        return cb(null,success)
      cb(null,{data:success,msg:msg.getMyInfo});

    })
    
  }

   People.remoteMethod("getEngineers", {
    accepts: [
      { arg: "vendorId", type: "string",required:true}
      //{ arg: 'realm', type: "string", required: true },
      ],
    returns: { arg: "success", type: "object" },
    http: { verb: "get" }
})
   People.getFreeEngineers =function(vendorId,cb){
   
    let filter = {};

    if (!filter.where)
      filter.where = {};
      filter.where = {
      "vendorId" : { "like" : vendorId},
      "realm":{"like":"engineer"},
      //isJobAssigned:false,
      active : true
    }
     // filter.where={vendorId : vendorId,realm : "engineer",active:true};
    //};
    filter.order = "date DESC";
    filter.include = [{
      relation: "expertise"
    }]
   // //console.log("chal ni rha ",filter)
    
   
    People.find(filter,function(err,success){
      if(err)
        return cb(err,null)
      cb(null,{data:success,msg:msg.getMyInfo});

    })
    
  }

   People.remoteMethod("getFreeEngineers", {
    accepts: [
      { arg: "vendorId", type: "string",required:true}
      //{ arg: 'realm', type: "string", required: true },
      ],
    returns: { arg: "success", type: "object" },
    http: { verb: "get" }
})


   People.editVendor=function(req,fullName,noOfEngineers,servicesIds,newpurchaseIds,yearOfExp,gstNumber
                      ,bankName,firmName,ifscCode,accountNumber,startTime,endTime,supportDays,cb){

    

    let data ={
      fullName           :     fullName,
      noOfEngineers      :     noOfEngineers,
      servicesIds        :     servicesIds,
      newpurchaseIds     :     newpurchaseIds,
      yearOfExp          :     yearOfExp,
      gstNumber          :     gstNumber,
      bankName           :     bankName,
      firmName           :     firmName,
      ifscCode           :     ifscCode,
      accountNumber      :     accountNumber,
      startTime          :     {value: startTime,
                                      valueInMinute : gf.timeCoversion(startTime) },
      endTime            :     {value: endTime,
                                valueInMinute : gf.timeCoversion(endTime) },
      supportDays        :     supportDays
        
    }



    /*data.addresses = [];
     obj.data.addresses=obj.data.addresses||[];
     obj.data.addresses.forEach(function(value){
      data.addresses.push(value);
     })*/


   

         data.updatedAt = new Date();

      let peopleId = req.accessToken.userId;
      People.findById(peopleId, function(err, peopleInst) {
        if (err) return cb(err, null);
        
        peopleInst.updateAttributes(data, function(err, success) {
          if (err) 
          {
            return cb(err, null);
            //console.log("error:=",err);
          }
          else{
             cb(null, { data: success, msg: msg.editProfile });
             //console.log("success:=",success);
          }

         
        })
      })
    }

    People.remoteMethod("editVendor", {
    accepts: [
      { arg: "req", type: "object",http: { source: 'req' }},
      { arg: "fullName", type:"string",http: { source: 'form' }},
      { arg: "noOfEngineers", type:"number",http: { source: 'form' }},
      { arg: "servicesIds", type:"array",http: { source: 'form' }},
      { arg: "newpurchaseIds",type:"array",http: { source: 'form' }},
      { arg: "yearOfExp", type: "number",http: { source: 'form' }},
      { arg: "gstNumber", type: "string",http: { source: 'form' }},
      { arg: "bankName", type: "string",http: { source: 'form' }},
      { arg: "firmName", type: "string",http: { source: 'form' }},
      { arg: "ifscCode", type: "string",http: { source: 'form' }},
      { arg: "accountNumber", type: "string",http: { source: 'form' }},
      { arg: "startTime", type: "string",http: { source: 'form' }},
      { arg: "endTime", type: "string",http: { source: 'form' }},
      { arg: "supportDays", type: "array",http: { source: 'form' }}
  ],
    returns: { arg: "success", type: "object" },
    http: { verb: "post" }
})


    People.vendorAvailability =function(req,isAvailable,cb){

      let data ={
        isAvailable :isAvailable
       }
      let vendorId = req.accessToken.userId;
      People.findById(vendorId,function(err,peopleInst){
        if(err)
          return cb(err,null)
        if(!peopleInst)
          return cb(new Error("Vendor not found!!"),null)
        peopleInst.updateAttributes(data,function(err,success){
          if(err)
            return cb(err,null)
          cb(null, { data: success, msg: msg.vendorAvailable });
        })
      })
    }

     People.remoteMethod("vendorAvailability", {
    accepts: [
      { arg: "req", type: "object",http:{source:"req"}},
      { arg: "isAvailable", type: "boolean",http:{source:"form"}}
      
      ],
    returns: { arg: "success", type: "object" }
  })


  People.changePwd =function(req,engineerId,vendorPwd,newPwd,cb){

     let vendorId = req.accessToken.userId;

     People.findById(vendorId,function(err,peopleInst){
      if(err)
        return cb(err,null)
      if(!peopleInst)
        return cb(new Error("Vendor not found!!"),null)
     
     if (peopleInst.password && vendorPwd) {
     
      bcrypt.compare(vendorPwd, peopleInst.password, function(err, match) {
        
       if(err)
        return cb(err,null)
    
      else
       {
       // return cb(null,match)
       ////console.log("match :", match)
       if(match == true)
       {

         People.findById(engineerId,function(err,engiInst){
      if(err)
        return cb(err,null)
      if(!engiInst)
        return cb(new Error("Engineer not found!!"),null)

      engiInst.updateAttributes({password:newPwd},function(err,success){
        if(err)
          return cb(err,null)
        cb(null, { data: success, msg: msg.changePwd })
        
          })
        })
       }
       else
       {
        return cb(new Error(" Wrong vendor password!!"),null);
       }
     }
        
      
    })
    }
       else
        return cb(new Error("!!wrong vendor password!!"),null)
     })
    }

    People.remoteMethod("changePwd", {
    accepts: [
      { arg: "req", type: "object",http:{source:"req"}},
      { arg: "engineerId", type: "string",http:{source:"form"}},
      { arg: "vendorPwd", type: "string",http:{source:"form"}},
      { arg: "newPwd", type: "string",http:{source:"form"}}
      ],
    returns: { arg: "success", type: "object" }
  })



    People.uploadEngineerPic = function(req, res, cb){
  //let peopleId = req.accessToken.userId;
      function uploadFile() {
        People.app.models.Container.imageUpload(req, res, { container: 'profileimages' }, function(err, success) {
          if (err)
            cb(err, null);
          else {
            ////console.log("success:",success);
            updateUser(success);

          }
        })
      }

      function updateUser(passObj) {
        var data = {};
        if (passObj.files) {
          if (passObj.files.image)
            data.image = passObj.files.image[0].url;
        }

    if(!data.image)
      return cb(new Error("No image found"),null);

    People.findById(passObj.engineerId,function(error, peopleInst){
      if(error) return cb(error,null);
      if(!peopleInst)
        return cb(new Error("Engineer not found!!"),null)

      peopleInst.updateAttributes(data, function(err, success) {
        if (err) return cb(err, null);
        cb(null, {data:success, msg: msg.uploadProfilePic });
      })
    })
  }  

  uploadFile();

}


    People.remoteMethod("uploadEngineerPic",{
      accepts : [
        //{ arg:"engineerId", type:"string",required:true, http:{source:"form"}},
        { arg:"req", type:"object", http:{source:"req"}},
        { arg:"res", type:"object", http:{source:"res"}}
      ],
      returns : {arg:"success", type:"object"}
    })


    People.getUsersAdmin = function(filter ,cb) {
      //let peopleId = req.accessToken.userId;
      
    People.find(filter,function(err, success) {
      if (err) {
        cb(err, null)
      } else {
        
        cb(null, { data: success, msg: msg.getPeoples });
      }
    })
  }

    People.remoteMethod("getUsersAdmin", {
      accepts:[
        {arg :"filter",type :"object"}
      ],
      returns: { arg: "success", type: "object" },
      http: { verb: "get" }
    });



     People.actInacVendors =function( req,peopleId,active,cb){

        let authPerson  = req.accessToken.userId;
        let data ={
          active : active,
          authPerson : authPerson
        }

        /*People.findById(authPerson,function(errA, admin){
          if(errA) return cb(errA,null);*/

          People.findById(peopleId,function(err,peopleInst){
            if(err)
              return cb(err,null)

            if(!peopleInst)
              return cb(new Error("people  not found!!"),null)
           
            if(peopleInst.authPerson){
              if(peopleInst.authPerson == authPerson.toString()){
                People.app.models.AccessToken.destroyAll({userId: peopleInst.id},function(errD,successD){
                  if(errD) return cb(errD,null);
                  peopleInst.updateAttributes(data,function(err,success){
                    if(err)
                      return cb(err,null)
                    cb(null, { data: success, msg: msg.inactiveVendor });
                  }) 
                });
                  
              }
              else
                return cb(new Error("!!you are unauthorized person!!"),null)
            }else{
              People.app.models.AccessToken.destroyAll({userId: peopleInst.id},function(errD,successD){
                if(errD) return cb(errD,null);
                peopleInst.updateAttributes(data,function(err,success){
                  if(err)
                    return cb(err,null)
                  cb(null, { data: success, msg: msg.inactiveVendor });
                })
              });
              
            } 
          })

        // })

      }
       
       People.remoteMethod("actInacVendors", {
        accepts: [
          { arg: "req", type: "object",required:true, http: { source: "req" } },
          { arg: "peopleId", type: "string",required:true, http: { source: "form" } },
          { arg: "active", type: "boolean", required:true,http: { source: "form" } }
        ],
        returns: { arg: "success", type: "object" }
      })


       People.actInacCustomers =function( req,peopleId,active,cb){

        let authPerson  = req.accessToken.userId;
        let data ={
          
            active : active,
          authPerson : authPerson
          }



        People.findById(peopleId,function(err,peopleInst){
          if(err)
            return cb(err,null)
          if(!peopleInst)
            return cb(new Error("people  not found!!"),null)
          //if(peopleInst.isJobAssigned == true)
            //return cb(new Error("Vendor has job assigned,You cant make him inactive!!"),null)
          if(peopleInst.authPerson)
          {
            if(peopleInst.authPerson == authPerson.toString())
            {
              peopleInst.updateAttributes(data,function(err,success){
            
            if(err)
              return cb(err,null)
           
            cb(null, { data: success, msg: msg.inactiveCustomer });
          })
            }
            else
              return cb(new Error("!!you are unauthorized person!!"),null)
          }
            else
            {
               peopleInst.updateAttributes(data,function(err,success){
            
            if(err)
              return cb(err,null)
           
            cb(null, { data: success, msg: msg.inactiveCustomer });
          })
            } 
          
          
        })
      }
       
       People.remoteMethod("actInacCustomers", {
        accepts: [
          { arg: "req", type: "object",required:true, http: { source: "req" } },
          { arg: "peopleId", type: "string",required:true, http: { source: "form" } },
          { arg: "active", type: "boolean", required:true,http: { source: "form" } }
        ],
        returns: { arg: "success", type: "object" }
      })



       People.uniqueEmail =function(email,cb){
        
       let data ={
        isEmailAvailable :false 
       }
        People.findOne({where:{email:email}},function(err,success){
          if(err) return cb(err,null)

            else
            { 
              if(success)
                data.isEmailAvailable=true;
              //return cb(new Error("Email already exists!!"),null);
              cb(null,{success:data})
            }

        })
       }

       People.remoteMethod("uniqueEmail", {
        accepts: [
          { arg: "email", type: "string",required:true, http: { source: "form" } }
        ],
        returns: { arg: "success", type: "object" }
      })



        People.uniqueMobile =function(mobile,cb){
        
       let data ={
        isMobileAvailable :false 
       }
       //console.log("mobile",mobile);
        People.findOne({where:{mobile:mobile}},function(err,success){
          if(err) return cb(err,null)

            else
            { 
              //console.log("success part :",success)
              if(success)
                data.isMobileAvailable=true;
              
              cb(null,{success:data})
            }

        })
       }

       People.remoteMethod("uniqueMobile", {
        accepts: [
          { arg: "mobile", type: "string",required:true, http: { source: "form" } }
        ],
        returns: { arg: "success", type: "object" }
      })



       People.quickCall =function(service,mobileNo,timeofCalling,cb){
        let data ={
          service            :service,
          mobileNo           :mobileNo,
          timeofCalling      :timeofCalling
         
        }

          People.sendQuick(data,function(){});
          return cb(null,{data:data,msg:"successfully done"});

       }

       People.remoteMethod("quickCall", {
        accepts: [
          { arg: "service", type: "string",required:true, http: { source: "form" } },
          { arg: "mobileNo", type: "string",required:true, http: { source: "form" } },
          { arg: "timeofCalling", type: "date",required:true, http: { source: "form" } }
         
        ],
        returns: { arg: "success", type: "object" }
      })



       People.sendQuick = function(data,cb) {

      
        let verifyOptions = {
            to: 'fixpapa.jp@gmail.com',
            from: 'info@fixpapa.com',
            subject: 'New_Inquiry',
            data   : data,
            template: path.resolve(__dirname, '../../server/views/quick-mail.ejs')
           
        }
        createVerificationEmailBody(verifyOptions, undefined, function(err, html) {
          if (err) return cb(err);
          
          verifyOptions.html = html;

          People.app.models.Email.send(verifyOptions, function(err, mail) {
            // //console.log('email sent!',mail);

            // //console.log(err);
            cb(err);
          });

        });
      }
      People.remoteMethod('sendQuick',{
            accepts:[
             { arg: 'data', type: 'object'}
             ],
            returns :{arg:"success",type :"object"},
            http :{verb:'post'}

          })

      People.formDetails =function(name,companyName,workEmail,phone,content,cb){
        let data ={
          name          :   name,
          companyName   :   companyName,
          workEmail     :   workEmail,
          phone         :   phone,
          content       :   content
        }

          People.sendMails(data,function(){});
          return cb(null,{data:data,msg:"successfully done"});

       }

       People.remoteMethod("formDetails", {
        accepts: [
          { arg: "name", type: "string",required:true, http: { source: "form" } },
          { arg: "companyName", type: "string",required:true, http: { source: "form" } },
          { arg: "workEmail", type: "string",required:true, http: { source: "form" } },
          { arg: "phone", type: "string",required:true, http: { source: "form" } },
          { arg: "content", type: "string",required:true, http: { source: "form" } }
        ],
        returns: { arg: "success", type: "object" }
      })



       People.sendMails = function(data,cb) {

      
        let verifyOptions = {
            to: ['fixpapa.jp@gmail.com','firoztak.advocosoft@gmail.com'],
            from: 'info@fixpapa.com',
            subject: 'Form_Enquiry',
            data   : data,
            template: path.resolve(__dirname, '../../server/views/form-details.ejs')
           
        }
        createVerificationEmailBody(verifyOptions, undefined, function(err, html) {
          if (err) return cb(err);
          
          verifyOptions.html = html;

          People.app.models.Email.send(verifyOptions, function(err, mail) {
            // //console.log('email sent!',mail);

            // //console.log(err);
            cb(err);
          });

        });
      }
      People.remoteMethod('sendMails',{
            accepts:[
             { arg: 'data', type: 'object'}
             ],
            returns :{arg:"success",type :"object"},
            http :{verb:'post'}

          })




      People.setCommission =function(serviceCommission, productCommission,cb){
        let data ={
          serviceCommission : serviceCommission,
          productCommission : productCommission
        }

        People.findOne({where:{realm:"superAdmin"}},function(err,superInst){
          if(err)
            return cb(err,null)
          else{
            if(!superInst)
              return cb(new Error("record not found!"),null)
            superInst.updateAttributes(data,function(err,success){
              if(err)
                return cb(err,null)
              cb(null,{data:success,msg:"successfully updated commission!!"});
            })
          }
        })
      }

       People.remoteMethod('setCommission',{
            accepts:[
             { arg: 'serviceCommission', type: 'number',http: { source: "form" }},
             { arg: 'productCommission', type: 'number',http: { source: "form" }}
             ],
            returns :{arg:"success",type :"object"},
            http :{verb:'post'}

          })


       People.getCommission =function(cb){
        People.findOne({where: {realm : "superAdmin" }, fields: {serviceCommission: true, productCommission: true} },function(err,success){
          if(err)
            return cb(err,null)
           cb(null,{data:success,msg:"successfully done"});
        })
       }
         People.remoteMethod('getCommission',{
            accepts:[
           
             ],
            returns :{arg:"success",type :"object"},
            http :{verb:'get'}

          })




          












      

      



// *********************************** Validations*****************************************

  function typePof(err){
    if(this.customerType == "home" && this.customerType=="corporate")
      err();
  }

  

};
