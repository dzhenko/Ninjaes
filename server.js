var express = require('express'),
    stylus = require('stylus'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');

//var env = process.env.NODE_ENV || 'development';
var portNumber = 9999;

var app = express();

// sets the default view engine
app.set('view engine', 'jade');

// sets the default folder for views
app.set('views', __dirname + '/server/views');

//
app.use(bodyParser());

// configures stylus to look and parse only css that is in public folder
app.use(stylus.middleware(
    {
        src: __dirname + '/public',
        compile: function(str, path) {
            return stylus(str).set('filename', path);
        }
    }
));

// tells server where to look for resources required by requests
// if someone requests css/app.css - the server will look in the %dirname%/public and then for css/app.css
app.use(express.static(__dirname + '/public'));

mongoose.connect('');
var db = mongoose.connection();

db.once('open', function(err){
    if (err) {
        console.log('Db error ' + err);
    }

    console.log('Db up and running');
});

db.on('error', function(err) {
    console.log('Db could not be opened' + err);
});

var messageSchema = mongoose.Schema({
    text : String
});

var Message = mongoose.model('Message', messageSchema);

Message.create({text : 'Hello'}).then(function(err, msg) {
    if (err) {
        console.log('Message could not be created ' + err);
    }

    console.log('Message created ' + msg);
});

// return the proper partial requested - look for it in the server/partials folder
app.get('/partials/:partialArea/:partialName', function (req, res) {
    res.render(__dirname + '/public/app/' + req.params.partialArea+ '/' + req.params.partialName);
});

// returns index.html to every request
app.get('*', function(req, res) {
    res.render('index'); // looks for it in server / views as set above
});

app.listen(9999);
console.log('Server running on port: ' + portNumber);