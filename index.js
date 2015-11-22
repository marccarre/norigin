var express = require('express');
var url     = require('url');
var uuid    = require('node-uuid');
var http    = require('http');
var https   = require('https');

http_get = function(url, id, success, error) {
  var client = url.startsWith('https') ? https : http;
  client.get(url, function(response) {
    console.log('[' + id + '] Received a HTTP ' + response.statusCode + '.');
    var count = 0;
    var data = '';
    response.on('data', function(chunk) {
      count += 1;
      data += chunk;
    });
    response.on('end', function() {
      console.log('[' + id + '] Received ' + data.length + ' bytes in ' + count + ' chunks.');
      success(data);
    });
  }).on('error', error);
};

var app = express();
app.get('/', function(request, response) {
  var id = uuid.v1();
  var query = url.parse(request.url, true).query;
  console.log('[' + id + '] ' + request.ip + ' requested ' + query.url);
  if (query.url === undefined) {
    var message = 'Please provide a valid URL.';
    response.status(400).type('application/json').send(message);
    console.log('[' + id + '] Replied with a HTTP 400: ' + message);
  } else {
    http_get(query.url, id, function(data) {
      if (query.callback !== undefined) {
        response.status(200).jsonp({'contents': data});
      } else {
        response.status(200).json({'contents': data});
      }
      console.log('[' + id + '] Replied with a HTTP 200 of "Content-Type": ' + response.get('Content-Type') + '.');
    }, function(e) {
      response.status(500).type('application/json').send(e.message);
      console.log('[' + id + '] Replied with a HTTP 500: ' + e.message);
    });
  }
});

var port = process.env.PORT || 1337;
app.listen(port, function() {
  console.log("Listening on port " + port);
});
