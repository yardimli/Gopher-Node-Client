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
      $('#project_files_view').empty();
      console.log(JSON.stringify(convertToJstreeObj()));
      $('#project_files_view').jstree({'core':{'data':convertToJstreeObj()}});
    };
    function safeFilePath(_filePath) {
      return _filePath.replace(/\\/g, '\\');
    }
    function convertToJstreeObj(obj){
      var root = [];
      function node(){
        this.text = '';
        this.state = function(_opened,_selected){
          return {opened:_opened,selected:_selected};
        };
        this.children = null;
        this.getNode = function(){
          return {text:this.text,state:this.state,children:this.children};
        };
      }
      /*var node1 = {
        text:'folder1',
        state:{
          opened:true,
          selected:false
        },
        children:null
      };*/
      function make(fn){
        for(var i=0; i<obj.length; i++){
          var newnode = new node();
          newnode.text = fileName(obj[i].path);
          newnode.state(false,false);
          if(obj[i].children !== null){
            make(function())
          }
          root.push(newnode);
        }
      }
      var newnode = new node();
      newnode.text = 'folder1';
      newnode.state(false,false);
      newnode.children = [newnode.getNode()];
      root.push(newnode.getNode());
      return root;
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