  module.exports = function(app) {
    var Requestjob = app.models.Requestjob;



  var People = app.models.People;
  var Role = app.models.Role;
  var RoleMapping = app.models.RoleMapping;
  
  RoleMapping.belongsTo(People);
  People.hasMany(RoleMapping, {foreignKey: 'principalId'});
  Role.hasMany(People, {through: RoleMapping, foreignKey: 'roleId'});

function createRoles(){

  Role.count(function(error,count){
     if(error) throw error;
     if(count == 0){
        Role.create([
          
          {name:'superAdmin'},
          {name:'admin'},
          {name:'staff'},
          {name:'customer'},
          {name:'vendor'},
          {name:'engineer'}
          
          
        ],function(err,success){
          if(err) throw err;
          createAdmin();
          createSuperAdmin();
          createStaff();
        })
     }else{
      createAdmin();
      createSuperAdmin();
      createStaff();
     }

  })

}

createRoles();


function createAdmin(){
  People.count({realm:"admin"},function(error,count){
    if(error) throw error;
    if(count == 0){
      People.create({
        fullName:'AdminUser',
        realm:'admin',
        email: 'support@fixpapa.com', 
        mobile:'919649165819', 
        address : 'jaipur',
        password: 'admin@123',
        emailVerified:true,
        mobileVerified:true,
        adminVerifiedStatus: "approved"
      }, function(err, user) {
        if (err) throw err;
        console.log("admin created")
        Role.findOne({
          where:{name: 'admin'}
        }, function(err, role) {
          if (err) throw err;
          role.principals.create({
            principalType: RoleMapping.USER,
            principalId: user.id
          }, function(err, principal) {
            if (err) throw err;
          });
        });
      });
    }
  });
}

function createSuperAdmin(){
  People.count({realm:"superAdmin"},function(error,count){
    if(error) throw error;
    if(count == 0){
      People.create({
        fullName:'super_admin',
        realm:'superAdmin',
        email: 'chetan@fixpapa.com', 
        mobile:'919067207818', 
        address : 'jaipur',
        password: 'Technogl@123',
        emailVerified:true,
        mobileVerified:true,
        adminVerifiedStatus: "approved"
      }, function(err, user) {
        if (err) throw err;
        console.log("super admin created")
        Role.findOne({
          where:{name: 'superAdmin'}
        }, function(err, role) {
          if (err) throw err;
          role.principals.create({
            principalType: RoleMapping.USER,
            principalId: user.id
          }, function(err, principal) {
            if (err) throw err;
          });
        });
      });
    }
  })
}

function createStaff(){
  People.count({realm:"staff"},function(error,count){
    if(error) throw error;
    if(count == 0){
      People.create({
        fullName:'staff',
        realm:'staff',
        email: 'staff@mailinator.com', 
        mobile:'7014100056', 
        address : 'jaipur',
        password: '123nandani456',
        emailVerified:true,
        mobileVerified:true,
        adminVerifiedStatus: "approved"
      }, function(err, user) {
        if (err) throw err;
        console.log("staff created")
        Role.findOne({
          where:{name: 'staff'}
        }, function(err, role) {
          if (err) throw err;
          role.principals.create({
            principalType: RoleMapping.USER,
            principalId: user.id
          }, function(err, principal) {
            if (err) throw err;
          });
        });
      });
    }
  })
}

var CronJob = require('cron').CronJob;
var job = new CronJob('* * * * * ', function() {
 

  Requestjob.cronNotifyJobs(function() {});
  Requestjob.cronCancelJobs(function() {});
  Requestjob.cronEngCancelJobs(function() {});
  Requestjob.cronVenCancelJobs(function() {});

  // console.log("hahaahha");
}, null, true, 'America/Los_Angeles');





};