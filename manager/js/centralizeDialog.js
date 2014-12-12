$(document).ready(function() {
$('.modal[id^="dialog_"]').on('show.bs.modal', function (e) { 
    var setWidth = Number($(this).data('dialogw'));
    var setHeight = Number($(this).data('dialogh'));
    $(this).find('.modal-content').css({
      'width':setWidth+'px'
    });
    $(this).find('.modal-body').css({
      'height':setHeight+'px',
      'width':setWidth+'px'
    });
    $(this).find('.modal-dialog').css({
      'margin-top': function() {
        return (($(window).height()-setHeight-131) / 2);
      },
      'margin-left': function() {
        return (($(window).width()-setWidth) / 2);
      }
    });
  });
});