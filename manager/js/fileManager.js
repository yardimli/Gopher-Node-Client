var Global = require("../global.js");

var fileNode = exports.fileNode = function(_name,_path,_isDirectory){
    return {
        name:_name,
        path:_path,
        isDirectory: _isDirectory
    };
};

var StringDecoder = require('string_decoder').StringDecoder;
var decoder = new StringDecoder('utf8');
var pathHelper = {
    getFileName: function (_filePath) {
        var fileArr = _filePath.split('\\');
        var targetFile = fileArr[fileArr.length - 1];
        return targetFile;
    }
};

var getDriveList = exports.getDriveList = function (_callBack) {
    require('child_process').exec("wmic logicaldisk get name", function (error, stdout, stderr) {
        var stdoutStr = decoder.write(stdout);
        stdoutStr = stdoutStr.trim(); //console.log('(stdoutStr)'+stdoutStr);

        var lines = stdoutStr.toString().split('\n');
        var result = [];
        for (var i = 1; i < lines.length; i++) {
            result.push(new fileNode(lines[i].trim(), lines[i].trim() + '\\'));
        }
        //console.log('stderr: ' + stderr);
        return _callBack(result,error);

    });
};

var getFileList = exports.getFileList = function(_targetFilePath, _onlyFolders, _callBack){
    var result = [];
    if(typeof(_onlyFolders) === 'string'){
        if(_onlyFolders.toLowerCase() === 'true'){
            _onlyFolders = true;
        }else{
            _onlyFolders = false;
        }
    }
    
    Global.fs.readdir(_targetFilePath,function(err,fileList){
        if(err !== null){
            return _callBack('node server error(js/fileManager.js ln-41): '+err,null);
        }
        var pending = fileList.length; 
        
        fileList.forEach(function(file){
            Global.fs.stat(_targetFilePath+file, function(err, stats){
                --pending; 
                if (err !== null) {
                    console.log('error at read stat'+err);
                    return;
                }
                
                if(_onlyFolders){
                    if(stats.isDirectory()){
                        //console.log(file);
                        result.push(new fileNode(file, _targetFilePath + file + '\\', true));
                        //console.log(pending);
                    }
                }else{
                    var markIsDirectory = false;
                    if(stats.isDirectory()){
                        markIsDirectory = true;
                    }
                    result.push(new fileNode(file, _targetFilePath + file + '\\', markIsDirectory));  
                }
                
                if (pending === 0) {                    
                    result.sort(function(a,b){
                       return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
                    });
                    
                    var directoryList = [];
                    var fileList = [];
                    for(var i=0; i<result.length; i++){
                        if(result[i].isDirectory){
                            directoryList.push(result[i]);
                        }else{
                            fileList.push(result[i]);
                        }
                    }
                    
                    result = [];
                    for(var j=0; j<directoryList.length; j++){
                        result.push(directoryList[j]);
                    }
                    for(var j=0; j<fileList.length; j++){
                        result.push(fileList[j]);
                    }
                    return _callBack(null, result);
                }
            });
        });
        
    });
};

/*(function test2(){
    getFileList('c:\\', true,function(error, result){
       if(error !== null){
           console.log(error);
       }
       console.log('++++++++++++++++++++++++++');
       console.log('result, test2');
       for(var i=0; i<result.length; i++){
           console.log(result[i].name);
       }
       console.log('++++++++++++++++++++++++++');
    });
})();*/


/*console.log('test function is called');
(function test() {
    
    var dir = "C:\\";
    var files = Global.fs.readdir(dir, function (err, fileList) {
        fileList.forEach(function (file) {
            Global.fs.stat(dir + file, function (err, stats) {
                if (err !== null) {
                    console.log(err);
                    return;
                }
                if (stats.isDirectory()) {
                    console.log(file);
                }
            });
        });
        if (err !== null) {
            console.log(err);
            return;
        }
    });
}());*/