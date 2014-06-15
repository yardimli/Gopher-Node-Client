var OpenProject = require('./project_modules/WalkDirectory.js');
OpenProject.open('c:\\wamp\\www\\EgeFlipCard2',function(projectTree){
  console.log(projectTree.errno);
});