
# Groupme Crypto Currency Price Bot

Complete Messaging Bot that sends crypto currency information to a designated groupme. The focus of this project was to enable more discution about how the crypto market is moving at the current day. It is a fun way to become excited about the movements in the market with fellow crypto enthusiast.


## Neccessary Requirements:

#### 1) A GroupMe with a number of fellow crypto currency enthusiast
#### 2) The willingness to deploy to a web hosting service

## How It Works:

### Two text commands:

#### "price of (crypto_ticker)"

![example1](screenshots/example1.png)

- This command is a very easy way to show a group how a certain token is doing
- Use this to brag about how well your favorite token is doing or be saddened about the downturn the coin took for the day

#### "dump them out"

![example2](screenshots/example2.png)

- Comes with a few built in crypto tickers that it will display all at once
- These tokens change over time to the 10 that the group request the price of most recently
- This is extremely helpful to get a quick idea about how the groups different tokens are doing that day


### Register a new GroupMe Bot

* Head over to [dev.groupme.com](https://dev.groupme.com/) and login with your GroupMe credentials
* [Go to the `bots` tab and select `Create Bot`](screenshots/dev.groupme.com.png)
* [Choose a group, and avatar uri for the bot. The callback url will be that of the server you are deploying on, use http://localhost:3000 as a placeholder for now](screenshots/example3.png)
* Select `Submit` to create your bot
* Select your bot from the list of bots and save the bot id for later
* Check the group where you added the bot. There should be a message in chat that your bot was added to the group

### Deploying to a cloud server
**(Recommended, cleanest steps to have the bot run continually)**

Heroku and dokku are great options for deployment but a small cloud server will run this bot with little setup. Some great, inexpensive cloud providers include [DigitalOcean](https://www.digitalocean.com/), [Amazon AWS](https://aws.amazon.com/), [Microsoft Azure](https://azure.microsoft.com/), [Linode](https://www.linode.com/), [Rackspace](https://www.rackspace.com/), Setting up, deploying, and maintaining your app on your own cloud server is more involved than a Heroku or dokku setup.

#### After spinning up a linux box:

##### 1. Install [Node.js](https://nodejs.org/)
##### 2. Install a process manager like [forever](https://github.com/foreverjs/forever) to run the bot in the background
##### 3. `git clone` this bot to the server
##### 4. Change the botID to that of the one created above
##### 5. Change on dev.groupme.com the callback url to be that of the server you just created
##### 6. Test the bot works by running 'npm start app.js' and in the group chat use the bot's commands,
##### If this works you should recieve the output in the group chat as displayed above
##### If there is no response in the chat:
##### - Check that you bot ID is entered correctly in the .env file
##### - The callback url is correctly entered in the groupme bot at dev.groupme.com/bots
##### - Lastly, if all else fails, it is most likely a security group on your webserver not allowing for the correct traffic and I'd recommend looking further into their documentation to resolve the issue
 
##### 7. Start the bot to continuously run with the process manager:
   
    Example using forever:
    $ forever start --append -l forever.log -o out.log -e err.log app.js

### Deploying to Heroku

[Heroku](https://www.heroku.com/) is a nice option because of its PaaS 'push and forget' style of deployment. Heroku has a limited free tier that is great for deploying chat bots (the paid tier isn't too bad). Follow [these steps](https://devcenter.heroku.com/articles/getting-started-with-nodejs#introduction) to get your machine setup with Heroku and deploy the bot. Heroku even lets you easily set environment variables within their dashbaord or command line interface. This is super useful for setting a bot id configuration variable on Heroku.

### Deploying to dokku

[Dokku](http://dokku.viewdocs.io/dokku/) is another great option because its open source! Similar to Heroku, dokku allows you to 'push and forget', but the setup for dokku is more involved as it requires you to setup your own cloud server and install dokku before you can deploy. See [this guide](http://dokku.viewdocs.io/dokku/deployment/application-deployment/) for deploying to dokku. Like Heroku, dokku allows you to easily set environment variables like your bot id.

### Resources For Further Development/Help

- Crypto Currency information is being pulled from [the CryptoCompare API](https://www.cryptocompare.com/api/#)
- The starter bot and the deployment steps came from [ACMatUC/groupme-bot-starter](https://github.com/ACMatUC/groupme-bot-starter.git)
- The [Groupme API](https://dev.groupme.com/) can be of further help to find other ways to expand upon this bot

## License

[GNU GPLv3 License](LICENSE.txt)

