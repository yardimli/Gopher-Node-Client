var Globals = require("../project_modules/Globals.js");
//var util = require('util');

var CommonMethods = {
	getFileExtention : function(_file) {
		var nameArr = _file.split('.');
		return nameArr[nameArr.length - 1];
	},
	isFileAccepted : function(_file) {
		var acceptedFileType = ['js', 'html', 'htm'];
		var countMatch = 0;
		for (var i = 0; i < acceptedFileType.length; i++) {
			if (acceptedFileType[i].toLowerCase().indexOf(CommonMethods.getFileExtention(_file)) > -1) {
				countMatch++;
			}
		}
		if (countMatch > 0) {
			return true;
		} else {
			return false;
		}
	},
	isItaGopherFile: function(_filePath){
		var nameArr = _filePath.split('.');
		if((nameArr[nameArr.length-2]).indexOf('_gopher')>-1){
			return true;
		}else{
			return false;
		}
	},
	getFileName : function(_filePath) {
		var fileArr = _filePath.split('\\');
		var targetFile = fileArr[fileArr.length - 1];
		return targetFile;
	},
	getGopherFileName: function(_filePath){
		return CommonMethods.getFileNameWithoutExt(_filePath) + '_gopher.' + CommonMethods.getFileExtention(_filePath);
	},
	getFileNameWithoutExt : function(_filePath) {
		var fileArr = _filePath.split('\\');
		var targetFile = fileArr[fileArr.length - 1];
		var nameArr = targetFile.split('.');
		var nameWithoutExt = targetFile.substring(0, targetFile.length - ('.' + nameArr[nameArr.length - 1]).length);
		return nameWithoutExt;
	},
	copyProjectFile : function(_filePath) {
		var filePathWithoutName = _filePath.substring(0, _filePath.indexOf(CommonMethods.getFileName(_filePath)));
		var readTheFile = Globals.fs.readFileSync(_filePath);
		/*readTheFile.on('error', function() {
		 readTheFile.close();
		 return end('Project files duplication operation is stopped because an error occures when reading file ' + file);
		 });*/
		var writeTheFile = Globals.fs.writeFileSync(filePathWithoutName + CommonMethods.getGopherFileName(_filePath), readTheFile);
		/*writeTheFile.on('error', function() {
		 writeTheFile.close();
		 return end('Project files duplication operation is stoped because an error occurs when copy file ' + file);
		 });*/
	},
	copyModifiedProjectFile: function(_filePath){
		var filePathWithoutName = _filePath.substring(0, _filePath.indexOf(CommonMethods.getFileName(_filePath)));
		var readOriginal = Globals.fs.statSync(_filePath);
		
		if(Globals.fs.existsSync(filePathWithoutName + CommonMethods.getGopherFileName(_filePath))){
			var readDuplicated = Globals.fs.statSync(filePathWithoutName + CommonMethods.getGopherFileName(_filePath));
			if(readOriginal.mtime > readDuplicated.mtime){
				//console.log('duplicate file:'+_filePath);
				Globals.fs.writeFileSync(filePathWithoutName + CommonMethods.getGopherFileName(_filePath), Globals.fs.readFileSync(_filePath));
			}
		}else{
			Globals.fs.writeFileSync(filePathWithoutName + CommonMethods.getGopherFileName(_filePath), Globals.fs.readFileSync(_filePath));
		}
	},
	isFileFolderIgnored: function(_filePath,_ignoreList){
		//console.log('========isFileFolderIgnored===========');
		//console.log(_ignoreList);
		var countMatch = 0;
		for(var i=0; i<_ignoreList.length; i++){
			if(_ignoreList[i] == _filePath){
				countMatch ++;
			}
		}
		if(countMatch>0){
			return true;
		}else{
			return false;
		}
	}
};

function fileNode(_path, _children) {
	this.path = _path;
	this.children = _children;
}

function finderPreferences() {
	this.root = '';
	this.findSubFolder = true;
	this.onlyFindFolders = false;
	this.acceptAllTypes = true;
	this.duplicateFiles = false;
	this.checkModified = false;
	this.ignoredFilesFolders = [];
	return this;
}

