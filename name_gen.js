var testNamesMale = "James John Robert Michael William David Richard Joseph Thomas Charles Christopher Daniel Matthew Anthony Donald Mark Paul Steven Andrew Kenneth Joshua George Kevin Brian Edward Ronald Timothy Jason Jeffrey Ryan Jacob Gary Nicholas Eric Stephen Jonathan Larry Justin Scott Brandon Frank Benjamin Gregory Samuel Raymond Patrick Alexander Jack Dennis Jerry Tyler Aaron Jose Henry Douglas Adam Peter Nathan Zachary Walter Kyle Harold Carl Jeremy Keith Roger Gerald Ethan Arthur Terry Christian Sean Lawrence Austin Joe Noah Jesse Albert Bryan Billy Bruce Willie Jordan Dylan Alan Ralph Gabriel Roy Juan Wayne Eugene Logan Randy Louis Russell Vincent Philip Bobby Johnny Bradley "
var testNamesFemale = "Mary Patricia Jennifer Linda Elizabeth Barbara Susan Jessica Sarah Karen Nancy Margaret Lisa Betty Dorothy Sandra Ashley Kimberly Donna Emily Michelle Carol Amanda Melissa Deborah Stephanie Rebecca Laura Sharon Cynthia Kathleen Helen Amy Shirley Angela Anna Brenda Pamela Nicole Ruth Katherine Samantha Christine Emma Catherine Debra Virginia Rachel Carolyn Janet Maria Heather Diane Julie Joyce Victoria Kelly Christina Joan Evelyn Lauren Judith Olivia Frances Martha Cheryl Megan Andrea Hannah Jacqueline Ann Jean Alice Kathryn Gloria Teresa Doris Sara Janice Julia Marie Madison Grace Judy Theresa Beverly Denise Marilyn Amber Danielle Abigail Brittany Rose Diana Natalie Sophia Alexis Lori Kayla Jane "

function generateNames(str)
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

