'use strict';

require('dotenv').config();

const https = require('https');


class Bot {
    /**
     * Called when the bot receives a message.
     *
     * @static
     * @param {Object} message The message data incoming from GroupMe
     * @return {string}
     */


    static cryptoGet(fromCoin, callback){
       https.get({
            host: 'min-api.cryptocompare.com',
            path:'/data/pricemultifull?fsyms='+fromCoin+'&tsyms=USD',
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



    static checkMessage(message) {

        const messageText = message.text;
        var botRegex = /^price of \<\w+\>/i;
        var crypCur = /\<\w+\>/i;
        // Check if the GroupMe message has content and if the regex pattern is true
        if (messageText && botRegex.test(messageText)) {
            var cryptoCur = crypCur.exec(messageText);
            var cur = cryptoCur[0].slice(1,-1);
            return cur.toUpperCase();
        }
    };


    /**
     * Sends a message to GroupMe with a POST request.
     *
     * @static
     * @param {string} messageText A message to send to chat
     * @return {undefined}
     */
    static sendMessage(messageText) {
        // Get the GroupMe bot id saved in `.env`
        const botId = process.env.BOT_ID;

        const options = {
            hostname: 'api.groupme.com',
            path: '/v3/bots/post',
            method: 'POST'
        };

        const body = {
            bot_id: botId,
            text: messageText
        };

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

        // Finally, send the body to GroupMe as a string
        botRequest.end(JSON.stringify(body));
    };
};

module.exports = Bot;
