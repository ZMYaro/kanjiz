var defaults = {
	"data": "{\"front\":\"english\", \"back\":\"kana\"}",
	//"backData":"kana",
	"list": "[{\"english\":\"Welcome\", \"kana\":\"よこそう\", \"kanji\":\"よこそう\"}, {\"english\":\"To KanjiFlipZ\", \"kana\":\"KanjiFlipZへ\", \"kanji\":\"KanjiFlipZへ\"}]",
	"cloudSave": "true"
};
/*var validators = {
	"data": /\{('|")(front|back)\1\s*:(english|kana|kanji)\1,\s*('|")(english|kana|kanji)\3\}/,
	//"backData": /english|kana|kanji/,
	"cloudSave": /true|false/,
	"list": /\[.*\]/
};*/

/**
  * Gets the value for a setting
  * @param {string} setting - The setting to fetch
  */
function getSetting(setting) {
	var value = "";
	if(cloudSave || setting === "cloudSave") {
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if(xhr.readyState === 4) {
				if(xhr.status === 401) { // not authenticated
					if(confirm("You do not appear to be signed in.  Sign in now?")) {
						window.open("/login?app=kanjiflip", "_self");
					}
				}
			}
		};
		xhr.open("GET", "/kanjiflip/settings/get/" + encodeURIComponent(setting), false); // NOT asynchronous (for now)
		xhr.send();
		value = xhr.responseText;
	} else if(!!localStorage) {
		value = localStorage[setting];
	} else {
		return defaults[setting];
	}
	if(!!value) {
	/*if(validators[setting].test(value)) {*/
		return value;
	} else {
		console.log("The stored value, \"" + value + "\", is not a valid value for setting \"" + setting + "\".  Substituting the default value.");
		return defaults[setting];
	}
}

/**
  * Sets a setting to the given value
  * @param {string} setting - The setting to change
  * @param {string} value - The new value for the setting
  */
function setSetting(setting, value) {
	/*if(!validators[setting].test(value)) {
		console.log("\"" + value + "\" is not a valid value for setting \"" + setting + "\".");
		return;
	}*/
	if(cloudSave || setting === "cloudSave") {
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if(xhr.readyState === 4) {
				if(xhr.status === 401) { // not authenticated
					if(confirm("You do not appear to be signed in.  Sign in now?")) {
						window.open("/login?app=kanjiflip", "_self");
					}
				}
			}
		};
		xhr.open("POST", "/kanjiflip/settings/set/" + encodeURIComponent(setting), false); // NOT asynchronous (for now)
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhr.send("value=" + encodeURIComponent(value));
	} else if(!!localStorage) {
		localStorage[setting] = value;
	} else {
		console.log("The setting " + setting + " = " + value + " was not saved because cloud storage is disabled, but this browser does not support localStorage.");
	}
}

/**
  * Loads all user-customizable settings
  */
function loadSettings() {
	cloudSave = getSetting("cloudSave") != "false";
	if(!!localStorage) {
		document.getElementById("saveLocal").disabled = false;
		if(!cloudSave) {
			document.getElementById("saveCloud").checked = false;
			document.getElementById("saveLocal").checked = true;
		}
	}
	
	/*if(localStorage) {
		if(localStorage.userList && localStorage.userList != "" && localStorage.userList != "[]") {*/
			/*list = localStorage.userList.split(";,;");
			
			var userListPane = document.getElementById("userListPane");
			
			userListPane.innerHTML = "<button style='font-size:10pt;' onclick='shuffleUserList();'>Shuffle List</button><button style='font-size:10pt;' onclick='clearUserList();'>Clear List</button>";
			for(var i = 0; i < list.length; i++) {
				list[i] = list[i].split("/\\/");
				list[i] = {"english":list[i][0], "kana":list[i][1], "kanji":list[i][2]};
				
				var listItem = document.createElement("div"); // create the HTML list item
				listItem.className = "listItem";
				listItem.innerHTML = "<button onclick=\"removeItem(this.parentElement);\">&times;</button>";
				listItem.innerHTML += "&nbsp;" + list[i]["english"] + " / " + list[i]["kanji"] + " / " + list[i]["kana"];
				userListPane.appendChild(listItem); // add it to the visible list
			}*/
	
	// load the list and fill in the user list interface
	list = JSON.parse(getSetting("list"));
	userListPane.innerHTML = "<button style='font-size:10pt;' onclick='shuffleUserList();'>Shuffle List</button><button style='font-size:10pt;' onclick='clearUserList();'>Clear List</button>";
	for(var i = 0; i < list.length; i++) {
		var listItem = document.createElement("div"); // create the HTML list item
		listItem.className = "listItem";
		listItem.innerHTML = "<button onclick=\"removeItem(this.parentElement);\">&times;</button>";
		listItem.innerHTML += "&nbsp;" + list[i]["english"] + " / " + list[i]["kanji"] + " / " + list[i]["kana"];
		userListPane.appendChild(listItem); // add it to the visible list
	}
	
	// load the front data and update the UI accourdingly
	data = JSON.parse(getSetting("data"));
	if(list.length > 0) {
		txt["front"] = list[current][data["front"]];
	}
	document.getElementById("frontEnglish").checked = false;
	document.getElementById("frontKana").checked = false;
	document.getElementById("frontKanji").checked = false;
	
	document.getElementById("front" + data["front"].charAt(0).toUpperCase() + data["front"].substring(1)).checked = true;
	
	// load the back data and update the UI accourdingly
	if(list.length > 0) {
		txt["back"] = list[current][data["back"]];
	}
	document.getElementById("backEnglish").checked = false;
	document.getElementById("backKana").checked = false;
	document.getElementById("backKanji").checked = false;
	
	document.getElementById("back" + data["back"].charAt(0).toUpperCase() + data["back"].substring(1)).checked = true;
	
	current--;
	nextCard();
}
