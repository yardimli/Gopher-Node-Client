var Global = require('../manager/global.js');

var StringDecoder = require('string_decoder').StringDecoder;
var decoder = new StringDecoder('utf8');
var xxxx = '';
var ServerB = Global.http.createServer(onRequest).listen(1337, function () {
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
    //console.log('RequestUrl '+RequestUrl);

    if (RequestUrl.indexOf('/' + Global.gopherManagerRoot) === 0) {
        if (!Global.extensions[FileMap.getFileExtension(RequestUrl)]) {
            //console.log(RequestUrl);
            response.writeHead(404, {'Content-Type': 'text/html'});
            response.end("<html><head></head><body>The requested file type is not supported</body></html>");

        } else {
            if (request.headers['x-requested-with'] !== 'XMLHttpRequest') {
                var FilePath = FileMap.getFilePath(RequestUrl);
                Global.fs.exists(FilePath, function (exists) {
                    if (exists) {
                        Global.fs.readFile(FilePath, function (err, contents) {
                            if (!err) {
                                response.writeHead(200, {
                                    "Content-type": FileMap.getMimeType(RequestUrl),
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
                console.log('Is a xmlhttprequest ' + FileMap.getCleanFileName(request.url));
                var FileExt = FileMap.getFileExtension(request.url);
                var Command = (FileMap.getCleanFileName(request.url)).replace(FileExt, '');
                if (FileExt === '.do') {
                    switch (Command) {
                        case 'getProjects':
                            request.on('data', function (chunk) {
                                console.log(chunk);
                                var RecievedData = Global.QueryString.parse(decoder.write(chunk));
                                Global.fs.exists(Global.dbPath, function (exists) {
                                    if (exists) {
                                        var db = new Global.sqlite3.Database(Global.dbPath);
                                        var AjaxToProject = require('./js/ajaxToProjects');
                                        AjaxToProject.getProjects(Number(RecievedData['projectID']), db, function (result) {
                                            response.end(JSON.stringify(result));
                                            db.close();
                                        });
                                    } else {
                                        response.end('Database does not exist.');
                                    }
                                });

                                /*var result = [];
                                 Global.db.serialize(function () {
                                 var qSelectProject = '';
                                 if(Number(RecievedData['projectID']) === 0){
                                 qSelectProject = 'select ID, name FROM projects ORDER BY name ASC';
                                 }else{
                                 qSelectProject = 'select ID, name FROM projects WHERE ID=' + RecievedData['projectID'];
                                 }
                                 Global.db.each(qSelectProject,function (err, row) {
                                 result.push(row);
                                 },function complete(){
                                 response.end(result[0].name+RecievedData['testCaller']);
                                 });
                                 });*/
                                //Global.db.close();
                            });
                            break;
                            
                        case 'getDriveList':
                            var FileManager = require('./js/fileManager.js');
                            FileManager.getDriveList(function(result,error){
                                if(error !== null){
                                    response.end(error.toString());
                                } 
                                response.end(JSON.stringify(result));
                            });
                            break;
                            
                        case 'getFileList':
                            var FileManager = require('./js/fileManager.js');
                            request.on('data', function (chunk) {
                                var RecievedData = Global.QueryString.parse(decoder.write(chunk));
                                FileManager.getFileList(RecievedData['path'],RecievedData['onlyFolders'],function(error,result){
                                   if(error !== null){
                                       response.end(error.toString());
                                   }
                                   response.end(JSON.stringify(result));
                                });
                            });
                            
                            
                            break;
                            
                        default:
                            response.end('Command is not recognized.');
                            break;
                    }

                } else {
                    response.end('File extension is not recognized.');
                }
            }
        }
    } else {
        response.end('use proxy');
        //forward request through proxy 
        var projectOnPort = 8003;
        var projectHost = 'localhost';
        var gopherHost = 'localhost';
        var gopherPort = 1337;

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
            var NodeProxyRequest = Globals.http.request(ProxyOptions, function (ApacheResponse) {
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

    request.on('end', function () {
        //console.log('*******************');
    });
}



