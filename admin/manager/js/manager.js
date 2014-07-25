var MANAGERJS = {
	iosocket : null,
	viewedFolders : [],
	initSocketIO : function() {
		MANAGERJS.iosocket = io.connect();
		var timeStamp = function() {
			var now = new Date();
			return ((now.getMonth() + 1) + '/' + (now.getDate()) + '/' + now.getFullYear() + " " + now.getHours() + ':' + ((now.getMinutes() < 10) ? ("0" + now.getMinutes()) : (now.getMinutes())) + ':' + ((now.getSeconds() < 10) ? ("0" + now.getSeconds()) : (now.getSeconds())));
		};
		MANAGERJS.iosocket.on('onconnection', function(value) {
			$("#debug_console").append(timeStamp() + "> connected to server<br>");
		});

		MANAGERJS.iosocket.on('disconnection', function(value) {
			$("#debug_console").append(timeStamp() + "> disconnected to server<br>");
		});

		$("#debug_console").append(timeStamp() + "> call server<br>");
		MANAGERJS.iosocket.emit("HiManager", "");

		// recieve changed values by other client from server
		MANAGERJS.iosocket.on('HiManagerClient', function(recievedData) {
			$("#debug_console").append(timeStamp() + "> " + recievedData.text + "<br>");
		});

		MANAGERJS.iosocket.on('getFolders', function(response) {
			if (response.success) {
				MANAGERJS.displayFilesFolders.asList(response.data);
			}
		});

		MANAGERJS.iosocket.on('openProjectFolder', function(response) {
			if (response.success) {
				if ($('#project_files_view').find('ul').length > 0) {
					var selectedids = $('#project_files_view').jstree('get_selected');
					$('#project_files_view').jstree('enable_node', selectedids);
					$('#project_files_view').jstree('deselect_node', selectedids);
				}
				
				$('#in_projectDir').val(response.data.path);	
				localStorage['selectedProjectPath'] = response.data.path;
				MANAGERJS.displayFilesFolders.asJstree(response.data);
				$('#project_ignorefiles_view').empty();
			}
		});
		
		MANAGERJS.iosocket.on('duplicateAllProjectFiles',function(response){
			if(response.success){
				
			}
		});
		
	}
};
$(document).ready(function() {
	
});
