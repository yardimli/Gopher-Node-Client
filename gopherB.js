var Globals = require("./project_modules/Globals.js"); 
var RealTimeConsole = require("./project_modules/RealTimeConsole.js"); 
var ProjectManegerServer = require("./project_modules/ProjectManagerServer.js"); 
var ClientServer = require("./project_modules/ClientServer.js"); 

// handle contains locations to browse to (vote and poll); pathnames.
//function startServer(route,handle,debug)
function startServer(debug)
{
	// on request event
	function onRequest(request, response) 
	{
		if (request.url.search("/admin/manager/")!=-1)
		{
			ProjectManegerServer.getFile( request, response );
		} else
		if (request.url.search("/admin/")!=-1)
		{
			RealTimeConsole.getFile( request, response );
		} else
		{
			ClientServer.getFile( request, response );
		}
	}
	
	Globals.httpServer = Globals.http.createServer(onRequest).listen(1337, function(){
		console.log("Listening at: http://localhost:1337 - Server is up");
	}); 
	
	initSocketIO(Globals.httpServer,debug);
}

function initSocketIO(httpServer,debug)
{
	Globals.socketServer = Globals.socketio.listen(httpServer);

	if(debug == false){
//		Globals.socketServer.set('log level', 1); // socket IO debug off
	}

	Globals.socketServer.sockets.on('connection', function (socket) {
		console.log("          user connected to gopherB: "+socket.id);

		socket.on('HiGopherB', function(data) {
			console.log(socket.id+" joins 'room1'");
			socket.join('room1');
		});

	
		ProjectManegerServer.InitLocalSocket(socket);
		RealTimeConsole.InitLocalSocket(socket);
		ClientServer.InitLocalSocket(socket);
	});


	
	
	/*
	socket.on('hellogopher', function(data) {
		console.log("hello gopher "+data);
		socket.emit('hiGopher',{text:"this is from Gopher Server"});
	});
	*/
}

var debug = false;

startServer(debug);