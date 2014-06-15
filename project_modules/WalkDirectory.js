var Globals = require("../project_modules/Globals.js");
function fileNode(_path,_children){
  this.path = _path;
  this.children = _children;
}
var scan = function(dir) {
  this.starts = function(w) {
    dig(dir, function(err, results) {
      if (err){
        w(err);
      }else{
         w(results);
      }
    });
  };
  function dig(dir, end) {
    //var output = [];
    var output = new fileNode(dir,[]);
    Globals.fs.readdir(dir, function(err, list) {
      if (err){
        return end(err);
      }
      var pending = list.length;
      if (!pending){
        return end(null, output);
      }
      list.forEach(function(file) {
        file = dir + '\\' + file;
        Globals.fs.stat(file, function(err, stat) {
          if (stat && stat.isDirectory()) {
            dig(file, function(err, res) {
              //output = output.concat(res);
              output.children.push(res);
              if (!--pending)
                end(null, output);
            });
          } else {
            //output.push(file);
            //output.children.push({"path":file});
            output.children.push(new fileNode(file,null));
            if (!--pending)
              end(null, output);
          }
        });
      });
    });
  }
};
var parseGopherTunnel = function(t){
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

this.open = function(path, gopher) {
  var gopherWalk = new scan(path);
  gopherWalk.starts(function(whatever) {
    gopher(whatever);
  });
};

