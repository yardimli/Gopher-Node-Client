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
      console.log(response.data);
      if (response.success == false) {
        
      } else {
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
    this.setData = function(data){
      _data = data;
    };
    this.showItemsInDir = function(){
      console.log(_data);
      $('#target_dir').empty();
      $('#current_dir').text(_data.path);
      $('#target_dir').append($('<ul></ul>'));
      if(_data.children.length>0){
        var takePath;
        for(var i=0; i<_data.children.length; i++){
          takePath = _data.children[i].path;
          takePath = takePath.replace(/\\/g,'\\');
          $('#target_dir').find('ul').append('<li data-path="'+takePath+'"><span>'+fileName(_data.children[i].path)+'</span></li>');
        };
      }
    };
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
  
  $('#target_dir').on('click','li span',function(){
    console.log('click');
    iosocket.emit('getItemsInDir', {target:$(this).parent('li').data('path')});
  });
});