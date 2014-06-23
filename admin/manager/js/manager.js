$(document).ready(function() {
  var iosocket;
  
  function getTimeStamp() {
    var now = new Date();
    return ((now.getMonth() + 1) + '/' + (now.getDate()) + '/' + now.getFullYear() + " " + now.getHours() + ':' + ((now.getMinutes() < 10) ? ("0" + now.getMinutes()) : (now.getMinutes())) + ':' + ((now.getSeconds() < 10) ? ("0" + now.getSeconds()) : (now.getSeconds())));
  }
  
  (function initSocketIO()
  {
    iosocket = io.connect();

    iosocket.on('onconnection', function(value) {
      $("#debug_console").append(getTimeStamp() + "> connected to server<br>");
    });
    
    iosocket.on('disconnection',function(value){
      $("#debug_console").append(getTimeStamp() + "> disconnected to server<br>");
    });

    $("#debug_console").append(getTimeStamp() + "> call server<br>");
    iosocket.emit("HiManager", "");

    // recieve changed values by other client from server
    iosocket.on('HiManagerClient', function(recievedData) {
      $("#debug_console").append(getTimeStamp() + "> " + recievedData.text + "<br>");
    });

    iosocket.on('getItemsInDirClient', function(response) {
      console.log('getItemInDirClient:');
      if (response.success == false) {
        
      } else {
        console.log(response.data);
        //$('#target_dir').html('<ul><li><span>'+response.data+'</span></li></ul>')
        dirInDrive.setData(response.data);
        dirInDrive.showItemsInDir();
      }
    });
  })();
  
  var dirInDrive;  
  
  function outputFileTree(data){
    var _data = data;
    var fileName = function(path){
      var strArr = path.split('\\');
      return strArr[(strArr.length-1)];
    };
    this.previousFolder = [];
    this.setData = function(data){
      _data = data;
    };
    this.showItemsInDir = function(){
      //console.log(_data);
      $('#target_dir').empty();
      $('#current_dir').text(_data.path);
      var liClass='two';
      if(_data.children.length>20){
        liClass='four';
      }
      $('#target_dir').append($('<ul class="'+liClass+'"></ul>'));
      if(this.previousFolder.length>0){
        $('#target_dir').find('ul').append('<li class="up" data-path="'+safeFilePath(this.previousFolder[this.previousFolder.length-1])+'"><b>[...]</b></li>');
      }
      if(_data.children.length>0){
        for(var i=0; i<_data.children.length; i++){
          $('#target_dir').find('ul').append('<li class="item" data-path="'+safeFilePath(_data.children[i].path)+'"><span>'+fileName(_data.children[i].path)+'</span></li>');
        };
      }
    };
    function safeFilePath(_filePath){
      return _filePath.replace(/\\/g,'\\');
    }
    return this;
  }
 
  $('#dialog_select_dir').on('show.bs.modal', function() {
    dirInDrive = new outputFileTree();
    $('#target_dir').css({
      'height':$('#dialog_select_dir').find('.modal-body').height()+'px',
      'width':$('#dialog_select_dir').find('.modal-body').width()+'px'
    });
    iosocket.emit('getItemsInDir', {target:'c:\\wamp\\www\\EgeFlipCard'});
  });
  
  $('#target_dir').on('click','li',function(){
    var liClass = $(this).attr('class');
    switch(liClass){
      case 'item':
        dirInDrive.previousFolder.push($('#current_dir').text());
        break;
      case 'up':
        dirInDrive.previousFolder.splice(dirInDrive.previousFolder.length-1,1);
        break;
    }
    iosocket.emit('getItemsInDir', {target:$(this).data('path')});
  });
});