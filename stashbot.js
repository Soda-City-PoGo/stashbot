//
//		CHECK THE LINE BELOW...DO THESE MAKE NO SENSE? ARE THEY RANDOM CHARACTERS?
//
// 		🔴 📵 🗨 📗 🗒 📜 📋 📝 📆 📲 👤 👥 🤖 📥 📤 ✅ ⚠ ⛔ 🚫 ❌ 🔨 🙂 😮 😁 😄 😆 😂 😅 😛 😍 😉 🤔 👍 👎 ❤
//
//		THEN YOU NEED TO ADJUST YOUR SETTINGS!!! "Encoding" » "Encode in UTF-8"
//		... BECAUSE THESE ARE ACTUAL IN-TEXT EMOJIS (WHICH DISCORD ALSO USES)
//

const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const bot=new Discord.Client({fetchAllMembers: true}); //		SLOW LOAD - GET OVER 1B USERS (FROM ALL SERVERS)
const mysql = require('mysql');
const winston = require('winston');
const request = require('request');
const Datetime    = require("./libs/Datetime.js");

try {
} catch (e){
	console.log(e.stack);
	console.log(process.version);
	console.log("Please run npm install and ensure it passes with no errors!"); // if there is an error, tell to install dependencies.
	process.exit();
}
console.log("Starting 🤖stashbot🤖 v1.0\nNode version: " + process.version + "\nDiscord.js version: " + Discord.version ); // send message notifying bot boot-up


let debugMode = false;
for (let val of process.argv){
    if (val === '-d' || val === '--debug'){
        debugMode = true;
        break;
    }
}

// Set up logging
const logger = winston.createLogger({
    levels: winston.config.syslog.levels,
    format: winston.format.combine(
        winston.format.colorize({ all:true }),
        winston.format.align(),
        winston.format.timestamp(),
        winston.format.splat(),  // Allows the text to be formatted at log time
        winston.format.simple(), // Same as above
        winston.format.printf(info => '[${info.timestamp}] ${info.level}: ${info.message}')
    ),
    transports: [
        new winston.transports.Console({
            level: (debugMode ? 'debug' : 'error')
        })
    ]
});

var appexit = (err = null) => {
    if (err){
        logger.error(err);
    }
//    if (Discord){
//       Discord.destroy((err) => {
//            logger.error(err);
//        });
//    }
    process.exit();
};


//		FUNCTION: TIME STAMP
//
function timeStamp(type){
	let CurrTime=new Date();
	let mo=CurrTime.getMonth()+1;if(mo<10){mo="0"+mo;}let da=CurrTime.getDate();if(da<10){da="0"+da;}let yr=CurrTime.getFullYear();
	let hr=CurrTime.getHours();if(hr<10){hr="0"+hr;}let min=CurrTime.getMinutes();if(min<10){min="0"+min;}let sec=CurrTime.getSeconds();if(sec<10){sec="0"+sec;}
	if(!type || type===0){
		// [YYYY/MM/DD @ HH:MM:SS]
		return cc.blue+yr+"/"+mo+"/"+da+" "+hr+":"+min+":"+sec+cc.reset+" |"
	}
	if(type===1){
		// `MM/DD/YYYY` **@** `HH:MM:SS`
		return "`"+mo+"/"+da+"/"+yr+"` **@** `"+hr+":"+min+":"+sec+"`"
	}
	if(type===2){
		// `MM/DD/YYYY @ HH:MM:SS`
		return "`"+mo+"/"+da+"/"+yr+" @ "+hr+":"+min+":"+sec+"`"
	}
}




// First you need to create a connection to the db
const con = mysql.createConnection({
  host  : config.mysqlHost,
  port  : config.mysqlPort,
  user  : config.mysqlUser,
  password  : config.mysqlPass,
  database  : config.mysqlDB,
  charset  : "utf8mb4"
});

con.connect((err) => {
  if(err){
    console.log('Error connecting to Db');
    return;
  }
  console.log('🤖stashbot🤖 successfully connected to the RDM database!');
});

con.end((err) => {
  // The connection is terminated gracefully
  // Ensures all previously enqueued queries are still
  // before sending a COM_QUIT packet to the MySQL server.
});






