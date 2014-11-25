var Global = require("../global.js");

var fileNode = exports.fileNode = function(_name,_path){
    return {
        name:_name,
        path:_path
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
                        result.push(new fileNode(file, _targetFilePath + file + '\\'));
                        console.log(pending);
                    }
                }else{
                    //console.log(file);
                    result.push(new fileNode(file, _targetFilePath + file + '\\'));  
                }
                
                if (pending === 0) {
                    return _callBack(null,result);
                }
            });
        });
        
    });
};

(function test2(){
    getFileList('D:\\',true,function(error, result){
       if(error !== null){
           console.log(error);
       }
       console.log('++++++++++++++++++++++++++');
       console.log('result, test2');
       console.log(result);
    });
})();

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