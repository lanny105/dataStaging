var express = require('express');
var app = express();
var fs = require("fs");
//var util = require('./mymodule/util');
var moment = moment;

var bodyParser = require('body-parser');
var multer  = require('multer');

app.use(express.static('public'));   
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ dest: '/tmp/'}).array('image'));


app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');



var moment = require('moment');
var Parse_dev = require('parse/node');

function initParse() {
//    Parse_dev.initialize("GGTNZ2qrKXClObC4qotCEIBCFEpytaSscYJ7yzcG",  "FEmiLsJNjftJ2kMob61vequskh6COimJvPSmYqZo");  //测试
//    
//    Parse_pro.initialize("4sMKBkz4xAcbBXyJ0n23idKJXfVm3Z0GsM34DZHZ",
//    "dRcA6Lt5jf5k07i7sLNsMZThlBVSO8C0uJaB01WQ");
//    
    Parse_dev.initialize("24t24lAA1VrzzlpqqB58ZMowWQTBbIG7v2O5lsPW");
    Parse_dev.serverURL = "http://concon-admin-data-dev.herokuapp.com/parse";
    
//    
//    Parse_dev.initialize("4sMKBkz4xAcbBXyJ0n23idKJXfVm3Z0GsM34DZHZ");
//    Parse_dev.serverURL = "http://concon-live-data-dev.herokuapp.com/parse";
//    
    
}

function changeParse() {
//    Parse_dev.initialize("GGTNZ2qrKXClObC4qotCEIBCFEpytaSscYJ7yzcG",  "FEmiLsJNjftJ2kMob61vequskh6COimJvPSmYqZo");  //测试
//    
//    Parse_pro.initialize("4sMKBkz4xAcbBXyJ0n23idKJXfVm3Z0GsM34DZHZ",
//    "dRcA6Lt5jf5k07i7sLNsMZThlBVSO8C0uJaB01WQ");
    
    Parse_dev.initialize("4sMKBkz4xAcbBXyJ0n23idKJXfVm3Z0GsM34DZHZ");
    Parse_dev.serverURL = "http://concon-live-data-dev.herokuapp.com/parse";
//    
    
}


function getParse(callback) {
    var Event = Parse_dev.Object.extend("Event");
    var query = new Parse_dev.Query(Event);
    var count = 0;
    var res = []
    
    query.count({
        success: function(count) {
            var chunk = 100;
            var cycles = Math.ceil(count / chunk);
            var t = 0;
            for (i = 0; i < cycles; i++) {
                var _query = new Parse_dev.Query("Event");
                _query.descending("createdAt");
                _query._limit = chunk;
                _query._skip = i * chunk;

//                console.log("getting results " + _query.skip.toString() + " to " + (_query.skip + _query.limit).toString());

                _query.find({
                    success: function(results) {
                        res = res.concat(results);
                        
                        
                        console.log(results);
                        t++;
                        if(t == cycles) {
//                            console.log(res);
                            callback(res); 
                        }
                    },
                    error: function(error) {
                        console.log("error");
                        console.log(error);
                    }
                });
            }
        },
        error: function(error) {
            console.log("error");
            console.log(error);
        }
    });
    
}



app.use(function(req, res, next) {
    var auth;

    // check whether an autorization header was send    
    if (req.headers.authorization) {
      // only accepting basic auth, so:
      // * cut the starting "Basic " from the header
      // * decode the base64 encoded username:password
      // * split the string at the colon
      // -> should result in an array
      auth = new Buffer(req.headers.authorization.substring(6), 'base64').toString().split(':');
    }

    // checks if:
    // * auth array exists 
    // * first value matches the expected user 
    // * second value the expected password
    if (!auth || auth[0] !== 'chalsea' || auth[1] !== 'Rulethec0n') {
        // any of the tests failed
        // send an Basic Auth request (HTTP Code: 401 Unauthorized)
        res.statusCode = 401;
        // MyRealmName can be changed to anything, will be prompted to the user
        res.setHeader('WWW-Authenticate', 'Basic realm="MyRealmName"');
        // this will displayed in the browser when authorization is cancelled
        res.end('Unauthorized');
    } else {
        // continue with processing, user was authenticated
        next();
    }
});

