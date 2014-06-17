var OpenProject = require('./project_modules/WalkDirectory.js');

var path = require("path");
var os = require("os");
var root = (os.platform == "win32") ? process.cwd().split(path.sep)[0] : "/";
console.log(root);

OpenProject.open('c:\\wamp\\www\\EgeFlipCard', true, true, function(projectTree){
  console.log(projectTree);
});