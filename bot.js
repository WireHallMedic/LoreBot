var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var deities = require('./deities.json')
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
		var msg = ""
		var cmd = message.substring(1).toLowerCase();
		// list of deities
		if(cmd === "deities") {
			msg = "```List of Deities:\n" + deities[cmd] + "```";
		}
		// phase of the moon
		if(cmd.startsWith("lunar")) {
			msg = calcLunar(cmd.substring(6, cmd.length));
		}
		else if(cmd in deities != 0) {
			msg = formatDeity(deities[cmd]);
		}
		
		if (msg != "") {
			bot.sendMessage({
                    to: channelID,
                    message: msg
                });
		}
     }
});

function formatDeity(deity) {
	var str = "```" + deity.name + " [" + deity.caste + "]:\n";
	str += "Portfolio: " + deity.portfolio + "\n";
	str += "Alignment: " + deity.alignment + "\n";
	str += "Symbol: " + deity.symbol + "\n";
	str += "Description and Tenets: " + deity.description + "```";
	return str;
	
};

function calcLunar(str)
{
	var splitStr = str.split(" ");
	var season = splitStr[0];
	var day = parseInt(splitStr[1]);
	var year = parseInt(splitStr[2]);
	if(season == "spring" || season == "sp")
		day += 0;
	else if(season == "summer" || season == "su")
		day += 90;
	else if(season == "autumn" || season == "au")
		day += 180;
	else if(season == "winter" || season == "wi")
		day += 270;
	else
		return "Command '" + str + "' not understood.";
	
	day += (year * 360);
	return "Elmore: " + getPhaseStr(day, 39) + ", Folio: " + getPhaseStr(day, 27);
}

function getPhaseStr(dayNum, cycleLength)
{
	var cyclePos = (dayNum % cycleLength) / cycleLength;
	var waxing = cyclePos < .5;
	var waxWane = "Waxing";
	if(waxing == false)
	{
		waxWane = "Waning";
		cyclePos = 1.0 - cyclePos;
	}
	cyclePos *= 100;
    return (parseInt(cyclePos) + "% (" + waxWane + ")");
}
