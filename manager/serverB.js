var Global = require('../manager/global.js');
var FileManager = require('./js/fileManager.js');

var StringDecoder = require('string_decoder').StringDecoder;
var decoder = new StringDecoder('utf8');
var xxxx = '';


var ServerB = Global.http.createServer(onRequest).listen(1337, function (err) {
    Global.Servers.push(ServerB);
    /*var spawn = require('child_process').spawn,
     list  = spawn('cmd');
     
     list.stdout.on('data', function (data) {
     //console.log('stdout: ' + data);
     var buff = new Buffer(data);
     console.log("stdout: " + buff.toString('utf8'));
     xxxx = buff.toString('utf8');
     });
     
     list.stderr.on('data', function (data) {
     console.log('stderr: ' + data);
     });
     
     list.on('exit', function (code) {
     console.log('child process exited with code ' + code);
     });
     
     list.stdin.write('wmic logicaldisk get name\n');
     list.stdin.end();*/
});

var FileMap = {
    root: __dirname + '/../',
    getCleanFileName: function (_requestUrl) {
        var UrlObj = Global.url.parse(_requestUrl);
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
        var PhysicalDirName = Global.path.dirname(_requestUrl);
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
    //console.log('request.url '+request.url);

    if (RequestUrl === '/' || RequestUrl === '/' + Global.gopherManagerRoot || RequestUrl === '/' + Global.gopherManagerRoot + '/') {
        RequestUrl = '/manager/index.html';
    } else if (RequestUrl.search('/' + Global.gopherManagerRoot) === -1) {
        RequestUrl = '/' + Global.gopherManagerRoot + '/' + RequestUrl;
    }

    if (RequestUrl.indexOf('/' + Global.gopherManagerRoot) === 0) {
        //console.log('>>not using proxy<<');
        mangerOnHttpRequest(request, response, RequestUrl);
    } else {

    }

    request.on('end', function () {
        //console.log('*******************');
    });
}

function mangerOnHttpRequest(request, response, ModifieidUrl) {
    if (!Global.extensions[FileMap.getFileExtension(ModifieidUrl)]) {
        //console.log(ModifieidUrl);
        response.writeHead(404, {'Content-Type': 'text/html'});
        response.end("<html><head></head><body>The requested file type is not supported</body></html>");

    } else {
        if (request.headers['x-requested-with'] !== 'XMLHttpRequest') {
            var FilePath = FileMap.getFilePath(ModifieidUrl);
            Global.fs.exists(FilePath, function (exists) {
                if (exists) {
                    Global.fs.readFile(FilePath, function (err, contents) {
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
                    Global.fs.readFile('404.html', function (err, contents) {
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
            //console.log('Is a xmlhttprequest ' + FileMap.getCleanFileName(request.url));
            var FileExt = FileMap.getFileExtension(request.url);
            var Command = (FileMap.getCleanFileName(request.url)).replace(FileExt, '');
            var RecievedChunk = [];
            var RecievedData = null;
            request.on('data', function (chunk) {
                RecievedChunk.push(chunk);
            });

            request.on('end', function () {
                RecievedData = Global.QueryString.parse(decoder.write(RecievedChunk));

                if (FileExt === '.do') {
                    switch (Command) {
                        case 'getProjects':
                            console.log('===== getProjects =======');
                            console.log(Global.Servers);
                            Global.dbConn(function (error, database) {
                                if (error === null) {
                                    var AjaxToProject = require('./js/ajaxToProjects.js');
                                    AjaxToProject.getProjects(Number(RecievedData['projectID']), database, function (result) {
                                        response.end(JSON.stringify(result));
                                        database.close();
                                    });
                                } else {
                                    resposne.end(error);
                                }
                            });
                            break;

                        case 'saveProject':
                            Global.dbConn(function (error, database) {
                                if (error === null) {
                                    var project = require('./js/ajaxToProjects.js');
                                    project.saveProject(RecievedData, database, function (result) {
                                        response.end(JSON.stringify(result));
                                        database.close();
                                    });
                                } else {
                                    response.end(error);
                                }
                            })
                            break;

                        case 'getProjectDetail':
                            Global.dbConn(function (error, database) {
                                if (error === null) {
                                    var project = require('./js/ajaxToProjects.js');
                                    project.getProjectDetail(Number(RecievedData['projectID']), database, function (result) {
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
                            var matchPortInUse = 0;
                            for (var i = 0; i < Global.Servers.length; i++) {
                                var connectionKey = Global.Servers[i]._connectionKey;
                                var keySplit = connectionKey.split(':');
                                if (Number(RecievedData['proxyHostPort']) === Number(keySplit[keySplit.length - 1])) {
                                    matchPortInUse++;
                                }
                            }
                            
                            if(matchPortInUse === 0){
                                var ProxyServer = Global.http.createServer(function (request, response) {
                                    proxyOnHttpRequest(request, response, RecievedData['forwardHostName'], Number(RecievedData['forwardHostPort']));
                                }).listen(Number(RecievedData['proxyHostPort']), function (err) {
                                    if (err) {
                                        response.end('error');
                                    }
                                    //check if this proxy port has been added!!
                                    ProxyServer.projectID = Number(RecievedData['projectID']);
                                    Global.Servers.push(ProxyServer);
                                    response.end('ready');
                                    //console.log('start listening to proxy port ' + RecievedData['proxyHostPort']);
                                    console.log('================lucn project, Global.Servers===============================');
                                    console.log(Global.Servers);
                                });
                            }else{
                                response.end('running');
                                console.log('port '+RecievedData['proxyHostPort']+' is already open.');
                            }

                            
                            break;

                        case 'closeServer':
                            console.log('================before closeServer starts, Global.Servers===============================');
                            console.log(Global.Servers);
                            for(var i=0; i<Global.Servers.length; i++){
                                if(Number(RecievedData['projectID']) === Global.Servers[i].projectID){
                                    Global.Servers[i].close(function(){                                        
                                        for(var i=0; i<Global.Servers.length; i++){
                                            if(Number(RecievedData['projectID']) === Global.Servers[i].projectID){
                                                Global.Servers.splice(i,1);
                                            }
                                        }
                                        response.end('success');
                                    });
                                }
                            }
                            
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
function proxyOnHttpRequest(request, response, forwardHostName, forwardHostPort) {
    console.log('>>using proxy<<');
    console.log(Global.Servers);
    console.log('-------------------------------');
    //console.log(request.headers);
    //console.log(request.headers['referer']);
    var hostSplit = (request.headers['host']).split(':');
    var proxyHostPort, proxyHostName;
    if (hostSplit.length > 1) {
        proxyHostPort = hostSplit[1];
        proxyHostName = hostSplit[0];
    } else {
        proxyHostPort = 80;
        proxyHostName = hostSplit[0];
    }
    //console.log(proxyHostPort);
    //console.log(proxyHostName);
    //console.log('-------------------------------');
    //forward request through proxy 
    var projectOnPort = forwardHostPort; //8003;
    var projectHost = forwardHostName; //'localhost';
    var gopherHost =  proxyHostName; //'localhost';
    var gopherPort = proxyHostPort; //1338;

    var BrowserData = [];
    request.on('data', function (chunk) {
        BrowserData.push(chunk);
    });

    var ApacheChunk = [];
    var ProxyOptions = {
        host: projectHost,
        port: projectOnPort,
        path: request.url,
        method: request.method,
        headers: request.headers
    };
    request.on('end', function () {
        var NodeProxyRequest = Global.http.request(ProxyOptions, function (ApacheResponse) {
            ApacheResponse.on('data', function (chunk) {
                if ((request.url.indexOf('.png') == -1) && (request.url.indexOf('.jpg') == -1) && (request.url.indexOf('.gif') == -1)) {
                    var chunkStr = decoder.write(chunk);
                    var regx1 = new RegExp('http://' + projectHost, 'g');
                    chunkStr = chunkStr.replace(regx1, 'http://' + gopherHost);
                    var regx2 = new RegExp('http://' + projectHost + ':' + projectOnPort, 'g');
                    chunkStr = chunkStr.replace(regx2, 'http://' + gopherHost + ':' + gopherPort);
                    chunk = new Buffer(chunkStr, 'utf8');
                }
                ApacheChunk.push(chunk);

            });

            ApacheResponse.on('end', function () {
                var ApacheBytes = Buffer.concat(ApacheChunk);
                ApacheResponse.headers['content-length'] = ApacheBytes.length;
                response.writeHead(ApacheResponse.statusCode, ApacheResponse.headers);
                response.write(ApacheBytes, 'binary');
                response.end();
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

/*var ProxyServer = Global.http.createServer(function (request, response) {
    proxyOnHttpRequest(request,response);
}).listen(1338, function () {
    Servers.push(ProxyServer);
});*/



