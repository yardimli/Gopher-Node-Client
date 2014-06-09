var Globals = require("../project_modules/Globals.js"); 
var	localFolder = __dirname + '/../liveparser-root';
var	page404 = localFolder + '/404.html';


//helper function handles file verification for the client files that will be converted
this.getFile = function(request, response)
{
	// (localFolder + filePathName + fileName),response,page404,Globals.extensions[ext]);	  	
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

	var filePath = localFolder+filePathName+fileName;

	
	console.log(filePath);
	Globals.fs.exists(filePath,function(exists)
	{
		//if it does...
		if(exists){
			//read the fiule, run the anonymous function
			Globals.fs.readFile(filePath,function(err,contents){
				if(!err){
					//if javascript file try parsing it
					if ( (mimeType=="application/javascript") && (filePath.indexOf("jquery")==-1) )
					{
						var options = {};
						options.locations = true; 
						var compact = false;

						parsed = Globals.acorn.parse(contents, options); 	
						//console.log(JSON.stringify(parsed, null, compact ? null : 2));
						Globals.fs.writeFile(filePath+".gopher",JSON.stringify(parsed, null, compact ? null : 2));
						Globals.fs.writeFile(filePath+".gopher.pure",JSON.stringify(parsed));
						if (Globals.socketVar!=0) { 
							Globals.socketVar.emit('ParsedGopher',{
								filename:filePath,
								jsondata:JSON.stringify(parsed, null, compact ? null : 2) 
							});
						}
					}	

					response.writeHead(200,{
							"Content-type" : mimeType,
							"Content-Length" : contents.length
					});
					response.end(contents);
				} else {
					//for our own troubleshooting
					console.dir(err);
				}
			});
		} else 
		{
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
		}
	});
}