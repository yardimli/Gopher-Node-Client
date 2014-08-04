var Globals = require("../project_modules/Globals.js");
var SocketIOHandle;
var FileManager = require('./FileManager.js');
var ProjectCollection = require('./ProjectCollection.js');

function getQuery(_requestUrl,_queryName){
	if(typeof(_queryName)=='undefined'){
		return undefined;
	}else{
		var urlObj = Globals.url.parse(_requestUrl,true);
		var queries = Object.keys(urlObj.query);
		var queryVals = [];
		for(var i=0; i<queries.length; i++){
			if(queries[i] == _queryName){
				var val = urlObj.query[queries[i]];
				if(typeof(val)=='string'){
					queryVals.push(val);
				}else if(val.length>1){
					queryVals = queryVal.contact(val);
				}
			}
		}
		if(queryVals.length==1){
			return queryVals[0];
		}else if (queryVals.length>1){
			return queryVals;
		}else{
			return undefined;
		}
	}
}

exports.getFile = function(request, response) {
  var fileMap = {
  	root:__dirname + '/../',
  	getCleanFileName: function(_requestUrl){
  		var urlObj = Globals.url.parse(_requestUrl);
  		if(urlObj.pathname !== ''){
  			var fileName = '';
		    var pathArr = urlObj.pathname.split('/');
		    fileName = pathArr[pathArr.length-1];
		    if(fileName.indexOf('.')==-1){
		     fileName = fileName + '.html';
		    }
		    return fileName;
  		}else{
  			return 'index.html';
  		}
  	},
  	getFilePath: function(_requestUrl){
  		var physicalDirName = Globals.path.dirname(_requestUrl);
  		if(physicalDirName !== '/'){
  			physicalDirName += '/';
  		}
  		return fileMap.root + physicalDirName + fileMap.getCleanFileName(_requestUrl);
  	},
  	getFileExtension: function(_requestUrl){
  		var dotArr = (fileMap.getCleanFileName(_requestUrl)).split('.');
  		if(dotArr.length>1 && dotArr[0]!==''){
  			return '.'+ (dotArr[dotArr.length-1]).toLowerCase();
  		}else if(dotArr.length==0 && datArr[0].indexOf('.')==-1){
  			return '.html';
  		}else{
  			return '';
  		}
  	},
  	getMimeType: function(_requestUrl){
  		return Globals.extensions[fileMap.getFileExtension(_requestUrl)];
  	}
  };
  console.log("===============================================================================");
  console.log("cleanFileName:" + fileMap.getCleanFileName(request.url));
  //console.log("filePath:"+fileMap.getFilePath(request.url));
  //console.log("fileExtension:"+fileMap.getFileExtension(request.url));
  //console.log("request url:" + request.url);
  //console.log(getQuery(request.url,'projectid'));
  
  //do we support the requested file type?
  if (!Globals.extensions[fileMap.getFileExtension(request.url)]) {
    //for now just send a 404 and a short message
    response.writeHead(404, {'Content-Type': 'text/html'});
    response.end("<html><head></head><body>The requested file type is not supported</body></html>");
  }
  //var filePath = localFolderAdmin + filePathName + fileName;
  var filePath = fileMap.getFilePath(request.url);
  //does the requested file exist?
  //console.log("ADMIN:" + filePath);
  Globals.fs.exists(filePath, function(exists) {
    //if it does...
    if (exists) {
      //read the fiule, run the anonymous function
      Globals.fs.readFile(filePath, function(err, contents) {
        if (!err) {
          //if there was no error
          //send the contents with the default 200/ok header
          response.writeHead(200, {
            "Content-type": fileMap.getMimeType(request.url),
            "Content-Length": contents.length
          });
          response.end(contents);
        } else {
          //for our own troubleshooting
          console.dir(err);
        }
        ;
      });
    } else {
      //if the requested file was not found
      //serve-up our custom 404 page
      Globals.fs.readFile(page404, function(err, contents) {
        //if there was no error
        if (!err) {
          //send the contents with a 404/not found header 
          response.writeHead(404, {'Content-Type': 'text/html'});
          response.end(contents);
        } else {
          //for our own troubleshooting
          console.dir(err);
        };
      });
    }
    ;
  });
};

function socketResponse(result) {
  var response = {};
  if(typeof(result) == 'object'){
	  if (result.errno > 0) {
	    response.success = false;
	    response.error = result;
	  } else {
	    response.success = true;
	    response.data = result;
	  }
  }else{
  	if(typeof(result) == 'undefined'){
  		response.success = false;
	  	response.data = '';
  	}else{
  		response.success = true;
	  	response.data = result;
	  }
  }
  return response;
}

exports.InitLocalSocket = function(socket) {
  SocketIOHandle = socket; // store socket so we can use it in the rest of the module
  socket.on('HiManager', function(data) {
    socket.emit('HiManagerClient', {text: "this is from Gopher Manager Server"});
  });

  socket.on('getItemsInDir', function(data) {
    //console.log('-------manager server:getItemsInDir-------');
    //console.log(data);
    var setSettings = new FileManager.finderPreferences();
    setSettings.root = data.target;
    setSettings.findSubFolders = false;
    setSettings.onlyFindFolders = false;
    
    FileManager.findFilesFoldersIn(setSettings,function(result){
	      //console.log('========manager server:getItemsInDir findFilesFoldersIn callback=================');
	      //console.log(result);
	      socket.emit('getItemsInDirClient', socketResponse(result));
    });
  });
  
  socket.on('_getFolders',function(data){
  	var settings = new FileManager.finderPreferences();
  	settings.root = data.target;
  	settings.findSubFolders = false;
  	settings.onlyFindFolders = true;
  	FileManager.findFilesFoldersIn(settings,function(result){
  		socket.emit('getFolders',socketResponse(result));
  	});
  });

  socket.on('_openProjectFolder', function(data) {
  	var setSettings = new FileManager.finderPreferences();
    setSettings.root = data.target;
    setSettings.findSubFolders = true;
    setSettings.onlyFindFolders = false;
    
    FileManager.findFilesFoldersIn(setSettings,function(result){
	      socket.emit('openProjectFolder', socketResponse(result));
    });
  });
  
  socket.on('_createANewProject',function(data){
  	ProjectCollection.addNewProject(data,function(result){
  		socket.emit('createANewProject',socketResponse(result));
  	});
  });
  
  socket.on('_findAProject',function(data){
  	console.log('findAProject'+data.id);
  	ProjectCollection.findAProject(data.id,function(result){
  		socket.emit('findAProject',socketResponse(result));
  	});
  });
  
  socket.on('_getQuery',function(data){
  	socket.emit('getQuery',socketResponse(getQuery(data.url,data.queryName)));
  });
};


