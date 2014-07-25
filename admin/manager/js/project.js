var PROJECTJS = {
	iosocket : null,
	viewedFolders : [],
	initSocketIO : function() {
		PROJECTJS.iosocket = io.connect();
		var timeStamp = function() {
			var now = new Date();
			return ((now.getMonth() + 1) + '/' + (now.getDate()) + '/' + now.getFullYear() + " " + now.getHours() + ':' + ((now.getMinutes() < 10) ? ("0" + now.getMinutes()) : (now.getMinutes())) + ':' + ((now.getSeconds() < 10) ? ("0" + now.getSeconds()) : (now.getSeconds())));
		};
		PROJECTJS.iosocket.on('onconnection', function(value) {
			$("#debug_console").append(timeStamp() + "> connected to server<br>");
		});

		PROJECTJS.iosocket.on('disconnection', function(value) {
			$("#debug_console").append(timeStamp() + "> disconnected to server<br>");
		});

		$("#debug_console").append(timeStamp() + "> call server<br>");
		PROJECTJS.iosocket.emit("HiManager", "");

		// recieve changed values by other client from server
		PROJECTJS.iosocket.on('HiManagerClient', function(recievedData) {
			$("#debug_console").append(timeStamp() + "> " + recievedData.text + "<br>");
		});

		PROJECTJS.iosocket.on('getFolders', function(response) {
			if (response.success) {
				PROJECTJS.displayFilesFolders.asList(response.data);
			}
		});

		PROJECTJS.iosocket.on('openProjectFolder', function(response) {
			if (response.success) {
				if ($('#project_files_view').find('ul').length > 0) {
					var selectedids = $('#project_files_view').jstree('get_selected');
					$('#project_files_view').jstree('enable_node', selectedids);
					$('#project_files_view').jstree('deselect_node', selectedids);
				}
				
				$('#in_projectDir').attr('placeholder',response.data.path);
				localStorage['selectedProjectPath'] = response.data.path;
				PROJECTJS.displayFilesFolders.asJstree(response.data);
				$('#project_ignorefiles_view').empty();
			}
		});
		
		PROJECTJS.iosocket.on('duplicateAllProjectFiles',function(response){
			if(response.success){
				
			}
		});
		
	}
};

