'use strict';
/* jshint node: true ,esversion:6*/
var loopback = require('loopback');
var boot = require('loopback-boot');

var app = module.exports = loopback();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var path = require('path');
var http = require('http');
var https = require('https');
//var sslConfig = require('./ssl-config');
const clientID = "340700811205-8i5rcn2d62beug1s4vbo2nv1jc07n6td.apps.googleusercontent.com";
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(clientID);
const axios = require("axios");
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
async function verify(token) {
/*  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: clientID,
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];
 */ 
}

app.get("/auth/google/token",function(req,res,next){
 /* console.log(req.query);
  try{
    const ticket = await client.verifyIdToken({
        idToken: req.query.access_token,
        audience: clientID,
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    // var profile = await axios.get('https://www.googleapis.com/oauth2/v3/tokeninfo?id_token='+req.query.access_token);
    console.log("dsfsdfds",payload)
    res.json(profile);
  }catch(error){
    console.log("come in error part")
    res.json(error);
  }*/

  console.log(clientID)

  async function verify() {
  const ticket = await client.verifyIdToken({
      idToken: req.query.access_token,
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
    "accessToken":req.query.access_token,
    "refreshToken":""
  }
  var options = { 
    "provider": provider,
    "module": "google-plus-token",
    "clientID": clientID,
    clientSecret: '401b547d011f78f1ca26242ec262a6c9',
    callbackPath: '/auth/facebook/token',
    failureFlash: true,
    strategy: 'GooglePlusTokenStrategy',
    json: true,
    session: false 

  }

  app.models.UserIdentity.login(provider, authScheme, profile, credentials,
                                 options,function(error,success){
                                  console.log(error)
                                  console.log(success);
                                 })
  console.log("payload",payload);
  console.log("userid",userid);
  // If request specified a G Suite domain:
  //const domain = payload['hd'];
}
verify().catch(console.error);
 
})


app.all('/*', function(req, res, next) {
  if( !req.url.startsWith('/api') && !req.url.startsWith('/user-verify')  && !req.url.startsWith('/explorer') && !req.url.startsWith('/auth/facebook') && !req.url.startsWith('/auth/google')){
    if(!req.url.startsWith('/admin')){
      // console.log("come in user part")
      // console.log(req.url)
      res.sendFile('index.html', { root: path.resolve(__dirname, '../', 'client/fixpapa/last-build') });
    }else{
      /*console.log("come in admin part")
      console.log(req.url)*/
      res.sendFile('index.html', { root: path.resolve(__dirname, '../', 'client/fixpapaadmin/admin') });
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
app.set('view engine', 'ejs');

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
	var httpOnly = true;
    // var options = {
  		// key: sslConfig.privateKey,
  		// cert: sslConfig.certificate,
    // };
    var options = { };
    var server = null;
    console.log("server loading");
    if (!httpOnly) {
		options = {
  			//key: sslConfig.privateKey,
  			//cert: sslConfig.certificate,
		};
		  server = https.createServer(options, app);
    } else {
		  server = http.createServer(app);
    }
    console.log('Server created');	
    server.listen(app.get('port'), function(){
    			var baseUrl = (httpOnly ? 'http://' : 'https://') + app.get('host') + ':' + app.get('port');
    			console.log('baseUrl',baseUrl);				
     			app.emit('started', baseUrl);
    			console.log('LoopBack server listening @ %s%s', baseUrl, '/');
   			if (app.get('loopback-component-explorer')) {
     			 	var explorerPath = app.get('loopback-component-explorer').mountPath;
    				console.log('Browse your REST API at %s%s', baseUrl, explorerPath); 
    			}
    });
    console.log('server process completed');
    return server;
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
/*boot(app, __dirname, function(err) {
  if (err) throw err;*/

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
//});
