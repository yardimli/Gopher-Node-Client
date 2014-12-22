exports.QueryString = require('querystring');

var sqlite3 = exports.sqlite3 = require('sqlite3');
var fs = exports.fs = require('fs');
var net = exports.net = require('net');

exports.http = require('http');
exports.url = require('url');
exports.path = require('path');
exports.gopherManagerRoot = 'manager';
exports.extensions = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "application/javascript",
    ".png": "image/png",
    ".gif": "image/gif",
    ".jpg": "image/jpeg",
    ".do": "application/javascript",
    ".woff":"application/x-font-woff",
    ".ttf":"application/x-font-woff"
};

exports.ignoredByDefault = ['jquery.','jquery-','jquery-ui','bootstrap.min.js','bootstrap.js'];

var dbPath = '/Gopher/ManagerDB.db';

var dbConn = exports.dbConn = function (callBack) {
    fs.exists(dbPath, function (exists) {
        if (exists) {
            return callBack(null,new sqlite3.Database(dbPath));
        } else {
            return callBack('Database does not exist.',null);
        }
    });
};

var Servers = exports.Servers = [];
/*fs.exists(dbPath, function (exists) {
    if (exists) {
        exports.db = new sqlite3.Database(dbPath);
    } else {
        console.log('database does not exist.');
    }
});*/
