var  
    twit = require('twit'),
    config = require('./config');

var mysql = require("mysql");
var async = require("async");
var Twitter = new twit(config);
var tweetData;


var con = mysql.createConnection(
{
    
   host: "localhost",
   user: "root",
   port:"3306",
   password: "Jaljap2732!",
   dateStrings: true,
   datebase: "gis_term"
});

function searchTweets() {
    var params = {
          q: 'since:2017-04-04',  // REQUIRED //goes by year-month-date
          geocode: '33.743450 -84.393138 1mi',
          result_type: 'recent',
          count:'100',
          lang: 'en'
    }
    
    Twitter.get('search/tweets', params, function(err, data) {
       
        if(err) {
            console.log("Error is: " + err);
        } else {
            tweetData = data;
            console.log(tweetData);
            //console.log("tweetData in search: \n" + tweetData);
            
        }
        
    });
}

searchTweets();
setInterval(searchTweets, 900010);