client.on('ready', () => {
	client.user.setStatus("online"); // Set the bot's online/idle/dnd/invisible status
	//client.user.setPresence({ game: { name: 'my code', type: 'WATCHING'}; // Set the bot's presence (activity and status)
	client.user.setActivity('PoGo-Maps', { type: 'Watching' });
	console.log("Connection was established at " + Datetime.GetToday());
	console.log("I am logged in to this server as " + client.user.tag)
	console.log("Prefix set to " + config.prefix);
	//console.log("total servers = " + client.guilds.size);
	//console.log("total users = "  + client.users.size)
	//console.log("total channels = "+ client.channels.size)
    console.log("🤖stashbot🤖 is alive, connected to the database, and ready to help you be the very best mapper!");	
    console.log("total servers = " + client.guilds.size)
    client.guilds.forEach((guild) => {
    console.log(" - " + guild.name);
        // List all channels
        //guild.channels.forEach((channel) => {
           // console.log(` -- ${channel.name} (${channel.type}) - ${channel.id}`)
       // })
    })
});


// this logs every message to the console.
//client.on('message', message => {
//	console.log(message.content);
//});
// these are prefix-less commands, basically the bot will just respond to whatever is in 'message.content.startsWith("here")' with whats in 'message.channel.send("here")'.
client.on("message", (message) => {
  if (message.content.startsWith("make")) {
    message.channel.send("scanning great again!");
  }
});


client.on("message", (message) => {
  if (message.content.startsWith("needful")) {
    message.channel.send("- hey asshole ur program doesn't work pls fix and do the needful!");
  }
});

client.on("message", (message) => {
  if (message.content.startsWith("profile")) {
    message.channel.send("https://raw.githubusercontent.com/Soda-City-PoGo/stashbot/master/XcodeHelp1.jpg \n https://raw.githubusercontent.com/Soda-City-PoGo/stashbot/master/XcodeHelp2.png \n https://raw.githubusercontent.com/Soda-City-PoGo/stashbot/master/XcodeHelp3.png");
  }
});

