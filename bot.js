var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var timeInfo = require('./time.json');
var deities = require('./deities.json');
var geography = require('./geography.json');
var historical = require('./history.json');	// because 'history' is a reserved word
var poopString = "Heh heh. You said 'poop.'";
var doomString = "DOOMED!";
var oddsString = "Never tell me the odds!";
var helpInfo = "Hi, I'm LoreBot! I can provide information on the following things:" +
			   "\n!Deities - List of deities." +
			   "\n![DEITY NAME] - Specific deity information." +
			   "\n!Geography - List of geographic locations." +
			   "\n![GEOGRAPHIC LOCATION] - Specific geographic information." +
			   "\n!History - List of historical topics." +
			   "\n![HISTORICAL TOPIC] - Specific historical information." +
			   "\n!Lunar [SEASON] [DAY] [YEAR] - Lunar phases for that day." +
			   "\n!Hakim - Description of Hakim and Hakim's New and Previously Owned Magical Items." +
			   "\n!Hakim Prices - Prices for Hakim's." +
			   "\n!Time - Calendar and timekeeping." + 
			   "\n!Standards - The foundation of currency." + 
			   "\n!Tavern - Randomly generated tavern name." + 
			   "\n!Interlude - Randomly selected interlude." + 
			   "\n!Stat Block - Roll a stat block (4d6 drop the lowest 8 times).";
var adjList = ["Stout", "Bloody", "Slow", "Dull", "Soaked", "Drunken", "Crooked", "Dark", "Fabulous", "Noble", "Soft", "Red", 
			   "Green", "White", "Black", "Yellow", "Blue", "Burning", "Shattered", "Mighty", "Strong", "Lonely", "Poor", "Old", 
			   "Generous", "Lanky", "Hapless", "Tall", "Remarkable", "Frugal", "Prudent", "Foul", "Evil", "Good", "Rotten", "Shining", 
			   "Hungry", "Tired", "Patient", "Merciful", "Immortal", "Faithful", "Friendly", "Forlorn", "Adoring", "Brittle", "Floating", 
			   "Sharp", "Worn", "Cursed", "Beautiful", "Beloved", "Quiet", "Happy", "Courageous", "Wounded", "Blind", "Clairvoyant", 
			   "Blushing", "Calm", "Wary", "Cheerful", "Wise", "Clumsy", "Boorish", "Boastful", "Sly", "Daring", "Rebellious", "Diligent", 
			   "Disguised", "Ominous", "Determined", "Reliable", "Loyal", "Raging", "Excited", "Shy", "Magical", "Treacherous", "False", 
			   "Foolhardy", "Golden", "Frozen", "Gracious", "Hairy", "Hidden", "Hoarse", "Honest", "Humble", "Limping", "Lively", "Lucky", 
			   "Lean", "Nefarious", "Ogling", "Subtle", "Crazy"];
var nounList = ["Rooster", "Raven", "Crow", "Toad", "Hound", "Fox", "Bull", "Boar", "Clam", "Hawk", "Eagle", "Mouse", "Rat", "Frog", 
				"Elk", "Cat", "Guardian", "Hunter", "Barbarian", "Witch", "Troll", "Sword", "Shield", "Bow", "Dagger", "Hammer", "Helm", 
				"Acrobat", "Lion", "Ghoul", "Druid", "Master", "King", "Queen", "Prince", "Princess", "Shrub", "Tree", "Bear", "Smile", 
				"Eye", "Tongue", "Flounder", "Whale", "Man", "Woman", "Steer", "Stallion", "Mare", "Wish", "Hoof", "Goat", "Tower", "Fist", 
				"Monk", "Sleep", "Fool", "Knight", "Lady", "Sir", "Poet", "Nightingale", "Thrush", "Diamond", "Ruby", "Emerald", "Lute", 
				"Drum", "Flute", "Sapphire", "Worker", "Farmer", "Songbird", "Mother", "Father", "Sister", "Brother", "Protector", 
				"Soldier", "Sailor", "Guest", "Brewer", "Hornet", "Donkey", "Hare", "Twig", "Barrel", "Wyrm", "Warlock", "Thief", "Boot", 
				"Fang", "Skull", "Tankard", "Rogue", "Cannoneer", "Cricket", "Snail", "Beetle", "Axe", "Quartermaster"];