function finder(_folderPath, _preferences, end) {
	//console.log('---------WalkDirectory finder is called--------------');
	var output = new fileNode(_folderPath, []);
	var stat;
	Globals.fs.readdir(_folderPath, function(err, list) {
		if (err) {
			console.log('---------WalkDirectory error--------------');
			return end(err);
		}
		var pending = list.length;
		if (!pending) {
			//console.log('---------WalkDirectory !pending ' + pending + '--------------');
			return end(null, output);
		}
		list.forEach(function(file) {
			file = _folderPath + '\\' + file;
			//console.log('---------WalkDirectory forEach----' + file + '-------');
			stat = Globals.fs.statSync(file);
			if (_preferences.findSubFolders) {
				if (stat.isDirectory()) {
					if(CommonMethods.isFileFolderIgnored(file,_preferences.ignoredFilesFolders)==false){
						finder(file, _preferences, function(err, res) {
							output.children.push(res);
							if (!--pending) {
								end(null, output);
							}
						});
					}
				} else {
					if (_preferences.onlyFindFolders) {
						if (!--pending) {
							end(null, output);
						}
					} else {
						if(CommonMethods.isItaGopherFile(file)==false && CommonMethods.isFileFolderIgnored(file,_preferences.ignoredFilesFolders)==false){
							if (_preferences.acceptAllTypes || (_preferences.acceptAllTypes == false && CommonMethods.isFileAccepted(file))) {
									output.children.push(new fileNode(file, null));
									if (_preferences.duplicateFiles) {
										if(_preferences.checkModified == false){
											CommonMethods.copyProjectFile(file);	
										}else{
											CommonMethods.copyModifiedProjectFile(file);
										}
									}					
							}
						}else{
							var originalProjectFile = file.substring(0,file.indexOf('_gopher.'+CommonMethods.getFileExtention(file))) + '.'+ CommonMethods.getFileExtention(file);
							if(Globals.fs.existsSync(originalProjectFile) == false){
								Globals.fs.unlinkSync(file);
							}
						}
						if (!--pending) {
							end(null, output);
						}
					}
				}
			} else {
				if (stat.isDirectory()) {
					if(CommonMethods.isFileFolderIgnored(file,_preferences.ignoredFilesFolders)==false){
						output.children.push(new fileNode(file, []));
					}
					if (!--pending) {
						end(null, output);
					}
				} else {
					if (_preferences.onlyFindFolders) {
						if (!--pending) {
							end(null, output);
						}
						//console.log('---------WalkDirectory skip subFolders/_onlyFindFolders pending ' + pending + '--------------');
					} else {
						if(CommonMethods.isItaGopherFile(file)==false && CommonMethods.isFileFolderIgnored(file,_preferences.ignoredFilesFolders)==false){
							if (_preferences.acceptAllTypes || (_preferences.acceptAllTypes == false && CommonMethods.isFileAccepted(file))) {
								output.children.push(new fileNode(file, null));
								if (_preferences.duplicateFiles) {
									if(_preferences.checkModified == false){
										CommonMethods.copyProjectFile(file);	
									}else{
										CommonMethods.copyModifiedProjectFile(file);
									}
								}
							}
						}else{
							var originalProjectFile = file.substring(0,file.indexOf('_gopher.'+CommonMethods.getFileExtention(file))) + '.'+CommonMethods.getFileExtention(file);
							if(Globals.fs.existsSync(originalProjectFile) == false){
								Globals.fs.unlinkSync(file);
							}
						}
						if (!--pending) {
							end(null, output);
						}
					}
				}
			}
		});
	});
}

exports.finderPreferences = function() {
	return finderPreferences();
};

exports.findFilesFoldersIn = function(_settings, _callBack) {
	finder(_settings.root, _settings, function(err, results) {
		if (err) {
			_callBack(err);
		} else {
			_callBack(results);
		}
	});
};

var path = 'JS';
console.log(path.split('.'));






