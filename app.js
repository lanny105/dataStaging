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
var Parse = require('parse/node');

//var ParseList;



function initParse() {
    Parse.initialize("GGTNZ2qrKXClObC4qotCEIBCFEpytaSscYJ7yzcG", "FEmiLsJNjftJ2kMob61vequskh6COimJvPSmYqZo");
}



function cpstring(a, b) {
    
    if (a.indexOf(b)!=-1||b.indexOf(a)!=-1) return true;
    return false;
}



function compare(parseObj, obj){
    
    var res = [];
//    console.log(obj);
//    console.log("------------");
    
    for(var i = 0; i < obj.length; ++i) {
        
        var flag = 2;
//        console.log(i);
        
        for(var j = 0; j < parseObj.length; ++j) {
            if(obj[i].eventCity.toLowerCase() == parseObj[j].get("eventCity").toLowerCase() && cpstring(obj[i].name.toLowerCase(),parseObj[j].get("eventName").toLowerCase()) && parseObj[j].get("eventStartDate").toISOString().substring(0, 10) == new Date(obj[i].eventStartDate).toISOString().substring(0, 10)) {
                
                flag = 0;
                break; // 名字  时间  地点都一样  肯定重复
            }
            
            else if( parseObj[j].get("eventStartDate").toISOString().substring(0, 10) != new Date(obj[i].eventStartDate).toISOString().substring(0, 10) ||   (obj[i].eventCity.toLowerCase() != parseObj[j].get("eventCity").toLowerCase()))  {
                //开始时间  或者  城市不一样   //认为肯定不重复
//                parse.insert 名字不一样  时间也不一样  肯定不重复
//                console.log(parseObj[j].get("eventStartDate"));
//                console.log(obj[i].eventStartDate);
//                console.log(obj[i].eventCity.toLowerCase());
//                console.log(parseObj[j].get("eventCity").toLowerCase());

            }
//            
            else {
                flag = 1;
                //开始时间   城市都一样   就是名字不一样
//              res.push(obj[i]);   //剩下的就要人工加了
            } 
        }
        
        if(flag == 2) {
            
//            console.log("need insert!");
            var Event = Parse.Object.extend("Event");
                var event = new Event();
                
                
                event.set("artistAlleyApplicationStatus",1);
                event.set("artistAlleyBoothPrice",0);
//                event.set("artistAlleyContactInfo");
                event.set("artistAlleySpotsAvailablility",0);
                
                if (obj[i].registerURL!="") {
                    event.set("artistsAlleyRegistrationUrl",obj[i].registerURL);
                }
                else {
                    event.set("artistsAlleyRegistrationUrl","N/A");
                }

                if (obj[i].atDoorTicketPrices!="") {
                    event.set("atDoorTicketPrices",obj[i].atDoorRates);
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
                
                
                event.set("eventCity",obj[i].eventCity);
                event.set("eventCountry",obj[i].eventCountry);
                event.set("eventDescription",obj[i].description);
                
                event.set("eventHomeUrl",obj[i].siteURL);
                
                var point = new Parse.GeoPoint({latitude: obj[i].latitude, longitude: obj[i].longitude});
                event.set("eventLatLong",point);
                event.set("eventName",obj[i].name);
                
            if(obj[i].eventStartDate!="") {
                event.set("eventStartDate",new Date(obj[i].eventStartDate));
            }
            
            if(obj[i].eventEndDate!="") {
                event.set("eventEndDate",new Date(obj[i].eventEndDate));
            }
                
//                event.set("eventStartTime");
                event.set("eventState",obj[i].eventState);
                event.set("eventStatus","NORMAL");
                

                event.set("eventType",obj[i].eventType);

                event.set("eventVenue",obj[i].eventVenue);
                
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
                
                event.save(null, {
                    success: function(event) {
                        // Execute any logic that should take place after the object is saved.
//                        alert('New object created with objectId: ' + gameScore.id);
                        console.log("not duplicate and insert into parse!!!!!!");
                    },
                    error: function(event, error) {
                        // Execute any logic that should take place if the save fails.
                        // error is a Parse.Error with an error code and message.
//                        alert('Failed to create new object, with error code: ' + error.message);
                        console.log(error);
                    }
                });
        } 
        
        else if (flag == 1) {
            
            res.push(obj[i]);
//            console.log("can't decide!!!!!!");
        }
        
        else {
//            console.log("replica!!!!!!");
            console.log(obj[i].name);
        }
        
    }
//    console.log('finished!');
//    console.log(res);

    console.log(res.length);
    
    return res;
}




function getParse(obj,callback) {
    var Event = Parse.Object.extend("Event");
    var query = new Parse.Query(Event);
    var count = 0;
    var obj = JSON.parse(obj);
    var res = []
    
    query.count({
        success: function(count) {
            var chunk = 100;
            var cycles = Math.ceil(count / chunk);
            var t = 0;
            for (i = 0; i < cycles; i++) {
                var _query = new Parse.Query("Event");
                _query.descending("createdAt");
                _query._limit = chunk;
                _query._skip = i * chunk;

//                console.log("getting results " + _query.skip.toString() + " to " + (_query.skip + _query.limit).toString());

                _query.find({
                    success: function(results) {
                        res = res.concat(results);
                        
                        t++;
                        if(t == cycles) {
//                            console.log(res);
                            
                            callback(compare(res,obj)); 
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
    res.sendFile( __dirname + "/" + "index.html" );
})


app.get('/result', function (req, res) {

    if (req.query.Filename==null) {
        console.log('filename missing!');
        res.render("result.html", {name:""});
        return;
    };

    res.render("result.html", { name: req.query.Filename });
})



app.get('/process_get', function (req, res) {

    if (req.query.Filename==null||req.query.Filename=="") {
        console.log('arguments missing!');
        res.json(JSON.stringify([]));
        return;
    };

    try{
        fs.accessSync(__dirname + "/tmp_file/" + req.query.Filename, fs.R_OK | fs.W_OK)
    }catch(e){
         //error
        console.log('files missing!');
        res.json(JSON.stringify([]));
        return;
    }
    
    //Converter Class 
    var Converter = require("csvtojson").Converter;
    var converter = new Converter({});
    
    //end_parsed will be emitted once parsing finished 
    converter.on("end_parsed", function (jsonArray) {

        var json = JSON.stringify(jsonArray)

//        var resArray = ugetParse(json);   
//        res.json(JSON.stringify(json));
        
        getParse(json,function (return_value) {
//            console.log(return_value);
//            res.end(JSON.stringify([]));
            res.end(JSON.stringify(return_value)); 
            
        });
//        
        
    });

    fs.createReadStream(__dirname + "/tmp_file/"+req.query.Filename).pipe(converter);
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