var interludeList = ["Tragedy: Describe a tale of tragedy or misfortune from your hero’s past, featuring one of his traits if possible. If the teller has a dark secret of some kind, hint strongly at it, drop clues, or otherwise give the rest of the group a glimpse into your hero’s dark side during your narrative.", 
					 "Victory: Tell the group about a great victory or personal triumph in your adventurer’s past. How did it affect him afterward? Was there a reward?",
					 "Love: Speak fondly of the character’s greatest love—lost, found, or waiting on him back home. What is her name? Where does she live? Why is the traveler not with her now?",
					 "Desire: Tell a tale about something your hero wants (or already has). It might be a material possession, recognition, a political goal, or even a trip he wishes to take to some amazing destination."];
var hakimPrices = "10 GP     - Common Magic Item Formula*\n" +
				  "50 GP     - Potion of Healing (2d4+2), Cantrip Spell Scroll, Uncommon Magic Item Formula*\n" +
				  "100 GP    - 1st Level Spell Scroll, Common Magic Item**\n" +
				  "250 GP    - Driftglobe, Bag of Holding, Potion of Greater Healing (4d4+4)\n" +
				  "300 GP    - 2nd Level Spell Scroll\n" +
				  "500 GP    - Rare Magic Item Formula*\n" +
				  "As Listed - Spell Components\n" +
				  "*See Xanathar's Guide to Everything, p129\n" +
				  "**Potion of Climbing, Socks of Comfort, and Xanathar's Guide to Everything p136-140";
var hakimDesc = "  Halkim Al-Nabi is known throughout Molidius as a fair and honest man; or perhaps more than a man.  Should a " +
				"town grow to sufficient size, one day a building will mysteriously lead to Hakim’s extraplanar shop.\n  Hakim himself " +
				" is a pleasant, polite man of Al-Badian descent.  He wears simple robes of high quality, and does not appear to age.  " +
				"He is obviously an extremely powerful spellcaster, his store is protected by a number of iron golems (rumored to be even " +
				"more powerful than the standard kind).  While his shop is otherwise fastidiously clean, he does not clean the blood " +
				"stains off the iron golems to remind guests what happens if they try to rob or attack him.\n  When a person or group " +
				"enters Hakim’s shop, they are the only ones there (other than Hakim).  No one else will come in while the original group " +
				"is there.  In effect, everyone gets their own instance of Hakim’s.\n  Hakim does not offer anything other than the " +
				"products and services listed below.  He is polite, but firm.  He does not deal in information or transportation, nor " +
				"does he  negotiate or haggle. He does not carry items made of nonmagical special substances, such as mithril or dragonhide.";
var standardsString = "  Commissioned by the ancient dwarven king Thakrond Flintbeard during the great Dwarven Empire, Standard Weights " +
					  "and Measurements of Precious Metals and Stones (usually just called 'Standards') is the most widely distributed " +
					  "book in Thelian by a large margin. Standards is an exhaustive guide to valuating metals and gem stones by weight, " +
					  "size, purity, and so on and so on, and is the basis of currency for thousands of years.\n  Standards is entirely " +
					  "self-referential, relating values in relation to silver, and when accompanied by a balance and small weights set, " +
					  "allows merchants to confidently accept coins and gems as currency. Nearly any merchant had to transcribe their own " +
					  "copy in their apprenticeship, and copies can be widely purchased for 1 GP. Any player character with a mercantile " +
					  "background may have a copy of Standards, a balance, and weights in addition to their normal starting gear.";
