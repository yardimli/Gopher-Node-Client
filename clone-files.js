var cloneFiles = function(_projectDirectory) {
  var dir = _projectDirectory;
  var fileTypes = ['php', 'js', 'html', 'htm'];
  var fs = require('fs');
  this.starts = function() {
    function dive(dir,end){
      var output=[];
    }
    var output = [];
    (function dive(entity,fn){
      //console.log('call dive');
      fs.readdir(entity,function(err,files){
        
          
        
        var fileIndex=0;
        (function diveIn(){
          var file = files[fileIndex];
          fileIndex++;
          //console.log(fileIndex);
          if(!file){
            return false;
          }
          file = entity + '\\'+file;  
          fs.stat(file,function(err,stat){
            if(stat && stat.isDirectory()){
              //console.log('directory:'+file);
              dive(file,function(err,res){
                output = output.contact(res);
                diveIn();
              });
            }else{
              //console.log('file:'+file);
              output.push(file);
              diveIn();            
            }
          });
        })();
        
        
      
      });
      
    })(_projectDirectory,function(output){
      console.log(output);
    });
    return this.starts;
  };
  function dive(entity){
    console.log('dive'+entity);
    fs.readdir(entity,function(err,files){
      console.log('readdir');
      console.log(err);
    }); 
  }
  function findFileExtension(file) {
    var nameArr = file.split('.');
    return nameArr[nameArr.length-1];
  };
  function isFileAccepted(file){
    var countMatch = 0;
    for(var i=0; i<fileTypes.length; i++){
      if(fileTypes[i].indexOf(findFileExtension(file))>-1){
        countMatch++;
      }
    }
    if(countMatch>0){
      return true;
    }else{
      return false;
    }
  }
  return this;
};
var doIt = new cloneFiles('c:\\wamp\\www\\EgeFlipCard');
doIt.starts(function(whatever) {
  //console.log(whatever);
});
