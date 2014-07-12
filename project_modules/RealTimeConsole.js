var Globals = require("../project_modules/Globals.js"); 

var SocketIOHandle;


this.getFile = function(request, response){
	
	var	localFolder = __dirname + '/..';
	
	localFolder = localFolder.replace(/\\/g,'/');
	
	var	page404 = localFolder + '/admin/404.html';
	
	var fileName = request.url;
	if ((request.url=="/admin") || (request.url=="/admin/")) { 
		fileName = '/admin/index.html'; 
	}
	
	
	var	ext = Globals.path.extname(fileName);
	var mimeType = Globals.extensions[ext];

	//do we support the requested file type?
	if(!Globals.extensions[ext]){
		//for now just send a 404 and a short message
		response.writeHead(404, {'Content-Type': 'text/html'});
		response.end("<html><head></head><body>The requested file type is not supported</body></html>");
	};
	
	
	var filePath = localFolder+fileName;

	//console.log("file:"+fileName+" url:"+request.url+" ext:"+ext+" filePath:"+filePath);
	
	//does the requested file exist?
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

	// console.log("Call binding Real Time Console socket");

	SocketIOHandle = socket; // store socket so we can use it in the rest of the module
	
	socket.on('HiAdmin', function(data) {
		console.log("HiAdmin called from client: "+socket.id);
		
		Globals.socketServer.sockets.in("room1").emit('HiAdminClient', { text:"this is from Gopher Admin Server"});
	});

	socket.on('Gopher.Tell', function(data) {
//		console.log(data);
		Globals.socketServer.sockets.in("room1").emit('ConsoleTell', { text:"L:"+data.CodeLine+" C:"+data.GopherCallerID +": "+data.GopherMsg+", <b>parent:</b>"+data.ParentID });
	});

	socket.on('Gopher.VarDecl', function(data) {
//		console.log(data);
		Globals.socketServer.sockets.in("room1").emit('ConsoleTell', { text:"L:"+data.CodeLine+" C:"+data.GopherCallerID +": <b>Var "+ data.VarName+"</b> set to <b>"+data.VarValue+"</b>, ("+data.VarStr+") <b>parent:</b>"+data.ParentID });
	});	
	
	socket.on('Gopher.GopherAssignment', function(data) {
//		console.log(data);
		Globals.socketServer.sockets.in("room1").emit('ConsoleTell', { text:"L:"+data.CodeLine+" C:"+data.GopherCallerID +": <b>Assignment("+ data.VarOperator +") "+ data.VarName+"</b> set to <b>"+data.VarValue+"</b>, ("+data.VarStr+") <b>parent:</b>"+data.ParentID });
	});	
}