PROJECTJS.myEvents = {
	isMouseMoveOverTree : false,
	project_files_view_mouseover : function(_senderJ) {
		PROJECTJS.myEvents.isMouseMoveOverTree = true;
	},
	project_files_view_mouseout : function(_senderJ) {
		PROJECTJS.myEvents.isMouseMoveOverTree = false;
	},
	document_mouseover : function(e) {
		if (PROJECTJS.myEvents.isMouseMoveOverTree) {
			if ($(e.target).is(':not(#btn_ignoreFile,a.jstree-anchor,a.jstree-anchor>i.jstree-icon)')) {
				$('#btn_ignoreFile').find('input[type="hidden"]').val('');
				$('#btn_ignoreFile').hide();
			}
		}
	},
	dialog_select_dir_show : function() {
		$('#target_dir').css({
			'height' : ($('#dialog_select_dir').find('.modal-body').height() - 14) + 'px',
			'width' : $('#dialog_select_dir').find('.modal-body').width() + 'px'
		});
		PROJECTJS.viewedFolders = [];
		PROJECTJS.iosocket.emit('_getFolders', {
			target : 'c:\\wamp\\www'
		});
	},
	target_dir_li_click : function(_senderJ) {
		$('#target_dir').find('li').removeClass('selected');
		$(_senderJ).addClass('selected');
		var clickCount = $(_senderJ).find('input[type=hidden]').val();
		if ($(_senderJ).hasClass('item')) {
			if (Number(clickCount) === 0) {
				var doubleClick = setTimeout(function() {
					var watchCount = $(_senderJ).find('input[type=hidden]').val();
					$(_senderJ).find('input[type=hidden]').val(0);
					if (Number(watchCount) >= 2) {
						$(_senderJ).removeClass('selected');
						PROJECTJS.viewedFolders.push($('#current_dir').text());
						PROJECTJS.iosocket.emit('_getFolders', {
							target : $(_senderJ).data('path')
						});
					}
				}, 300);
			}
			clickCount++;
			$(_senderJ).find('input[type=hidden]').val(clickCount);
		} else if ($(_senderJ).hasClass('up')) {
			PROJECTJS.viewedFolders.splice(PROJECTJS.viewedFolders.length - 1, 1);
			PROJECTJS.iosocket.emit('_getFolders', {
				target : $(_senderJ).data('path')
			});
		}
	},
	btn_openProjectDir : function(_folderPath) {	
		PROJECTJS.iosocket.emit('_openProjectFolder', {
			target : _folderPath
		}); 
	},
	btn_ignoreFile_click: function(_senderJ){
		var selectedNodeId = $('#input_setSelectedNodeId').val();
		var selectedNodeObj = $('#project_files_view').jstree('get_node',selectedNodeId);
		console.log(selectedNodeObj);
		
		var nameArr = selectedNodeObj.text.split('.');
		if(selectedNodeObj.children_d.length==0 && nameArr[nameArr.length-1].toLowerCase()=='js'){
			if($('#project_files_view').jstree('is_disabled',selectedNodeObj.id)){
				$('#project_files_view').jstree('deselect_node',selectedNodeObj.id);
				$('#project_files_view').jstree('enable_node',selectedNodeObj.id);
			}else{
				$('#project_files_view').jstree('select_node',selectedNodeObj.id);
				$('#project_files_view').jstree('disable_node',selectedNodeObj.id);
			}
			toggleBtnLabel();
		}else{
			var selectCommand = '', enableCommand='';
			if($('#project_files_view').jstree('is_disabled',selectedNodeObj.id)){
				selectCommand = 'deselect_node';
				enableCommand = 'enable_node';
			}else{
				selectCommand = 'select_node';
				enableCommand = 'disable_node';
			}
			var childrenIds = selectedNodeObj.children_d;
			var countJsMatch = 0;
			for (var i = 0; i < childrenIds.length; i++) {
				var childNode = $('#project_files_view').jstree('get_node', childrenIds[i]);
				var nameArr = childNode.text.split('.');
				if ((nameArr[nameArr.length - 1]).toLowerCase() == 'js') {
					$('#project_files_view').jstree(selectCommand, childNode.id);
					$('#project_files_view').jstree(enableCommand, childNode.id);
					countJsMatch ++;
					checkChildrenState(childNode.id,0);
				}
			}
			if(countJsMatch>0){
				toggleBtnLabel();
			}else{
				$('#btn_ignoreFile').hide();
				$('#input_setSelectedNodeId').val('');
			}
		}
		checkChildrenState(selectedNodeObj.id,0);
		PROJECTJS.ignoredFilesFolders.display();
		
		function toggleBtnLabel(){
			if ($('#project_files_view').jstree('is_disabled', selectedNodeObj.id)) {
				$(_senderJ).text($(_senderJ).attr('data-whendisable'));
			} else {
				$(_senderJ).text($(_senderJ).attr('data-whenenable'));
			}
		}
		
		function checkChildrenState(_jstreeId,_countParentChecked){
			var treeNode = $('#project_files_view').jstree('get_node', _jstreeId);
			
			if(_countParentChecked < treeNode.parents.length){
				if (treeNode.parents[_countParentChecked] !== '#') {
					var childNodeIds = $('#project_files_view').jstree('get_node', treeNode.parents[_countParentChecked]).children_d;
					var countDisabled = 0, countEnabled = 0;
					for (var j = 0; j < childNodeIds.length; j++) {
						if ($('#project_files_view').jstree('is_disabled', childNodeIds[j])) {
							countDisabled++;
						}else{
							countEnabled++;
						}
					}
					if (countDisabled == childNodeIds.length) {
						$('#project_files_view').jstree('select_node', treeNode.parents[_countParentChecked]);
						$('#project_files_view').jstree('disable_node', treeNode.parents[_countParentChecked]);
						_countParentChecked++;
						checkChildrenState(_jstreeId,_countParentChecked);
					}else if(countEnabled == childNodeIds.length || countDisabled<childNodeIds.length){
						$('#project_files_view').jstree('deselect_node', treeNode.parents[_countParentChecked]);
						$('#project_files_view').jstree('enable_node', treeNode.parents[_countParentChecked]);
						_countParentChecked++;
						checkChildrenState(_jstreeId,_countParentChecked);
					}
				}
			}
		}
		//console.log($('#project_files_view').jstree().get_selected(true));
	},
	btn_doneSetup_click:function(_senderJ){
		/*
		 NOT DONE YET!! Check any server script files, only duplicate files if this is a pure html5 project.s
		 * */
	}
};

