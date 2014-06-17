var Globals = require("../project_modules/Globals.js");
function fileNode(_path, _children) {
  this.path = _path;
  this.children = _children;
}
var scan = function(dir, findSubDir, onlyDir) {
  this.starts = function(w) {
    dig(dir, function(err, results) {
      if (err) {
        w(err);
      } else {
        w(results);
      }
    });
  };
  
  function dig(dir, end) {
    //var output = [];
    var output = new fileNode(dir, []);
    Globals.fs.readdir(dir, function(err, list) {
      if (err) {
        return end(err);
      }
      var pending = list.length;
      if (!pending) {
        return end(null, output);
      }
      list.forEach(function(file) {
        file = dir + '\\' + file;
        Globals.fs.stat(file, function(err, stat) {
          if(findSubDir){
            if (stat && stat.isDirectory()) {
                dig(file, function(err, res) {
                    output.children.push(res);
                    if (!--pending){
                      end(null, output);
                    }
                  });
              } else {
                if(onlyDir){
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
            if (stat && stat.isDirectory()) {
              output.children.push(new fileNode(file, []));
                  if (!--pending){
                    end(null, output);
                  }
            } else {
              if(onlyDir){
                --pending;
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

this.open = function(path, findSubDir, onlyDir, gopher) {
  var gopherWalk = new scan(path, findSubDir, onlyDir);
  gopherWalk.starts(function(whatever) {
    gopher(whatever);
  });
};

