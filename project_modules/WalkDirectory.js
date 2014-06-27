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
    console.log('---------WalkDirectory finder is called--------------');
    var output = new fileNode(_folderPath, []);
    var stat;
    Globals.fs.readdir(_folderPath, function(err, list) {
      if (err) {
        console.log('---------WalkDirectory error--------------');
        return end(err);
      }
      var pending = list.length;
      if (!pending) {
        console.log('---------WalkDirectory !pending--------------');
        return end(null, output);
      }
      list.forEach(function(file) {
        file = _folderPath + '\\' + file;
          console.log('---------WalkDirectory forEach----'+file+'-------');
          stat = Globals.fs.statSync(file);
          if(_findSubFolders){
            if (stat.isDirectory()) {
                finder(file, function(err, res) {
                    output.children.push(res);
                    if (!--pending){
                      end(null, output);
                    }
                  });
              } else {
                if(_onlyFindFolders){
                  if (!--pending){
                      end(null, output);
                  }
                }else{
                  output.children.push(new fileNode(file, null));
                  if (!--pending){
                      end(null, output);
                  }
                }
              }
          }else{
            if (stat.isDirectory()) {
              output.children.push(new fileNode(file, []));
                  if (!--pending){
                    end(null, output);
                  }
            } else {
              if(_onlyFindFolders){
                if (!--pending){
                    end(null, output);
                }
                console.log('---------WalkDirectory _onlyFindFolders pending '+pending+'--------------');
              }else{
                output.children.push(new fileNode(file, null));
                if (!--pending){
                    end(null, output);
                }
              }
            }
          }
      });
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
    console.log('---------WalkDirectory findFilesFoldersIn is called--------------');
    console.log(result);
    _callBack(result);
  });
};