var diceRegEx = /\d+d\d+|^advantage|^disadvantage/i;
var intRegEx = /\d+/;
var opRegEx = /[+-/*x]/;
var shouldCalcRegEx = /^[+-\d]|^d\d|^advantage|^disadvantage/;
var shouldInsertOne = /^d\d/;
var numberRegEx = /\d+/;

var fifteenMinutes = 15 * 60 * 1000;

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

function connect()
{
   bot = new Discord.Client({token: auth.token, autorun: true});
   logger.info('Reconnected');
}

/*
// prevent the stupid, stupid heartbead timeout
function autoReconnect()
{
   bot = new Discord.Client({token: auth.token, autorun: true});
}

// call reconnect every fifteen minutes
setInterval(autoReconnect, fifteenMinutes);
*/
// create websocket (technically you should perform a GET to /api/gateway and use the response)

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

bot.on('disconnect', connect);

bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
	var msg = "";
	var cmd = "";
    if (message.substring(0, 1) == '!') {
		cmd = message.substring(1).toLowerCase();
		// help
		if(cmd === "lorebot") {
			msg = "```" + helpInfo + "```";
		}
		// how time works
		else if(cmd === "time") {
			msg = "```" + timeInfo["time"] + "```";
		}
		// list of deities
		else if(cmd === "deities") {
			msg = "```List of Deities:\n" + deities[cmd] + "```";
		}
		// list of geography locations
		else if(cmd === "geography") {
			msg = "```Geography Topics:\n" + geography[cmd] + "```";
		}
		// list of historical topics
		else if(cmd === "history") {
			msg = "```Historical Topics:\n" + historical[cmd] + "```";
		}
		// Standard Weights and Measurements of Precious Stones and Metals
		else if(cmd === "standards") {
			msg = "```" + standardsString + "```";
		}
		// phase of the moon
		else if(cmd.startsWith("lunar")) {
			msg = calcLunar(cmd.substring(6, cmd.length));
		}
		// tavern name
		else if(cmd === "tavern") {
			msg = getTavernName();
		}
		// interlude
		else if(cmd === "interlude") {
			msg = "```" + randomElement(interludeList) + "```";
		}
		// Hakim
		else if(cmd === "hakim") {
			msg = "```" + hakimDesc + "```";
		}
		// Hakim prices
		else if(cmd === "hakim prices") {
			msg = "```" + hakimPrices + "```";
		}
		// specific deities
		else if(cmd in deities != 0) {
			msg = formatDeity(deities[cmd]);
		}
		// test function
		else if(cmd === "test") {
			if(user === "wire_hall_medic") {
				msg = "Working properly.";
			}
			else {
				msg = "Should you really be messing with things you don't understand, " + user + "?";
			}
		}
		// roll stat block
		else if(cmd === "stat block") {
			msg = "```" + genStatBlock() + "```";
		}
		// dice interpertere and calculator
		else if(shouldCalcRegEx.test(cmd)) {
			msg = "```" + calculate(cmd) + "```";
		}
		// specific geographic and historical topics
		else {
			var cmd2 = cmd;
			if(cmd2.startsWith("the ")) {
				cmd2 = cmd2.substring(4);
			}
			if(cmd2 in geography != 0) {
				msg = formatGeography(geography[cmd2]);
			}
			if(cmd2 in historical != 0) {
				msg = historical[cmd2];
			}
		}
     }
	 // chirp, ignores own comments
	 else if(parseInt(userID) != parseInt(bot.id)){
		cmd = message.toLowerCase();
		
		if(cmd.includes("poop")) {
			msg = "Heh heh. You said 'poop.'";
		}
		else if(cmd.includes("doomed")) {
			msg = "DOOMED!";
		}
		else if(cmd.includes("chances of") || cmd.includes("odds of")) {
			msg = "Never tell me the odds!";
		}
		else if(cmd === "what does lorebot think?") {
			if(user === "wire_hall_medic") {
				msg = "Michael is 100% correct.";
			} else {
				msg = getGoForItMsg();
			}
		}
	 }
		
	if (msg != "") {
		bot.sendMessage({
				to: channelID,
				message: msg
			});
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

function formatGeography(geo) {
	var str = "```" + geo.name + ":\n";
	str += "Primary Language: " + geo.language + "\n";
	str += geo.description + "```";
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

function roll(max) {
	return parseInt(max * Math.random());
};

function roll1d6() {
	return roll(6) + 1;
}

function roll4d6() {
	return [roll1d6(), roll1d6(), roll1d6(), roll1d6()];
}

function genStat() {
	var returnVal = [0, 0, 0, 0, 0];
	var statRoll = roll4d6();
	var i;
	for (i = 0; i < 4; i++) {
		returnVal[i] = statRoll[i];
	} 
	statRoll.sort();
	for (i = 1; i < 4; i++) {
		returnVal[4] += statRoll[i];
	}
	return returnVal;
}

function getStatString(statArr) {
	var outStr = statArr[4] + " ";
	if(statArr[4] < 10) {
		outStr += " ";
	}
	outStr += "[" + statArr[0] + ", " + statArr[1] + ", " + statArr[2] + ", " + statArr[3] + "]";
	return outStr;
}

function randomElement(list) {
	return list[roll(list.length)];
	
};

function genStatBlock() {
	var finalStats = [0, 0, 0, 0, 0, 0, 0, 0];
	var outStr = "";
	var i;
	for (i = 0; i < 8; i++) {
		var curRoll = genStat();
		outStr += getStatString(curRoll) + "\n";
		finalStats[i] = curRoll[4];
	}
	finalStats.sort(function(a, b){return a-b});
	outStr = finalStats[2] + ", " + finalStats[3] + ", " + finalStats[4] + ", " + 
			 finalStats[5] + ", " + finalStats[6] + ", " + finalStats[7] + "\n" + outStr;
	return outStr;
}

function getTavernName() {
	var msg = "";
	var tavernNameStructure = roll(3);
	if(tavernNameStructure == 0) {
		msg = "```The " + randomElement(adjList) + " " + randomElement(nounList);
	}
	else if(tavernNameStructure == 1) {
		msg = "```The " + randomElement(nounList) + " and " + randomElement(nounList);
	}
	else if(tavernNameStructure == 2) {
		msg = "```The " + randomElement(nounList) + "'s " + randomElement(nounList);
	}
	var suffix = roll(6);
	if(suffix == 2) {
		msg += " Inn";
	}
	if(suffix == 3) {
		msg += " Tavern";
	}
	if(suffix == 4) {
		msg += " Lodge";
	}
	if(suffix == 5) {
		msg += " Public House";
	}
	msg += "```";
	return msg;
};

function calculate(inStr) {
	if(shouldInsertOne.test(inStr)) {
		inStr = "1" + inStr;
	}
	var parsedArr = parseDiceExpression(inStr);
	var rolledArr = null;
	var msg = "";
	
	if(parsedArr == null) {
		return "Could not parse '" + inStr + "'";
	}
	rolledArr = resolveRolls(parsedArr);
	if(rolledArr == null) {
		return "Could not parse '" + inStr + "'";
	}
	msg = "Total = " + sumExpr(rolledArr) + "\n";
	
	var i;
	for(i = 0; i < parsedArr.length; i++) {
		msg += parsedArr[i] + " ";
	}
	
	// only show third line if needed dice
	if(diceRegEx.test(inStr)) {
		msg += "=> ";
		for(i = 0; i < rolledArr.length; i++) {
			msg += rolledArr[i] + " ";
		}
	}
	
	return msg;
}

function parseDiceExpression(inStr) {
	// remove whitespace
	var calcStr = inStr.replace(/\s/g, "");
	var valArr = [];
	var i;
	var startIndex = 0;
	// break into array
	for(i = 0; i < calcStr.length + 1; i++) {
		if(i == calcStr.length) {
			valArr.push(calcStr.substring(startIndex, i));
		}
		else if(hasOpVal(calcStr.substring(i, i + 1))) {
			if (i == 0) {
				valArr.push("0");
			} else {
				valArr.push(calcStr.substring(startIndex, i));
			}
			valArr.push(calcStr.substring(i, i + 1));
			startIndex = i + 1;
		}
	}
	// check validity
	if(hasDiceVal(valArr[valArr.length - 1]) == false) {
		return null;
	}
	if(hasDiceVal(valArr[0]) == false) {
		return null;
	}
	var expectingOp = false;
	for(i = 0; i < valArr.length; i++) {
		if(expectingOp) {
			if(hasOpVal(valArr[i]) == false)
				return null;
		} else {
			if(hasDiceVal(valArr[i]) == false)
				return null;
		}
		expectingOp = !expectingOp;
	}
	return valArr;
}

function resolveRolls(parsedExp) {
	var returnVal = [];
	var i = 0;
	for(i = 0; i < parsedExp.length; i++) {
		if(diceRegEx.test(parsedExp[i]) == true) {
			returnVal.push(resolveDiceExpression(parsedExp[i]));
		} else {
			returnVal.push(parsedExp[i]);
		}
		if(returnVal[i] == null) {
			return null;
		}
	}
	return returnVal;
}

function resolveDiceExpression(expStr) {
	if(expStr === "advantage") {
		return rollAdv();
	}
	if(expStr === "disadvantage") {
		return rollDis();
	}
	var i;
	var sum = 0;
	var x = parseInt(expStr.split('d')[0]);
	if(x > 1000) {
		return null;
	}
	var y = parseInt(expStr.split('d')[1]);
	for(i = 0; i < x; i++) {
		sum += roll(y) + 1;
	}
	return sum;
}

function sumExpr(superExpr) {
	// create copy to avoid overwriting expr
	var expr = [];
	var i = 0;
	for(i = 0; i < superExpr.length; i++) {
		expr.push(superExpr[i]);
	}
	// first replace advantage and disadvantage
	for(i = 0; i < expr.length; i++) {
		if(typeof expr[i] == typeof " ") {
			if(expr[i].includes("min")) {
				var a = parseInt(numberRegEx.exec(expr[i].split(",")[0]));
				var b = parseInt(numberRegEx.exec(expr[i].split(",")[1]));
				expr[i] = Math.min(a, b);
			}
			else if(expr[i].includes("max")) {
				var a = parseInt(numberRegEx.exec(expr[i].split(",")[0]));
				var b = parseInt(numberRegEx.exec(expr[i].split(",")[1]));
				expr[i] = Math.max(a, b);
			}
		}
	}
	var sum = parseInt(expr[0]);
	for(i = 1; i < expr.length; i += 2) {
		if(expr[i] == "+") {
			sum += parseInt(expr[i + 1]);
		}
		if(expr[i] == "-") {
			sum -= parseInt(expr[i + 1]);
		}
		if(expr[i] == "*" || expr[i] == "x") {
			sum *= parseInt(expr[i + 1]);
		}
		if(expr[i] == "/") {
			sum /= parseInt(expr[i + 1]);
		}
	}
	return sum;
}

function rollAdv() {
	var rollA = roll(20) + 1;
	var rollB = roll(20) + 1;
	return "max(" + rollA + "," + rollB + ")";
}

function rollDis() {
	var rollA = roll(20) + 1;
	var rollB = roll(20) + 1;
	return "min(" + rollA + "," + rollB + ")";
}

function hasDiceVal(str) {
	return diceRegEx.test(str) || intRegEx.test(str);
}

function hasOpVal(str) {
	return opRegEx.test(str);
}

function getGoForItMsg() {
	return "You should go for it! The chance of a TPK is only " + (roll(99) + 1) + "%!";
}
