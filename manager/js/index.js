$(document).ready(function () {
    var sendData = {
      task:'getProject',
      projectID: 0
    };
    $.ajax({
        type: 'POST',
        url: 'js/ajaxToProject.js',
        traditional: true,
        data: sendData,
        success: function (data) {
            console.log(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {

        },
        complete: function (jqXHR, textStatus) {
        }
    });

});

