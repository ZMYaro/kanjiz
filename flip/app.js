var txt = ["Welcome", "よこそう"];

var lang = {
	"english":0,
	"kana":1,
	"kanji":1
};

/** What is displayed on the front and back of each card */
var data = ["english", "kana"];

/** The currently visible side (0 = front; 1 = back) */
var side = 0;

/** The current list of cards */
var list = [{"english":"Welcome", "kana":"よこそう", "kanji":"よこそう"}, {"english":"To KanjiFlip_Z.", "kana":"KanjiFlip_Z.へ", "kanji":"KanjiFlip_Z.へ"}];

/** The currently visible card */
var current = 0;

/** Whether data is saved to the user's account */
var cloudSave = false;

//var lists = [];

// these are constants
var fontFamilies = ["Arial, Helvetica, Tahoma, Verdana, sans-serif", "HGKyokashotai, YOzFont"];
var fontSizes = ["32pt", "40pt"]

// HTML elements
/** The styled card div */ var card;
/** The text container in the card div */ var cardTxt;
/** The off-screen card, used for sizing */ var osCard;

/** Initialize the app */
function init() {
	// set HTML element variables
	card = document.getElementById("card");
	cardTxt = document.getElementById("cardTxt");
	osCard = document.getElementById("osCard");
//	osCard.style.left = (window.innerWidth + 5000) + "px";
	document.getElementById("nextCardBtn").disabled = false;
	document.getElementById("restartBtn").style.WebkitBoxShadow = "none";
	
	// load all other settings
	loadSettings();
	
	current--;
	nextCard();
	
	setTimeout("loadLists();", 1);
	
	document.addEventListener("keydown", keyPressed, true);
}

function flipCard() {
	card.style.width = "0px";
	setTimeout("flipCardBack();", 300);
	
	if (side == 0) {
		side = 1;
	} else {
		side = 0;
	}
}
function flipCardBack() {
	
	osCard.style.fontFamily = fontFamilies[lang[data[side]]];
	osCard.style.fontSize = fontSizes[lang[data[side]]];
	cardTxt.style.fontFamily = fontFamilies[lang[data[side]]];
	cardTxt.style.fontSize = fontSizes[lang[data[side]]];
	
	osCard.innerHTML = txt[side];
	cardTxt.innerHTML = txt[side];
	
	var newWidth = osCard.offsetWidth;
	
	if (newWidth > (window.innerWidth - 128)) {
		cardTxt.style.width = (window.innerWidth - 128) + "px";
		card.style.width = (window.innerWidth - 96) + "px";
	} else {
		cardTxt.style.width = (newWidth + 32) + "px";
		card.style.width = (newWidth + 32) + "px";
	}
	
	document.getElementById("progress").style.width = (1.0 * (current + 1) / list.length * 100) + "%";
	document.getElementById("progressNum").innerHTML = (current + 1) + "/" + list.length;
}

function nextCard() {
	//card.style.width = "0px";
	document.getElementById("cardBlock").style.top = "-200px";
	
	current++;
	
	if (current < list.length) {
		txt = [list[current][data[0]], list[current][data[1]]];
		side = 0;
		//setTimeout("flipCardBack();", 550);
		setTimeout("slideCardBack();", 200);
	}
	if (current >= list.length - 1) {
		document.getElementById("nextCardBtn").disabled = true;
		document.getElementById("restartBtn").style.WebkitBoxShadow = "0px 0px 6px 1px lightBlue";
	} else {
		document.getElementById("flipCardBtn").disabled = false;
		document.getElementById("nextCardBtn").disabled = false;
		document.getElementById("restartBtn").disabled = false;
		document.getElementById("restartBtn").style.WebkitBoxShadow = "none";
	}
	if (current <= 0) {
		document.getElementById("prevCardBtn").disabled = true;
	} else {
		document.getElementById("prevCardBtn").disabled = false;
	}
	
	if (list.length < 1) {
		document.getElementById("progress").style.width = "0%";
		document.getElementById("progressNum").innerHTML = "0/0";
		document.getElementById("flipCardBtn").disabled = true;
		document.getElementById("prevCardBtn").disabled = true;
		document.getElementById("nextCardBtn").disabled = true;
		document.getElementById("restartBtn").disabled = true;
		document.getElementById("restartBtn").style.WebkitBoxShadow = "none";
	}
}
function slideCardBack() {
	if (list.length > 0) {
		osCard.style.fontFamily = fontFamilies[lang[data[side]]];
		osCard.style.fontSize = fontSizes[lang[data[side]]];
		cardTxt.style.fontFamily = fontFamilies[lang[data[side]]];
		cardTxt.style.fontSize = fontSizes[lang[data[side]]];
	
		osCard.innerHTML = txt[side];
		cardTxt.innerHTML = txt[side];
	
		var newWidth = osCard.offsetWidth;
	
		if (newWidth > (window.innerWidth - 128)) {
			cardTxt.style.width = (window.innerWidth - 128) + "px";
			card.style.width = (window.innerWidth - 96) + "px";
		} else {
			cardTxt.style.width = (newWidth + 32) + "px";
			card.style.width = (newWidth + 32) + "px";
		}
		
		setTimeout("document.getElementById('cardBlock').style.top = '128px';", 200);
		
		document.getElementById("progress").style.width = (1.0 * (current + 1) / list.length * 100) + "%";
		document.getElementById("progressNum").innerHTML = (current + 1) + "/" + list.length;
	} else { // have to do something else or it will divide by zero and the world will expluude
		document.getElementById("progress").style.width = "0%";
		document.getElementById("progressNum").innerHTML = "0/0";
		document.getElementById("flipCardBtn").disabled = true;
		document.getElementById("nextCardBtn").disabled = true;
		document.getElementById("prevCardBtn").disabled = true;
		document.getElementById("restartBtn").disabled = true;
		document.getElementById("restartBtn").style.WebkitBoxShadow = "none";
		alert(5);
	}
}

function restart() {
	current = -1;
	side = 0;
	nextCard();
}

function setData(dataSide, dataType) {
	data[dataSide] = dataType;
	if (dataSide == 0) {
		setSetting("frontData", dataType);
	} else if (dataSide == 1) {
		setSetting("backData", dataType);
	}
	current--;
	nextCard();
}
