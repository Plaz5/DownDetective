//This 
const {Client, RichEmbed } = require('discord.js')

const bot = new Client({
    partials: ['MESSAGE']
})
const PREFIX = '>'

const TOKEN = require('./config/config.json') //change for prod
const format = require('date-format')
//const schedule = require('node-schedule');

//More Robust logging
const SimpleNodeLogger = require('simple-node-logger'),
opts2 = {
    logFilePath:'./log/downdetective.log',
    timestampFormat:'YYYY-MM-DD HH:mm:ss.SSS'
},
log = SimpleNodeLogger.createSimpleFileLogger( opts2 ); //For logging only to log file

opts = {
    logFilePath:'./log/downdetective.log',
    timestampFormat:'YYYY-MM-DD HH:mm:ss.SSS'
},
logCon = SimpleNodeLogger.createSimpleLogger( opts ); //For logging to console and log file

bot.on('ready', () =>{
    bot.user.setStatus('available')
    bot.user.setPresence({
        game: {
            name: 'watching you',
            type: "PLAYING",
            //url: "https://www.twitch.tv/test"
        }
    })
    logCon.warn(bot.user.tag + " has logged in and is online");
    
})
bot.on('error', console.error);



bot.on('raw', event => {
    console.log(event)
    const eventName = event.t;
    console.log(eventName)
    console.log("STAT" + event.d.status)
    const eventD = event.d;
    //const myUser = eventD.user.id
    if(eventName === 'PRESENCE_UPDATE')
    {
        console.log("User: " + eventD.user.id)
        var presenceBot = eventD.user.id;
        console.log("PRESENCE DETECTED")
        var presenceStatus = eventD.status;
        //Currently Set to a specific bot ID - This will eventually be an array of bots per guild
		//Bot ID of the bot to be monitored
        if(presenceBot === '<BOT ID>')
        {
            console.log('Correct BOT');
            console.log(eventD.status)

            //Possible presence status 
            //online - user is online
            //idle - user is AFK
            //offline - user is offline or invisible
            //dnd - user is in Do Not Disturb
            var presenceTypes = ['online', 'idle', 'dnd']
            if(presenceTypes.includes(presenceStatus) === true)
            {
                console.log('BOT is online')
                bot.emit('presenceUpdateOn', presenceStatus, presenceBot)

            }
            else if(presenceTypes.includes(presenceStatus) === false)
            {
                console.log("Bot is offline")
                bot.emit('presenceUpdateOff', presenceStatus, presenceBot)
            }
            else{
                //THIS ISN'T RIGHT - How Did we get here?
                //THIS SHOULD PROBABLY MESSAGE ME with error info 
                logCon.error("Error in presence detection : Status Value" + presenceStatus)
            }
            //bot.channels.get('651321951922421765').send("test")
            //bot.users.get('137276753734402048').send("test")
        }
    }

})




bot.on('presenceUpdateOn', (presenceStatus, presenceBot) =>{
    console.log(presenceBot + " is " + presenceStatus)
    console.log(presenceBot + " is online!")    
    //This will eventually send a message - to an array of users and/or a channel
})


bot.on('presenceUpdateOff', (presenceStatus, presenceBot) =>{
    console.log(presenceBot + " is " + presenceStatus)
    console.log(presenceBot + " is offline!")
     //This will eventually send a message - to an array of users and/or a channel
})






bot.login(TOKEN.token)