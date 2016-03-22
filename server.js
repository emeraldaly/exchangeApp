var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var logger = require('morgan');

var app = express();
var db = 'mongodb://localhost/exchangeSite';

var PORT = process.env.PORT || 9000;

mongoose.connect(db)

app.use(logger('dev'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

var route = require('./routes/routes.js');

route.routes(app);

app.listen(PORT, function() {
  console.log("listening on port", PORT);
});