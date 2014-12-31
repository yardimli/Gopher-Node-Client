function listViewHistory() {
    this.currentAtIndex = -1;
    this.trace = [];
};



$(document).ready(function () {
    var dialogFileListView;
    var IgnoredFiles = [];
    var template = {
        bottomAlert: ''
    };
    
    

    function getQureyString(_name) {
        var url = document.URL;
        console.log(url);
        var queryString = url.substring(url.indexOf('?') + 1);
        var arrQuery = queryString.split('&');
        var result = [];
        for (var i = 0; i < arrQuery.length; i++) {
            var arrNames = arrQuery[i].split('=');
            //console.log(arrNames[0]);
            if (arrNames[0] === _name) {
                result.push(arrNames[1]);
            }
        }
        if (result.length > 0) {
            return result;
        } else {
            return result[0];
        }
    }

    function ajaxGetProjectDetail(_projectID, _beforeSend, _callBack) {
        var sendData = {
            projectID: _projectID
        };

        $.ajax({
            type: 'POST',
            url: 'getProjectDetail.do',
            traditional: true,
            data: sendData,
            beforeSend: function () {
                if (_beforeSend !== null) {
                    _beforeSend();
                }
            },
            success: function (data) {
                var Data = $.parseJSON(data);
                if (Data.detail.ID > 0) {
                    _callBack(null, Data);
                } else {
                    _callBack('Can not get project details.', null);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                _callBack('textStatus:' + textStatus + ' errorThrown:' + errorThrown);
            },
            complete: function (jqXHR, textStatus) {

            }
        });
    }

    function ajaxGetDriveList(_callBack) {
        $.ajax({
            type: 'POST',
            url: 'getDriveList.do',
            traditional: true,
            success: function (data) {
                var dataObj = $.parseJSON(data);

                if (dataObj.length > 0) {
                    $('#select_drive_option ul').empty();

                    $('#current_drive').val(dataObj[0].name);
                    $('#current_drive_val').val(dataObj[0].path);
                    for (var i = 0; i < dataObj.length; i++) {
                        $('#select_drive_option ul').append('<li data-path="' + dataObj[i].path + '">' + dataObj[i].name + '</li>');
                    }
                }
                _callBack(null);
                //console.log(dataObj[0]);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                _callBack('textStatus:' + textStatus + ' errorThrown:' + errorThrown);
            },
            complete: function (jqXHR, textStatus) {

            }
        });
    }

    function ajaxGetFileList(_path, _onlyFolders, _callBack) {
        var sendData = {
            path: _path,
            onlyFolders: _onlyFolders
        };
        $.ajax({
            type: 'POST',
            url: 'getFileList.do',
            traditional: true,
            data: sendData,
            success: function (data) {
                var Data, hasNodeError, errorMessage = '';
                try {
                    Data = $.parseJSON(data);
                    hasNodeError = 0;
                } catch (e) {
                    hasNodeError = 1;
                    if (data.search('UNKNOWN, readdir') > -1) {
                        errorMessage = 'Can not find directory ' + sendData.path;
                    } else {
                        errorMessage = e;
                    }
                }

                if (hasNodeError === 0) {
                    _callBack(null, Data);
                } else {
                    _callBack(errorMessage, null);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                _callBack(textStatus + ' ' + errorThrown, null);
            },
            complete: function (jqXHR, textStatus) {
            }
        });
    }

    function ajaxGetDefaultIgnoredFile(_path, _callBack) {
        var sendData = {
            path: _path
        };
        $.ajax({
            type: 'POST',
            url: 'getDefaultIgnoredFiles.do',
            traditional: true,
            data: sendData,
            success: function (data) {
                var Data, hasNodeError, errorMessage = '';
                try {
                    Data = $.parseJSON(data);
                    hasNodeError = 0;
                } catch (e) {
                    hasNodeError = 1;
                    errorMessage = 'Can not find default ignored files.';
                }

                if (hasNodeError === 0) {
                    _callBack(null, Data);
                } else {
                    _callBack(errorMessage, null);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                _callBack('Can not find default ignored files. Request status: ' + textStatus + ' Error: ' + errorThrown, null);
            },
            complete: function (jqXHR, textStatus) {
            }
        });
    }

    

    function displayFileList(data, listContainer, errorMessage) {
        $(listContainer).find('ul').remove();
        var liClass = 'four';
        if (data.length > 0) {
            $(listContainer).append($('<ul class="' + liClass + '"></ul>'));
            var assignClass;
            for (var i = 0; i < data.length; i++) {
                if (data[i].isDirectory == true) {
                    assignClass = 'item';
                } else {
                    assignClass = 'item file';
                }
                var li = $('<li></li>');
                $(li).attr('class', assignClass);
                $(li).attr('data-path', data[i].path);
                $(li).attr('data-is_directory', data[i].isDirectory);

                $(li).append('<span>' + data[i].name + '</span>');
                $(listContainer).find('ul').append(li.prop('outerHTML'));
            }
        } else {
            console.log('show msg no folders');
            $(listContainer).append('<div class="alert alert-info" role="alert">' + errorMessage + '</div>');
        }

    }

    function updateArrowState(listViewHistoryObj, arrowsContainer) {
        //console.log('current view index '+listViewHistoryObj.currentAtIndex);
        //console.log('trace  '+listViewHistoryObj.trace.length);
        if (listViewHistoryObj.trace.length <= 1) {
            $(arrowsContainer).find('a[data-role="backward"] div').addClass('disabled');
            $(arrowsContainer).find('a[data-role="forward"] div').addClass('disabled');
        } else {
            if (listViewHistoryObj.currentAtIndex === listViewHistoryObj.trace.length - 1) {
                $(arrowsContainer).find('a[data-role="backward"] div').removeClass('disabled');
                $(arrowsContainer).find('a[data-role="forward"] div').addClass('disabled');
            } else if (listViewHistoryObj.currentAtIndex === 0) {
                $(arrowsContainer).find('a[data-role="backward"] div').addClass('disabled');
                $(arrowsContainer).find('a[data-role="forward"] div').removeClass('disabled');
            }
            else {
                $(arrowsContainer).find('a[data-role="backward"] div').removeClass('disabled');
                $(arrowsContainer).find('a[data-role="forward"] div').removeClass('disabled');
            }
        }
    }

    function markIgnoredFiles() {
        $('#new_project_files').find('div[data-role="display files"] li.file').each(function () {
            for (var i = 0; i < IgnoredFiles.length; i++) {
                if ($(this).data('path').toLowerCase() === (IgnoredFiles[i]).toLowerCase()) {
                    $(this).addClass('selected');
                }
            }
        });
    }

    function updateFileIgnoredView(markNow) {
        $('#file_ignored_list').empty();
        $('#file_ignored_list').append('<ul class="ignored-file"></ul>');
        var fileName = function (path) {
            var splashes = path.split('\\');
            return splashes[splashes.length - 1];
        };

        for (var i = 0; i < IgnoredFiles.length; i++) {
            var name = fileName(IgnoredFiles[i]);
            var theRestText = (IgnoredFiles[i]).substring(0, IgnoredFiles[i].length - name.length);
            $('#file_ignored_list ul').append('<li>' + theRestText + '<span class="file-name">' + name + '</span>' + '</li>');
        }
        $('#btn_view_ignored').find('span.badge').text(IgnoredFiles.length);
    }



    /*jQuery events* **************************************************************************************/

    $('#dialog_select_dir').on('show.bs.modal', function () {
        var targetDirElm = $('#dialog_select_dir').find('div[data-role="display files"]');
        $(targetDirElm).css({
            'height': ($('#dialog_select_dir').find('.modal-body').height() - 14) + 'px',
            'width': $('#dialog_select_dir').find('.modal-body').width() + 'px'
        });

        ajaxGetDriveList(function (error) {
            if (error !== null) {
                return false;
            }
            //$('#current_drive_val').val()
            ajaxGetFileList($('#current_drive_val').val(), true, function (error, data) {
                if (error === null) {
                    dialogFileListView = new listViewHistory();
                    dialogFileListView.trace.push($('#current_drive_val').val());
                    dialogFileListView.currentAtIndex = dialogFileListView.currentAtIndex + 1;

                    displayFileList(data, $('#dialog_select_dir').find('div[data-role="display files"]'), 'There has no folders here.');

                    $('#dialog_select_dir').find('div[data-role="current directory"]').text('');
                    updateArrowState(dialogFileListView, $('#dialog_select_dir').find('div[data-role="fileList_arrow_navigate"]'));
                } else {
                    $('#dialog_select_dir').find('div[data-role="display files"]').append('<div class="alert alert-warning" role="alert">' + error + '</div>');
                }
            });
        });
    });

    $('#arrow_select_drive').click(function () {
        $('#select_drive_option').slideDown('fast');
    });

    $('#select_drive_option').on('click', 'li', function () {
        var fileListContainer = $('#dialog_select_dir').find('div[data-role="display files"]');
        var currentDirectory = $('#dialog_select_dir').find('div[data-role="current directory"]');
        var arrowsContainer = $('#dialog_select_dir').find('div[data-role="fileList_arrow_navigate"]');

        $('#current_drive').val($(this).text());
        $('#current_drive_val').val($(this).data('path'));
        $('#select_drive_option').hide();

        $(fileListContainer).find('div[role="alert"]').remove();
        ajaxGetFileList($(this).data('path'), true, function (error, data) {
            $(currentDirectory).text('');
            //$('#'+$(fileListContainer).data('forid')).find('input[data-role="remember home"]').val('0');
            $(fileListContainer).find('ul').remove();

            dialogFileListView = new listViewHistory();
            if (error === null) {
                dialogFileListView.trace.push($('#current_drive_val').val());
                dialogFileListView.currentAtIndex = dialogFileListView.currentAtIndex + 1;

                displayFileList(data, $(fileListContainer), 'There has no folders here.');

            } else {
                $(fileListContainer).append('<div class="alert alert-warning" role="alert">' + error + '</div>');

            }

            updateArrowState(dialogFileListView, arrowsContainer);
        });
    });

    $(document).click(function (e) {
        if ($(e.target).is(':not(#arrow_select_drive)') && $('#arrow_select_drive').has(e.target).length === 0) {
            $('#select_drive_option').hide();
        }
        
        /*if($(e.target).is(':not(#set_gopher_link div[data-role="select arrow"])') && $('#set_gopher_link div[data-role="select arrow"]').has(e.target).length===0){
            $('#gopher_port_option').hide();
        }*/

        /*if( $(e.target).closest('li').data('path') === 'undefined' || $(e.target).closest('li').data('path') === null){
         
         console.log($('#new_project_files').find('div[data-role="display files"] li.item.selected').length);
         if($('#new_project_files').find('div[data-role="display files"] li.item.selected').length === 0){
         $('#btn_ignoreFile').hide();
         }
         
         $('div[data-role="display files"]').find('li').removeClass('selected');
         }*/
    });

    $('div[data-role="display files"]').on('click', 'li', function () {
        var _senderJ = this;
        var listContainer = $(_senderJ).closest('div[data-role="display files"]');
        var arrowsContainer = $('#' + $(listContainer).data('forid')).find('div[data-role="fileList_arrow_navigate"]');
        var getOnlyFolders = $(listContainer).data('only_folders');


        if ($(listContainer).data('multi_select') === false) {
            $(listContainer).find('li').removeClass('selected');
            $(_senderJ).addClass('selected');
        } else {
            console.log($(_senderJ).hasClass('selected'));
            if ($(_senderJ).hasClass('selected')) {
                $(_senderJ).removeClass('selected');
            } else {
                $(_senderJ).addClass('selected');
            }
        }

        if ($(_senderJ).data('is_directory') === true) {
            ajaxGetFileList($(_senderJ).data('path'), getOnlyFolders, function (error, data) {
                if (error === null) {
                    var msg = '';
                    if ($(listContainer).data('forid') === 'new_project_files') {
                        msg = 'There are no javascript files here.';
                    } else {
                        msg = 'There are no folders here.';
                    }
                    displayFileList(data, $(listContainer), msg);
                } else {
                    $(listContainer).find('ul').remove();
                    $(listContainer).append('<div class="alert alert-warning" role="alert">' + error + '</div>');
                }

                var showPath = $(_senderJ).data('path');
                showPath = showPath.replace($('#current_drive').val() + '\\', '');
                $('#' + $(listContainer).data('forid')).find('div[data-role="current directory"]').text(showPath);

                dialogFileListView.trace.push($(_senderJ).data('path'));
                dialogFileListView.currentAtIndex = dialogFileListView.currentAtIndex + 1;

                if (dialogFileListView.trace.length - dialogFileListView.currentAtIndex > 1) {
                    dialogFileListView.trace.splice(dialogFileListView.currentAtIndex, dialogFileListView.trace.length - dialogFileListView.currentAtIndex - 1);
                }

                updateArrowState(dialogFileListView, arrowsContainer);

                if ($(listContainer).data('forid') === 'new_project_files') {
                    markIgnoredFiles();
                }
            });
        }
    });

    $('div[data-role="fileList_arrow_navigate"]').on('click', 'a', function () {
        var forID = $(this).closest('div[data-role="fileList_arrow_navigate"]').data('forid');
        var displayFilesObj = $('#' + forID).find('div[data-role="display files"]');
        var currentDirectoryObj = $('#' + forID).find('div[data-role="current directory"]');
        var arrowsContainerObj = $(this).closest('div[data-role="fileList_arrow_navigate"]');
        var getOnlyFolders = $(displayFilesObj).data('only_folders');

        if ($(this).find('div').hasClass('disabled') === false) {
            switch ($(this).data('role')) {
                case 'backward':
                    dialogFileListView.currentAtIndex = dialogFileListView.currentAtIndex - 1;
                    break;

                case 'forward':
                    dialogFileListView.currentAtIndex = dialogFileListView.currentAtIndex + 1;
                    break;
            }

            $(displayFilesObj).find('div[role="alert"]').remove();

            ajaxGetFileList(dialogFileListView.trace[dialogFileListView.currentAtIndex], getOnlyFolders, function (error, data) {
                if (error === null) {
                    displayFileList(data, displayFilesObj, 'There has no folders here.');
                    markIgnoredFiles();
                } else {
                    $(displayFilesObj).find('ul').remove();
                    $(displayFilesObj).append('<div class="alert alert-warning" role="alert">' + error + '</div>');
                }

                var showPath = dialogFileListView.trace[dialogFileListView.currentAtIndex];
                showPath = showPath.replace($('#current_drive').val() + '\\', '');
                $(currentDirectoryObj).text(showPath);

                updateArrowState(dialogFileListView, arrowsContainerObj);
            });
        }
    });

    $('#btn_openProjectDir').click(function () {
        var selectedPath = $('#current_drive_val').val() + $('#dialog_select_dir').find('div[data-role="current directory"]').text();
        var fileListContainer = $('#new_project_files').find('div[data-role="display files"]');
        var currentDirectory = $('#new_project_files').find('div[data-role="current directory"]');
        var arrowNavigator = $('new_project_files').find('div[data-role="fileList_arrow_navigate"]');

        $('#btn_save_project').removeClass('disabled');
        $('#selected_project_folder').val(selectedPath);
        var fileName = function (path) {
            var splashes = path.split('\\');
            return splashes[splashes.length - 2];
        };
        $('#in_projectName').val(fileName(selectedPath));
        $(fileListContainer).find('div[role="alert"]').remove();

        ajaxGetFileList(selectedPath, false, function (error, data) {
            if (error === null) {
                dialogFileListView = new listViewHistory();
                dialogFileListView.trace.push(selectedPath);
                dialogFileListView.currentAtIndex = dialogFileListView.currentAtIndex + 1;

                displayFileList(data, $(fileListContainer), 'There are no javascript files here.');

                $(currentDirectory).text(selectedPath);
                updateArrowState(dialogFileListView, $(arrowNavigator));

                ajaxGetDefaultIgnoredFile(selectedPath, function (error, data) {
                    if (error === null) {
                        IgnoredFiles = [];
                        for (var i = 0; i < data.length; i++) {
                            IgnoredFiles.push(data[i].toLowerCase());
                        }

                        updateFileIgnoredView();
                        markIgnoredFiles();
                    } else {
                        $('#file_ignored_list').append('<div class="alert alert-warning" role="alert">' + error + '</div>');
                    }
                });
            } else {
                $(fileListContainer).append('<div class="alert alert-warning" role="alert">' + error + '</div>');
            }
        });


    });

    $('#new_project_files').on('click', 'div[data-role="display files"] li.file', function () {
        if ($(this).hasClass('selected')) {
            IgnoredFiles.push($(this).data('path'));
        } else {
            for (var i = 0; i < IgnoredFiles.length; i++) {
                if (($(this).data('path')).toLowerCase() === (IgnoredFiles[i]).toLowerCase()) {
                    IgnoredFiles.splice(i, 1);
                }
            }
        }
        $('#btn_view_ignored').find('span.badge').text(IgnoredFiles.length);
    });

    $('#btn_view_ignored').click(function () {
        $('#new_project_files').find('div[data-role="display files"]').hide();
        $('#new_project_files').find('div[data-role="fileList_arrow_navigate"]').hide();
        $('#new_project_files').find('div[data-role="current directory"]').hide();
        $('#file_ignored_list').fadeIn('fast');
        $('#btn_open_dir_dialog').hide();
        $('#btn_close_fileIgnored').fadeIn('fast');

        updateFileIgnoredView();
    });

    $('#btn_close_fileIgnored').click(function () {
        $('#new_project_files').find('div[data-role="display files"]').fadeIn('fast');
        $('#new_project_files').find('div[data-role="fileList_arrow_navigate"]').fadeIn('fast');
        $('#new_project_files').find('div[data-role="current directory"]').fadeIn('fast');
        $('#file_ignored_list').hide();
        $('#btn_close_fileIgnored').hide();
        $('#btn_open_dir_dialog').fadeIn('fast');
    });

    $('#btn_save_project').click(function () {
        
        if($('#is_gopher_html5').is(':checked')){
           $('#original_project_link').find('input[data-role="host name"]').val('');
           $('#original_project_link').find('input[data-role="port"]').val('');
           $('#original_project_link').find('input[data-role="path"]').val('');
        }
        
        
        var postData = {
            projectID: Number($('#project_id').val()),
            projectName: $('#in_projectName').val(),
            projectFolder: $('#selected_project_folder').val(),
            forwardHostName: $('#original_project_link').find('input[data-role="host name"]').val(),
            forwardHostPort: $('#original_project_link').find('input[data-role="port"]').val(),
            proxyHostName: $('#set_gopher_link').find('input[data-role="host name"]').val(),
            proxyHostPort: $('#set_gopher_link').find('input[data-role="port"]').val(),
            projectLink: 'http://'+ $('#set_gopher_link').find('input[data-role="host name"]').val() + ':' + $('#set_gopher_link').find('input[data-role="port"]').val() + '/' + $('#set_gopher_link').find('input[data-role="path"]').val(),
            ignoredFiles: IgnoredFiles
        };
        console.log('(potsDataa.ignoredFiles)'+postData.ignoredFiles);        

        var alert = $(template.bottomAlert);
        var ramid = Number(new Date());
        $(alert).attr('id', ramid);

        $.ajax({
            type: 'POST',
            url: 'saveProject.do',
            traditional: true,
            data: postData,
            dataType: 'JSON',
            beforeSend: function () {
                $(alert).find('div[data-role="message"]').text('Saving project...');
                $(alert).addClass('loading');
                $('body').append($(alert).prop('outerHTML'));
                $('#' + ramid).fadeIn('fast');
            },
            success: function (response) {
                if(response.error === null){
                    $('#' + ramid).removeClass('loading');
                    $('#' + ramid).addClass('ok');
                    $('#' + ramid).find('div[data-role="message"]').text('Project is Saved!');
                    
                    setTimeout(function () {
                        $('#' + ramid).hide();
                        $('#' + ramid).remove();
                        location.replace('index.html');
                    }, 2500);
                }else{
                    $('#' + ramid).find('div[data-role="message"]').text(response.error);
                    setTimeout(function () {
                        $('#' + ramid).hide();
                        $('#' + ramid).remove();
                    }, 3500);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $('#' + ramid).find('div[data-role="message"]').text('Can not save the project. Request status: ' + textStatus + ' Error: ' + errorThrown);
                setTimeout(function () {
                    $('#' + ramid).hide();
                    $('#' + ramid).remove();
                }, 3500);
            },
            complete: function (jqXHR, textStatus) {
            }
        });
        
        
        
    });
    
    $('#original_project_link input[data-role="path"]').keyup(function(){
        $('#set_gopher_link input[data-role="path"]').val($(this).val());
    });
    
    /*$('#set_gopher_link').on('click','div[data-role="select arrow"]',function(){
       $('#gopher_port_option').slideDown('fast'); 
    });*/
    
    /*$('#gopher_port_option').on('click','li',function(){
       $('#gopher_port').val($(this).text()); 
    });*/
    
    $('#is_gopher_html5').click(function(){
       if($(this).is(':checked')){
           
           $('#set_gopher_link').find('input[data-role="path"]').prop('readonly',false);
           
           $('#original_project_link').slideUp('fast');
       }else{
           $('#original_project_link').find('input[data-role="path"]').val($('#set_gopher_link').find('input[data-role="path"]').val());
           
           $('#set_gopher_link').find('input[data-role="path"]').prop('readonly',true);
           
           $('#original_project_link').slideDown('fast');
       } 
    });
    
    $('#btn_port_auto').click(function () {
        var alert = $(template.bottomAlert);
        var ramid = Number(new Date());
        $(alert).attr('id', ramid);
        
        $.ajax({
            type: 'POST',
            url: 'getAnAvailablePort.do',
            traditional: true,
            dataType: 'JSON',
            beforeSend: function(){
                $(alert).find('div[data-role="message"]').text('Assigning...');
                $(alert).addClass('loading');
                $('body').append($(alert).prop('outerHTML'));
                $('#' + ramid).fadeIn('fast');
            },
            success: function (data) {
                if(data.error === null){
                    $('#set_gopher_link').find('input[data-role="port"]').val(data.port);
                    
                    $('#' + ramid).removeClass('loading');
                    $('#' + ramid).addClass('ok');
                    $('#' + ramid).find('div[data-role="message"]').text('An available gopher port is found!');

                    setTimeout(function () {
                        $('#' + ramid).hide();
                        $('#' + ramid).remove();
                    }, 2500);
                }else{
                    $('#' + ramid).find('div[data-role="message"]').text(data.error);
                    setTimeout(function () {
                       $('#' + ramid).hide();
                       $('#' + ramid).remove();
                   }, 3500);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {

            },
            complete: function (jqXHR, textStatus) {
            }
        });
    });
    
    
    /**** Page Starts *****/
    template.bottomAlert = (function () {
        var elmTxt = $('div[data-role="template-bottom-alert"]').prop('outerHTML');
        var newElm = $(elmTxt).attr('data-role', 'bottom-alert');
        $('div[data-role="template-bottom-alert"]').remove();
        return $(newElm).prop('outerHTML');
    }());

    //Get the poject detail in edit mode
    var projectID = Number(getQureyString('projectID'));
    if (projectID > 0) {
        $('#btn_openProjectDir').removeAttr('data-edit_mode');
        $('#btn_openProjectDir').attr('data-edit_mode',true);
        
        var sendData = {
            projectID: projectID
        };

        $.ajax({
            type: 'POST',
            url: 'getProjectDetail.do',
            traditional: true,
            data: sendData,
            success: function (data) {
                var Data = $.parseJSON(data);
                
                if (Data.detail.ID > 0) {
                    getDetailSuccess(Data);
                } else {
                   // _callBack('Can not get project details.', null);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                //_callBack('textStatus:' + textStatus + ' errorThrown:' + errorThrown);
            },
            complete: function (jqXHR, textStatus) {

            }
        });
        
        
        function getDetailSuccess(data) {
            $('#project_id').val(data.detail.ID);
            $('#in_projectName').val(data.detail.Name);
            $('#selected_project_folder').val(data.detail.FolderPath);
            IgnoredFiles = [];
            for (var i = 0; i < data.ignored.length; i++) {
                IgnoredFiles.push(data.ignored[i].FilePath);
            }

            $('#original_project_link').find('input[data-role="host name"]').val(data.detail.ForwardHostName);
            
            $('#set_gopher_link').find('input[data-role="host name"]').val(data.detail.ProxyHostName);
            $('#set_gopher_link').find('input[data-role="port"]').val(data.detail.ProxyHostPort);
            

            var linkPath = data.detail.ProjectLink.replace('http://' + data.detail.ProxyHostName + ':' + data.detail.ProxyHostPort + '/', '');
            if(data.detail.ForwardHostName === '' && data.detail.ForwardHostPort === 0){
                $('#is_gopher_html5').prop('checked',true);
                $('#original_project_link').find('input[data-role="port"]').val('');
                $('#set_gopher_link').find('input[data-role="path"]').val(linkPath);
                $('#set_gopher_link').find('input[data-role="path"]').prop('readonly',false);
                $('#original_project_link').slideUp('fast');
            }else{
                $('#is_gopher_html5').prop('checked',false);
                $('#original_project_link').find('input[data-role="port"]').val(data.detail.ForwardHostPort);
                $('#original_project_link').find('input[data-role="path"]').val(linkPath);
                $('#set_gopher_link').find('input[data-role="path"]').val(linkPath);
                $('#set_gopher_link').find('input[data-role="path"]').prop('readonly',true);
                $('#original_project_link').slideDown('fast');
            }
            
            
            var selectedPath = $('#current_drive_val').val() + $('#selected_project_folder').val();
            var fileListContainer = $('#new_project_files').find('div[data-role="display files"]');
            var currentDirectory = $('#new_project_files').find('div[data-role="current directory"]');
            var arrowNavigator = $('new_project_files').find('div[data-role="fileList_arrow_navigate"]');

            $('#btn_save_project').removeClass('disabled');
            $('#selected_project_folder').val(selectedPath);
            

            //GET PROJECT FILES 
            $(fileListContainer).find('div[role="alert"]').remove();

            ajaxGetFileList(selectedPath, false, function (error, data) {
                if (error === null) {
                    dialogFileListView = new listViewHistory();
                    dialogFileListView.trace.push(selectedPath);
                    dialogFileListView.currentAtIndex = dialogFileListView.currentAtIndex + 1;

                    displayFileList(data, $(fileListContainer), 'There are no javascript files here.');

                    $(currentDirectory).text(selectedPath);
                    updateArrowState(dialogFileListView, $(arrowNavigator));

                    updateFileIgnoredView();
                    markIgnoredFiles();
                } else {
                    $(fileListContainer).append('<div class="alert alert-warning" role="alert">' + error + '</div>');
                }
            });
        }
       
    }
    
    
});
