function listViewHistory(){
    this.currentAtIndex = -1;
    this.trace = [];
};

$(document).ready(function () {  
    var dialogFileListView;
    
    function ajaxGetDriveList(_callBack){
        $.ajax({
            type: 'POST',
            url: 'getDriveList.do',
            traditional: true,
            success: function (data) {
                var dataObj = $.parseJSON(data);
                
                if(dataObj.length>0){
                    $('#select_drive_option ul').empty();
                    
                    $('#current_drive').val(dataObj[0].name);
                    $('#current_drive_val').val(dataObj[0].path);
                    for(var i=0; i<dataObj.length; i++){
                        $('#select_drive_option ul').append('<li data-path="'+dataObj[i].path+'">'+dataObj[i].name+'</li>');
                    }
                }
                _callBack(null);
                //console.log(dataObj[0]);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                _callBack('textStatus:'+textStatus+' errorThrown:'+errorThrown);
            },
            complete: function (jqXHR, textStatus) {
                
            }
        });
    }
    
    function ajaxGetFileList(_path,_onlyFolders,_callBack){
        var sendData = {
            path: _path,
            onlyFolders: _onlyFolders
        };
        $.ajax({
            type: 'POST',
            url: 'getFileList.do',
            traditional: true,
            data: sendData,
            success: function(data){
                var Data, hasNodeError, errorMessage = '';
                try{
                    Data = $.parseJSON(data);
                    hasNodeError = 0;
                }catch(e){
                    hasNodeError = 1;
                    if(data.search('UNKNOWN, readdir')>-1){
                        errorMessage = 'Can not find directory '+ sendData.path;
                    }else{
                        errorMessage = e;
                    }
                }
                
                if(hasNodeError === 0){
                    _callBack(null, Data);
                }else{
                    _callBack(errorMessage, null);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                _callBack(textStatus+' '+errorThrown, null);
            },
            complete: function (jqXHR, textStatus) {
            }
        });
    }
    
    function displayFileList(data, listContainer, showCheckbox) {
        $(listContainer).empty();
        var liClass = 'two';
        if (data.length > 20) {
            liClass = 'four';
        }
        if (data.length > 0) {
            $(listContainer).append($('<ul class="' + liClass + '"></ul>'));
            var assignClass;
            for (var i = 0; i < data.length; i++) {
                if(data[i].isDirectory == true){
                    assignClass = 'item';
                }else{
                    assignClass = 'item file';
                }
                var li = $('<li></li>');
                $(li).attr('class',assignClass);
                $(li).attr('data-path',data[i].path);
                $(li).attr('data-is_directory', data[i].isDirectory);
                
                var isExtValid = function(fileName){
                    fileName = fileName.toLowerCase();
                    var dots = fileName.split('.');
                    if( dots[dots.length-1].search('js') == -1){
                        return false;
                    }else{
                        return true;
                    }
                };
                
                if(typeof(showCheckbox)!=='undefined' && showCheckbox === true){
                    if(data[i].isDirectory == true || isExtValid(data[i].name)){
                        $(li).append('<div data-role="checkbox" class="not-checked"></div>');
                    }
                }
                $(li).append('<span>' + data[i].name + '</span>');
                $(li).append('<input type="hidden" value="0"/>');
                $(listContainer).find('ul').append(li.prop('outerHTML'));
            }
        } else {
            $(listContainer).append('<div class="alert alert-info" role="alert">There has no folders here.</div>');
        }

    }
    
    function updateArrowState(listViewHistoryObj, arrowsContainer){
        //console.log('current view index '+listViewHistoryObj.currentAtIndex);
        //console.log('trace  '+listViewHistoryObj.trace.length);
        if(listViewHistoryObj.trace.length <= 1 ){
            $(arrowsContainer).find('a[data-role="backward"] div').addClass('disabled');
            $(arrowsContainer).find('a[data-role="forward"] div').addClass('disabled');
        }else{
            if(listViewHistoryObj.currentAtIndex === listViewHistoryObj.trace.length-1){
                $(arrowsContainer).find('a[data-role="backward"] div').removeClass('disabled');
                $(arrowsContainer).find('a[data-role="forward"] div').addClass('disabled');
            }else if(listViewHistoryObj.currentAtIndex === 0){
                $(arrowsContainer).find('a[data-role="backward"] div').addClass('disabled');
                $(arrowsContainer).find('a[data-role="forward"] div').removeClass('disabled');
            }
            else{
                $(arrowsContainer).find('a[data-role="backward"] div').removeClass('disabled');
                $(arrowsContainer).find('a[data-role="forward"] div').removeClass('disabled');
            }
        }
    }

    
    
    /*jQuery events* **************************************************************************************/
    
    $('#dialog_select_dir').on('show.bs.modal', function () {
        $('#target_dir').css({
            'height': ($('#dialog_select_dir').find('.modal-body').height() - 14) + 'px',
            'width': $('#dialog_select_dir').find('.modal-body').width() + 'px'
        });
        $('#btn_openProjectDir').addClass('disabled');
        
        ajaxGetDriveList(function(error){
            if(error !== null){
                return false;
            }
            //$('#current_drive_val').val()
            ajaxGetFileList($('#current_drive_val').val(), true, function(error,data){
                if(error === null){
                    dialogFileListView = new listViewHistory();
                    dialogFileListView.trace.push($('#current_drive_val').val());
                    dialogFileListView.currentAtIndex = dialogFileListView.currentAtIndex+1;

                    displayFileList(data,$('#dialog_select_dir').find('div[data-role="display files"]'));

                    $('#dialog_select_dir').find('div[data-role="current directory"]').text(''); 
                    updateArrowState(dialogFileListView, $('#dialog_select_dir').find('div[data-role="fileList_arrow_navigate"]'));
                }else{
                    $('#dialog_select_dir').find('div[data-role="display files"]').append('<div class="alert alert-warning" role="alert">'+error+'</div>');
                }
            });
        });
    });
    
    $('#arrow_select_drive').click(function(){
       $('#select_drive_option').slideDown('fast');
    });
    
    $('#select_drive_option').on('click', 'li', function () {
        var fileListContainer = $('#dialog_select_dir').find('div[data-role="display files"]');
        var currentDirectory = $('#dialog_select_dir').find('div[data-role="current directory"]');
        var arrowsContainer = $('#dialog_select_dir').find('div[data-role="fileList_arrow_navigate"]');
        
        $('#current_drive').val($(this).text());
        $('#current_drive_val').val($(this).data('path'));
        $('#select_drive_option').hide();

        $('#btn_openProjectDir').addClass('disabled');
        ajaxGetFileList($(this).data('path'), true, function (error, data) {
            $(currentDirectory).text('');
            //$('#'+$(fileListContainer).data('forid')).find('input[data-role="remember home"]').val('0');
            $(fileListContainer).empty();
            
            dialogFileListView = new listViewHistory();
            if (error === null) {
                dialogFileListView.trace.push($('#current_drive_val').val());
                dialogFileListView.currentAtIndex = dialogFileListView.currentAtIndex + 1;

                displayFileList(data, $(fileListContainer));
                
            } else {                
                $(fileListContainer).append('<div class="alert alert-warning" role="alert">' + error + '</div>');
                
            }
            
            updateArrowState(dialogFileListView, arrowsContainer);
        });
    });
    
    $(document).click(function(e){
        if($(e.target).is(':not(#arrow_select_drive)') && $('#arrow_select_drive').has(e.target).length ===0){
            $('#select_drive_option').hide();
        }
        //console.log(e.target);
        var forID = $(e.target).closest('div[data-role="display files"]').data('forid'); 
        console.log(forID);
        if($(e.target).is(':not(#'+forID+' div[data-role="display files"])') && $('#'+forID+' div[data-role="display files"]').has(e.target).length===0){
            $(e.target).closest('div[data-role="display files"]').find('li').removeClass('selected');
        }
    });
    
    $('div[data-role="display files"]').on('click', 'li', function () {
        var _senderJ = this;
        var listContainer = $(this).closest('div[data-role="display files"]');
        var arrowsContainer = $('#'+$(listContainer).data('forid')).find('div[data-role="fileList_arrow_navigate"]');
        var getOnlyFolders = $(listContainer).data('only_folders');
        
        //always mark select one
        $(listContainer).find('li').removeClass('selected');
        $(_senderJ).addClass('selected');
        $('#btn_openProjectDir').removeClass('disabled');
        var clickCount = $(_senderJ).find('input[type=hidden]').val();

        //implement double clicking
        if (Number(clickCount) === 0) {
            var doubleClick = setTimeout(function () {
                var watchCount = $(_senderJ).find('input[type=hidden]').val();
                $(_senderJ).find('input[type=hidden]').val(0);
                
                //detect double click happens
                if (Number(watchCount) >= 2) {
                    $(_senderJ).removeClass('selected');
                    $('#btn_openProjectDir').addClass('disabled');
                    
                    if($(_senderJ).data('is_directory') == true){
                        ajaxGetFileList($(_senderJ).data('path'), getOnlyFolders, function(error,data){
                            if(error === null){
                                displayFileList(data,$(listContainer));
                            }else{
                                $(listContainer).empty();
                                $(listContainer).append('<div class="alert alert-warning" role="alert">'+error+'</div>');
                            }

                            var showPath = $(_senderJ).data('path');
                            showPath = showPath.replace($('#current_drive').val()+'\\','');
                            $('#'+$(listContainer).data('forid')).find('div[data-role="current directory"]').text(showPath);

                            dialogFileListView.trace.push( $(_senderJ).data('path'));  
                            dialogFileListView.currentAtIndex = dialogFileListView.currentAtIndex+1;

                            if(dialogFileListView.trace.length - dialogFileListView.currentAtIndex > 1){
                                dialogFileListView.trace.splice(dialogFileListView.currentAtIndex, dialogFileListView.trace.length - dialogFileListView.currentAtIndex-1);
                            }

                            updateArrowState(dialogFileListView,arrowsContainer);

                        });
                    }
                }
            }, 300);
        }
        clickCount++;
        $(_senderJ).find('input[type=hidden]').val(clickCount);

    });
    
    $('div[data-role="fileList_arrow_navigate"]').on('click','a',function(){
        var forID = $(this).closest('div[data-role="fileList_arrow_navigate"]').data('forid');
        var displayFilesObj = $('#'+forID).find('div[data-role="display files"]');
        var currentDirectoryObj = $('#'+forID).find('div[data-role="current directory"]');
        var arrowsContainerObj = $(this).closest('div[data-role="fileList_arrow_navigate"]');
        var getOnlyFolders = $(displayFilesObj).data('only_folders'); 
        
        if($(this).find('div').hasClass('disabled') === false){
            switch($(this).data('role')){
                case 'backward':
                    dialogFileListView.currentAtIndex = dialogFileListView.currentAtIndex-1;
                    break;

                case 'forward':
                    dialogFileListView.currentAtIndex = dialogFileListView.currentAtIndex+1;                    
                    break;
            } 

            $('#btn_openProjectDir').addClass('disabled');
            
            ajaxGetFileList(dialogFileListView.trace[dialogFileListView.currentAtIndex], getOnlyFolders, function(error, data){
                if(error === null){
                    displayFileList(data,displayFilesObj);
                }else{
                    $(displayFilesObj).empty();
                    $(displayFilesObj).append('<div class="alert alert-warning" role="alert">'+error+'</div>');
                }

                var showPath = dialogFileListView.trace[dialogFileListView.currentAtIndex];
                showPath = showPath.replace($('#current_drive').val()+'\\','');
                $(currentDirectoryObj).text(showPath);

                updateArrowState(dialogFileListView, arrowsContainerObj);
            });
        }
    });
    
    $('#btn_openProjectDir').click(function () {
        var selectedPath = $('#dialog_select_dir').find('div[data-role="display files"] li[class="item selected"]').data('path');
        var fileListContainer = $('#new_project_files').find('div[data-role="display files"]');
        var currentDirectory = $('#new_project_files').find('div[data-role="current directory"]');
        var arrowNavigator = $('new_project_files').find('div[data-role="fileList_arrow_navigate"]');
        
        ajaxGetFileList(selectedPath, false, function(error, data){
            //console.log(data);            
            if(error === null){
                dialogFileListView = new listViewHistory();
                dialogFileListView.trace.push(selectedPath);
                dialogFileListView.currentAtIndex = dialogFileListView.currentAtIndex+1;

                displayFileList(data, $(fileListContainer));

                $(currentDirectory).text(selectedPath); 
                updateArrowState(dialogFileListView, $(arrowNavigator));
            }else{
                $(fileListContainer).append('<div class="alert alert-warning" role="alert">'+error+'</div>');
            }
        });
    });
    
    
    
    
    
    
    $('#project_files_view').mouseout(function () {
       // PROJECTJS.myEvents.project_files_view_mouseout($(this));
    });
    $('#project_files_view').mouseover(function () {
        //PROJECTJS.myEvents.project_files_view_mouseover($(this));
    });
    $(document).mouseover(function (e) {
        //PROJECTJS.myEvents.document_mouseover(e);
    });
    $('#debug_console').click(function () {
        //$(this).toggleClass('hideme');
    });
    $('#btn_ignoreFile').click(function () {
        //PROJECTJS.myEvents.btn_ignoreFile_click($(this));
    });
    $('#btn_doneSetup').click(function () {
        //PROJECTJS.myEvents.btn_doneSetup_click($(this));
    });


});