PROJECTJS.displayFilesFolders = {
	fileName : function(_takePath) {
		var strArr = _takePath.split('\\');
		return strArr[(strArr.length - 1)];
	},
	safeFilePath : function(_filePath) {
		return _filePath.replace(/\\/g, '\\');
	},
	asList : function(_data) {
		$('#target_dir').empty();
		$('#current_dir').text(_data.path);
		var liClass = 'two';
		if (_data.children.length > 20) {
			liClass = 'four';
		}
		$('#target_dir').append($('<ul class="' + liClass + '"></ul>'));
		if (PROJECTJS.viewedFolders.length > 0) {
			$('#target_dir').find('ul').append('<li class="up" data-path="' + PROJECTJS.displayFilesFolders.safeFilePath(PROJECTJS.viewedFolders[PROJECTJS.viewedFolders.length - 1]) + '"><b>[...]</b></li>');
		}
		if (_data.children.length > 0) {
			for (var i = 0; i < _data.children.length; i++) {
				$('#target_dir').find('ul').append('<li class="item" data-path="' + PROJECTJS.displayFilesFolders.safeFilePath(_data.children[i].path) + '"><span>' + PROJECTJS.displayFilesFolders.fileName(_data.children[i].path) + '</span><input type="hidden" value="0"/></li>');
			}
		}
	},
	asJstree : function(_data) {
		$('#project_files_view').on('hover_node.jstree', function(e, data) {
			var nameArr = data.node.text.split('.');	
			$('#btn_ignoreFile').removeAttr('data-whenenable');		
			$('#btn_ignoreFile').removeAttr('data-whendisable');
			if(data.node.children_d.length==0){
				//it's  file node
				if(nameArr[nameArr.length-1].toLowerCase() == 'js'){
					$('#btn_ignoreFile').attr('data-whenenable','Ignore it');
					$('#btn_ignoreFile').attr('data-whendisable','Watch it');
					showIgnoreFileBtn(data.node.id);
				}else{
					hideIgnoreFileBtn();
				}
			}else{
				//it's a folder
				if(data.node.text !== '.git' && data.node.id!=='j1_1'){
					$('#btn_ignoreFile').attr('data-whenenable','Ignore all .js insdie');
					$('#btn_ignoreFile').attr('data-whendisable','Watch all .js inside');
					showIgnoreFileBtn(data.node.id);
				}else{
					hideIgnoreFileBtn();
				}
			}
			function showIgnoreFileBtn(treeNodeId){
				var nodeItem = $('#' + treeNodeId).find('a.jstree-anchor');
				var nodeWidth = $(nodeItem).width();
				var nodeOffset = $(nodeItem).offset();
				var nodePosition = $(nodeItem).position();
				$('#btn_ignoreFile').css({
					top : nodePosition.top + 'px',
					left : nodePosition.left + nodeWidth + 5 + 'px'
				});
				if($('#project_files_view').jstree('is_disabled',treeNodeId)==false){
					$('#btn_ignoreFile').text($('#btn_ignoreFile').attr('data-whenenable'));
				}else{
					$('#btn_ignoreFile').text($('#btn_ignoreFile').attr('data-whendisable'));
				}
				$('#btn_ignoreFile').show();
				$('#btn_ignoreFile').fadeIn();
				$('#input_setSelectedNodeId').val(treeNodeId);
			}
			function hideIgnoreFileBtn(){
				$('#btn_ignoreFile').hide();
				$('#input_setSelectedNodeId').val('');
			}
		}).on('disable_node.jstree',function(e,data){
			if(data.node.id == 'j1_1'){
				$('#select_projectfiles').find('div[role="alert"]').fadeIn();
			}
		}).jstree({
			core : {
				data : convertToJstreeObj(_data)
			}
		});

		if ($('#project_files_view').find('ul').length > 0) {
			$('#project_files_view').jstree(true).settings.core.data = convertToJstreeObj(_data);
			$('#project_files_view').jstree(true).refresh();
		}

		function convertToJstreeObj(_obj) {
			function node(_text, _path, _opened, _selected, _icon, _children) {
				var icon;
				if (_icon !== null) {
					icon = _icon;
				}
				return {
					text : _text,
					path : _path,
					state : {
						opened : _opened,
						selected : _selected
					},
					icon : icon,
					children : _children
				};
			}

			//var testObj = {path:'flipcard',children:[{path:'main.js',children:null},{path:'index.html',children:null},{path:'card.json',children:null},{path:'git',children:[{path:'config',children:[{path:'git\\maing.config',children:null},{path:'git\\sub.config',children:null}]}]},{path:'blabla\\nbproject',children:[{path:'blabla\\history',children:null}]}]};
			//console.log('======testObj=======');
			//console.log(testObj);
			if (_obj !== undefined) {
				//_obj = testObj;
				var jstreeObj = [];
				function makeJstreeObj(title, path, runObj, end) {
					//console.log('*'+runObj[0].path+'*');
					var output = new node(title, path, false, false, null, []);
					//console.log('-----test is called:'+JSON.stringify(runObj)+'-----');
					var unfinished = runObj.length;
					//console.log(title);
					//console.log('-----first unfinished:'+unfinished+'-------');
					if (!unfinished) {
						return end(output);
					}
					for (var i = 0; i < runObj.length; i++) {
						//console.log('---i:'+i+'------');
						if (runObj[i].children !== null) {
							//console.log('----- runObj[i].children!==null,'+runObj[i].path+'------');
							makeJstreeObj(PROJECTJS.displayFilesFolders.fileName(runObj[i].path), runObj[i].path, runObj[i].children, function(res) {
								/*console.log('----- res ----');
								 console.log(res);
								 console.log('----- end of res ----');*/
								output.children.push(res);
								unfinished--;
								if (unfinished <= 0) {
									//console.log(unfinished);
									end(output);
								}
							});
						} else {
							//console.log('----- runObj[i].children!==null else,'+runObj[i].path+'------')
							output.children.push(new node(PROJECTJS.displayFilesFolders.fileName(runObj[i].path), runObj[i].path, false, false, 'images/file-32.png', null));
							unfinished--;
							if (unfinished <= 0) {
								//console.log(unfinished);
								end(output);
							}
						}
					}
				}

				makeJstreeObj(PROJECTJS.displayFilesFolders.fileName(_obj.path), _obj.path, _obj.children, function(result) {
					jstreeObj.push(result);
				});
				/*console.log('======jstreeObj========');
				 console.log(jstreeObj);
				 console.log(JSON.stringify(jstreeObj));
				 console.log('======end of jstreeObj========');*/
				localStorage['currentJstreeData'] = JSON.stringify(jstreeObj);
				return jstreeObj;
			} else {
				localStorage['currentJstreeData'] = '';
				return null;
			}
		}
	},
};