//app.get('/logout', function (req, res) {
//    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
//    return res.sendStatus(401);
//});


app.get('/', function (req, res) {
    initParse();
    res.sendFile( __dirname + "/" + "index.html" );
})

app.get('/add', function (req, res) {
    initParse();
    res.render("add.html",{});
})


//
//app.get('/result', function (req, res) {
//
//    if (req.query.Filename==null) {
//        console.log('filename missing!');
//        res.render("result.html", {name:""});
//        return;
//    };
//
//    res.render("result.html", { name: req.query.Filename });
//})



app.get('/process_get', function (req, res) {
    
    getParse(function(data){
        console.log({"data":data});
        
//        for(var i = 0; i < data.length; i++) {
//            console.log(data[i].get('eventName'));
//            console.log(data[i].get('eventStartDate'));
//            console.log(data[i].get('eventCity'));
//        }
    
        
        res.json({"data":data});
    });
    
})

app.get('/show', function (req, res) {
    
    var Event = Parse_dev.Object.extend("Event");
    var query = new Parse_dev.Query(Event);
    query.get(req.query.data, {
      success: function(Event) {
        // The object was retrieved successfully.
//          console.log(Event.get("eventName"));
          
          res.render("show.html", { event: Event });
      },
      error: function(object, error) {
        // The object was not retrieved successfully.
        // error is a Parse.Error with an error code and message.
          res.end("no pages available!");
      }
    });    
})

app.get('/edit', function (req, res) {
    
    initParse();
    
    var Event = Parse_dev.Object.extend("Event");
    var query = new Parse_dev.Query(Event);
    query.get(req.query.data, {
      success: function(Event) {
        // The object was retrieved successfully.
//          console.log(Event.get("eventLatLong").latitude);
//          console.log(Event.get("eventLatLong").longitude);
          
//          console.log(Event.id);
          
          res.render("edit.html", { event: Event });
      },
      error: function(object, error) {
        // The object was not retrieved successfully.
        // error is a Parse.Error with an error code and message.
          res.end("no pages available!");
      }
    });    
})


