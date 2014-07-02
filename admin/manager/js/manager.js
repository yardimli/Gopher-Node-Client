$(document).ready(function() {
  var iosocket;
  var selectProjectFolder;
  var selectedProjectFolder;
  var template = {
    fileItem: $('#target_dir').find('div[data-role="template"]').prop('outerHTML')
  };

  (function initSocketIO()
  {
    iosocket = io.connect();

    iosocket.on('onconnection', function(value) {
      $("#debug_console").append(getTimeStamp() + "> connected to server<br>");
    });

    iosocket.on('disconnection', function(value) {
      $("#debug_console").append(getTimeStamp() + "> disconnected to server<br>");
    });

    $("#debug_console").append(getTimeStamp() + "> call server<br>");
    iosocket.emit("HiManager", "");

    // recieve changed values by other client from server
    iosocket.on('HiManagerClient', function(recievedData) {
      $("#debug_console").append(getTimeStamp() + "> " + recievedData.text + "<br>");
    });

    iosocket.on('getItemsInDirClient', function(response) {
      if (response.success == false) {

      } else {
        selectProjectFolder.setData(response.data);
        selectProjectFolder.displayItemsInList();
      }
    });
    
    iosocket.on('openProjectFolder', function(response){
      if(response.success){
        selectedProjectFolder = new displayFilesFolders(response.data);
        selectedProjectFolder.displaySelectedProjectFiles();
      }
    });
  })();

  function getTimeStamp() {
    var now = new Date();
    return ((now.getMonth() + 1) + '/' + (now.getDate()) + '/' + now.getFullYear() + " " + now.getHours() + ':' + ((now.getMinutes() < 10) ? ("0" + now.getMinutes()) : (now.getMinutes())) + ':' + ((now.getSeconds() < 10) ? ("0" + now.getSeconds()) : (now.getSeconds())));
  }

  function displayFilesFolders(data) {
    var _data = data;
    var fileName = function(path) {
      var strArr = path.split('\\');
      return strArr[(strArr.length - 1)];
    };
    this.previousFolder = [];
    this.setData = function(data) {
      _data = data;
    };
    this.displayItemsInList = function() {
      $('#target_dir').empty();
      $('#current_dir').text(_data.path);
      var liClass = 'two';
      if (_data.children.length > 20) {
        liClass = 'four';
      }
      $('#target_dir').append($('<ul class="' + liClass + '"></ul>'));
      if (this.previousFolder.length > 0) {
        $('#target_dir').find('ul').append('<li class="up" data-path="' + safeFilePath(this.previousFolder[this.previousFolder.length - 1]) + '"><b>[...]</b></li>');
      }
      if (_data.children.length > 0) {
        for (var i = 0; i < _data.children.length; i++) {
          $('#target_dir').find('ul').append('<li class="item" data-path="' + safeFilePath(_data.children[i].path) + '"><span>' + fileName(_data.children[i].path) + '</span><input type="hidden" value="0"/></li>');
        }
        ;
      }
    };
    this.displaySelectedProjectFiles = function(){
      $('#project_files_view').jstree({'core':{'data':convertToJstreeObj(_data)}}); 
      if($('#project_files_view').find('ul').length>0){
        $('#project_files_view').jstree(true).settings.core.data = convertToJstreeObj(_data);
        $('#project_files_view').jstree(true).refresh(); 
      }
    };
    function safeFilePath(_filePath) {
      return _filePath.replace(/\\/g, '\\');
    }
    function convertToJstreeObj(_obj){
      function node(_text,_opened,_selected,_children){
        return {text:_text,
                state:{opened:_opened,selected:_selected},
                children:_children};
      }
      //var testObj = {path:'flipcard',children:[{path:'main.js',children:null},{path:'index.html',children:null},{path:'card.json',children:null},{path:'git',children:[{path:'config',children:[{path:'git\\maing.config',children:null},{path:'git\\sub.config',children:null}]}]},{path:'blabla\\nbproject',children:[{path:'blabla\\history',children:null}]}]};
      //console.log('======testObj=======');
      //console.log(testObj);
      if(_obj !== undefined){
        //_obj = testObj;
        var jstreeObj = [];
        function makeJstreeObj(title,runObj,end){
          //console.log('*'+runObj[0].path+'*');
          var output = new node(title,false,false,[]);
          //console.log('-----test is called:'+JSON.stringify(runObj)+'-----');
          var unfinished = runObj.length;
          //console.log(title);
          //console.log('-----first unfinished:'+unfinished+'-------');
          if(!unfinished){
            return end(output);
          }
          for(var i=0; i<runObj.length; i++){
            //console.log('---i:'+i+'------');
            if(runObj[i].children!==null){
              //console.log('----- runObj[i].children!==null,'+runObj[i].path+'------');
              makeJstreeObj(fileName(runObj[i].path),runObj[i].children,function(res){
                /*console.log('----- res ----');
                console.log(res);
                console.log('----- end of res ----');*/
                output.children.push(res);
                unfinished--;
                if(unfinished<=0){
                  //console.log(unfinished);
                  end(output);
                }
              });
            }else{
              //console.log('----- runObj[i].children!==null else,'+runObj[i].path+'------')
              output.children.push(new node(fileName(runObj[i].path),false,false,null));
              unfinished--;
              if(unfinished<=0){
                  //console.log(unfinished);
                  end(output);
              }
            }
          }
        }
        makeJstreeObj(_obj.path,_obj.children,function(result){
          jstreeObj.push(result);
        });
        /*console.log('======jstreeObj========');
        console.log(jstreeObj);
        console.log(JSON.stringify(jstreeObj));
        console.log('======end of jstreeObj========');*/
        return jstreeObj;
      }else{
        return null;
      }
    }
    return this;
  }
  
  


  /****** EVENTS ***************************************************************************************/
  var eventsOnPage = {
    
  };
  var eventsOnDialog = {
    dialog_select_dir_show: function() {
      selectProjectFolder = new displayFilesFolders();
      $('#target_dir').css({
        'height': ($('#dialog_select_dir').find('.modal-body').height() - 14) + 'px',
        'width': $('#dialog_select_dir').find('.modal-body').width() + 'px'
      });
      iosocket.emit('getItemsInDir', {target: 'c:\\wamp\\www'});
    },
    target_dir_li_click: function(_senderJ) {
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
              selectProjectFolder.previousFolder.push($('#current_dir').text());
              iosocket.emit('getItemsInDir', {target: $(_senderJ).data('path')});
            }
          }, 300);
        }
        clickCount++;
        $(_senderJ).find('input[type=hidden]').val(clickCount);
      } else if ($(_senderJ).hasClass('up')) {
        selectProjectFolder.previousFolder.splice(selectProjectFolder.previousFolder.length - 1, 1);
        iosocket.emit('getItemsInDir', {target: $(_senderJ).data('path')});
      }
    },
    dialog_select_dir_hidden: function(){
      var folderPath = $('#target_dir').find('li.selected').data('path');
      $('#in_projectDir').val(folderPath);
      iosocket.emit('_openProjectFolder', {target: folderPath});
    }
  };

  //******** jQUERY EVENT BEINDING **************************************************************************/
  $('#dialog_select_dir').on('show.bs.modal', function() {
    eventsOnDialog.dialog_select_dir_show();
  });

  $('#dialog_select_dir').on('hidden.bs.modal', function() {
    eventsOnDialog.dialog_select_dir_hidden();
  });

  $('#target_dir').on('click', 'li', function() {
    eventsOnDialog.target_dir_li_click($(this));
  });

});