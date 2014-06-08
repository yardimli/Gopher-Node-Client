var cloneFiles = function(_projectDirectory) {
  var dir = _projectDirectory;
  var fileTypes = ['php', 'js', 'html', 'htm'];
  var fs = require('fs');
  this.starts = function(w) {
	(function dive(dir){
		var output=[];
		var c=0;
		(function circle(dir){
			c++;
			if(c<4){
			fs.readdir(dir,function(err,files){
				files.forEach(function(file){
					output.push(file);
					circle(dir);
				});	
			console.log(c);
			
			});
			}else{
				return w(output);
			}
		})(dir);
		
	})(dir);
	
    /*w((function dive(entity,w){
		var output = {
			'path':entity,
			'children':[]
		}
		fs.readdir(entity,function(err,files){
		
			var fl = files.length;
			if(!fl){
				return w(null,output);
			}
			files.forEach(function(file){
				fs.stat(entity+'\\'+file,function(err,stat){
					if(stat.isDirectory()){
						//console.log(true);
					}else{
						output.children.push({'path':entity+'\\'+file});
						if(!fl){
							return output;
						}
						//console.log(output);
					}
					console.log(output);
				});
				
			});
			
		});
		return output;
    })(_projectDirectory,w));*/
    return this.starts;
  };
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
  console.log(whatever);
});
