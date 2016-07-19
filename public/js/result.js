//<script src="//www.parsecdn.com/js/parse-1.6.14.min.js"></script>
Parse.initialize("24t24lAA1VrzzlpqqB58ZMowWQTBbIG7v2O5lsPW");
Parse.serverURL = "http://concon-admin-data-dev.herokuapp.com/parse";
var global;
function printTerms(id, obj) {

  $(id).empty();
  // $('#'+id).append("<tr><th>Order</th><th>streamCreator</th><th>number of calling</th><th>sum of calling time</th></tr>");

//  $(id+'_myPager').empty();
//      
  if (obj.length>0) {
    $(id+"_pro").empty();
    $(id+"_pro").html("<button type='button' class='btn btn-success btn-sm' onclick = 'submit()'>insert</button>");
  }
  else {
    $(id+"_pro").html('<div color="red" id="table1_pro"><font color="red">finished analyzing, No data needs to be mannually decided.</font></div>');
    return;
  }

  for (var i = 0; i < obj.length; i++) {
    // console.log(obj[i].streamCreator);
      
//                                     <th>eventName</th>
//                                    <th>eventCity</th>
//                                    <th>eventState</th>
//                                    <th>eventVenue</th>
//                                    <th>eventStartDate</th>
//                                    <th>eventEndDate</th>

//    var x = obj[i].sumofcallingtime;
//    var d = moment.duration(x, 'seconds');
//    var hours = Math.floor(d.asHours());
//    var mins = Math.floor(d.asMinutes()) - hours * 60;
//
//    var seconds = (x - hours*3600-mins*60).toFixed(2);

    $(id).append("<tr><td>"+(i+1)+"</td><td>"+obj[i].name+"</td><td>"+obj[i].eventCity+"</td><td>"+ obj[i].eventState+ "</td><td>"+obj[i].eventVenue + "</td><td>" + obj[i].eventStartDate + "</td><td>"+obj[i].eventEndDate + "</td><td><input type='checkbox' checked></td></tr>");
  };

//  $(id).pageMe({pagerSelector:id+'_myPager',showPrevNext:true,hidePageNumbers:false,perPage:15,numbersPerPage:5});

}



function submit() {
    var tds = $('#table1 tr');
    var insertArray = [];
    
    for(var i = 0; i < tds.length; ++i) {
        if(tds[i].children[7].children[0].checked) {
            
            var Event = Parse.Object.extend("Event");
            var event = new Event();
            
            
            event.set("artistAlleyApplicationStatus",1);
            event.set("artistAlleyBoothPrice",0);
//                event.set("artistAlleyContactInfo");
            event.set("artistAlleySpotsAvailablility",0);
                
            if (global[i].registerURL!="") {
                event.set("artistsAlleyRegistrationUrl",global[i].registerURL);
            }
            else {
                event.set("artistsAlleyRegistrationUrl","N/A");
            }

            if (global[i].atDoorTicketPrices!="") {
                event.set("atDoorTicketPrices",global[i].atDoorRates);
            }
            else {
                event.set("atDoorTicketPrices","N/A");
            }
                
//                event.set("boothEnrollmentEndDay");
//                event.set("boothOpenEnrollmentDay");
//                event.set("exhibitorBoothEnrollmentEndDay");
//                event.set("exhibitorBoothOpenEnrollmentDay");
                
            event.set("eventAddress","");
//                event.set("eventAttendancePriorYear");
                
                
            event.set("eventCity",global[i].eventCity);
            event.set("eventCountry",global[i].eventCountry);
            event.set("eventDescription",global[i].description);
                
            event.set("eventHomeUrl",global[i].siteURL);
                
            var point = new Parse.GeoPoint({latitude: global[i].latitude, longitude: global[i].longitude});
            event.set("eventLatLong",point);
            event.set("eventName",global[i].name);
                
            if(global[i].eventStartDate!="") {
                event.set("eventStartDate",new Date(global[i].eventStartDate));
            }
            
            if(global[i].eventEndDate!="") {
                event.set("eventEndDate",new Date(global[i].eventEndDate));
            }
                
//                event.set("eventStartTime");
            event.set("eventState",global[i].eventState);
            event.set("eventStatus","NORMAL");
                

            event.set("eventType",global[i].eventType);

            event.set("eventVenue",global[i].eventVenue);
                
            event.set("exhibitorApplicationStatus",1);
            event.set("exhibitorBoothPrice",0);
//                event.set("exhibitorContactInfo","");
//                event.set("exhibitorSpotsAvailable","");
            event.set("exhibitorsBoothRegistrationUrl","N/A");
            event.set("fanTicketRegistrationUrl","N/A");
            event.set("featuredEvent",false);
            event.set("notes","");
            event.set("organizerContactUrl","");
            event.set("presaleTicketPrices","N/A");
            event.set("eventNamelower_case","");
            event.set("hiddenEvent",false);
            
            event.set("newData",true);
            event.set("prodData",false);
            
            insertArray.push(event);

        }
        
        console.log(insertArray);
        
        Parse.Object.saveAll(insertArray, {
            success: function(list) {
                    // Execute any logic that should take place after the object is saved.
//                  alert('New object created with objectId: ' + gameScore.id);
                    
                alert('insert completed!');
                window.location = '/';

            },
            error: function(event, error) {
                // Execute any logic that should take place if the save fails.
                // error is a Parse.Error with an error code and message.
//                        alert('Failed to create new object, with error code: ' + error.message);
                console.log(error);
            }
        });
        
    }
}


