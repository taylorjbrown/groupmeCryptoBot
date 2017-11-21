'use strict';

const http = require('http');
const Bot  = require('./bot');
const moment = require('moment-timezone');

var getCoinInfo= function (coin){
        Bot.cryptoGet(coin,function(result){
                var timeStamp = moment().tz("America/New_York").format('YYYY-MM-DD HH:mm'); 

                var sendInfo = [];
                sendInfo.push("TIMESTAMP: " + timeStamp);
                sendInfo.push("TICKER: "+ coin);

                var responseArr = result['DISPLAY'][coin]['USD'];

                for(var name in responseArr){
                
                    if(name.match(/^(PRICE|HIGHDAY|LOWDAY|CHANGEDAY|CHANGEPCTDAY|LASTMARKET|HIGH24HOUR|LOW24HOUR)/)){
                       
                        sendInfo.push(name+": "+responseArr[name]);
                    }
                }

                Bot.sendMessage(sendInfo);
            });
    }

class Server {
    /**
     * Creates an instance of Server.
     *
     * @param {Object} router
     * @param {boolean} devMode
     * @param {number} port
     */
     constructor(router, devMode, port) {
        // Create the server with the router
        this.server = http.createServer(function(req, res) {
            req.chunks = [];

            req.on('data', function(chunk) {
                req.chunks.push(chunk.toString());
            });

            // Router error handling
            router.dispatch(req, res, function(error) {
                res.writeHead(error.status, { 'Content-Type': 'text/plain' });
                res.end(error.message);
            });
        });

        this.devMode = devMode;

        // Default to 3000 if a port is not given
        this.port = Number(port || 3000);
    };

    /**
     * Starts listening on the server.
     *
     * @return {undefined}
     */
     serve() {
        // Start listening
        this.server.listen(this.port);

        console.log('Running on port ' + this.port);

        // If devMode is active, start a local tunnel for local development
        if (this.devMode) {
            require('./dev').dev(this.port, process.env.LT_SUBDOMAIN);
        }
    };

    /**
     * Responds to a GET request. A GroupMe bot sends a POST request anytime
     * there is a new message in chat, so GET requests can be ignored.
     *
     * @static
     * @return {undefined}
     */
     static getResponse() {
        this.res.end('Bot is responding to a GET request... hey there!');
    };
    /**
     * Responds to a POST request.
     *
     * @static
     * @return {undefined}
     */
     static postResponse() {

        // The message data from GroupMe
        const requestMessage = JSON.parse(this.req.chunks[0]);

        this.res.writeHead(200);
        this.res.end();

        // Give the message data to the bot, need a case for mutiple writings
        const messageResponse = Bot.checkMessage(requestMessage);
        const singleMatch = /Cryp,/;
        const mutipleMatch = /Dump,/;

        if (singleMatch.test(messageResponse)) {

            var temp = messageResponse.split(',');
            var coin = temp[1];
            getCoinInfo(coin);

        }
        else if(mutipleMatch.test(messageResponse)){
          
            var arr =  messageResponse.split(',');
            arr.shift();
       
            arr.forEach(function(coin, index){
                    getCoinInfo(coin);
            });
        };


    };
};

module.exports = Server;
