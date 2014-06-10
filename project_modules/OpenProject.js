var fs = require('fs');

var scan = function(dir) {
  this.starts = function(w) {
    dig(dir, function(err, results) {
      if (err)
        throw err;
      w(results);
    });
  };
  function dig(dir, end) {
    var output = [];
    fs.readdir(dir, function(err, list) {
      if (err){
        return done(err);
      }
      var pending = list.length;
      if (!pending){
        return end(null, output);
      }
      list.forEach(function(file) {
        file = dir + '\\' + file;
        fs.stat(file, function(err, stat) {
          if (stat && stat.isDirectory()) {
            dig(file, function(err, res) {
              output = output.concat(res);
              if (!--pending)
                end(null, output);
            });
          } else {
            output.push(file);
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

