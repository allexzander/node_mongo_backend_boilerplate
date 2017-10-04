var Express = require('express'),
  App = Express(),
  port = process.env.PORT || 3001;

var MongoConfig = require("./mongo_config.json");

var Mongoose = require('mongoose');

/****MongoDB credentials*******************/
var mongoLogin = MongoConfig.username;
var mongoPass = MongoConfig.pass;
/******************************************/

/*******Schemas********************************************************/
var userSchema = Mongoose.Schema({ username: String, password: String});
userSchema.methods.speak = function () {
  return "User: " + this.username + " Pass: " + this.password;
}
var User = Mongoose.model('User', userSchema);
/**********************************************************************/

/****Routes*******************/
App.get('/', function (req, res) {
  res.send("Welcome to Sociami");
});

/*Test Connection*/
App.get('/test-db-connection', function (req, res) {
  
  var mongoURI = String(MongoConfig.uri).replace("{username}", mongoLogin).replace("{password}", mongoPass);
    console.log("Connecting to database...");
    Mongoose.connect(mongoURI, { useMongoClient: true, promiseLibrary: global.Promise });

    var result = "";

    var onErrorConnectDB = function(err) {
      result = "Failed to connect to Database: " + err;
      res.send(result);
      console.log(result);
      return;
    }
    var db = Mongoose.connection;
    db.on('error', onErrorConnectDB);
    db.once('open', function() {
      result = "Database connection successfull";
      db.close();
      res.send(result);
      console.log(result);
    });
});

/*Create Collection*/
App.get('/test-db-create-collection', function (req, res) {
  var mongoURI = String(MongoConfig.uri).replace("{username}", mongoLogin).replace("{password}", mongoPass);
  console.log("Connecting to database...");
  Mongoose.connect(mongoURI, { useMongoClient: true, promiseLibrary: global.Promise });

  var db = Mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
    // we're connected!
  });
    //Only for test!!!
    var user = new User({ username: 'dummyUser', password: 'dummyPassword'});
    user.save(function (err) {
      var result = "";
      if (err) {
        result = "Error creating new user: " + err;
        res.send(result);
      } else {
        result = "New user created: " + user.speak();
        res.send(result);
      }
  });
});

/*Read Collection*/
App.get('/test-read-collection', function (req, res) {
  var mongoURI = String(MongoConfig.uri).replace("{username}", mongoLogin).replace("{password}", mongoPass);
  var mongoURI = String(MongoConfig.uri).replace("{username}", mongoLogin).replace("{password}", mongoPass);
  console.log("Connecting to database...");
  Mongoose.connect(mongoURI, { useMongoClient: true, promiseLibrary: global.Promise });

  var db = Mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
    // we're connected!
  });

  User.find(function (err, users) {
    if (err) return console.error(err);
    console.log(users);
    res.send(users);
  })
});

/******************************************/

App.listen(port);

console.log('sociami RESTful API server started on: ' + port);