PROJECTJS.ignoredFilesFolders = {
	getList: function(asRaw){
		var jstreeNodeIds = $('#project_files_view').jstree().get_selected();
		var list = [];
		for(var i=0; i<jstreeNodeIds.length; i++){
			var nodeId = jstreeNodeIds[i];
			var nodeObj = $('#project_files_view').jstree('get_node', nodeId);
			if(asRaw){
				list.push(nodeObj.original.path);
			}else{
				list.push({path: nodeObj.original.path, treeNodeId: nodeId});
			}
		}
		return list;
	},
	display: function(){
		var gotList = PROJECTJS.ignoredFilesFolders.getList(false);
		$('#project_ignorefiles_view').empty();
		for(var i=0; i<gotList.length; i++){
			var displayName = gotList[i].path.replace($('#project_files_view').jstree('get_text','j1_1'),'');
			displayName = markTheLastInPath(displayName);
			$('#project_ignorefiles_view').append('<div data-treenodeid="'+gotList[i].treeNodeId+'">'+ displayName +'</div>');
		}
		$('#project_ignoreFiles_view').on('click','div',function(){
			$('#project_files_view').jstree('select_node', $(this).data('treenodeid'));
		});
		
		function markTheLastInPath(_filePath){
			var namearr = _filePath.split('\\');
			var allButLastPart = _filePath.substring(0,_filePath.indexOf(namearr[namearr.length-1]));
			return allButLastPart + '<font color="#83ECFC"><b>'+namearr[namearr.length-1]+'</b></font>';
		}
	}
};


$(document).ready(function() {
	$('#debug_console').toggleClass('hideme');
	PROJECTJS.initSocketIO();

	if (localStorage['selectedProjectPath'] !== undefined && localStorage['selectedProjectPath'] !== '') {
		/*var originalPath = localStorage['selectedProjectPath'];
		originalPath = originalPath.replace(/\\\\/g, '\\');
		console.log('has local selectedProject path');*/
		PROJECTJS.myEvents.btn_openProjectDir(localStorage['selectedProjectPath']);
	}

	$('#dialog_select_dir').on('show.bs.modal', function() {
		PROJECTJS.myEvents.dialog_select_dir_show();
	});
	$('#btn_openProjectDir').click(function() {
		PROJECTJS.myEvents.btn_openProjectDir($('#target_dir').find('li.selected').data('path'));
	});
	$('#target_dir').on('click', 'li', function() {
		PROJECTJS.myEvents.target_dir_li_click($(this));
	});
	$('#project_files_view').mouseout(function() {
		PROJECTJS.myEvents.project_files_view_mouseout($(this));
	});
	$('#project_files_view').mouseover(function() {
		PROJECTJS.myEvents.project_files_view_mouseover($(this));
	});
	$(document).mouseover(function(e) {
		PROJECTJS.myEvents.document_mouseover(e);
	});
	$('#debug_console').click(function() {
		$(this).toggleClass('hideme');
	});
	$('#btn_ignoreFile').click(function(){
		PROJECTJS.myEvents.btn_ignoreFile_click($(this));
	});
	$('#btn_doneSetup').click(function(){
		PROJECTJS.myEvents.btn_doneSetup_click($(this));
	});
	
	
});
