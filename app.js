/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var errorhandler = require('errorhandler');
var mongodb = require('mongodb');
var mongoose = require('mongoose');
var passport = require('passport')
    , OAuthStrategy = require('passport-oauth').OAuthStrategy;
var bodyParser = require('body-parser');
var users = require('./controllers/users_controller.js');
var MongoClient = mongodb.MongoClient;
var cons = require('consolidate');
require('handlebars/runtime');
var app = express();
var url = 'mongodb://localhost:27017/massive_attack';
mongoose.connect(url);
var router = express.Router();
var  expressValidator = require('express-validator');
var ejs = require('ejs');
var session = require('express-session');
var fs = require('fs');
var swig = require('swig');
const util = require('util');
var methodOverride = require('method-override');
//var check = require('validator').check,
//    sanitize = require('validator').sanitize;
//var logger = require('morgan');
//var cookieParser = require('cookie-parser');
//var methodOverride = require('method-override');
//var site = require('./site');
var routes = require('./routes');
//var post = require('./post');
//var user = require('./user');
// Use connect method to connect to the Server
module.exports = app;

// Config
app.set('port', process.env.PORT || 3000);
/*app.use(express.static(__dirname + '/public'));
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(app.router);*/
//app.use(require('stylus').middleware(__dirname + 'public'));
//app.engine('html', require('ejs').renderFile);
//app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname , '/views'));
var swig = new swig.Swig();
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
//app.engine('html', cons.swig);
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')));
//app.set('trust proxy', 1) // trust first proxy
app.use(session({
    store: '',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 36000000,
        httpOnly: false // <- set httpOnly to false
    },
    secret: 'MySecret'
}));
passport.use('provider', new OAuthStrategy({
        requestTokenURL: 'https://www.facebook.com/oauth/?response_type=code&client_id=1703946223264507&redirect_uri=CALLBACK_URL&scope=read',
        accessTokenURL: 'https://www.facebook.com/oauth/access_token',
        userAuthorizationURL: 'https://www.facebook.com/oauth/authorize',
        consumerKey: '123-456-789',
        consumerSecret: 'shhh-its-a-secret',
        callbackURL: 'http://localhost:3000/dashboard'
    },
    function(token, tokenSecret, profile, done) {
        users.findOrCreate(function(err, user) {
            done(err, user);
        });
    }
));

//app.use(express.bodyParser());

/*app.set('view engine', 'ejs');
app.set('views', path.join(__dirname , '/views'));*/

/* istanbul ignore next */
/*if (!module.parent) {
    app.use(logger('dev'));
}*/

app.use(function(err, req, res, next) {
    if (app.get('env') === 'development') {
        return errorhandler(err, req, res, next);
    } else {
        res.sendStatus(401);
    }
});
/*if('development' == app.get('env')){
    errorhandler(err, req, res, next);
}*/
//app.use(methodOverride('_method'));
//app.use(cookieParser());
//app.use(bodyParser.urlencoded({ extended: true }));
//app.use(express.static(__dirname + '/public'));

// General

//app.get('/', site.index);

// User
app.use(bodyParser.urlencoded({ extended: true }));
/*app.use(express.cookieParser('shhhh, very secret'));
app.use(express.session());*/
router.use(methodOverride(function(req, res){
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method;
        delete req.body._method;
        return method
    }
}));
app.use(expressValidator());
app.get('/', routes.index);
app.get('/register', users.register);
app.get('/login', users.login);
app.get('/logout', users.logout);
app.get('/contact', routes.contact);
app.get('/dashboard', users.dashboard);
app.get('/auth/provider', passport.authenticate('provider'));
app.get('/auth/provider/callback',
    passport.authenticate('provider', { successRedirect: '/',
        failureRedirect: '/login' }));
//app.get('/dashboard', routes.dashboard);
//var u = new user();
//console.log(u);
//console.log(u['name']);

