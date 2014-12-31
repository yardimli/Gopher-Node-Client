var Global = require('../manager/global.js');
var FileManager = require('./js/fileManager.js');

var StringDecoder = require('string_decoder').StringDecoder;
var decoder = new StringDecoder('utf8');
var xxxx = '';
var pageMark = 0;



var ServerB = Global.http.createServer(onRequest).listen(1337, function (err) {
    Global.Servers.push(ServerB);   

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
                            if(RecievedData['forwardHostPort'] === ''){
                               RecievedData['forwardHostPort'] = 0; 
                            }
                            if(RecievedData['proxyHostPort'] === ''){
                               RecievedData['proxyHostPort'] = 0; 
                            }
                            
                            //check ports already claimed by another project
                            Global.dbConn(function (error, database) {
                                if (error === null) {
                                    var AjaxToProject = require('./js/ajaxToProjects.js');
                                    AjaxToProject.getProjects(0, database, function (result) {
                                        var countOccupied = 0;
                                        
                                        for(var i=0; i<result.length; i++){
                                            if( Number(result[i].ProxyHostPort) === Number(RecievedData['proxyHostPort'])){
                                                if(Number(result[i].ID) !== Number(RecievedData['projectID'])){
                                                    countOccupied ++;
                                                }
                                            }
                                        }
                                        database.close();
                                        
                                        if(countOccupied > 0 ){
                                            var _result = {
                                                error: 'Choosen port is already used in another project.',
                                                result: null
                                            };
                                            response.end(JSON.stringify(_result));
                                        }else{
                                            var server = new Global.net.createServer();
                                            server.listen(Number(RecievedData['proxyHostPort']));

                                            server.once('error',function(error){ 
                                                if(error.code === 'EADDRINUSE'){
                                                    var _result = {
                                                        error: 'The choosen port is buy or occupied.',
                                                        result: null
                                                    };
                                                    response.end(JSON.stringify(_result));
                                                }
                                            });

                                            server.once('listening', function () {
                                                server.close();
                                                Global.dbConn(function (err, database) {
                                                    if (err === null) {
                                                        var project = require('./js/ajaxToProjects.js');
                                                        project.saveProject(RecievedData, database, function (result) {
                                                            response.end(JSON.stringify(result));
                                                            database.close();
                                                        });
                                                    } else {
                                                        response.end({error:err,result:null});
                                                    }
                                                });
                                            });
                                        }
                                        
                                    });
                                } else {
                                    resposne.end(error);
                                }
                            });
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
                            var portManager = require('./js/portManager.js');
                            var portOpened = portManager.isPortOpen(Number(RecievedData['proxyHostPort']),function(error, result){
                                if(error !== null){
                                    response.end('error:'+error);
                                }else{
                                    if(result === false){
                                        Global.dbConn(function (error, database) {
                                            if (error === null) {
                                                var project = require('./js/ajaxToProjects.js');
                                                project.getProjectDetail(Number(RecievedData['projectID']), database, function (result) {
                                                    var ProxyServer = Global.http.createServer(function (request, response) {
                                                        proxyOnHttpRequest(request, response, RecievedData['forwardHostName'], Number(RecievedData['forwardHostPort']), Number(RecievedData['projectID']),result.ignored);
                                                    }).listen(Number(RecievedData['proxyHostPort']), function (err) {
                                                        if (err) {
                                                            response.end('error');
                                                        }
                                                        ProxyServer.projectID = Number(RecievedData['projectID']);
                                                        ProxyServer.usePort = Number(RecievedData['proxyHostPort']);
                                                        Global.Servers.push(ProxyServer);
                                                        response.end('ready');
                                                    });
                                                    
                                                    database.close();
                                                });
                                            } else {
                                                response.end(error);
                                            }
                                        });
                                        
                                        
                                        
                                    }else{
                                        response.end('running');
                                        console.log('port '+RecievedData['proxyHostPort']+' is already open.');
                                    }
                                }   
                            });
                            
                            /*var exec = require('child_process').exec;
                            var child = exec('node ./js/html5server.js gopher myProject run',function(error,stdout,stderr){
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
                            console.log('================before closeServer starts, Global.Servers===============================');
                            console.log(Global.Servers);
                            for(var i=0; i<Global.Servers.length; i++){
                                var connKey = Global.Servers[i]._connectionKey;
                                
                                if(connKey.search(':'+RecievedData['proxyHostPort'])>-1){
                                    Global.Servers[i].close(function(){                                        
                                        for(var j=0; j<Global.Servers.length; j++){
                                            if(Global.Servers[j]._connectionKey.search(':'+RecievedData['proxyHostPort'])>-1){
                                                Global.Servers.splice(j,1);
                                            }
                                        }
                                        response.end('success');
                                    });
                                }
                            }
                            
                            break;
                            
                        case 'getAnAvailablePort':
                            var start=1338, end=2338;
                            var stopSearching = false;
                            var occupied = [];
                            
                            Global.dbConn(function (error, database) {
                                if (error === null) {
                                    var AjaxToProject = require('./js/ajaxToProjects.js');
                                    AjaxToProject.getProjects(0, database, function (result) {
                                        for(var i=0; i<result.length; i++){
                                            occupied.push(Number(result[i].ProxyHostPort));                                            
                                        }
                                        database.close();
                                        console.log('========= start looking for open port,'+ start +' =================');
                                        checkPort(start);
                                        
                                    });
                                } else {
                                    var _response = {
                                        error: error,
                                        result: null
                                    };
                                    resposne.end(_response);
                                }
                            });
                            
                            function checkPort(_port){
                                var server = new Global.net.createServer();
                                server.listen(_port);
                                
                                server.once('error',function(error){ 
                                    console.log(error);
                                    start ++;
                                    if(error.code === 'EADDRINUSE'){
                                        if(start<=end && stopSearching === false){
                                            checkPort(start);
                                        }else{
                                            var result = {
                                                error: 'Can not find an open port',
                                                port:null
                                            };
                                            response.end(JSON.stringify(result));
                                        }
                                    }
                                });
                                
                                server.once('listening', function () {
                                    server.close();
                                    var countOccupied = 0;
                                    for (var i = 0; i < occupied.length; i++) {
                                        if (occupied[i] === _port) {
                                            countOccupied++;
                                        }
                                    }

                                    if(stopSearching === false){
                                        if(countOccupied > 0){
                                            start++;
                                            if(start<=end){
                                                checkPort(start);
                                            }
                                        }else{
                                            stopSearching = true;
                                            var result = {
                                                error: null,
                                                port: _port
                                            };
                                            response.end(JSON.stringify(result));
                                        }
                                    }
                                });
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
var pageStack = [];
function proxyOnHttpRequest(request, response, forwardHostName, forwardHostPort, projectID, ignoredFiles) {
    //console.log('>>using proxy<<');
    //console.log(Global.Servers);
    //console.log(projectID);
    //console.log(ignoredFiles);
    //console.log('-------------------------------');
    
    
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
    
    console.log('fileName'+FileMap.getCleanFileName(request.url)+'    '+'ext ' +FileMap.getFileExtension(request.url));
    pageMark++; 
    if(pageMark > 1000000000){
        pageMark=1;
    }
    var pageTrackerNum = projectID+''+pageMark+'';
    

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
                var chunkStr = decoder.write(chunk);
                
                //Replace the port in hard code address
                if(FileMap.getFileExtension(request.url)!=='.png' || FileMap.getFileExtension(request.url)!=='.jpg' || FileMap.getFileExtension(request.url)!=='.jpeg' || FileMap.getFileExtension(request.url)!=='.gif' || FileMap.getFileExtension(request.url)!=='.pdf' || FileMap.getFileExtension(request.url)!=='.exe'){
                    var regx1 = new RegExp('http://' + projectHost, 'g');
                    chunkStr = chunkStr.replace(regx1, 'http://' + gopherHost);
                    var regx2 = new RegExp('http://' + projectHost + ':' + projectOnPort, 'g');
                    chunkStr = chunkStr.replace(regx2, 'http://' + gopherHost + ':' + gopherPort);
                }
                
                //Add gopher helper file reference
                if(FileMap.getFileExtension(request.url)==='.php' || FileMap.getFileExtension(request.url)==='.html' || FileMap.getFileExtension(request.url)==='.htm' || FileMap.getFileExtension(request.url)===''){                    
                    var regx3 = new RegExp(/(<script([^>]*)>)/ig);
                    var scriptTag, scriptTagArr=[];
                    while((scriptTag = regx3.exec(chunkStr)) !== null){
                        scriptTagArr.push(scriptTag);
                    }
                    
                    if(scriptTagArr.length>0){
                        var gopherHelper = '<script src="gopherHelper.js?GopherPage='+pageTrackerNum+'" type="text/javascript"></script>';
                        chunkStr = [chunkStr.slice(0,scriptTagArr[0].index), gopherHelper, chunkStr.slice(scriptTagArr[0].index)].join('');
                        
                        for(var i=0; i<scriptTagArr.length; i++){
                             pageStack.push(scriptTagArr[i][1]); 
                            //Get src value
                            var regFindSrc;
                            var scriptTagStr = (scriptTagArr[i][1]).toLowerCase();
                            if(scriptTagStr.search('src="')>-1){
                                regFindSrc = new RegExp(/<script.*?src="(.*?)"/ig);
                            }else{
                                regFindSrc = new RegExp(/<script.*?src='(.*?)'/ig);
                            }

                            var findSrcRst = regFindSrc.exec(scriptTagArr[i][1]);//console.log('findSrcRst[1] '+findSrcRst[1]);

                            //Varify the value
                            var unqualified = 0;
                            var slashes = (findSrcRst[1]).split('/');
                            if( ((slashes[slashes.length-1]).toLowerCase()).search('.js') === -1){
                                unqualified++;
                            }
                            
                            for(var j=0; j<ignoredFiles.length; j++){
                                var srcVal = (findSrcRst[1]).toLowerCase();
                                var newSrcVal='';
                                var splashes = srcVal.split('/');
                                for(var k=0; k<splashes.length; k++){
                                    if(splashes[k] == '.' || splashes[k]=='..'){
                                        splashes[k] = '';
                                    }
                                    newSrcVal += splashes[k];
                                }
                                srcVal = newSrcVal;
                                
                                var path = (ignoredFiles[j].FilePath).replace(/\\/g,'');
                                if(path.search(srcVal) > -1){
                                    unqualified++;
                                }
                            }
                            
                            if(unqualified === 0){
                                var changeSrcTo = '';
                                
                                if((findSrcRst[1]+'').indexOf('?') == -1){
                                    changeSrcTo = findSrcRst[1] + '?GopherPage='+pageTrackerNum;
                                }else{
                                    changeSrcTo = findSrcRst[1] + '&GopherPage='+pageTrackerNum;
                                }
                                var srcreg = new RegExp(findSrcRst[1]);
                                chunkStr = chunkStr.replace(srcreg,changeSrcTo,'g');
                            }
                        }
                    }                     
                    
                    chunk = new Buffer(chunkStr, 'utf8');
                }
                ApacheChunk.push(chunk);

            });

            ApacheResponse.on('end', function () {
                var ApacheBytes;
                
                if(request.url.indexOf('gopherHelper.js')>-1){
                    console.log('request gopherHelper content');
                    var helperContent = 'var pageStack=[';
                    for(var i=0; i<pageStack.length; i++){
                        helperContent += pageStack[i];
                        if(i<pageStack.length-1){
                            helperContent += ',';
                        }
                    }
                    helperContent += '];';
                    var makeChunk = new Buffer(helperContent,'utf8');
                    ApacheBytes = makeChunk;
                }else{
                    ApacheBytes = Buffer.concat(ApacheChunk);
                }
                
                ApacheResponse.headers['content-length'] = ApacheBytes.length;
                ApacheResponse.headers['Cache-Control'] = 'no-cache';
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



