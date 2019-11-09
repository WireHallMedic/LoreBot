var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var timeInfo = require('./time.json');
var deities = require('./deities.json');
var geography = require('./geography.json');
var poopString = "Heh heh. You said 'poop.'";
var doomString = "DOOMED!";
var oddsString = "Never tell me the odds!";
var helpInfo = "Hi, I'm LoreBot! I can provide information on the following things:" +
			   "\n!Deities - List of deities." +
			   "\n![DEITY NAME] - Specific deity information." +
			   "\n!Geography - List of geographic locations." +
			   "\n![GEOGRAPHIC LOCATION] - Specific geographic information." +
			   "\n!Lunar [SEASON] [DAY] [YEAR] - Lunar phases for that day." +
			   "\n!Hakim - Description of Hakim and Hakim's New and Previously Owned Magical Items." +
			   "\n!Hakim Prices - Prices for Hakim's." +
			   "\n!Time - Calendar and timekeeping." + 
			   "\n!Standards - The foundation of currency." + 
			   "\n!Tavern - Randomly generated tavern name." + 
			   "\n!Interlude - Randomly selected interlude.";
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
			msg = "Should you really be messing with things you don't understand, " + user + "?";
		}
		// specific geographic locations
		else {
			var cmd2 = cmd;
			if(cmd2.startsWith("the ")) {
				cmd2 = cmd2.substring(4);
			}
			if(cmd2 in geography != 0) {
				msg = formatGeography(geography[cmd2]);
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

function randomElement(list) {
	return list[roll(list.length)];
	
};

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