app.post('/register', users.register);
app.post('/login', users.login);
/*app.post("/register", function(req, res){

    var password = req.body.password;
     var name = req.body.name;
     var email = req.body.email;
     var username = req.body.username;
     //var confirm_pass = req.body.user.password_confirm;
    //Validate
    req.checkBody("name", 'Name is required').notEmpty();           //Validate name
    req.checkBody("username", 'User Name is required').notEmpty();           //Validate name
    req.checkBody("email", 'A valid email is required').isEmail();  //Validate email
    req.checkBody("password", 'Password is required').notEmpty();  //Validate email
    /!*req.checkBody(
       "password_confirm",
      "Password does not matches.").optional().matches("password");*!/
    //req.assert(email, 'A valid email is required').isEmail();  //Validate email
    /!*var check = [
       {param: "name", msg: "Name is required", value: 'Name'},
       {param: "email", msg: "A valid email is required", value: 'Email'},
       {param: "password", msg: "Password is required", value: 'Password'},
    ];*!/
    /!*var Array = req.body.data;
    res.end(Array[0]["QuestionText"].toString());*!/
    var errors = req.validationErrors();
    //console.log(errors);
    if( !errors) {   //No errors were found.  Passed Validation!

        mongoose.model('Users').create({
            name : name,
            username : username,
            email : email,
            password : password
        }, function (err, user) {
            if (err) {
                res.send("There was a problem adding the information to the database.");
            } else {
                //Blob has been created
                console.log('POST creating new blob: ' + user);
                res.format({
                    //HTML response will set the location and redirect back to the home page. You could also create a 'success' page if that's your thing
                    html: function(){
                        // If it worked, set the header so the address bar doesn't still say /adduser
                        res.location("register");
                        // And forward to success page
                        res.redirect("/register");
                    },
                    //JSON response will show the newly created blob
                    json: function(){
                        res.json(user);
                    }
                });
            }
        });

        //MongoClient.connect(url, function (err, db) {
        //    if (err) {
        //        console.log('Unable to connect to the mongoDB server. Error:', err);
        //    } else {
        //        //HURRAY!! We are connected. :)
        //        console.log('Connection established to', url);
        //
        //        // Get the documents collection
        //        var collection = db.collection('users');
        //
        //        //Create some users
        //       // var todo = new Users({name: 'Master NodeJS', completed: false, note: 'Getting there...'});
        //        var user1 = {name: name, username: username, email: email, password: password};
        //        var u = new user();
        //        console.log(u);
        //        u.save(function(err){
        //            console.log('hi');
        //            if(err){
        //                console.log(err);
        //            }
        //            else{
        //                res.send('ok');
        //                console.log(u);
        //            }
        //
        //        });
        //        /!*collection.find({email: email}).toArray(function (err, result) {
        //            if (err) {
        //                console.log(err);
        //            } else if (result.length) {
        //                console.log('Found:', result);
        //                res.render('register',{
        //                    'error_email': 'Email already exist.'
        //                });
        //            } else {
        //                console.log('No document(s) found with defined "find" criteria!');
        //                // Insert some users
        //                collection.insert([user1], function (err, result) {
        //                    if (err) {
        //                        console.log(err);
        //                    } else {
        //                        console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
        //                        res.render('register', {
        //                            'title': 'Successfully Registered user:',
        //                            'user': username,
        //                            'errors': {}
        //                        });
        //                    }
        //                });
        //            }
        //        });
        //        collection.find({name: name}).toArray(function (err, result) {
        //            if (err) {
        //                console.log(err);
        //            } else if (result.length) {
        //                console.log('Found:', result);
        //            } else {
        //                console.log('No document(s) found with defined "find" criteria!');
        //            }
        //        });*!/
        //    }
        //    //Close connection
        //    db.close();
        //});
    }
    else {   //Display errors to user
        console.log(util.inspect(errors, false, null));
        //var json = JSON.parse(errors);

                var erroros = errors[0]["msg"].toString();

                res.render("register", {
                    message: '',
                    errors: erroros
                });
       /!* for (var i = 0; i < errors.length; i++) {

            var erroros = errors[i]["msg"].toString();
            console.log(erroros);
        }

        res.render('register', {
            message: '',
            errors: erroros
        });*!/
        }

});*/
//app.all('/user/:id/:op?', user.load);
//app.get('/user/:id', user.view);
//app.get('/user/:id/view', user.view);
//app.get('/user/:id/edit', user.edit);
//app.put('/user/:id/edit', user.update);

// Posts

//app.get('/posts', post.list);

/* istanbul ignore next */

http.createServer(app).listen(app.get('port'), function(){
    console.log('Listting on port' + app.get('port'));
});
/*
if (!module.parent) {
    app.listen(3000);
    console.log('Express started on port 3000');
}*/
