"use strict";
var Twitter = require('twitter');


var client = new Twitter({
  consumer_key: 'consumer_key',
  consumer_secret: 'consumer_secret',
  access_token_key: 'access_token_key',
  access_token_secret: 'access_token_secret'
});

function tweet(id, name, text, retweets, likes, hashtags, users, followers) {
	this.id = id;
	this.name = name;
	this.text = text;
	this.retweets = retweets;
	this.likes = likes;
	this.hashtags = hashtags;
	this.users = users;
	this.followers = followers
	this.score = (retweets + likes) * 100000 / followers;
}

function sortBy(field, reverse, primer){
   var key = primer ? function(x) {return primer(x[field])} : function(x) {return x[field]};
   reverse = !reverse ? 1 : -1;

   return function (a, b) {
       return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
     } 
}


module.exports = NodeHelper.create({

	socketNotificationReceived: function(notification, payload) {
		
		if(notification === "CONNECTED"){
			console.log(this.name + " received a socket notification: " + notification + " - Payload: " + payload);
			this.updateUi();
		}

		if (notification === "LOG"){
			console.log("here" + JSON.stringify(payload));
		}
	},

	updateUi: function () {
		var self = this;
		self.updateTweets();
		setInterval(function() {
			self.updateTweets();
		}, 900000);
	},

	updateTweets: function() {
		var self = this;
		client.get('https://api.twitter.com/1.1/statuses/home_timeline.json?count=30', function(error, jsonOut, response) {
			var tweets = [];
			if (!error) {
				for (var i = jsonOut.length - 1; i >= 0; i--) {
					var item = jsonOut[i];
					if(item.entities.urls == 0 && item.entities.user_mentions.length == 0){
						var myTweet = new tweet(item.id, item.user.name, item.text, item.retweet_count, item.favorite_count, item.entities.hashtags, item.entities.user_mentions, item.user.followers_count);
						tweets.push(myTweet);
					}
				}
			}
			else
				console.log(error);

			tweets.sort(sortBy('score', false, parseInt));
			self.sendSocketNotification("GET_TWEETS", tweets);
		});	
		
	}
});
