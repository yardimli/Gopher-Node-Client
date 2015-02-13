var fs = require('fs');
var http = require('http');
var url = require('url');
var path = require('path');
var queryString = require('querystring');

var Global = require('./ServerB_Global.js');
var FileManager = require('./ServerB_FileManager.js');
var portManager = require('./ServerB_PortManager.js');
var ajaxProcessor = require('./ServerB_ProcessAjax.js');

var enableDestroy = require('./ServerB_DestroyHelper.js');


var StringDecoder = require('string_decoder').StringDecoder;
var decoder = new StringDecoder('utf8');
var xxxx = '';
var requestMarker = 0;



var ServerB = http.createServer(onRequest).listen(1337, function (err) {
    Global.Servers.push(ServerB);

});

var FileMap = {
    root: __dirname+'/',
    getCleanFileName: function (_requestUrl) {
        var UrlObj = url.parse(_requestUrl);
        if (UrlObj.pathname !== '') {
            var FileName = '';
            var PathArr = UrlObj.pathname.split('/');
            FileName = PathArr[PathArr.length - 1];
            if (FileName.indexOf('.') === -1) {
                FileName = FileName + '.html';
            }
            return FileName;
        } else {
            return 'index.html';
        }
    },
    getFilePath: function (_requestUrl) {
        var PhysicalDirName = path.dirname(_requestUrl);
        if (PhysicalDirName !== '/') {
            PhysicalDirName += '/';
        }
        return FileMap.root + PhysicalDirName + FileMap.getCleanFileName(_requestUrl);
    },
    getFileExtension: function (_requestUrl) {
        var DotArr = (FileMap.getCleanFileName(_requestUrl)).split('.');
        if (DotArr.length > 1 && DotArr[0] !== '') {
            return '.' + (DotArr[DotArr.length - 1]).toLowerCase();
        } else if (DotArr.length === 0 && DotArr[0].indexOf('.') === -1) {
            return '.html';
        } else {
            return '';
        }
    },
    getMimeType: function (_requestUrl) {
        return Global.extensions[FileMap.getFileExtension(_requestUrl)];
    }
};

function onRequest(request, response) {
    var RequestUrl = request.url;

    if (RequestUrl === '/' || RequestUrl === '/' + Global.gopherManagerRoot || RequestUrl === '/' + Global.gopherManagerRoot + '/') {
        RequestUrl = '/manager/index.html';
    } else if (RequestUrl.search('/' + Global.gopherManagerRoot) === -1) {
        RequestUrl = '/' + Global.gopherManagerRoot + '/' + RequestUrl;
    }

    if (RequestUrl.indexOf('/' + Global.gopherManagerRoot) === 0) {
        mangerOnHttpRequest(request, response, RequestUrl);
    }

    request.on('end', function () {
    });
}

