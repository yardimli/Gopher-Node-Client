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
                    console.log('ajaxGetFileList items:' + Data.length);
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
    
    function displayFileList(data) {
        $('#target_dir').empty();
        var liClass = 'two';
        if (data.length > 20) {
            liClass = 'four';
        }
        if (data.length > 0) {
            $('#target_dir').append($('<ul class="' + liClass + '"></ul>'));
            for (var i = 0; i < data.length; i++) {
                $('#target_dir').find('ul').append('<li class="item" data-path="' + data[i].path + '"><span>' + data[i].name + '</span><input type="hidden" value="0"/></li>');
            }
        } else {
            $('#target_dir').append('<div class="alert alert-info" role="alert">There has no folders here.</div>');
        }

    }
    
    function updateArrowState(listViewHistoryObj){
        console.log('current view index '+listViewHistoryObj.currentAtIndex);
        console.log('trace  '+listViewHistoryObj.trace.length);
        if(listViewHistoryObj.trace.length <= 1 ){
            $('#fileList_arrow_navigate').find('a[data-role="backward"] div').addClass('disabled');
            $('#fileList_arrow_navigate').find('a[data-role="forward"] div').addClass('disabled');
        }else{
            if(listViewHistoryObj.currentAtIndex === listViewHistoryObj.trace.length-1){
                $('#fileList_arrow_navigate').find('a[data-role="backward"] div').removeClass('disabled');
                $('#fileList_arrow_navigate').find('a[data-role="forward"] div').addClass('disabled');
            }else if(listViewHistoryObj.currentAtIndex === 0){
                $('#fileList_arrow_navigate').find('a[data-role="backward"] div').addClass('disabled');
                $('#fileList_arrow_navigate').find('a[data-role="forward"] div').removeClass('disabled');
            }
            else{
                $('#fileList_arrow_navigate').find('a[data-role="backward"] div').removeClass('disabled');
                $('#fileList_arrow_navigate').find('a[data-role="forward"] div').removeClass('disabled');
            }
        }
        
        
    }
    
    
    /*jQuery events* **************************************************************************************/
    
    $('#dialog_select_dir').on('show.bs.modal', function () {
        $('#target_dir').css({
            'height': ($('#dialog_select_dir').find('.modal-body').height() - 14) + 'px',
            'width': $('#dialog_select_dir').find('.modal-body').width() + 'px'
        });
        
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

                    displayFileList(data);

                    $('#show_current_dir').val('');
                    $('#remember_backHome').val('0');
                    updateArrowState(dialogFileListView);
                }else{
                    $('#target_dir').append('<div class="alert alert-warning" role="alert">'+error+'</div>');
                }
            });
        });
    });
    
    $('#arrow_select_drive').click(function(){
       $('#select_drive_option').slideDown('fast');
    });
    
    $('#select_drive_option').on('click', 'li', function () {
        $('#current_drive').val($(this).text());
        $('#current_drive_val').val($(this).data('path'));
        $('#select_drive_option').hide();

        ajaxGetFileList($(this).data('path'), true, function (error, data) {
            if (error === null) {
                dialogFileListView = new listViewHistory();
                dialogFileListView.trace.push($('#current_drive_val').val());
                dialogFileListView.currentAtIndex = dialogFileListView.currentAtIndex + 1;

                displayFileList(data);

                $('#show_current_dir').val('');
                updateArrowState(dialogFileListView);
            } else {
                $('#target_dir').empty();
                $('#target_dir').append('<div class="alert alert-warning" role="alert">' + error + '</div>');
            }
        });
    });
    
    $(document).click(function(e){
        if($(e.target).is(':not(#arrow_select_drive)') && $('#arrow_select_drive').has(e.target).length ===0){
            $('#select_drive_option').hide();
        }
    });
    
    $('#target_dir').on('click', 'li', function () {
        var _senderJ = this;
        
        $('#target_dir').find('li').removeClass('selected');
        $(_senderJ).addClass('selected');
        var clickCount = $(_senderJ).find('input[type=hidden]').val();

        if (Number(clickCount) === 0) {
            var doubleClick = setTimeout(function () {
                var watchCount = $(_senderJ).find('input[type=hidden]').val();
                $(_senderJ).find('input[type=hidden]').val(0);
                if (Number(watchCount) >= 2) {
                    $(_senderJ).removeClass('selected');
                    ajaxGetFileList($(_senderJ).data('path'), true, function(error,data){
                        if(error === null){
                            displayFileList(data);
                        }else{
                            $('#target_dir').empty();
                            $('#target_dir').append('<div class="alert alert-warning" role="alert">'+error+'</div>');
                        }
                        
                        var showPath = $(_senderJ).data('path');
                        showPath = showPath.replace($('#current_drive').val()+'\\','');
                        $('#show_current_dir').text(showPath);
                        
                        dialogFileListView.trace.push( $(_senderJ).data('path'));
                        dialogFileListView.currentAtIndex = dialogFileListView.currentAtIndex+1;
                        
                        //console.log('last second '+ dialogFileListView.trace[dialogFileListView.trace.length-2]);
                        if($('#remember_backHome').val()=='1' && dialogFileListView.currentAtIndex === 1){
                            dialogFileListView.trace = [];
                            dialogFileListView.trace[0] = $('#current_drive_val').val();
                            dialogFileListView.trace[1] =  $(_senderJ).data('path');
                            console.log(dialogFileListView.trace);
                        }
                        updateArrowState(dialogFileListView);
                        
                    });
                }
            }, 300);
        }
        clickCount++;
        $(_senderJ).find('input[type=hidden]').val(clickCount);

    });
    
    $('#fileList_arrow_navigate').on('click','a',function(){
        if($(this).find('div').hasClass('disabled') === false){
            switch($(this).data('role')){
                case 'backward':
                    dialogFileListView.currentAtIndex = dialogFileListView.currentAtIndex-1;
                    if(dialogFileListView.currentAtIndex === 0){
                        $('#remember_backHome').val('1');
                    }
                    break;

                case 'forward':
                    dialogFileListView.currentAtIndex = dialogFileListView.currentAtIndex+1;                    
                    break;
            } 
            ajaxGetFileList(dialogFileListView.trace[dialogFileListView.currentAtIndex], true, function(error, data){
                if(error === null){
                    displayFileList(data);
                }else{
                    $('#target_dir').empty();
                    $('#target_dir').append('<div class="alert alert-warning" role="alert">'+error+'</div>');
                }

                var showPath = dialogFileListView.trace[dialogFileListView.currentAtIndex];
                showPath = showPath.replace($('#current_drive').val()+'\\','');
                $('#show_current_dir').text(showPath);


                updateArrowState(dialogFileListView);
            });
        }
    });
    
    $('#btn_openProjectDir').click(function () {
        ajaxGetFileList($('#target_dir').find('li[class="item selected"]').data('path'), false, function(error, data){
            
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
