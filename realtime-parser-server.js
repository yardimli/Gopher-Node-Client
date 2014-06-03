var fs = require('fs');
var http = require('http');
var socketio = require('socket.io');
var url = require("url");
var path = require('path');

var acorn = require("./acorn/acorn.js"); 

var socketServer;
var sendData = "";

//these are the only file types we will support for now
var extensions = {
    ".html" : "text/html",
    ".css" : "text/css",
    ".js" : "application/javascript",
    ".png" : "image/png",
    ".gif" : "image/gif",
    ".jpg" : "image/jpeg"
};

//helper function handles file verification
function getFile(filePath,res,page404,mimeType){
    //does the requested file exist?
	console.log(filePath);
    fs.exists(filePath,function(exists){
        //if it does...
        if(exists){
            //read the fiule, run the anonymous function
            fs.readFile(filePath,function(err,contents){
                if(!err){
					
					var options = {};
					options.locations = true; 
					
					parsed = acorn.parse(contents, options); 	
					
					console.log(parsed);
					
                    //if there was no error
                    //send the contents with the default 200/ok header
                    res.writeHead(200,{
                        "Content-type" : mimeType,
                        "Content-Length" : contents.length
                    });
                    res.end(contents);
                } else {
                    //for our own troubleshooting
                    console.dir(err);
                };
            });
        } else {
            //if the requested file was not found
            //serve-up our custom 404 page
            fs.readFile(page404,function(err,contents){
                //if there was no error
                if(!err){
                    //send the contents with a 404/not found header 
                    res.writeHead(404, {'Content-Type': 'text/html'});
                    res.end(contents);
                } else {
                    //for our own troubleshooting
                    console.dir(err);
                };
            });
        };
    });
};
 

// handle contains locations to browse to (vote and poll); pathnames.
//function startServer(route,handle,debug)
function startServer(debug)
{
	// on request event
	function onRequest(request, response) 
	{
		var fileName = path.basename(request.url) || 'index.html';
		var	ext = path.extname(fileName);
		var	localFolder = __dirname + '/public';
		var	page404 = localFolder + '/404.html';
		var filePathName = path.dirname(request.url);
		if (filePathName=="/") { } else { filePathName+="/";}
			
		//console.log("path:"+filePathName+" file:"+fileName+" url:"+request.url+" ext:"+ext+" ");
		console.log("url:"+request.url);
	 
		//do we support the requested file type?
		if(!extensions[ext]){
			//for now just send a 404 and a short message
			response.writeHead(404, {'Content-Type': 'text/html'});
			response.end("<html><head></head><body>The requested file type is not supported</body></html>");
		};
 
		getFile((localFolder + filePathName + fileName),response,page404,extensions[ext]);	  
	}
	
	var httpServer = http.createServer(onRequest).listen(1337, function(){
		console.log("Listening at: http://localhost:1337");
		console.log("Server is up");
	}); 
	
	initSocketIO(httpServer,debug);

	//launch chrome -- commented while developing
	//var childProcess = require('child_process'); 
	//childProcess.exec('start chrome http://localhost:1337 --user-data-dir=c:\tempchrome --kiosk');
}

function initSocketIO(httpServer,debug)
{
	socketServer = socketio.listen(httpServer);

	if(debug == false){
		socketServer.set('log level', 1); // socket IO debug off
	}
	
	socketServer.on('connection', function (socket) {
		console.log("user connected");
		socket.emit('onconnection', {version:"0.1 alfa"});
		
		socket.on('hellogopher', function(data) {
			console.log("hello gopher "+data);
			socket.emit('hiGopher',{text:"this is from Gopher Server"});
		});
	});
}

var debug = false;

startServer(debug);
