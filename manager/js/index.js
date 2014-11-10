$(document).ready(function () {
    var sendData = {
        projectID: 0
    };
    $.ajax({
        type: 'POST',
        url: 'getProjects.do',
        traditional: true,
        data: sendData,
        success: function (data) {
            data = JSON.parse(data);
            console.log(data.length);
            var template = $('#projects').find('div:eq(0)').prop('outerHTML');
            var templateToJqObj = $.parseHTML(template);
            $(templateToJqObj).removeAttr('style');
            template = $(templateToJqObj).prop('outerHTML');
            $('#projects').empty();
            if(data.length>0){
                for(var i=0; i<data.length; i++){
                    var useTemplate = template;
                    useTemplate = useTemplate.replace(/##ProjectName##/g,data[i].name);
                    useTemplate = useTemplate.replace(/##ID##/g,data[i].ID);
                    $('#projects').append(useTemplate);
                }
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {

        },
        complete: function (jqXHR, textStatus) {
        }
    });
    
    $('#projects').on('click','.view-project',function(){
       location.replace('project.html?projectID='+$(this).data('projectid')); 
    });
});