app.post('/add', function (req, res) {
    initParse();
    
    console.log(req.body);
    
    var Event = Parse_dev.Object.extend("Event");
    var event = new Event();

    event.set("artistAlleyApplicationStatus", parseInt(req.body.artistAlleyApplicationStatus));
         
    event.set("artistAlleyBoothPrice",Number(req.body.artistAlleyBoothPrice));
    
    event.set("artistAlleySpotsAvailablility",Number(req.body.artistAlleySpotsAvailablility));
             
    if (req.body.artistsAlleyRegistrationUrl!="") {
        event.set("artistsAlleyRegistrationUrl",req.body.artistsAlleyRegistrationUrl);
    }
    else {
        event.set("artistsAlleyRegistrationUrl","N/A");
    }
    
    if (req.body.atDoorTicketPrices!="") {
        event.set("atDoorTicketPrices", req.body.atDoorTicketPrices);
    }
    else {
        event.set("atDoorTicketPrices","N/A");
    }
            
    event.set("eventAddress",req.body.eventAddress);
         
    event.set("eventCity",req.body.eventCity);
    event.set("eventCountry",req.body.eventCountry);
    event.set("eventDescription",req.body.eventDescription);
    
    event.set("eventHomeUrl",req.body.eventHomeUrl);
           

    if(Number(req.body.latitude)!=NaN && Number(req.body.longitude)!=NaN) {
        var point = new Parse_dev.GeoPoint({latitude: Number(req.body.latitude), longitude: Number(req.body.longitude)});

        event.set("eventLatLong",point);                    
    }
                
    event.set("eventName",req.body.eventName);
                
    if(req.body.eventStartDate!='') {
        event.set("eventStartDate",new Date(req.body.eventStartDate) +" UTC");
    }
      
    if(req.body.eventEndDate!='') {
        event.set("eventEndDate",new Date(req.body.eventEndDate + " UTC"));
    }

    event.set("eventState",req.body.eventState);
    if(req.body.eventStatus!='undefined')event.set("eventStatus",req.body.eventStatus);
 
    
    event.set("eventType",req.body.eventType);

    event.set("eventVenue",req.body.eventVenue);
    event.set("eventZip",req.body.eventZip);
                    
    event.set("exhibitorApplicationStatus",Number(req.body.exhibitorApplicationStatus));
    event.set("exhibitorBoothPrice",Number(req.body.exhibitorBoothPrice));

    event.set("exhibitorsBoothRegistrationUrl",req.body.exhibitorsBoothRegistrationUrl);
    event.set("fanTicketRegistrationUrl",req.body.fanTicketRegistrationUrl);
          
    event.set("notes",req.body.notes);
    event.set("organizerContactUrl",req.body.organizerContactUrl);
    event.set("presaleTicketPrices",req.body.presaleTicketPrices);
                
    event.set("eventCategory",req.body.eventCategory);

    if(req.body.featuredEvent != undefined) {
        event.set("featuredEvent",true);
    }
    else {
        event.set("featuredEvent",false);
    }

    if(req.body.hidden != undefined) {
        event.set("hiddenEvent",true);
    }
    else {
        event.set("hiddenEvent",false);
    }
    if(req.body.newData != undefined) {
        event.set("newData",true);
    }
    else {
        event.set("newData",false);
    }


    if(req.body.prodData != undefined) {
        event.set("prodData",true);
    }
    else {
        event.set("prodData",false);
    }
    
    if(req.body.eventAttendancePriorYear != undefined) {
        event.set("eventAttendancePriorYear",parseInt(req.body.eventAttendancePriorYear));  
        console.log(event.get("eventAttendancePriorYear"));
    }
                
    event.save(null, {
        success: function(event) {
                                    
            if(event.get("prodData")) {

                changeParse();
                
                console.log("hhe");

                var Event = Parse_dev.Object.extend("Event");
                var event2 = new Event();
                        
                event2.set("artistAlleyApplicationStatus", parseInt(req.body.artistAlleyApplicationStatus));
                        
                event2.set("artistAlleyBoothPrice",Number(req.body.artistAlleyBoothPrice));
                event2.set("artistAlleySpotsAvailablility",Number(req.body.artistAlleySpotsAvailablility));
                           
                if (req.body.artistsAlleyRegistrationUrl!="") {
                    event2.set("artistsAlleyRegistrationUrl",req.body.artistsAlleyRegistrationUrl);
                }
                else {
                    event2.set("artistsAlleyRegistrationUrl","N/A");
                }

                if (req.body.atDoorTicketPrices!="") {
                    event2.set("atDoorTicketPrices", req.body.atDoorTicketPrices);
                }
                else {
                    event2.set("atDoorTicketPrices","N/A");
                }
              
                event2.set("eventAddress",req.body.eventAddress);
            
                event2.set("eventCity",req.body.eventCity);
                event2.set("eventCountry",req.body.eventCountry);
                event2.set("eventDescription",req.body.eventDescription);
                            
                event2.set("eventHomeUrl",req.body.eventHomeUrl);             

                if(Number(req.body.latitude)!=NaN && Number(req.body.longitude)!=NaN) {
                    var point = new Parse_dev.GeoPoint({latitude: Number(req.body.latitude), longitude: Number(req.body.longitude)});


                    event2.set("eventLatLong",point);

                }
                event2.set("eventName",req.body.eventName);
           
                if(req.body.eventStartDate!='') {
                    event2.set("eventStartDate",new Date(req.body.eventStartDate + " UTC"));
                }
                
        
                if(req.body.eventEndDate!='') {
                    event2.set("eventEndDate",new Date(req.body.eventEndDate + " UTC"));
                }
        
                event2.set("eventState",req.body.eventState);
                
                if(req.body.eventStatus!='undefined')event2.set("eventStatus",req.body.eventStatus);

                event2.set("eventType",req.body.eventType);

                event2.set("eventVenue",req.body.eventVenue);
                            
                event2.set("exhibitorApplicationStatus",Number(req.body.exhibitorApplicationStatus));
                event2.set("exhibitorBoothPrice",Number(req.body.exhibitorBoothPrice));

                event2.set("exhibitorsBoothRegistrationUrl",req.body.exhibitorsBoothRegistrationUrl);
                event2.set("fanTicketRegistrationUrl",req.body.fanTicketRegistrationUrl);
                        
                event2.set("notes",req.body.notes);
                event2.set("organizerContactUrl",req.body.organizerContactUrl);
                event2.set("presaleTicketPrices",req.body.presaleTicketPrices);
                            
                event2.set("eventCategory",req.body.eventCategory);

                if(req.body.featuredEvent != undefined) {
                    event2.set("featuredEvent",true);
                }
                else {
                    event2.set("featuredEvent",false);
                }

                if(req.body.hidden != undefined) {
                    event2.set("hiddenEvent",true);
                }
                else {
                    event2.set("hiddenEvent",false);
                }
                
                if(req.body.newData != undefined) {
                    event2.set("newData",true);
                }
                else {
                    event2.set("newData",false);
                }

                if(req.body.prodData != undefined) {
                    event2.set("prodData",true);
                }
                else {
                    event2.set("prodData",false);
                }
                
                if(req.body.eventAttendancePriorYear != undefined) {
                    event2.set("eventAttendancePriorYear",parseInt(req.body.eventAttendancePriorYear));    
                }

                event2.save(null, {
                    success: function(event) {
                                // Execute any logic that should take place after the object is saved.
                //                        alert('New object created with objectId: ' + gameScore.id);
                //                console.log("not duplicate and insert into parse!!!!!!");
                        console.log(event);
                    },
                    
                    error: function(event, error) {
                                // Execute any logic that should take place if the save fails.
                                // error is a Parse.Error with an error code and message.
                //                        alert('Failed to create new object, with error code: ' + error.message);
                        console.log(error);
                    }
                });
            }
                        
        },
        error: function(event, error) {
            // Execute any logic that should take place if the save fails.
            // error is a Parse.Error with an error code and message.
            //                        alert('Failed to create new object, with error code: ' + error.message);
            console.log(error);
        }
    });
            
    res.end("<a href = '/'> back to main page</a>");
})



