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
        if ((request.url.search("/admin/manager/") == 0) || (request.url.search("/admin/") == 0)) {
            if (request.url.search("/admin/manager/") != -1)
            {
                ProjectManegerServer.getFile(request, response);
            } else
            if (request.url.search("/admin/") != -1)
            {
                RealTimeConsole.getFile(request, response);
            } else
            {
                ClientServer.getFile(request, response);
            }
        } else {
            //get pages through gopher proxy 
            var projectOnPort = 8003;
            var projectHost = 'localhost';
            var gopherHost = 'localhost';
            var gopherPort = 1337;
            var StringDecoder = require('string_decoder').StringDecoder;
            var decoder = new StringDecoder('utf8');

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


    }

    Globals.httpServer = Globals.http.createServer(onRequest).listen(1337, function () {
        console.log("Listening at: http://localhost:1337 - Server is up");
    });

    initSocketIO(Globals.httpServer, debug);
}

function initSocketIO(httpServer, debug)
{
    Globals.socketServer = Globals.socketio.listen(httpServer);

    if (debug == false) {
//		Globals.socketServer.set('log level', 1); // socket IO debug off
    }

    Globals.socketServer.sockets.on('connection', function (socket) {
        console.log("          user connected to gopherB: " + socket.id);

        socket.on('HiGopherB', function (data) {
            console.log(socket.id + " joins 'room1'");
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