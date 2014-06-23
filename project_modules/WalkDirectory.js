var Globals = require("../project_modules/Globals.js");
//var util = require('util');

function fileNode(_path, _children) {
  this.path = _path;
  this.children = _children;
}

function scanFolder(_folderPath, _findSubFolders, _onlyFindFolders) {
  this.starts = function(_callBack) {
    finder(_folderPath, function(err, results) {
      if (err) {
        _callBack(err);
      } else {
        _callBack(results);
      }
    });
  };
  
  function finder(_folderPath, end) {
    var output = new fileNode(_folderPath, []);
    var stat;
    Globals.fs.readdir(_folderPath, function(err, list) {
      if (err) {
        return end(err);
      }
      //var pending = list.length;
      list.forEach(function(file) {
        //pending--;
        file = _folderPath + '\\' + file;
        stat = Globals.fs.statSync(file);
        if(_findSubFolders){
          if (stat.isDirectory()) {
              dig(file, function(err, res) {
                  output.children.push(res);
                });
            } else {
              if(!_onlyFindFolders){
                output.children.push(new fileNode(file, null));
              }
            }
        }else{
            if (stat.isDirectory()) {
              output.children.push(new fileNode(file, []));
          } else {
            if(!_onlyFindFolders){
              output.children.push(new fileNode(file, null));
            }
          }
        }
      });
      return end(null, output);
    });
  }
};
var parseGopherTunnel = function(t) {
  function findFileExtension(file) {
    var nameArr = file.split('.');
    return nameArr[nameArr.length - 1];
  }
  ;
  function isFileAccepted(file) {
    var countMatch = 0;
    for (var i = 0; i < fileTypes.length; i++) {
      if (fileTypes[i].indexOf(findFileExtension(file)) > -1) {
        countMatch++;
      }
    }
    if (countMatch > 0) {
      return true;
    } else {
      return false;
    }
  }
};

this.findFilesFoldersIn = function(_filePath, _findSubFolders, _onlyFindFolders, _callBack) {
  var fileFolderScanner = new scanFolder(_filePath, _findSubFolders, _onlyFindFolders);
  fileFolderScanner.starts(function(result) {
    _callBack(result);
  });
};



