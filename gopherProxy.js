var http = require('http');
var projectOnPort = 8003;
var projectHost = 'localhost';
var gopherHost = 'localhost';
var gopherPort = 1337;
var StringDecoder = require('string_decoder').StringDecoder;
var decoder = new StringDecoder('utf8');

http.createServer(onRequest).listen(1337);

/*var qs = require('querystring');
var processRequest = function(req, callback) {
    var body = '';
    req.on('data', function (data) {
        body += data;
    });
    req.on('end', function () {
        callback(qs.parse(body));
    });
;*/
function onRequest(BrowserRequest, BrowserResponse) {
    var options = {
        host: projectHost,
        port: projectOnPort,
        path: BrowserRequest.url,
        method: BrowserRequest.method,
        headers: BrowserRequest.headers
    };
    //console.log("---------------------------------------------------\n");
    //console.log(BrowserRequest.url);
//  console.log(BrowserRequest.headers);
    //var tempStr = BrowserRequest.url+"";
    //var isPhp = tempStr.match(/.php/i);
    
    var BrowserData = '';
/*
    processRequest(BrowserRequest, function(data) {
         console.log("BrowserRequest Data: "+data);
    });
*/    
//    console.log("=============================\n");
    
    BrowserRequest.on('data', function (chunk) {
        //console.log("BrowserRequest data:"+decoder.write(chunk));  
        BrowserData += chunk;
    }); 
    var ApacheChunk=[];
    BrowserRequest.on('end', function () {        
        var NodeProxyRequest = http.request(options, function (ApacheResponse) {
            //console.log("APACHE HEADER: %j", ApacheResponse.headers);
            
            ApacheResponse.on('data', function (chunk) {
                //console.log('============= _res.on data get chunk =============');
            //    if (isPhp) { console.log("Apache Response: "+ decoder.write(chunk)); }
                
                
                console.log(BrowserRequest.url+'\n');
                if((BrowserRequest.url.indexOf('.png')==-1) && (BrowserRequest.url.indexOf('.jpg')==-1) && (BrowserRequest.url.indexOf('.gif')==-1) ){
                    var chunkStr = decoder.write(chunk);
                    var regx1 = new RegExp('http://'+projectHost,'g');
                    chunkStr = chunkStr.replace(regx1,'http://'+gopherHost);
                    var regx2 = new RegExp('http://'+projectHost+':'+projectOnPort,'g');
                    chunkStr = chunkStr.replace(regx2,'http://'+gopherHost+':'+gopherPort);
                    //console.log(chunkStr);
                    chunk = new Buffer(chunkStr,'binary');
                }
                ApacheChunk.push(chunk);
               
            });

            ApacheResponse.on('end', function () {
            //    console.log("ApacheResponse END");
                //console.log(decoder.write(ApacheChunk));
                var ApacheBytes = Buffer.concat(ApacheChunk);
                //console.log('ApacheChunk.length '+ ApacheBytes.length);
                //console.log('ApacheResponse.headers '+ApacheResponse.headers['content-length']);
                ApacheResponse.headers['content-length'] = ApacheBytes.length;
                BrowserResponse.writeHead(ApacheResponse.statusCode,ApacheResponse.headers);
                BrowserResponse.write(ApacheBytes,'binary');
                BrowserResponse.end();
            });

            ApacheResponse.on('error', function(e){
               console.log('problem with proxy response: '+e.message); 
            });
        });

        //console.log("WRITE APACHE:"+decoder.write(BrowserData));
        NodeProxyRequest.write(BrowserData, 'binary');
        NodeProxyRequest.end();
        
    });
    
    
    BrowserRequest.on('error',function(e){
       console.log('problem with request: '+e.message); 
    });
}



