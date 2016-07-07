var moment = require('moment');
var Parse = require('parse/node');

//var ParseList;
var crawlList;

function initParse() {
    Parse.initialize("GGTNZ2qrKXClObC4qotCEIBCFEpytaSscYJ7yzcG", "FEmiLsJNjftJ2kMob61vequskh6COimJvPSmYqZo");
//    var TestObject = Parse.Object.extend("TestObject");
//    var testObject = new TestObject();
//    testObject.save({foo: "bar"}).then(function(object) {
//      alert("yay! it worked");
//    });
}



function cpstring(a, b) {
    
    if (a.indexOf(b)!=-1||b.indexOf(a)!=-1) return true;
    return false;
}




function compare(parseObj, obj){
    
//    console.log(parseObj.length);
    var res = [];
    for(var i = 0; i < obj.length; ++i) {
//        console.log(obj[i].eventStartDate);
        
        var flag = 2;
        
        for(var j = 0; j < parseObj.length; ++j) {
//            console.log(moment(parseObj[i].get("eventStartDate")).format("YYYY-MM-DD"));
            if(obj[i].eventCity.toLowerCase() == parseObj[j].get("eventCity").toLowerCase() && cpstring(obj[i].name.toLowerCase(),parseObj[j].get("eventName").toLowerCase()) && parseObj[j].get("eventStartDate").toISOString().substring(0, 10) == new Date(obj[i].eventStartDate).toISOString().substring(0, 10)) {
                
//                console.log(moment(obj[i].eventStartDate).format("YYYY-MM-DD"));
                flag = 0;
                break;
//                continue;  // 名字  时间  地点都一样  肯定重复
            }
            
            else if( obj[i].eventStartDate != moment(parseObj[i].get("eventStartDate")).format("YYYY-MM-DD") ||   (obj[i].eventCity.toLowerCase() != parseObj[j].get("eventCity").toLowerCase()))  {
                
//                continue;
//                console.log("not duplicate");
                //                  parse.insert 名字不一样  时间也不一样  肯定不重复

            }
//            
            else {
//                console.log("manual");
                flag = 1;
//                res.push(obj[i]);   //剩下的就要人工加了
            } 
        }
        
        if(flag == 2) {
//            console.log("need insert!!!!!!");
//            console.log(obj[i].eventStartDate);
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
        
//        else console.log("replica!!!!!!");
        
    }
    console.log('finished!');
//    console.log(res);

    console.log(res);
    
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



exports.moment = moment;
exports.initParse = initParse;
exports.getParse = getParse;




