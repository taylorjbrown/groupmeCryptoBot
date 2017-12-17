'use strict';

require('dotenv').config();

const https = require('https');
const snoowrap = require('snoowrap');
var cacheCrypt = ['IOT','BTC','ETH','NEO','OMG','XRP'];

class Bot {
    /**
     * Called when the bot receives a message.
     *
     * @static
     * @param {Object} message The message data incoming from GroupMe
     * @return {string}
     */

     static cryptoGet(pathUrl, callback){
       https.get({
        host: 'min-api.cryptocompare.com',
        path: pathUrl,
        JSON:true
      }, 
      function(response){
        var resData = '';
        response.on('data', function(chunk){
          resData +=chunk;
        });

        response.on('end', function(){   
          callback(JSON.parse(resData));
        });
      });
     }

    /*add here for multiple messages*/
    static checkMessage(message) {

      const messageText = message.text;
      var singleBotRegex = /^price of \(\w+\)/i;
      var crypCur = /\(\w+\)/i;
      var dumpBotRegex = /^dump them out/i;
        // Check if the GroupMe message has content and if the regex pattern is true
        if (messageText && singleBotRegex.test(messageText)) {
          var cryptoCur = crypCur.exec(messageText);
          var cur = cryptoCur[0].slice(1,-1).toUpperCase();
          
          if(cacheCrypt.indexOf(cur) === -1){
              if(cacheCrypt.length >10){
                  cacheCrypt.pop();
               }
            cacheCrypt.push(cur);
          }
          return "/Cryp,"+cur;
        }

        if(messageText && dumpBotRegex.test(messageText)){
          return "/Dump,"+cacheCrypt.toString();
        }

      };

    /**
     * Sends a message to GroupMe with a POST request.
     *
     * @static
     * @param {string} messageText A message to send to chat
     * @return {undefined}
     */
     
     static sendMessage(messagesText) {
        // Get the GroupMe bot id saved in `.env`
        const botId = process.env.BOT_ID;

        const options = {
          hostname: 'api.groupme.com',
          path: '/v3/bots/post',
          method: 'POST'
        };

        //const fulltext = messageText1+messageText2;
        // Make the POST request to GroupMe with the http module
        const botRequest = https.request(options, function(response) {
          if (response.statusCode !== 202) {
            console.log('Rejecting bad status code ' + response.statusCode);
          }
        });

        // On error
        botRequest.on('error', function(error) {
          console.log('Error posting message ' + JSON.stringify(error));
        });

        // On timeout
        botRequest.on('timeout', function(error) {
          console.log('Timeout posting message ' + JSON.stringify(error));
        });
        

        botRequest.write(JSON.stringify({ bot_id: botId, text: messagesText.join('\n') }));

        botRequest.end();
      };
    };



module.exports = Bot;
