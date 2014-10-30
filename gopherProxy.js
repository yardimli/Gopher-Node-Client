var http = require('http');

//var StringDecoder = require('string_decoder').StringDecoder;
//var decoder = new StringDecoder('utf8');

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
        host: 'localhost',
        port: 8003,
        path: BrowserRequest.url,
        method: BrowserRequest.method,
        headers: BrowserRequest.headers
    };
    console.log("---------------------------------------------------\n");
    console.log(BrowserRequest.url);
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
    
    BrowserRequest.on('end', function () {        
        var NodeProxyRequest = http.request(options, function (ApacheResponse) {
            //console.log("APACHE HEADER: %j", ApacheResponse.headers);
            BrowserResponse.writeHead(ApacheResponse.statusCode,ApacheResponse.headers);
            
            ApacheResponse.on('data', function (chunk) {
            //    console.log('============= _res.on data get chunk =============');
            //    if (isPhp) { console.log("Apache Response: "+ decoder.write(chunk)); }
                BrowserResponse.write(chunk, 'binary');
            });

            ApacheResponse.on('end', function () {
            //    console.log("ApacheResponse END");
                BrowserResponse.end();
            });

            ApacheResponse.on('error', function(e){
               console.log('problem with proxy response: '+e.message); 
            });
        });

        //console.log("WRITE APACHE:"+BrowserData);
        NodeProxyRequest.write(BrowserData, 'binary');
        NodeProxyRequest.end();
    });
    
    BrowserRequest.on('error',function(e){
       console.log('problem with request: '+e.message); 
    });
}



