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
	getFileName : function(_filePath) {
		var fileArr = _filePath.split('\\');
		var targetFile = fileArr[fileArr.length - 1];
		return targetFile;
	},
	getFileNameWithoutExt : function(_filePath) {
		var fileArr = _filePath.split('\\');
		var targetFile = fileArr[fileArr.length - 1];
		var nameArr = targetFile.split('.');
		var nameWithoutExt = targetFile.substring(0, targetFile.length - ('.' + nameArr[nameArr.length - 1]).length);
		return nameWithoutExt;
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
	this.duplicateModified = false;
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
					finder(file, _preferences, function(err, res) {
						output.children.push(res);
						if (!--pending) {
							end(null, output);
						}
					});
				} else {
					if (_preferences.onlyFindFolders) {
						if (!--pending) {
							end(null, output);
						}
					} else {
						if (_preferences.acceptAllTypes || (_preferences.acceptAllTypes == false && CommonMethods.isFileAccepted(file))) {
							output.children.push(new fileNode(file, null));
						}
						if (!--pending) {
							end(null, output);
							
							if (_preferences.duplicateFiles) {
								console.log('duplicating...');
								var duplicateFileName = CommonMethods.getFileNameWithoutExt(file) + '_gopher.' + CommonMethods.getFileExtention(file);
								var originalFilePathWithoutFileName = file.substring(0, CommonMethods.getFileName(file));
								console.log(originalFilePathWithoutFileName + duplicateFileName);
								if (CommonMethods.getFileExtention(file).toLowerCase().indexOf('js') > -1) {
									var readTheFile = Globals.fs.readFileSync(file);
									/*readTheFile.on('error', function() {
										readTheFile.close();
										return end('Project files duplication operation is stopped because an error occures when reading file ' + file);
									});*/
									var writeTheFile = Globals.fs.writeFileSync(originalFilePathWithoutFileName + duplicateFileName, readTheFile);
									/*writeTheFile.on('error', function() {
										writeTheFile.close();
										return end('Project files duplication operation is stoped because an error occurs when copy file ' + file);
									});*/
								}
								
								//overwirteReferenceInFile(originalFilePathWithoutFileName + duplicateFileName);
							}
							
						}
					}
				}
			} else {
				if (stat.isDirectory()) {
					output.children.push(new fileNode(file, []));
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
						if (_preferences.acceptAllTypes || (_preferences.acceptAllTypes == false && CommonMethods.isFileAccepted(file))) {
							output.children.push(new fileNode(file, null));
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

function overwirteReferenceInFile(_filePath) {
	//console.log(_filePath);
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

exports.findAllAndDuplicateFilesIn = function(_settings, _callBack) {
	finder(_settings.root, _settings, function(err, results) {
		if (err) {
			_callBack(err);
		} else {
			_callBack(results);
		}
	});
};

