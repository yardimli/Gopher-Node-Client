var fs = require('fs');
var http = require('http');
var socketio = require('socket.io');
var url = require("url");
var path = require('path');

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
	function onRequest(request, response) {

		// parse the requested url into pathname. pathname will be compared
		// in route.js to handle (var content), if it matches the a page will 
		// come up. Otherwise a 404 will be given. 
		/*
		var pathname = url.parse(request.url).pathname; 
		console.log("Request for " + pathname + " received");
		var content = route(handle,pathname,response,request,debug);
		*/
	  
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
 
		//call our helper function
		//pass in the path to the file we want,
		//the response object, and the 404 page path
		//in case the requestd file is not found
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


//			socket.emit('CardResponse',{CardNumber:InputCardNumber,OpStatus:"release",LockerID:i}); 



function closelocker(data)
{			
	console.log(data);
}

function initSocketIO(httpServer,debug)
{
	socketServer = socketio.listen(httpServer);

	if(debug == false){
		socketServer.set('log level', 1); // socket IO debug off
	}
	
	socketServer.on('connection', function (socket) {
		console.log("user connected");
		socket.emit('onconnection', {pollOneValue:sendData});
		
		socketServer.on('update', function(data) {
			socket.emit('updateData',{pollOneValue:data});
		});
    });
}


var debug = false;

startServer(debug);
