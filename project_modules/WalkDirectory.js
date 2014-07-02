var Globals = require("../project_modules/Globals.js");
//var util = require('util');
var acceptedFileType = ['js','JS','html','htm','HTML','HTM'];

function fileNode(_path, _children) {
  this.path = _path;
  this.children = _children;
}

function scanFolder(_settings) {
  var _folderPath = _settings.folderPath, 
     _findSubFolders = _settings.findSubFolders,
     _onlyFindFolders = _settings.onlyFindFolders,
     _acceptAllTypes = _settings.acceptAllTypes;
  var fileExtension = function(_file) {
    var nameArr = _file.split('.');
    return nameArr[nameArr.length - 1];
  };
  var isFileAccepted = function(_file) {
    var countMatch = 0;
    for (var i = 0; i < acceptedFileType.length; i++) {
      if (acceptedFileType[i].indexOf(fileExtension(_file)) > -1) {
        countMatch++;
      }
    }
    if (countMatch > 0) {
      return true;
    } else {
      return false;
    }
  };
  
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
        console.log('---------WalkDirectory !pending '+pending+'--------------');
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
                  if(_acceptAllTypes || (_acceptAllTypes==false && isFileAccepted(file))){
                    output.children.push(new fileNode(file, null));
                  }
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
                console.log('---------WalkDirectory skip subFolders/_onlyFindFolders pending '+pending+'--------------');
              }else{
                if(_acceptAllTypes || (_acceptAllTypes==false && isFileAccepted(file))){
                  output.children.push(new fileNode(file, null));
                }
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

this.findFilesFoldersIn = function(_settings, _callBack) {
  var fileFolderScanner = new scanFolder(_settings);
  fileFolderScanner.starts(function(result) {
    console.log('---------WalkDirectory findFilesFoldersIn is called--------------');
    _callBack(result);
  });
};



