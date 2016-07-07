$(document).ready(function(){
  $("#mainform").submit(function() {  
    $.ajax({
      url: 'file_upload', 
      type: 'POST',
      data: new FormData($('#mainform')[0]), // The form with the file inputs.
      processData: false,               // Using FormData, no need to process data.
      contentType: false,
      enctype: 'multipart/form-data',

      success: function(returnval){

        $(location).attr('href','/result?Filename=' + returnval)

      }

    }).fail(function(){
      console.log("An error occurred, the files couldn't be sent!");
    });
  });

});