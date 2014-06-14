var Globals = require("../project_modules/Globals.js"); 

var SocketIOHandle;


this.getFile = function(request, response){

	var	localFolderAdmin = __dirname + '/../';
	var	page404 = localFolderAdmin + 'admin/manager/404.html';
	
	var fileName = Globals.path.basename(request.url) || 'index.html';
	var	ext = Globals.path.extname(fileName);
	var mimeType = Globals.extensions[ext];
	var filePathName = Globals.path.dirname(request.url);
	if (filePathName=="/") { } else { filePathName+="/";}

	console.log("path:"+filePathName+" file:"+fileName+" url:"+request.url+" ext:"+ext+" ");
	console.log("url:"+request.url);

	//do we support the requested file type?
	if(!Globals.extensions[ext]){
		//for now just send a 404 and a short message
		response.writeHead(404, {'Content-Type': 'text/html'});
		response.end("<html><head></head><body>The requested file type is not supported</body></html>");
	};
	
	
	var filePath = localFolderAdmin+filePathName+fileName;
	
	//does the requested file exist?
	console.log("ADMIN:"+filePath);
    Globals.fs.exists(filePath,function(exists){
        //if it does...
        if(exists){
            //read the fiule, run the anonymous function
            Globals.fs.readFile(filePath,function(err,contents){
                if(!err){
                    //if there was no error
                    //send the contents with the default 200/ok header
                    response.writeHead(200,{
                        "Content-type" : mimeType,
                        "Content-Length" : contents.length
                    });
                    response.end(contents);
                } else {
                    //for our own troubleshooting
                    console.dir(err);
                };
            });
        } else {
            //if the requested file was not found
            //serve-up our custom 404 page
            Globals.fs.readFile(page404,function(err,contents){
                //if there was no error
                if(!err){
                    //send the contents with a 404/not found header 
                    response.writeHead(404, {'Content-Type': 'text/html'});
                    response.end(contents);
                } else {
                    //for our own troubleshooting
                    console.dir(err);
                };
            });
        };
    });
};

this.InitLocalSocket = function(socket){
	
	SocketIOHandle = socket; // store socket so we can use it in the rest of the module
	
	socket.on('HiManager', function(data) {
		socket.emit('HiManagerClient', { text:"this is from Gopher Manager Server"});
	});

}
