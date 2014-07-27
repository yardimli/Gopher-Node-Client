var myProjects = [];

function defineProjectObject(){
	var crtDateTime = new Date();
	this.id = crtDateTime.getFullYear().toString() + (crtDateTime.getMonth()+1).toString() + crtDateTime.getDate().toString() + crtDateTime.getHours().toString() + crtDateTime.getMinutes().toString() + crtDateTime.getSeconds().toString();
	this.name = '';
	this.filePaths = null; /*must be an object later*/
	this.ignoredFileList = []; /*a flat list of absolute file path*/
	return this;
}

function findAProject(_id){
	for(var i=0; i<myProjects.length; i++){
		if(myProjects[i].id == _id){
			return myProjects[i];
		}
	}
}

exports.addNewProject = function(_projectObj,_callBack){
	var newProjectObj = new defineProjectObject();
	
	if(typeof(_projectObj.name)=='string' && _projectObj.name !=='' ){
		newProjectObj.name = _projectObj.name;
	}
	if(typeof(_projectObj.filePaths)=='object'){
		newProjectObj.filePaths = _projectObj.filePaths;
	}
	if(typeof(_projectObj.ignoredFileList)!=='undefined' && _projectObj.ignoredFileList.length>0 ){
		newProjectObj.ignoredFileList = _projectObj.ignoredFileList;
	}
	myProjects.push(newProjectObj);
	
	_callBack(newProjectObj);
};

exports.findAProject = function(_id,_callBack){
	for(var i=0; i<myProjects.length; i++){
		if(_id == myProjects[i].id){
			_callBack(myProjects[i]);
			break;
		}
	}
};