// This event will run on every single message received, from any channel or DM.
client.on("message", async message => {

  // Ignores commands from itself and other bots
  if(message.author.bot) return;

  // Ignores any message that does not contain the prefix defined in "config.json"
  if(message.content.indexOf(config.prefix) !== 0) return;

  // Seperate arguments and commands
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();	// all commands are lowercase, but can be called in discord in uppercase
 
 
 // These are all the commands for stashbot!
  
  if (message.content.startsWith(config.prefix + "rdm")) {
    message.channel.send("https://gitlab.com/realdevicemap/RealDeviceMap-Beta");
  } else
  if (message.content.startsWith(config.prefix + "uic")) {
    message.channel.send("https://gitlab.com/realdevicemap/RealDeviceMap-UIControl-Beta");
  } else
  if (message.content.startsWith(config.prefix + "help")) {
    message.channel.send("**Welcome to stashbot!** \n a bot made by soda to help mappers! \n If you want to buy me a :beer: \n `https://www.paypal.me/SodaCity` \n Clone me \n `git clone https://github.com/Soda-City-PoGo/stashbot.git` \n Invite me \n `https://discordapp.com/api/oauth2/authorize?client_id=603809400288706560&permissions=8&scope=bot` \n __Command Prefix__ `!`  \n $#########################################################$ \n **Command List** \n $#########################################################$ \n **rdm** - RealDeviceMap gitlab repo. \n **tuner** - Perl tuner to optimize Mysql! \n **pogo** - Links to official & useful pages. \n **mega** - instructions on how to use homebrew to download \n the gds ipa from megaupload from terminal. \n **uic** - RDM UIControl gitlab repo. \n **geojson** - geofence tool. \n **sort** - coordinate sorting tool. \n **wiki** - RDM read the docs. \n **mysql** - latest mysql server download page. \n **homebrew** - Homebrew for MacOS. \n **vmplayer** - Virtual Machine Host for Win/Linux. \n **pmsf** - Frontend for RDM. \n **pokebot** - Alert discord bot for RDM. \n **poracle** - Alert discord bot for RDM. \n **clusters** - Tool for Analyzing spwawnpoints in a RDM database. \n **tools** - Tool for making instances in RDM. \n **monitor** - discord bot to monitor RDM. \n **spoofninja** - discord bot to monitor for spoofers. \n **force** - discord bot to monitor current pogo version. \n **build** - command to build RDM UIC. \n **blocktrade** - Site to trade BTC for XMR. \n **yml** - example .yml for RDM docker image. \n **docker** - helpful docker commands. \n **gds** - :sunglasses: :iphone: \n **xmr** - current price of XMR. \n **stats** - stat page for RDM. \n **icons** - icon repos for pmsf/pokebot/RDM. \n **nest** - script for finding nest in RDM. \n **manmr** - commands to pull a merge request for rdm-uic. \n **help** - show this message.");	
  } else
  if (message.content.startsWith(config.prefix + "geojson")) {
    message.channel.send("http://geojson.io/#map=2/20.0/0.0");
  } else
  if (message.content.startsWith(config.prefix + "sort")) {
    message.channel.send("https://github.com/Kneckter/AutoSortCoords");
  } else
  if (message.content.startsWith(config.prefix + "wiki")) {
    message.channel.send("https://realdevicemap.readthedocs.io/en/latest/index.html");
  } else
  if (message.content.startsWith(config.prefix + "mysql")) {
    message.channel.send("https://dev.mysql.com/downloads/mysql/");
  } else
  if (message.content.startsWith(config.prefix + "brew")) {
    message.channel.send("🍺 https://brew.sh/ 🍺");
  } else
  if (message.content.startsWith(config.prefix + "pm2")) {
    message.channel.send("`npm install pm2@latest -g`");	
  } else
  if (message.content.startsWith(config.prefix + "vmplayer")) {
    message.channel.send("https://my.vmware.com/en/web/vmware/free#desktop_end_user_computing/vmware_workstation_player/15_0");	
  }	else
  if (message.content.startsWith(config.prefix + "pmsf")) {
    message.channel.send("https://github.com/whitewillem/PMSF");
  } else
  if (message.content.startsWith(config.prefix + "pokebot")) {
    message.channel.send("https://gitlab.com/webhookdatareceiver/Webhook-Data-Receiver");
  } else
  if (message.content.startsWith(config.prefix + "poracle")) {
    message.channel.send("https://github.com/KartulUdus/PoracleJS");
  } else
  if (message.content.startsWith(config.prefix + "clusters")) {
    message.channel.send("https://github.com/Kneckter/SpawnpointClusterTool");
  } else
  if (message.content.startsWith(config.prefix + "tools")) {
    message.channel.send("https://github.com/abakedapplepie/RealDeviceMap-tools \n or show spawnpoints with TTH as purple! \n https://github.com/bushe/RealDeviceMap-tools/tree/master");
  } else
  if (message.content.startsWith(config.prefix + "monitor")) {
    message.channel.send("https://github.com/chuckleslove/RDMMonitor");
  } else
  if (message.content.startsWith(config.prefix + "spoofninja")) {
    message.channel.send("https://github.com/JennerPalacios/SimpleSpoofNinja");
  } else
  if (message.content.startsWith(config.prefix + "leaderboard")) {
    message.channel.send("a cool leaderboard bot made by chuckleslove \n https://discordapp.com/api/oauth2/authorize?client_id=446821666320809984&permissions=805685328&scope=bot \n support server \n https://discord.gg/uZZrkTS");	
  } else
  if (message.content.startsWith(config.prefix + "force")) {
    message.channel.send("https://github.com/chuckleslove/DiscordPogoVersionMonitor");
  } else
  if (message.content.startsWith(config.prefix + "build")) {
    message.channel.send("`swift build && cp ./.build/x86_64-apple-macosx10.10/debug/RDM-UIC-Manager .`");
  } else
  if (message.content.startsWith(config.prefix + "blocktrade")) {
    message.channel.send("https://blocktrades.us/");
  } else
  if (message.content.startsWith(config.prefix + "yml")) {
    message.channel.send("https://pastebin.com/raw/Sf9JTRQy");
  } else
  if (message.content.startsWith(config.prefix + "manmr")) {
    message.channel.send("`git fetch origin merge-requests/72/head:master` \n `git checkout master` \n `cd Manager` \n `swift build && cp ./.build/x86_64-apple-macosx10.10/debug/RDM-UIC-Manager .` \n `./RDM-UIC-Manager` \n `git fetch origin merge-requests/71/head:invasion_spin_close` \n `git checkout invasion_spin_close` \n `cd Manager` \n `swift build && cp ./.build/x86_64-apple-macosx10.10/debug/RDM-UIC-Manager .` \n `./RDM-UIC-Manager`");	
  } else
  if (message.content.startsWith(config.prefix + "docker")) {
    message.channel.send("**Useful Docker Commands** \n `sudo docker ps -a -s` - Show all containers \n `sudo docker system df` - Show docker disk usage \n `sudo docker image ls -a` - Show all images \n `sudo docker logs -f contianerID | grep keyword` - \n Search docker logs for a specific keyword or phrase, \n **Note** keyword or phrase needs to be surrounded in double quotes! \n `sudo docker system prune -a` - a single command that will clean up all docker resources!");	
  } else
  if (message.content.startsWith(config.prefix + "gds")) {
    message.author.send("`GDS 1.3 version, Pokemon GO (0.149.0-A)` \n https://mega.nz/#!e7xwnAzQ!FqQGsMxT2l-pPKE2hKyzDci86hAnjK9UUcZQWcheuNo ");	
  } else
  if (message.content.startsWith(config.prefix + "xmr")) {
    message.channel.send("https://coinmarketcap.com/converter/usd/xmr/?amt=");
  } else
  if (message.content.startsWith(config.prefix + "store")) {
    message.channel.send("https://play.google.com/store/apps/details?id=com.nianticlabs.pokemongo&hl=en_US \n https://apps.apple.com/us/app/pok%C3%A9mon-go/id1094591345");	
  } else
  if (message.content.startsWith(config.prefix + "stats")) {
    message.channel.send("https://github.com/versx/RealDeviceMap-opole");
  } else
  if (message.content.startsWith(config.prefix + "pogo")) {
    message.channel.send("https://pokemongolive.com/en \n https://twitter.com/PokemonGoApp \n https://twitter.com/PokemonGOHubNet \n https://twitter.com/Chrales \n https://twitter.com/LeekDuck");	
  } else
  if (message.content.startsWith(config.prefix + "shadow")) {
    message.channel.send("https://docs.google.com/spreadsheets/d/1XkAcwNMDNZWuuqTyM4VkrR-ioS0TMciZIbemj7mylUc/edit#gid=0");	
  } else
  if (message.content.startsWith(config.prefix + "tuner")) {
	message.channel.send("https://github.com/major/MySQLTuner-perl");
  } else
  if (message.content.startsWith(config.prefix + "estimate")) {
	message.channel.send("If you need an **estimate** for radius you can use this `-6.188212745 * x + 947.4455894` and put your latitude for x. \n it gets you close to where you need to be and then adjust for what you observe.");	
  } else
  if (message.content.startsWith(config.prefix + "protos")) {
	message.channel.send("https://github.com/123FLO321/POGOProtos-Swift");	
  } else
  if (message.content.startsWith(config.prefix + "mega")) {
    message.channel.send("To install megatools for macOS \n `brew install megatools` \n once installed \n download latest ipa with \n `megadl ' https://mega.nz/megalinkgiventousbyG'`");	
  } else
  if (message.content.startsWith(config.prefix + "multiloc")) {
    message.channel.send("https://pgm-multiloc.devkat.org/ \n or \n https://voxx.github.io/pgm-multiloc/");	
  } else
  if (message.content.startsWith(config.prefix + "banned")) {
    message.channel.send("**For Linux** \n `wget https://stuff.notfurprofit.org/banned.sh; bash banned.sh` \n **For Windows**, \n you can either navigate to \n https://pgorelease.nianticlabs.com/plfe/version \n and https://sso.pokemon.com/ and look for a \n 403 Forbidden and 409 Conflict respectively, \n or download banned.sh from \n https://stuff.notfurprofit.org/banned.sh \n and run in Git Bash/Power shell.");	
  } else
  if (message.content.startsWith(config.prefix + "icons")) {
    message.channel.send("`https://raw.githubusercontent.com/nileplumb/PkmnShuffleMap/master/PMSF_icons_large/` \n `https://raw.githubusercontent.com/Aranoh/pkmn_shuffle_icons_pokesquad/master/optimized_for_PMSF_frontend/` \n `https://raw.githubusercontent.com/geekygreek7/pkmn_shuffle_icons/master/optimized_for_PMSF_frontend/` \n `https://raw.githubusercontent.com/shindekokoro/PkmnShuffleMap/master/PMSF_icons_large/` \n `https://raw.githubusercontent.com/tallypokemap/derpysprites/master/`");
  } else
  if (message.content.startsWith(config.prefix + "nest")) {
    message.channel.send("https://github.com/M4d40/PMSFnestScript");
  } else 
  if (message.content.startsWith(config.prefix + "stashbot")) {
	message.channel.send("Here is my source code on Github: https://github.com/Soda-City-PoGo/stashbot");
  } else	
  if (message.content.startsWith(config.prefix + 'today')) {
    message.channel.send('Today is: ' + new Date());

        	  
}
});

//do some cleanup on ctrl + c
process.on('SIGINT', () => {
    console.log('\nCTRL + C pressed 🤖stashbot🤖 shutting down!');
    appexit();
});


 
client.login(config.token);
