Module.register("MMM-CoolTweet",{
    defaults: {
        text: "Hello World!",
        lists: "some list",
        itemsCount: "1",
        width: "280px",
        
    },

    socketNotificationReceived: function(notification, payload) {

        if(notification === 'GET_TWEETS'){
          this.tweets = payload;
          this.updateDom(3000); 
        }


        // this.sendSocketNotification("LOG", payload);
    },

    // Override dom generator.
    getDom: function() {
        var wrapper = document.createElement("table"); 
        wrapper.className = "normal small light";
        // wrappers.style.width = "200px";
        if(this.tweets.length === 0){
          wrapper.innerHTML = "Keine Coolen Tweets"
        }
        else{
          for (var i = 0; i < this.config.itemsCount && i < this.tweets.length; i++) {
              var row = document.createElement("tr");
              var cell = document.createElement("td");
              cell.style.width = this.config.width;
              cell.innerHTML = this.tweets[i].text;
              cell.className = "title bright";
              row.appendChild(cell);
              wrapper.appendChild(row);
          }
        }

        return wrapper;
        
    },

    start: function() {        
        this.tweets = [];
        this.sendSocketNotification("CONNECTED", "connected");
        this.update();
    },

    update: function () {
        this.sendSocketNotification("UPDATEUI", "options");
    }
});
