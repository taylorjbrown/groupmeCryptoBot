'use strict';

const http = require('http');
const Bot  = require('./bot');
const moment = require('moment-timezone');

var getCoinInfo = function (coin){
        var pathUrl = '/data/pricemultifull?fsyms='+coin+'&tsyms=USD';
        getPastInfo(coin , function(minMax){

            Bot.cryptoGet(pathUrl,function(result){
                var timeStamp = moment().tz("America/New_York").format('YYYY-MM-DD HH:mm'); 

                var sendInfo = [];

                sendInfo.push("TIMESTAMP: " + timeStamp);
                sendInfo.push("TICKER: "+ coin);

                var responseArr = result['DISPLAY'][coin]['USD'];

                if(responseArr['HIGHDAY']>minMax[0]){
                        sendInfo.push('30DAYHIGH: $ ' +responseArr['HIGHDAY']);
                    }
                else{
                        sendInfo.push('30DAYHIGH: $ ' + minMax[0]);
                    }
                if(responseArr['LOWDAY']<minMax[1]){
                        sendInfo.push('30DAYLOW: $ '+responseArr['LOWDAY']);
                    }
                else{
                        sendInfo.push('30DAYLOW: $ '+minMax[1]);
                    }

                for(var name in responseArr){ 
                    if(name.match(/^(PRICE|CHANGEDAY|CHANGEPCTDAY|LASTMARKET|HIGHDAY|LOWDAY)/)){
                        sendInfo.push(name+": "+responseArr[name]);
                    }
                }


                Bot.sendMessage(sendInfo);
            });
        });
    };


var getPastInfo = function(coin, callback){
    var minMax = [];
    var pathUrl = '/data/histoday?fsym='+coin+'&tsym=USD&limit=30&aggregate=1';
    Bot.cryptoGet(pathUrl, function(result){
        var histData = result['Data'];
        histData.forEach(function(coin){
            var low = coin['low'];
            var high  = coin['high'];
            if(minMax.length>0){
                if(minMax[0]<high){
                    minMax[0]=high;
                }
                if(minMax[1]>low){
                    minMax[1] =low;
                }
            }   
            else{
                minMax.push(coin['high']);
                minMax.push(coin['low']);
            }
        });
        callback(minMax);
    })
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
