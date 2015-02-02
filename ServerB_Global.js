var sqlite3 = require('sqlite3');
var dbPath = 'ManagerDB.db';
var fs = require('fs');


exports.dbConn = function (callBack) {
    fs.exists(dbPath, function (exists) {
        if (exists) {
            return callBack(null,new sqlite3.Database(dbPath));
        } else {
            return callBack('Database does not exist.',null);
        }
    });
};

exports.Servers = [];

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
    ".ttf":"application/x-font-woff",
    ".eot":"application/x-font-eot"
};

exports.ignoredByDefault = ['jquery.','jquery-','jquery-ui','bootstrap.min.js','bootstrap.js'];

exports.GopherHelperFile = 'GopherBInsert.js';