app.post('/edit', function (req, res) {
    
    
    
    
//    console.log(req.body.newData == undefined);
//    console.log(req.body.prodData == undefined);
    

//    
//    var objectId = req.body.objectId;
    
//            if(!objectId.val()){
//                alert("?????????");
//                return;
//            }
        
    initParse();
    
    console.log(req.body);
        var event = Parse_dev.Object.extend("Event");

        var query = new Parse_dev.Query(event);
        query.get(req.body.objectId,{
            success: function(event) {

    //            console.log(event.get("eventName"));
                event.set("artistAlleyApplicationStatus", parseInt(req.body.artistAlleyApplicationStatus));
    //            
    //            
    //            console.log(event.get("eventName"));
    //            
                event.set("artistAlleyBoothPrice",Number(req.body.artistAlleyBoothPrice));
    ////                event.set("artistAlleyContactInfo");
                event.set("artistAlleySpotsAvailablility",Number(req.body.artistAlleySpotsAvailablility));
    //                
                if (req.body.artistsAlleyRegistrationUrl!="") {
                    event.set("artistsAlleyRegistrationUrl",req.body.artistsAlleyRegistrationUrl);
                }
                else {
                    event.set("artistsAlleyRegistrationUrl","N/A");
                }
    //
                if (req.body.atDoorTicketPrices!="") {
                    event.set("atDoorTicketPrices", req.body.atDoorTicketPrices);
                }
                else {
                    event.set("atDoorTicketPrices","N/A");
                }
    //                
    //                
                event.set("eventAddress",req.body.eventAddress);
    ////                event.set("eventAttendancePriorYear");
    //                
                event.set("eventCity",req.body.eventCity);
                event.set("eventCountry",req.body.eventCountry);
                event.set("eventDescription",req.body.eventDescription);
    //                
                event.set("eventHomeUrl",req.body.eventHomeUrl);
    //                

                if(Number(req.body.latitude)!=NaN && Number(req.body.longitude)!=NaN) {
                    var point = new Parse_dev.GeoPoint({latitude: Number(req.body.latitude), longitude: Number(req.body.longitude)});


                    event.set("eventLatLong",point);
                    
                }
                event.set("eventName",req.body.eventName);
    //            
                if(req.body.eventStartDate!='') {
                    console.log(new Date(req.body.eventStartDate));
                    event.set("eventStartDate",new Date(req.body.eventStartDate));
                }
    //            
                if(req.body.eventStartDate!='') {
//                    console.log(req.body.eventStartDate + " UTC");

                    event.set("eventStartDate",new Date(req.body.eventStartDate + " UTC"));
                }
                if(req.body.eventEndDate!='') {
                    event.set("eventEndDate",new Date(req.body.eventEndDate+ " UTC")));
                }
                
    //                
    ////                event.set("eventStartTime");
    //            
                event.set("eventState",req.body.eventState);
                if(req.body.eventStatus!='undefined')event.set("eventStatus",req.body.eventStatus);
    //                
    //
                event.set("eventType",req.body.eventType);

                event.set("eventVenue",req.body.eventVenue);
                event.set("eventZip",req.body.eventZip);
    //                
                event.set("exhibitorApplicationStatus",Number(req.body.exhibitorApplicationStatus));
                event.set("exhibitorBoothPrice",Number(req.body.exhibitorBoothPrice));
    ////                event.set("exhibitorContactInfo","");
    ////                event.set("exhibitorSpotsAvailable","");
                event.set("exhibitorsBoothRegistrationUrl",req.body.exhibitorsBoothRegistrationUrl);
                event.set("fanTicketRegistrationUrl",req.body.fanTicketRegistrationUrl);
    //            

    //            
                event.set("notes",req.body.notes);
                event.set("organizerContactUrl",req.body.organizerContactUrl);
                event.set("presaleTicketPrices",req.body.presaleTicketPrices);
                
                event.set("eventCategory",req.body.eventCategory);

                if(req.body.featuredEvent != undefined) {
                    event.set("featuredEvent",true);
                }
                else {
                    event.set("featuredEvent",false);
                }

                if(req.body.hidden != undefined) {
                    event.set("hiddenEvent",true);
                }
                else {
                    event.set("hiddenEvent",false);
                }
                if(req.body.newData != undefined) {
                    event.set("newData",true);
                }
                else {
                    event.set("newData",false);
                }

                if(req.body.prodData != undefined) {
                    event.set("prodData",true);
                }
                else {
                    event.set("prodData",false);
                }
                
                if(req.body.eventAttendancePriorYear != undefined) {
                    event.set("eventAttendancePriorYear",parseInt(req.body.eventAttendancePriorYear));  
                    
                    console.log(event.get("eventAttendancePriorYear"));
                }
                

                event.save(null, {
                    success: function(event) {

                        console.log(event.get("eventZip"));
                        
                        
                        if(event.get("prodData")) {

                        changeParse();
                            
                        console.log("hhe");
//                        var event2 = new Event();
//                        event2 = event;
                        var Event = Parse_dev.Object.extend("Event");
                        var event2 = new Event();
                        
                        event2.set("artistAlleyApplicationStatus", parseInt(req.body.artistAlleyApplicationStatus));
                        
                        event2.set("artistAlleyBoothPrice",Number(req.body.artistAlleyBoothPrice));
            ////                event.set("artistAlleyContactInfo");
                        event2.set("artistAlleySpotsAvailablility",Number(req.body.artistAlleySpotsAvailablility));
            //                
                        if (req.body.artistsAlleyRegistrationUrl!="") {
                            event2.set("artistsAlleyRegistrationUrl",req.body.artistsAlleyRegistrationUrl);
                        }
                        else {
                            event2.set("artistsAlleyRegistrationUrl","N/A");
                        }
            //
                        if (req.body.atDoorTicketPrices!="") {
                            event2.set("atDoorTicketPrices", req.body.atDoorTicketPrices);
                        }
                        else {
                            event2.set("atDoorTicketPrices","N/A");
                        }
            //                
            //                
                        event2.set("eventAddress",req.body.eventAddress);
            ////                event.set("eventAttendancePriorYear");
            //                
                        event2.set("eventCity",req.body.eventCity);
                        event2.set("eventCountry",req.body.eventCountry);
                        event2.set("eventDescription",req.body.eventDescription);
            //                
                        event2.set("eventHomeUrl",req.body.eventHomeUrl);
            //                

                        if(Number(req.body.latitude)!=NaN && Number(req.body.longitude)!=NaN) {
                            var point = new Parse_dev.GeoPoint({latitude: Number(req.body.latitude), longitude: Number(req.body.longitude)});


                            event2.set("eventLatLong",point);

                        }
                        event2.set("eventName",req.body.eventName);
            //            
                        if(req.body.eventStartDate!='') {
//                            console.log(new Date(req.body.eventStartDate + " UTC"));
                            event2.set("eventStartDate",new Date(req.body.eventStartDate + " UTC"));
                        }
            //            
                        if(req.body.eventEndDate!='') {
                            event2.set("eventEndDate",new Date(req.body.eventEndDate + " UTC")));
                        }
            //                
            ////                event.set("eventStartTime");
            //            
                        event2.set("eventState",req.body.eventState);
                        if(req.body.eventStatus!='undefined')event2.set("eventStatus",req.body.eventStatus);
            //                
            //
                        event2.set("eventType",req.body.eventType);

                        event2.set("eventVenue",req.body.eventVenue);
            //                
                        event2.set("exhibitorApplicationStatus",Number(req.body.exhibitorApplicationStatus));
                        event2.set("exhibitorBoothPrice",Number(req.body.exhibitorBoothPrice));
            ////                event.set("exhibitorContactInfo","");
            ////                event.set("exhibitorSpotsAvailable","");
                        event2.set("exhibitorsBoothRegistrationUrl",req.body.exhibitorsBoothRegistrationUrl);
                        event2.set("fanTicketRegistrationUrl",req.body.fanTicketRegistrationUrl);
            //            

            //            
                        event2.set("notes",req.body.notes);
                        event2.set("organizerContactUrl",req.body.organizerContactUrl);
                        event2.set("presaleTicketPrices",req.body.presaleTicketPrices);
                            
                        event2.set("eventCategory",req.body.eventCategory);

                        if(req.body.featuredEvent != undefined) {
                            event2.set("featuredEvent",true);
                        }
                        else {
                            event2.set("featuredEvent",false);
                        }

                        if(req.body.hidden != undefined) {
                            event2.set("hiddenEvent",true);
                        }
                        else {
                            event2.set("hiddenEvent",false);
                        }
                        if(req.body.newData != undefined) {
                            event2.set("newData",true);
                        }
                        else {
                            event2.set("newData",false);
                        }


                        if(req.body.prodData != undefined) {
                            event2.set("prodData",true);
                        }
                        else {
                            event2.set("prodData",false);
                        }
                            
                        if(req.body.eventAttendancePriorYear != undefined) {
                            event.set("eventAttendancePriorYear",parseInt(req.body.eventAttendancePriorYear));  
//                            console.log(event.get("eventAttendancePriorYear"));
                        }

                        event2.save(null, {
                            success: function(event) {
                                // Execute any logic that should take place after the object is saved.
                //                        alert('New object created with objectId: ' + gameScore.id);
                //                console.log("not duplicate and insert into parse!!!!!!");
                                console.log(event);
                            },
                            error: function(event, error) {
                                // Execute any logic that should take place if the save fails.
                                // error is a Parse.Error with an error code and message.
                //                        alert('Failed to create new object, with error code: ' + error.message);
                                console.log(error);
                            }
                        });
                    }
                        
                        
                        
                        
                        
                    },
                    error: function(event, error) {
                            // Execute any logic that should take place if the save fails.
                            // error is a Parse.Error with an error code and message.
            //                        alert('Failed to create new object, with error code: ' + error.message);
                        console.log(error);
                    }
                });
                
                
                

            },
            error: function(object, error) {
            // The object was not retrieved successfully.
            // error is a Parse.Error with an error code and message.
//                res.end("no pages available!");
                
                console.log(error);
            }
        });
    
    
    res.end("<a href = '/'> back to main page</a>");
    
})




app.post('/file_upload', function (req, res) {

//    console.log(req.files[0]);  

    var des_file = __dirname + "/tmp_file/" + req.files[0].filename;
    fs.readFile( req.files[0].path, function (err, data) {
        fs.writeFile(des_file, data, function (err) {
            if( err ){
                console.log( err );
            }
            res.end( req.files[0].filename );
        });
    });
})

var server = app.listen(8081, function () {

    var host = server.address().address;
    var port = server.address().port;
    initParse();
    
    
    console.log("start application http://%s:%s", host, port);

})