//function draw(id, obj) {
//  // console.log(obj);
//  $('#'+id).empty();
//
//  if (obj.length == 0) {
//    return
//  };
//
//  var call = [];
//  var sum = [];
//
//  for (var i = 0; i < obj.length; i++) {
//    var temp = [obj[i].streamCreator, obj[i].numberofcalling];
//    call.push(temp);
//    var temp2 = [obj[i].streamCreator, moment.duration(obj[i].sumofcallingtime, 'seconds').asHours()];
//    sum.push(temp2);
//  };
//
//  $('#'+id).highcharts({
//    chart: {
//      type: 'column',
//      zoomType: 'x',
//    },
//    title: {
//      text: 'number of calling times'
//    },
//    xAxis: {
//      type: 'category',
//      labels: {
//        rotation: -45,
//        style: {
//          fontSize: '13px',
//          fontFamily: 'Verdana, sans-serif'
//        }
//      }
//    },
//    yAxis: {
//      min: 0,
//      title: {
//        text: '# of calling time'
//      }
//    },
//    legend: {
//      enabled: false
//    },
//    tooltip: {
//      pointFormat: '# of calling: <b>{point.y} times</b>'
//    },
//    series: [{
//      name: 'user',
//      data: call,
//      dataLabels: {
//        enabled: true,
//        rotation: -90,
//        color: '#FFFFFF',
//        align: 'right',
//        format: '{point.y}', // one decimal
//        y: 10, // 10 pixels down from the top
//        style: {
//          fontSize: '13px',
//          fontFamily: 'Verdana, sans-serif'
//        }
//      }
//    }]
//  });
//
//  $('#'+id+'_2').highcharts({
//    chart: {
//      type: 'column',
//      zoomType: 'x',
//    },
//    title: {
//      text: 'sum of calling times'
//    },
//    xAxis: {
//      type: 'category',
//      labels: {
//        rotation: -45,
//        style: {
//          fontSize: '13px',
//          fontFamily: 'Verdana, sans-serif'
//        }
//      }
//    },
//    yAxis: {
//      min: 0,
//      title: {
//        text: '# of calling time'
//      }
//    },
//    legend: {
//      enabled: false
//    },
//    tooltip: {
//      pointFormat: '# of calling: <b>{point.y:.2f} times</b>'
//    },
//    series: [{
//      name: 'user',
//      data: sum,
//      dataLabels: {
//        enabled: true,
//        rotation: -90,
//        color: '#FFFFFF',
//        align: 'right',
//        format: '{point.y:.2f}', // one decimal
//        y: 10, // 10 pixels down from the top
//        style: {
//          fontSize: '13px',
//          fontFamily: 'Verdana, sans-serif'
//        }
//      }
//    }]
//  });
//}

