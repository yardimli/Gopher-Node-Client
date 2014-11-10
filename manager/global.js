exports.QueryString = require('querystring');

var sqlite3 = exports.sqlite3 = require('sqlite3');
var fs = exports.fs = require('fs');

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
    ".do": "----"
};

var dbPath = exports.dbPath = '/Gopher/ManagerDB.db';
/*exports.connectDB = function(callBack){
    fs.exists(dbPath, function (exists) {
        if (exists) {
            return callBack(new sqlite3.Database(dbPath));
        } else {
            console.log('database does not exist.');
        }
    });
};*/
/*fs.exists(dbPath, function (exists) {
    if (exists) {
        exports.db = new sqlite3.Database(dbPath);
    } else {
        console.log('database does not exist.');
    }
});*/
