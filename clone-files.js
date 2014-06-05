var cloneFiles = function(_projectDirectory) {
  var fileTypes = ['php', 'js', 'html', 'htm'];
  var fs = require('fs');
  this.starts = function() {
    fs.exists(_projectDirectory, function(exists) {
      if (exists) {
        console.log(' read dir called');
        fs.readdir(_projectDirectory, function(err, files) {
          console.log(files);
        });
      } else {
        console.log('directory doens\'t exist.');
      }
    });
  };
};
var doIt = new cloneFiles('c:\\wamp\\www');
doIt.starts();
