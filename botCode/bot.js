var  
    twit = require('twit'),
    config = require('./config');

var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');

var natural_language_understanding = new NaturalLanguageUnderstandingV1({
  'username': 'f3550111-bd50-4e5f-8d44-8f0cc493c05e',
  'password': 'XSG0rEW0UOlB',
  'version_date': '2017-02-27'
});


var parameters = {
  'text': 'I was born in Tashkent Uzbekistan, it is the Capital of Uzebkistan. Although I was born there, I have no love for my home country.',

  'features': {
    'entities': {
      'emotion': true,
      'sentiment': true,
      'limit': 2
    },
    'keywords': {
      'emotion': true,
      'sentiment': true,
      'limit': 2
    }
  }
}


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
    //insertIntoTable
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
        
        //console.log("Tweet Text: " + tweets[result].text);
        var parameters = {
            
            region: 'Central',
            category: '',
            tweet: tweets[result].text,
            sentiment: '0.0'
            
        }
        
        con.query("use gis_term");
        con.query("INSERT INTO tweet SET ?", parameters, function(err, rows) {
           
            if(err) {
                //console.log("Error inserting: " + err);
            } else {
                console.log("Successfully Inserted Into Table");
            }
            
        });
        
    }
}

function calculateSentiment() {
    
    natural_language_understanding.analyze(parameters, function(err, response) {
        if (err)
            console.log('error:', err);
        else
            console.log(JSON.stringify(response, null, 2));
        }
    ); 
}

function searchTweets() {
    
    calculateSentiment();
    
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
            //console.log(tweetData);
            
            insertIntoTable(tweetData);
        }
        
    });
}

searchTweets();
searchTweets(doConnect, 900010);