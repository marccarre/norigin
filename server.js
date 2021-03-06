/*global require, process, module, console*/
/*jshint node: true*/
'use strict';
var express = require('express');
var url     = require('url');
var uuid    = require('uuid');
var request = require('request');

function send(id, callback, resp, statusCode, body) {
    if (callback === undefined) {
        resp.status(statusCode).json(body);
    } else {
        resp.status(statusCode).jsonp(body);
    }
    if (statusCode === 200) {
        console.log('[' + id + '] Response: ' + statusCode + ' - Content-Type: ' + resp.get('Content-Type') + ' - ' + body.length + ' bytes.');
    } else {
        console.log('[' + id + '] Response: ' + statusCode + ' - Content: "' + body + '"');
    }
}

var app = express();
app.get('/', function (req, resp) {
    var id = req.ip + '/' + uuid.v1().substring(0, 8),
        query = url.parse(req.url, true).query;
    console.log('[' + id + '] Request: ' + JSON.stringify(query));

    if (query.url === undefined) {
        send(id, query.callback, resp, 400, 'Please provide a valid URL.');
    } else {
        request.get(query.url)
            .on('response', function (response) {
                var buffer = '';
                response.on('data', function (chunk) {
                    buffer += chunk;
                });
                response.on('end', function () {
                    send(id, query.callback, resp, response.statusCode, buffer);
                });
            })
            .on('error', function (error) {
                send(id, query.callback, resp, 500, error);
            });
    }
});

var port = process.env.PORT || 1337;
app.listen(port, function () {
    console.log('Listening on port ' + port);
});

module.exports = {
    app:  app,
    port: port
};
