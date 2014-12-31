var net = require('net');

var isPortOpen = exports.isPortOpen = function(_portNumber,_callBack){
    var testServer = new net.createServer();
    testServer.listen(_portNumber);
    
    testServer.once('error',function(err){
       if(err.code === 'EADDRINUSE'){
           return _callBack(null,true);
       }else{
           return _callBack(err.toString(), null);
       } 
    });
    
    testServer.once('listening', function(){
       testServer.close();
       return _callBack(null, false);
    });
};


