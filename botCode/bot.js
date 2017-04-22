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

async.series([
    doConnect,
    searchTweets,
    insertIntoTable
]);



function doConnect() {
    
    con.connect(function(err) {
        if(err) {
            console.log("Sorry Fam, error connecting");
        }else {
            console.log("Connection Successful")
            searchTweets();
        }
    });
}

function insertIntoTable(tweets) {
    
    //console.log("Tweet Inserted is: " + tweets);
    
    
    for(var result in tweets) {
        
        console.log("Tweet Text: " + tweets[result].text);
        var parameters = {
            
            region: 'East_Coast',
            category: '',
            tweet: tweets[result].text,
            sentiment: '0.0'
            
        }
        
        con.query("use gis_term");
        con.query("INSERT INTO tweet SET ?", parameters, function(err, rows) {
           
            if(err) {
                console.log("Error inserting: " + err);
            } else {
                console.log("Successfully Inserted Into Table");
            }
            
        });
        
    }
}

function searchTweets() {
    var params = {
          q: 'since:2017-04-020',  // REQUIRED //goes by year-month-date
          result_type: 'recent',
          count:'100',
          lang: 'en'
    }
    
    Twitter.get('search/tweets', params, function(err, data) {
       
        if(err) {
            console.log("Error is: " + err);
        } else {
            tweetData = data.statuses;
            console.log(tweetData);
            
            insertIntoTable(tweetData);
        }
        
    });
}

searchTweets();
searchTweets(doConnect, 900010);