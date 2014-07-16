var Globals = require("../project_modules/Globals.js");

var SocketIOHandle;
var	localFolder = __dirname + '/../liveparser-root';
localFolder = localFolder.replace(/\\/g,'/');
var	page404 = localFolder + '/404.html';

//----------------------------------------------------------------------------------------
//helper function handles file verification for the client files that will be converted
this.getFile = function(request, response)
{
	var fileName = request.url;
	if ((request.url=="") || (request.url=="/")) { fileName = '/index.html'; }
	
	var	ext = Globals.path.extname(fileName);
	var mimeType = Globals.extensions[ext];
	
	if(!Globals.extensions[ext]){ //do we support the requested file type?
		//for now just send a 404 and a short message
		response.writeHead(404, {'Content-Type': 'text/html'});
		response.end("<html><head></head><body>The requested file type is not supported</body></html>");
	};

	var filePath = localFolder+fileName;
//	console.log("file:"+fileName+" url:"+request.url+" ext:"+ext+" filePath:"+filePath);

	Globals.fs.exists(filePath,function(exists)
	{
		//if it does...
		if(exists){
			Globals.fs.readFile(filePath,function(err,contents){
				if(!err){
					if ( (mimeType=="application/javascript") && 
							 (filePath.indexOf("jquery")==-1) ) //if javascript file try parsing it
					{
						//if it is gopher converted file load the original for source viewer
						if (filePath.indexOf("-gopher.js")>=0)
						{
							Globals.fs.readFile(filePath.replace("-gopher.js","-gopher.html"),function(err,contents)
							{
								Globals.socketServer.sockets.in("room1").emit('UpdateTreeView',{	htmlcode:'<div class="tree" style="width:1200px">'+contents+'</div>' });
							});	

							Globals.fs.readFile(filePath.replace("-gopher.js",".js"),function(err,contents)
							{
								//use https://github.com/balupton/jquery-syntaxhighlighter for highlighting
								Globals.socketServer.sockets.in("room1").emit('UpdateSourceView',{	sourcecode:'<pre class="language-javascript">'+contents+'</pre>' });
							});
						
						} else
						{
							//use https://github.com/balupton/jquery-syntaxhighlighter for highlighting
							Globals.socketServer.sockets.in("room1").emit('UpdateSourceView',{	sourcecode:'<pre class="language-javascript">'+contents+'</pre>' });
						}
							
						response.writeHead(200,{ "Content-type" : mimeType, "Content-Length" : contents.length });
						response.end(contents);
					}	else
					{
						response.writeHead(200,{ "Content-type" : mimeType, "Content-Length" : contents.length });
						response.end(contents);
					}
				} else {
					//for our own troubleshooting
					console.dir(err);
				}
			});
		} else 
		{
			//if the requested file was not found serve-up our custom 404 page
			Globals.fs.readFile(page404,function(err,contents){
				if(!err){
						response.writeHead(404, {'Content-Type': 'text/html'});
						response.end(contents);
				} else {
						//for our own troubleshooting
						console.dir(err);
				};
			});
		}
	});
}


//----------------------------------------------------------------------------------------
this.InitLocalSocket = function(socket){

//	console.log("Call binding Client Server socket");

	SocketIOHandle = socket; // store socket so we can use it in the rest of the module

	socket.on('HiClientServer', function(data) {
		console.log("HiClientServer called from client: "+socket.id);

		Globals.socketServer.sockets.in("room1").emit('HiClient', { text:"this is from Gopher Client Server"});
	});
		

}
