var express = require('express');
var path = require('path');
var util = require('util');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var multiplayer = require('./multiplayer');
var X = require('./../src/x').X;

app.set('views', __dirname + '/../views');
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, '..')));

app.get('/', function (req, res) { res.render('index'); });

var server = http.listen(8000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Running game at http://%s:%s', host, port)
});

var gameState = {};

new multiplayer.MultiplayerServer(io,  X.update);
