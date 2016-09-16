//users_controller.js
var express = require('express');
var crypto = require("crypto");
var router = express.Router();
var session = require('express-session');
var app = express();
var  expressValidator = require('express-validator');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
//app.set('trust proxy', 1); // trust first proxy
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
var user = require("../models/users.js");
var UserModel = new user();
exports.register = function(req, res) {

    if(req.method.toLowerCase() != "post") {
        if(!req.session.email) {
            res.render('register', {
                'error_email': '',
                'errors' : ''
            });
        }
        else {
            res.redirect('/dashboard');
        }
    }
    else {
        var password = req.body.password;
        var name = req.body.name;
        var email = req.body.email;
        var username = req.body.username;
        var confirm_pass = req.body.password_confirm;
        //Validate
        req.checkBody("name", 'Name is required').notEmpty();           //Validate name
        req.checkBody("username", 'User Name is required').notEmpty();           //Validate name
        req.checkBody("email", 'A valid email is required').isEmail();  //Validate email
        req.checkBody("password", 'Password is required').notEmpty();  //Validate email
        req.checkBody(
            "password_confirm",
            "Password does not matches.").matches(password);
        var errors = req.validationErrors();
        console.log(errors);
        if( !errors) { //No errors were found.  Passed Validation!
            user.findOne({email: email}, function(err, result) {
                if(err) console.log(err);

                if(result == null) {
                    new user(req.body).save();
                    res.render('login', {
                        'title': 'Successfully Registered.',
                        'user': ''
                    });
                    return res.redirect('/login');
                }
                else {
                    res.render('register', {
                        'error_email': 'Email Already Registered try other one'
                    });
                }
            });
        }
        else { //Display errors to user
           // console.log(util.inspect(errors, false, null));
            //var json = JSON.parse(errors);

            //var erroros = errors[0]["msg"].toString();
            //console.log(erroros);
            res.render("register", {
                message: '',
                errors: errors
            });
        /*for (var i = 0; i < errors.length; i++) {

                var erroros = errors[i]["msg"].toString();
                console.log(erroros);
            }

            res.render('register', {
                message: '',
                errors: erroros
            });*/

        }
    }

};

exports.login = function(req, res) {

    if(req.method.toLowerCase() != "post") {
        if(!req.session.email) {
            res.render("login.html", {layout: false});
        }
        else {
            res.redirect('/dashboard');
        }
    }
    else {
        user.findOne({email: req.body.username}, function(err, result) {
            if(err) console.log(err);

            if(result == null) {
                res.render('login', {
                    'invalid_email' : 'Invalid Email or and Password.'
                });
            }
            else {
                auth(result);
            }
        });

        function auth( userRes ) {
            //console.log(userRes.password);
            if(UserModel.encrypt(req.body.password) != userRes.password) {
                res.render('login',
                    {
                        'invalid_email' : 'Invalid Email or and Password.'
                    });
            } else {
                var sess = req.session;
                sess.email=userRes.username;
                req.session.save();
                user.update({_id : userRes._id}, {'$set' : {token : Date.now}});
                if(userRes){
                    "use strict";
                    res.render('dashboard',{
                        'username' : sess.email
                    });
                }
            }
        }
    }
};

exports.dashboard=function (req, res) {
    console.log(req.session.email);
    if(req.session.email){
        res.render('dashboard',{
            'username': req.session.email
        });
    }
    else {
        res.redirect('/login');
    }

};

exports.logout=function (req, res) {
    console.log(req.session.email);
    if(req.session.destroy()){

        res.redirect('/login');
    }
    else {
        res.render('dashboard',{
            'username': req.session.email
        });
    }

};