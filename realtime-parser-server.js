var Globals = require("./project_modules/Globals.js"); 
var AdminServer = require("./project_modules/AdminServer.js"); 
var ClientServer = require("./project_modules/ClientServer.js"); 


// handle contains locations to browse to (vote and poll); pathnames.
//function startServer(route,handle,debug)
function startServer(debug)
{
	// on request event
	function onRequest(request, response) 
	{
		if (request.url.search("/admin/")!=-1)
		{
			AdminServer.getFileAdmin( request, response );
		} else
		{
			ClientServer.getFile( request, response );
		}
	}
	
	Globals.httpServer = Globals.http.createServer(onRequest).listen(1337, function(){
		console.log("Listening at: http://localhost:1337");
		console.log("Server is up");
	}); 
	
	initSocketIO(Globals.httpServer,debug);
}

function initSocketIO(httpServer,debug)
{
	Globals.socketServer = Globals.socketio.listen(httpServer);

	if(debug == false){
		Globals.socketServer.set('log level', 1); // socket IO debug off
	}
	
	Globals.socketServer.on('connection', function (socket) {
		Globals.socketVar = socket;
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