function mangerOnHttpRequest(request, response, ModifieidUrl) {
    if (!Global.extensions[FileMap.getFileExtension(ModifieidUrl)]) {
		console.log("404 not found on 2: "+ModifieidUrl);
        response.writeHead(404, {'Content-Type': 'text/html'});
        response.end("<html><head></head><body>The requested file type is not supported</body></html>");

    } else {
        if (request.headers['x-requested-with'] !== 'XMLHttpRequest') {
            var FilePath = FileMap.getFilePath(ModifieidUrl);
            fs.exists(FilePath, function (exists) {
                if (exists) {
                    fs.readFile(FilePath, function (err, contents) {
                        if (!err) {
                            response.writeHead(200, {
                                "Content-type": FileMap.getMimeType(ModifieidUrl),
                                "Content-Length": contents.length
                            });
                            response.end(contents);
                        } else {
                            console.dir(err);
                        }
                    });
                } else {
					consoel.log("404 not found on: "+ModifieidUrl);
                    fs.readFile('./'+Global.gopherManagerRoot+'/404.html', function (err, contents) {
                        if (!err) {
                            response.writeHead(404, {'Content-Type': 'text/html'});
                            response.end(contents);
                        } else {
                            console.dir(err);
                        }
                        ;
                    });
                }
                ;
            });

        } else {
            var FileExt = FileMap.getFileExtension(request.url);
            var Command = (FileMap.getCleanFileName(request.url)).replace(FileExt, '');
            var RecievedChunk = [];
            var RecievedData = null;
            request.on('data', function (chunk) {
                RecievedChunk.push(chunk);
            });

            request.on('end', function () {
                RecievedData = queryString.parse(decoder.write(RecievedChunk));

                if (FileExt === '.do') {
                    switch (Command) {
                        case 'getProjects':
                            Global.dbConn(function (error, database) {
                                if (error === null) {
                                    ajaxProcessor.getProjects(Number(RecievedData['projectID']), database, function (result) {
                                        response.end(JSON.stringify(result));
                                        database.close();
                                    });
                                } else {
                                    response.end(error);
                                }
                            });
                            break;

                        case 'saveProject':
                            if (RecievedData['forwardHostPort'] === '') {
                                RecievedData['forwardHostPort'] = 0;
                            }
                            if (RecievedData['proxyHostPort'] === '') {
                                RecievedData['proxyHostPort'] = 0;
                            }

                            //check ports already claimed by another project
                            Global.dbConn(function (error, database) {
                                if (error === null) {
                                    ajaxProcessor.getProjects(0, database, function (result) {
                                        var countOccupied = 0;

                                        for (var i = 0; i < result.length; i++) {
                                            if (Number(result[i].ProxyHostPort) === Number(RecievedData['proxyHostPort'])) {
                                                if (Number(result[i].ID) !== Number(RecievedData['projectID'])) {
                                                    countOccupied++;
                                                }
                                            }
                                        }
                                        database.close();

                                        if (countOccupied > 0) {
                                            var _result = {
                                                error: 'Choosen port is already used in another project.',
                                                result: null
                                            };
                                            response.end(JSON.stringify(_result));
                                        } else {
                                            portManager.isPortOpen(Number(RecievedData['proxyHostPort']),function(err, result){
                                                if(err == null){
                                                    if(result===true){
                                                        var _result = {
                                                            error: 'The choosen port is buy or occupied.',
                                                            result: null
                                                        };
                                                        response.end(JSON.stringify(_result));
                                                    }else{
                                                        Global.dbConn(function (err, database) {
                                                            if (err === null) {
                                                                ajaxProcessor.saveProject(RecievedData, database, function (result) {
                                                                    response.end(JSON.stringify(result));
                                                                    database.close();
                                                                });
                                                            } else {
                                                                response.end({error: err, result: null});
                                                            }
                                                        });
                                                    }
                                                }else{
                                                    var _result = {
                                                        error: err,
                                                        result: null
                                                    };
                                                    response.end(JSON.stringify(_result));
                                                }
                                            });
                                            
                                        }

                                    });
                                } else {
                                    response.end(error);
                                }
                            });
                            break;

                        case 'getProjectDetail':
                            Global.dbConn(function (error, database) {
                                if (error === null) {
                                    ajaxProcessor.getProjectDetail(Number(RecievedData['projectID']), database, function (result) {
                                        response.end(JSON.stringify(result));
                                        database.close();
                                        response.end();
                                    });
                                } else {
                                    response.end(error);
                                }
                            });
                            break;

                        case 'getDriveList':
                            FileManager.getDriveList(function (result, error) {
                                if (error !== null) {
                                    response.end(error.toString());
                                }
                                response.end(JSON.stringify(result));
                            });
                            break;

                        case 'getFileList':
                            var path = RecievedData['path'];
//							console.log(path);
                            FileManager.getFileList(RecievedData['path'], RecievedData['onlyFolders'], function (error, result) {
                                if (error !== null) {
                                    response.end(error.toString());
                                }
                                response.end(JSON.stringify(result));
                            });

                            break;
                        case 'getDefaultIgnoredFiles':
                            var options = {
                                targetFolder: RecievedData['path'],
                                targetFiles: Global.ignoredByDefault
                            };
                            FileManager.findFiles(options, function (error, result) {
                                if (error !== null) {
                                    response.end(error.toString());
                                }

                                var newRst = [];
                                for (var i = 0; i < result.length; i++) {
                                    var ext = FileManager.pathHelper.getFileExtention(result[i]);
                                    if (ext.toLowerCase() === 'js') {
                                        newRst.push(result[i]);
                                    }
                                }
                                response.end(JSON.stringify(newRst));
                            });

                            break;
                        case 'lunchProject':
                            var portOpened = portManager.isPortOpen(Number(RecievedData['proxyHostPort']), function (error, result) {
                                if (error !== null) {
                                    response.end('error:' + error);
                                } else {
                                    if (result === false) {
                                        Global.dbConn(function (error, database) {
                                            if (error === null) {
                                                ajaxProcessor.getProjectDetail(Number(RecievedData['projectID']), database, function (result) {
                                                    
                                                    var ProxyServer = http.createServer(function (request, response) {
                                                        proxyOnHttpRequest(request, response, RecievedData['forwardHostName'], Number(RecievedData['forwardHostPort']), Number(RecievedData['projectID']), result.ignored);
                                                    }).listen(Number(RecievedData['proxyHostPort']), function (err) {
                                                        if (err) {
                                                            response.end('error');
                                                        }
                                                        ProxyServer.projectID = Number(RecievedData['projectID']);
                                                        ProxyServer.usePort = Number(RecievedData['proxyHostPort']);
														
														enableDestroy(ProxyServer);
                                                        Global.Servers.push(ProxyServer);
                                                        response.end('ready');
                                                    });
													

                                                    database.close();
                                                });
                                            } else {
                                                response.end(error);
                                            }
                                        });
                                    } else {
                                        response.end('running');
                                    }
                                }
                            });
                            
                            //Execute line in command from node
                            /*var exec = require('child_process').exec;
                             var child = exec('node ./ServerB_createHtml5Server.js gopher myProject run',function(error,stdout,stderr){
                             console.log('====== stdout =========');
                             console.log(stdout.trim());
                             console.log('====== stderr =========');
                             console.log(stderr);
                             if(error !== null){
                             console.log(error);
                             } 
                             });*/
                            break;

                        case 'closeServer':
							console.log("running server:"+Global.Servers.length+" looking for port:"+RecievedData['proxyHostPort']);
							
                            for (var i = 0; i < Global.Servers.length; i++) {
                                var connKey = Global.Servers[i]._connectionKey;
								
								console.log("connKey:"+connKey);
								
                                if (connKey.search(':' + RecievedData['proxyHostPort']) > -1) {
									console.log("found... closing.. "+i+" "+Global.Servers.length+" "+ Global.Servers[i].projectID);
                                    //Global.Servers[i].close(
											
									Global.Servers[i].destroy(function () {
                                        for (var j = 0; j < Global.Servers.length; j++) {
											console.log(Global.Servers[j]._connectionKey+" search for: "+':' + RecievedData['proxyHostPort']);
                                            if (Global.Servers[j]._connectionKey.search(':' + RecievedData['proxyHostPort']) > -1) {
                                                Global.Servers.splice(j, 1);
                                            }
                                        }
                                        console.log(Global.Servers);
                                        response.end('success');
                                    });
                                }
                            }
							console.log("end of close");
                            break;

                        case 'getAnAvailablePort':
                            Global.dbConn(function (error, database) {
                                if (error === null) {
                                    var occupied = [];
                                    ajaxProcessor.getProjects(0, database, function (result) {
                                        for (var i = 0; i < result.length; i++) {
                                            occupied.push(Number(result[i].ProxyHostPort));
                                        }
                                        database.close();
                                        portManager.getAvailablePort(occupied,function(result){
                                           response.end(JSON.stringify(result)); 
                                        });
                                    });
                                } else {
                                    var _response = {
                                        error: error,
                                        result: null
                                    };
                                    response.end(_response);
                                }
                            });
                            break;

                        default:
                            response.end('Command is not recognized.');
                            break;
                    }
                }
            });
        }
    }
}

