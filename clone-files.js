var cloneFiles = function(_projectDirectory) {
  var fileTypes = ['php', 'js', 'html', 'htm'];
  var fs = require('fs');
  this.starts = function(w) {
    fs.exists(_projectDirectory, function(exists) {
      if (exists) {
        fs.readdir(_projectDirectory, function(err, files) {
          w(files);
        });
      } else {
        console.log('directory doens\'t exist.');
      }
    });
  };
};
var doIt = new cloneFiles('c:\\wamp\\www');
doIt.starts(function(whatever){
  console.log(whatever);
});
