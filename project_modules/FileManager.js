var Globals = require("../project_modules/Globals.js");
//var util = require('util');
var CommonMethods = {
    getFileExtention: function (_filePath) {
        var targetFile = CommonMethods.getFileName(_filePath);
        if (targetFile.indexOf('.') > -1) {
            var nameArr = targetFile.split('.');
            return nameArr[nameArr.length - 1];
        } else {
            return '';
        }
    },
    isFileAccepted: function (_filePath, _fileTypes) {
        if (_fileTypes.length == 0 || _fileTypes == null) {
            return true;
        } else {
            var countMatch = 0;
            if (CommonMethods.getFileExtention(_filePath) !== '') {
                for (var i = 0; i < _fileTypes.length; i++) {
                    if (_fileTypes[i].toLowerCase().indexOf(CommonMethods.getFileExtention(_filePath)) > -1) {
                        countMatch++;
                    }
                }
            }
            if (countMatch > 0) {
                return true;
            } else {
                return false;
            }
        }
    },
    getFileName: function (_filePath) {
        var fileArr = _filePath.split('\\');
        var targetFile = fileArr[fileArr.length - 1];
        return targetFile;
    },
    getFileNameWithoutExt: function (_filePath) {
        var targetFile = CommonMethods.getFileName(_filePath);
        var nameArr = targetFile.split('.');
        var nameWithoutExt;
        if (nameArr.length > 1) {
            nameWithoutExt = targetFile.substring(0, targetFile.length - ('.' + nameArr[nameArr.length - 1]).length);
        } else {
            nameWithoutExt = targetFile;
        }
        return nameWithoutExt;
    },
    /*copyProjectFile : function(_filePath) {
     var filePathWithoutName = _filePath.substring(0, _filePath.indexOf(CommonMethods.getFileName(_filePath)));
     var readTheFile = Globals.fs.readFileSync(_filePath);
     // readTheFile.on('error', function() {
     // readTheFile.close();
     // return end('Project files duplication operation is stopped because an error occures when reading file ' + file);
     // });
     var writeTheFile = Globals.fs.writeFileSync(watchProjectsPath+CommonMethods.getFileName(_filePath), readTheFile);
     // writeTheFile.on('error', function() {
     // writeTheFile.close();
     // return end('Project files duplication operation is stoped because an error occurs when copy file ' + file);
     // });
     },
     copyModifiedProjectFile : function(_filePath) {
     //NOT DONE YET!! Gopher files is no longer used. Need to change to compare the file from original project folder and the one on gopherB
     var filePathWithoutName = _filePath.substring(0, _filePath.indexOf(CommonMethods.getFileName(_filePath)));
     var readOriginal = Globals.fs.statSync(_filePath);
     
     if (Globals.fs.existsSync(filePathWithoutName + CommonMethods.getGopherFileName(_filePath))) {
     var readDuplicated = Globals.fs.statSync(filePathWithoutName + CommonMethods.getGopherFileName(_filePath));
     if (readOriginal.mtime > readDuplicated.mtime) {
     Globals.fs.writeFileSync(filePathWithoutName + CommonMethods.getGopherFileName(_filePath), Globals.fs.readFileSync(_filePath));
     }
     } else {
     Globals.fs.writeFileSync(filePathWithoutName + CommonMethods.getGopherFileName(_filePath), Globals.fs.readFileSync(_filePath));
     }
     },*/
    isFileFolderIgnored: function (_filePath, _ignoreList) {
        //console.log('========isFileFolderIgnored===========');
        //console.log(_ignoreList);
        var countMatch = 0;
        for (var i = 0; i < _ignoreList.length; i++) {
            if (_ignoreList[i] == _filePath) {
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

function fileNode(_path, _children) {
    this.path = _path;
    this.children = _children;
}

function finderPreferences() {
    this.root = '';
    this.findSubFolder = true;
    this.onlyFindFolders = false;
    this.targetFileType = [];
    return this;
}

function finder(_folderPath, _preferences, end) {
    //console.log('---------WalkDirectory finder is called--------------');
    var output = new fileNode(_folderPath, []);
    var stat;
    Globals.fs.readdir(_folderPath, function (err, list) {
        if (err) {
            console.log('---------WalkDirectory error--------------');
            return end(err);
        }
        var pending = list.length;
        if (!pending) {
            //console.log('---------WalkDirectory !pending ' + pending + '--------------');
            return end(null, output);
        }
        list.forEach(function (file) {
            file = _folderPath + '\\' + file;
            //console.log('---------WalkDirectory forEach----' + file + '-------');
            stat = Globals.fs.statSync(file);
            if (_preferences.findSubFolders) {
                if (stat.isDirectory()) {
                    finder(file, _preferences, function (err, res) {
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
                        if (CommonMethods.isFileAccepted(file, _preferences.targetFileType)) {
                            output.children.push(new fileNode(file, null));
                        }

                        if (!--pending) {
                            end(null, output);
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
                        if (CommonMethods.isFileAccepted(file, _preferences.targetFileType)) {
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

exports.finderPreferences = function () {
    return finderPreferences();
};

exports.findFilesFoldersIn = function (_settings, _callBack) {
    finder(_settings.root, _settings, function (err, results) {
        if (err) {
            _callBack(err);
        } else {
            _callBack(results);
        }
    });
};
