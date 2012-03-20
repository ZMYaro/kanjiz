var defaults = {
	"frontData":"english",
	"backData":"kana",
	"list":"[{\"english\":\"Welcome\", \"kana\":\"よこそう\", \"kanji\":\"よこそう\"}, {\"english\":\"To KanjiFlip_Z.\", \"kana\":\"KanjiFlip_Z.へ\", \"kanji\":\"KanjiFlip_Z.へ\"}]",
	"cloudSave":"true"
};
var validators = {
	"frontData":/english|kana|kanji/,
	"backData":/english|kana|kanji/,
	"cloudSave":/true|false/,
	"list":/\[.*\]/
};

/** Gets the value for a setting
  * @param {string} setting - The setting to fetch
  */
function getSetting(setting) {
	var value = "";
	if(cloudSave || setting === "cloudSave") {
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if(xhr.readyState == 4) {
				if(xhr.status == 401) { // not authenticated
					if(confirm("You do not appear to be signed in.  Sign in now?")) {
						window.open("/login", "_self");
					}
				}
			}
		}
		xhr.open("GET", "/kanjiflip/settings/get/" + encodeURIComponent(setting), false); // NOT asynchronous (for now)
		xhr.send();
		value = xhr.responseText;
	} else if(!!localStorage) {
		value = localStorage[setting];
	} else {
		return defaults[setting];
	}
	if(validators[setting].test(value)) {
		return value;
	} else {
		console.log("The stored value, \"" + value + "\", is not a valid value for setting \"" + setting + "\".  Substituting the default value.");
		return defaults[setting];
	}
}

/** Sets a setting to the given value
  * @param {string} setting - The setting to change
  * @param {string} value - The new value for the setting
  */
function setSetting(setting, value) {
	if(!validators[setting].test(value)) {
		console.log("\"" + value + "\" is not a valid value for setting \"" + setting + "\".");
		return;
	}
	if(cloudSave || setting === "cloudSave") {
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if(xhr.readyState == 4) {
				if(xhr.status == 401) { // not authenticated
					if(confirm("You do not appear to be signed in.  Sign in now?")) {
						window.open("/login", "_self");
					}
				}
			}
		}
		xhr.open("GET", "/kanjiflip/settings/set/" + encodeURIComponent(setting) + "/" + encodeURIComponent(value), false); // NOT asynchronous (for now)
		xhr.send();
	} else if(!!localStorage) {
		localStorage[setting] = value;
	} else {
		console.log("The setting " + setting + " = " + value + " was not saved because cloud storage is disabled, but this browser does not support localStorage.");
	}
}
