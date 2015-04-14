var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect('mongodb://192.168.1.52/test');


var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');

var url = 'mongodb://192.168.1.52:27017/test';
// Use connect method to connect to the Server
MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");

    findDocuments(db, function () {
        db.close();
    });
});

var findDocuments = function (db, callback) {
    // Get the documents collection
    var collection = db.collection('colombia_format_3');
    // Find some documents
    collection.find({'properties.DEPNAME': 'Antioquia'}, {
        _id: 0,
        properties: 1,
        geometry: 1
    }).toArray(function (err, docs) {
        assert.equal(err, null);
        console.log("Found the following records");
        callback(docs);
    });
};

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/bower", express.static(__dirname + '/bower_components'));

app.use('/', routes);
app.use('/users', users);


app.get('/collection/antioquia/names', function (req, res) {
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        console.log("Connected correctly to server");
        var findDocuments = function (db, callback) {
            // Get the documents collection
            var collection = db.collection('colombia_format_3');
            // Find some documents
            collection.find({'properties.DEPNAME': 'Antioquia'}, {
                _id: 1,
                properties: 1
            }).toArray(function (err, docs) {
                assert.equal(err, null);
                console.log("Found the following records");
                res.json(docs);
            });
        };
        findDocuments(db, function () {
            db.close();
        });

    });
});
app.get('/collection/antioquia', function (req, res) {
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        console.log("Connected correctly to server");
        var findDocuments = function (db, callback) {
            // Get the documents collection
            var collection = db.collection('colombia_format_3');
            // Find some documents
            collection.find({'properties.DEPNAME': 'Antioquia'}, {
                _id: 0,
                properties: 1,
                geometry: 1,
                type: 1
            }).toArray(function (err, docs) {
                assert.equal(err, null);
                console.log("Found the following records");
                var Docs ={
                    "type": "FeatureCollection", "features": []
                };
                Docs.features = docs;
                res.send(Docs);
            });
        };
        findDocuments(db, function () {
            db.close();
        });

    });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