$.fn.pageMe = function(opts){
  var $this = this,
    defaults = {
      perPage: 7,
      showPrevNext: false,
      numbersPerPage: 5,
      hidePageNumbers: false
    },
    
  settings = $.extend(defaults, opts);
    
  var listElement = $this;
  var perPage = settings.perPage; 
  var children = listElement.children();
  var pager = $('.pagination');
    
  if (typeof settings.childSelector!="undefined") {
    children = listElement.find(settings.childSelector);
  }
    
  if (typeof settings.pagerSelector!="undefined") {
    pager = $(settings.pagerSelector);
  }
    
  var numItems = children.size();
  var numPages = Math.ceil(numItems/perPage);

  pager.data("curr",0);
    
  if (settings.showPrevNext){
    $('<li><a href="#" class="prev_link">«</a></li>').appendTo(pager);
  }
    
  var curr = 0;
  while(numPages > curr && (settings.hidePageNumbers==false)){
    $('<li><a href="#" class="page_link">'+(curr+1)+'</a></li>').appendTo(pager);
    curr++;
  }
  
  if (settings.numbersPerPage>1) {
    $('.page_link').hide();
    $('.page_link').slice(pager.data("curr"), settings.numbersPerPage).show();
  }
    
  if (settings.showPrevNext){
    $('<li><a href="#" class="next_link">»</a></li>').appendTo(pager);
  }
    
  pager.find('.page_link:first').addClass('active');
  pager.find('.prev_link').hide();
  if (numPages<=1) {
    pager.find('.next_link').hide();
  }
  pager.children().eq(1).addClass("active");
    
  children.hide();
  children.slice(0, perPage).show();
    
  pager.find('li .page_link').click(function(){
    var clickedPage = $(this).html().valueOf()-1;
    goTo(clickedPage,perPage);
    return false;
  });
  pager.find('li .prev_link').click(function(){
    previous();
    return false;
  });
  pager.find('li .next_link').click(function(){
    next();
    return false;
  });
    
  function previous(){
    var goToPage = parseInt(pager.data("curr")) - 1;
    goTo(goToPage);
  }
     
  function next(){
    goToPage = parseInt(pager.data("curr")) + 1;
    goTo(goToPage);
  }
    
  function goTo(page){
    var startAt = page * perPage,
      endOn = startAt + perPage;
        
    children.css('display','none').slice(startAt, endOn).show();
        
    if (page>=1) {
      pager.find('.prev_link').show();
    }
    else {
      pager.find('.prev_link').hide();
    }
        
    if (page<(numPages-1)) {
      pager.find('.next_link').show();
    }
    else {
      pager.find('.next_link').hide();
    }
        
    pager.data("curr",page);
       
    if (settings.numbersPerPage>1) {
      $('.page_link').hide();
      $('.page_link').slice(page, settings.numbersPerPage+page).show();
    }
      
    pager.children().removeClass("active");
    pager.children().eq(page+1).addClass("active");
    
  }
};




	

$(document).ready(function () {
  // var name = "{{ name }}";
  $.ajax({
    url: 'process_get', 
    type: 'GET',
//    dataType:"json",
    data: {Filename: Filename}, // The form with the file inputs.

    success: function(returnval){

        var c = JSON.parse(returnval); 
        console.log(c);
        global = c;
        printTerms('#table1',c);
//      draw('chart1',c[3]);
//
//      printTerms('table2',c[2]);
//      draw('chart2',c[2]);
//      printTerms('table3',c[1]);
//      draw('chart3',c[1]);
//      printTerms('table4',c[0]);
//      draw('chart4',c[0]);
//        var c = JSON.parse(returnval);
//        console.log(returnval);
    },
    error: function (error) {
        console.log(error);
    }

  }).fail(function(){
    console.log("An error occurred, the files couldn't be sent!");
  });



//  $("#myform").submit(function() {  
//    $.ajax({
//      url: "process_get",
//      type: 'GET',
//      data: {
//        Filename: Filename, Nums:$('#numberofDays').val()
//      },
//
//      success: function(returnval){
//        // $('#test').html(returnval);
//        var c = JSON.parse(returnval); 
//
//        printTerms('table5',c[0]);
//        draw('chart5',c[0]);
//      }
//    }).fail(function(){
//      console.log("An error occurred, the files couldn't be sent!");
//    });
//  });

});