var pageStack = [];
function proxyOnHttpRequest(request, response, forwardHostName, forwardHostPort, projectID, ignoredFiles) {
    var hostSplit = (request.headers['host']).split(':');
    var proxyHostPort, proxyHostName;
    if (hostSplit.length > 1) {
        proxyHostPort = hostSplit[1];
        proxyHostName = hostSplit[0];
    } else {
        proxyHostPort = 80;
        proxyHostName = hostSplit[0];
    }
    
    //forward request through proxy 
    var projectOnPort = forwardHostPort; //8003;
    var projectHost = forwardHostName; //'localhost';
    var gopherHost = proxyHostName; //'localhost';
    var gopherPort = proxyHostPort; //1338;

    //console.log('(fileName)' + FileMap.getCleanFileName(request.url) + '    ' + 'ext ' + FileMap.getFileExtension(request.url));
    //console.log(' ');
    var pageMarker = projectID + '' + requestMarker + '';


    var BrowserData = [];
    request.on('data', function (chunk) {
        BrowserData.push(chunk);
    });


	//  ****** REMOVE the headers responsible for asking apache etc. if the request can be used from local cache **
	request.headers['if-none-match'] = '';
	request.headers['if-modified-since'] = '';
	//---------------
	
    var ApacheChunk = [];
    var ProxyOptions = {
        host: projectHost,
        port: projectOnPort,
        path: request.url,
        method: request.method,
        headers: request.headers
    };
	
//	console.dir(request.headers);


    request.on('end', function () {
        requestMarker++;
        if (requestMarker > 1000000000) {
            requestMarker = 1;
        }
        pageMarker = projectID + '' + requestMarker + '';
        var trackImageByteIndex = 0;
        var NodeProxyRequest = http.request(ProxyOptions, function (ApacheResponse) {
            /*if (FileMap.getFileExtension(request.url) === '.png' || FileMap.getFileExtension(request.url) === '.jpg' || FileMap.getFileExtension(request.url) === '.jpeg' || FileMap.getFileExtension(request.url) === '.gif' || FileMap.getFileExtension(request.url) === '.pdf' || FileMap.getFileExtension(request.url) === '.exe' && FileMap.getFileExtension(request.url) === '.eot') {
                ApacheResponseContentLength = parseInt(ApacheResponse.headers['Cache-Control']);
                trackImageByteIndex = ApacheResponseContentLength;
            }*/
                
            ApacheResponse.on('data', function (chunk) {
                ApacheChunk.push(chunk);

            });

            ApacheResponse.on('end', function () {
                var ResponseBuffer = Buffer.concat(ApacheChunk);
                var CurrentExt = FileMap.getFileExtension(request.url).toLowerCase();
                if (CurrentExt === '.php' || CurrentExt === '.htm' || CurrentExt === '.html' || CurrentExt === '.js'  ) {
					

                    var chunkStr = decoder.write(ResponseBuffer);

                    //Replace the port in hard code address
                    var regHttp = new RegExp('[\'"]http:\/\/' + projectHost + '(.*?)[\'"]', 'ig');
                    while ((strWithHttp = regHttp.exec(chunkStr)) !== null) {
                        var afterHttp = (strWithHttp[0]).substring((strWithHttp[0]).indexOf('http://') + 7);

                        if (afterHttp.indexOf('/') > -1) {
                            var splashes = afterHttp.split('/');
                            splashes[0] = gopherHost + ':' + gopherPort;
                            afterHttp = splashes.join('\/');
                        } else {
                            afterHttp = gopherHost + ':' + gopherPort;
                        }

                        var newStrWithHttp = (strWithHttp[0]).substring(0, (strWithHttp[0]).indexOf('http://')) + 'http://' + afterHttp;
                        chunkStr = chunkStr.replace(strWithHttp[0], newStrWithHttp);
                    }

					if (CurrentExt === '.js') {
						
						var srcVal =  (request.url).toLowerCase();
						var srcSplashes = srcVal.split('/');
						for (var k = 0; k < srcSplashes.length; k++) {
							if (srcSplashes[k] == '.' || srcSplashes[k] == '..') {
								srcSplashes[k] = '';
							}
						}
						srcVal = srcSplashes.join('');

						//if js file has a querysting of its own then. 
						//if not found then the returning array will have the origial string in [0]
						var srcVal2 = srcVal.split('?');
						srcVal = srcVal2[0];
						
						
						for (var j = 0; j < ignoredFiles.length; j++) {
                            var path = (ignoredFiles[j].FilePath).replace(/\//g, '');
							console.log(path+" "+srcVal);
						}
						
						chunkStr = "testXYZ=1;\n"+chunkStr;
					}
					
                    //Add gopherHealper reference
                    if (CurrentExt === '.php' || CurrentExt === '.html' || CurrentExt === '.htm') {
                        pageStack.push(pageMarker+':'+FileMap.getCleanFileName(request.url));
						
						var regx3 = new RegExp('(<script([^>]*)>)', 'ig');
                        var scriptTag, scriptTagArr = [];
						
//						console.log("*************** ADD GOPHER HELPERS");
//						console.log(chunkStr);

                        while ((scriptTag = regx3.exec(chunkStr)) !== null) {
//							console.log("scriptTag:"+scriptTag);
                            scriptTagArr.push(scriptTag);
                        }

                        if (scriptTagArr.length > 0) {
							console.log("*** ADD GOPHER HELPERS");
                            var gopherHelper = '<script src="GopherBHelper.js?GopherPage=' + pageMarker + '" type="text/javascript"></script>';
                            chunkStr = [chunkStr.slice(0, scriptTagArr[0].index), gopherHelper, chunkStr.slice(scriptTagArr[0].index)].join('');

                            for (var i = 0; i < scriptTagArr.length; i++) {
								//console.log("JAVASCRIPTS: "+(scriptTagArr[i][1]).toLowerCase());
                                //Get src value
                                var regFindSrc;
                                var scriptTagStr = (scriptTagArr[i][1]).toLowerCase();
                                if (scriptTagStr.search('src="') > -1) {
									regFindSrc = new RegExp('<script.*?src="(.*?)"', 'ig');
                                } else {
									regFindSrc = new RegExp('<script.*?src=\'(.*?)\'', 'ig');
                                }

                                var findSrcRst = regFindSrc.exec(scriptTagArr[i][1]);
                                //Varify the value
                                var unqualified = 0;
                                if (findSrcRst !== null) {
									
									//console.log("findSrcRst: "+findSrcRst[1]);
									
                                    var slashes = (findSrcRst[1]).split('/');
                                    if (((slashes[slashes.length - 1]).toLowerCase()).search('.js') === -1) {
                                        unqualified++;
                                    }

                                    var ignoredCount = 0;
                                    for (var j = 0; j < ignoredFiles.length; j++) {
                                        var srcVal = (findSrcRst[1]).toLowerCase();
                                        var srcSplashes = srcVal.split('/');
                                        for (var k = 0; k < srcSplashes.length; k++) {
                                            if (srcSplashes[k] == '.' || srcSplashes[k] == '..') {
                                                srcSplashes[k] = '';
                                            }
                                        }
                                        srcVal = srcSplashes.join('');
										
										//if js file has a querysting of its own then. 
										//if not found then the returning array will have the origial string in [0]
										var srcVal2 = srcVal.split('?');
										srcVal = srcVal2[0];

                                        var path = (ignoredFiles[j].FilePath).replace(/\//g, '');
                                        if (path.search(srcVal) > -1) {
                                            unqualified++;
                                            ignoredCount++;
                                        }
                                    }
                                    
                                    if(ignoredCount === 0){
										//console.log('        '+pageMarker+':'+findSrcRst[1]);
                                        pageStack.push(pageMarker+':'+findSrcRst[1]);
                                    }
                                    
                                    if (unqualified === 0) {
                                        var changeSrcTo = '';

                                        if ((findSrcRst[1] + '').indexOf('?') == -1) {
                                            changeSrcTo = findSrcRst[1] + '?GopherPage=' + pageMarker;
                                        } else {
                                            changeSrcTo = findSrcRst[1] + '&GopherPage=' + pageMarker;
                                        }
										chunkStr = chunkStr.replace(findSrcRst[1], changeSrcTo, 'g');
                                    }
                                }

                            }
                        }
                    }
                    
                    if((FileMap.getCleanFileName(request.url)).indexOf('GopherBHelper.js')>-1){
						console.log("INSERT GOPHER HELPER");
                        var queries = queryString.parse((request.url).substring(request.url.indexOf('?')+1));
                        var parentPage='';
                        var childPage=[];
                        for(var i=0; i<pageStack.length; i++){
                            if((pageStack[i]).indexOf(queries['GopherPage']+':')>-1){
                                var dots = (pageStack[i]).split('.');
                                var page = (pageStack[i]).substring((pageStack[i]).indexOf(':')+1);
								
								//if js file has a querysting of its own then. 
								//if not found then the returning array will have the origial string in [0]
								
								var puredots = (dots[dots.length-1]).split('?');
								
								//console.log(pageStack[i]+" "+dots[dots.length-1]+" "+page+" "+puredots[0]);
								
                                if(puredots[0] !== 'js'){
                                    parentPage = page;
                                }else{
                                    childPage.push(page);
                                }
                            } 
                        }
                        

                        var helperFilePath =  './liveparser-root/js/GopherBInsert.js';
                        fs.exists(Global.GopherHelperFile, function (exists) {
                            if (exists) {
								//console.log("INSERT GOPHER HELPER 2");
                                fs.readFile(Global.GopherHelperFile, function (err, contents) {
									//console.log("INSERT GOPHER HELPER 3 ");
                                    contents = decoder.write(contents);
									
									/*PLACEHOLDERFORINSERT*/
									PLACEHOLDERFORINSERT = '\nvar xProjectID = "'+projectID+'";\n';
                                    PLACEHOLDERFORINSERT += 'var xParentFileName = "'+parentPage+'";\n';
                                    
                                    var buildFileMapStr = 'var GFileMap=[';
                                    for(var j=0; j<childPage.length; j++){
                                        buildFileMapStr += '"'+childPage[j]+'"';
                                        if(j<childPage.length-1){
                                            buildFileMapStr += ',\n';
                                        }
                                    }
                                    buildFileMapStr += '];';
									
									PLACEHOLDERFORINSERT += buildFileMapStr;
                                    
                                    contents = contents.replace('/*PLACEHOLDERFORINSERT*/',PLACEHOLDERFORINSERT);
                                    chunkStr = contents;
                                    
				//					console.dir(ApacheResponse);
                                    ResponseBuffer = new Buffer(chunkStr, 'utf8');
                                    ApacheResponse.headers['content-length'] = ResponseBuffer.length;
                                    ApacheResponse.headers['Cache-Control'] = 'no-cache, must-revalidate';
                                    ApacheResponse.headers['Expires'] = '-1';
                                    ApacheResponse.headers['Pragma'] = 'no-cache';
									ApacheResponse.statusCode = 200;
									ApacheResponse.statusMessage = "OK";
                                    response.writeHead(ApacheResponse.statusCode, ApacheResponse.headers);
                                    response.write(ResponseBuffer, 'binary');
                                    response.end();
                                });
                            } else
							{
								console.log("***** FATAL ERROR: CANT FIND HELPER!!");
							}
                        }); 
                    }else{                         
                        ResponseBuffer = new Buffer(chunkStr, 'utf8');
                    }
                }
                
                if((FileMap.getCleanFileName(request.url)).indexOf('GopherBHelper.js') == -1){
                    ApacheResponse.headers['content-length'] = ResponseBuffer.length;
                    ApacheResponse.headers['Cache-Control'] = 'no-cache, must-revalidate';
                    ApacheResponse.headers['Expires'] = '-1';
                    ApacheResponse.headers['Pragma'] = 'no-cache';
					//change status to 200 for 304 so file will be downloaded every time
					if (ApacheResponse.statusCode==304) {
						ApacheResponse.statusCode = 200;
						ApacheResponse.statusMessage = "OK";
					}
					//-----------------
                    response.writeHead(ApacheResponse.statusCode, ApacheResponse.headers);
                    response.write(ResponseBuffer, 'binary');
                    response.end();
                }
            });

            ApacheResponse.on('error', function (e) {
                console.log('problem with proxy response: ' + e.message);
            });

        });

        var BrowserBytes = Buffer.concat(BrowserData);
        NodeProxyRequest.write(BrowserBytes, 'binary');
        NodeProxyRequest.end();

    });

    request.on('error', function (e) {
        console.log('problem with request: ' + e.message);
    });
}





