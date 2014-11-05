var Global = require('../manager/global.js');

var ServerB = Global.http.createServer(onRequest).listen(1337);
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
    console.log('request.url '+request.url);
    if(RequestUrl==='/' || RequestUrl==='/'+Global.gopherManagerRoot || RequestUrl==='/'+Global.gopherManagerRoot+'/'){
        RequestUrl = '/manager/index.html';
    }else if(RequestUrl.search('/'+Global.gopherManagerRoot) === -1){
        RequestUrl = '/'+Global.gopherManagerRoot+'/'+RequestUrl;
    }
    console.log('RequestUrl '+RequestUrl);
    if (RequestUrl.indexOf('/' + Global.gopherManagerRoot) === 0) {
        if (!Global.extensions[FileMap.getFileExtension(RequestUrl)]){
            response.writeHead(404, {'Content-Type': 'text/html'});
            response.end("<html><head></head><body>The requested file type is not supported</body></html>");
        } else {
            var FilePath = FileMap.getFilePath(RequestUrl);
            console.log('FilePath '+FilePath);
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
        }
    } else {
        console.log('else statement');
        response.end('use proxy');
        //forward request through proxy 
    }
    
    request.on('end',function(){
       console.log('*******************'); 
    });
}

