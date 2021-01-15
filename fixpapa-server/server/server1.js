'use strict';
/* jshint node: true ,esversion:6*/
var loopback = require('loopback');
var boot = require('loopback-boot');

var app = module.exports = loopback();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var path = require('path');
// ****************** for testing environment *************************

var databaseFile = require("./datasources.json");
if(process.argv[2] === "test"){
  databaseFile.db.database += "test"; 
}

// ****************** for testing environment *************************

app.use(loopback.static(path.resolve(__dirname, '../client/fixpapa/last-build')));
app.use(loopback.static(path.resolve(__dirname, '../client/fixpapaadmin')));



// to support JSON-encoded bodies
app.middleware('parse', bodyParser.json({limit:"50mb"}));
// to support URL-encoded bodies
app.middleware('parse', bodyParser.urlencoded({
  limit:"50mb",
  extended: true,
}));


// app.get('/robots.txt', function (req, res) {
//     res.type('text/plain');
//     res.send("User-agent: *\nDisallow: /");
// });


// app.get("/project/assets/*",function(req,res,next){
//   res.sendFile(req.url, { root: path.resolve(__dirname, '../', 'client/fixpapaadmin') });
// })

// app.get("/assets/*",function(req,res,next){
//   res.sendFile(req.url, { root: path.resolve(__dirname, '../', 'client/fixpapa/last-build') });
// })


app.all('/*', function(req, res, next) {
  if( !req.url.startsWith('/api') && !req.url.startsWith('/user-verify')  && !req.url.startsWith('/explorer') && !req.url.startsWith('/auth/facebook')){
    if(!req.url.startsWith('/admin') && !req.url.startsWith('/project')){
      console.log("come in user part")
      console.log(req.url)
      res.sendFile('index.html', { root: path.resolve(__dirname, '../', 'client/fixpapa/last-build') });
    }else{
      console.log("come in admin part")
      console.log(req.url)
      res.sendFile('index.html', { root: path.resolve(__dirname, '../', 'client/fixpapaadmin/project') });
    }
  }
  else
    next();
});







// Passport Login Functionality


// New Passport stratorgy

// Create an instance of PassportConfigurator with the app instance
var session = require('express-session');

// Passport configurators..
var loopbackPassport = require('loopback-component-passport');
var PassportConfigurator = loopbackPassport.PassportConfigurator;
var passportConfigurator = new PassportConfigurator(app);
var flash      = require('express-flash');

var config = {};
try {
  config = require('../provider.json');
} catch (err) {
  console.trace(err);
  process.exit(1); // fatal
}

// -- Add your pre-processing middleware here --
var path = require('path');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// boot scripts mount components like REST API
boot(app, __dirname);



// The access token is only available after boot
app.middleware('auth', loopback.token({
  model: app.models.accessToken,
}));

app.middleware('session:before', cookieParser(app.get('cookieSecret')));
app.middleware('session', session({
  secret: 'kitty',
  saveUninitialized: true,
  resave: true,
}));
passportConfigurator.init();

// We need flash messages to see passport errors
app.use(flash());

passportConfigurator.setupModels({
  userModel: app.models.People,
  userIdentityModel: app.models.UserIdentity,
  userCredentialModel: app.models.UserCredential
});

for (var s in config) {
  var c = config[s];
  c.session = c.session !== false;
  passportConfigurator.configureProvider(s, c);
}





// default code of this file 
app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
/*boot(app, __dirname, function(err) {
  if (err) throw err;*/

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
//});
mongoose.connect(mongoConnectionString, {useNewUrlParser: true, useUnifiedTopology: true});
