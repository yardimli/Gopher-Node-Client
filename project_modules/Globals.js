exports.fs = require('fs');
exports.http = require('http');
exports.socketio = require('socket.io');
exports.url = require("url");
exports.path = require('path');
exports.acorn = require("../acorn/acorn.js"); 


//these are the only file types we will support for now
exports.extensions = {
    ".html" : "text/html",
    ".css" : "text/css",
    ".js" : "application/javascript",
    ".png" : "image/png",
    ".gif" : "image/gif",
    ".jpg" : "image/jpeg"
};

exports.socketServer;
exports.httpServer;
