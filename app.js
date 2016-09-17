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
    , OAuthStrategy = require('passport-oauth').OAuthStrategy,
    FacebookStrategy  =     require('passport-facebook').Strategy;
var config  =     require('./config/config');
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
var routes = require('./routes');
// Use connect method to connect to the Server
module.exports = app;
passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(obj, done) {
    done(null, obj);
});
// Config
app.set('port', process.env.PORT || 3000);
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

passport.use(new FacebookStrategy({
        clientID: config.facebook_api_key,
        clientSecret:config.facebook_api_secret ,
        callbackURL: config.callback_url
    },
    function(accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
            //Check whether the User exists or not using profile.id
            //Further DB code.
            return done(null, profile);
        });
    }
));
//passport.use('provider', new OAuthStrategy({
//        requestTokenURL: 'https://www.facebook.com/oauth/?response_type=code&client_id=1703946223264507&redirect_uri=CALLBACK_URL&scope=read',
//        accessTokenURL: 'https://www.facebook.com/oauth/access_token',
//        userAuthorizationURL: 'https://www.facebook.com/oauth/authorize',
//        consumerKey: '123-456-789',
//        consumerSecret: 'shhh-its-a-secret',
//        callbackURL: 'http://localhost:3000/dashboard'
//    },
//    function(token, tokenSecret, profile, done) {
//        users.findOrCreate(function(err, user) {
//            done(err, user);
//        });
//    }
//));


app.use(function(err, req, res, next) {
    if (app.get('env') === 'development') {
        return errorhandler(err, req, res, next);
    } else {
        res.sendStatus(401);
    }
});

// User
app.use(bodyParser.urlencoded({ extended: true }));

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

app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect : '/dashboard',
        failureRedirect: '/login'
    }),
    function(req, res) {
        res.redirect('/');
    });
app.post('/register', users.register);
app.post('/login', users.login);
//app.all('/user/:id/:op?', user.load);
//app.get('/user/:id', user.view);
//app.get('/user/:id/view', user.view);
//app.get('/user/:id/edit', user.edit);
//app.put('/user/:id/edit', user.update);


http.createServer(app).listen(app.get('port'), function(){
    console.log('Listting on port' + app.get('port'));
});