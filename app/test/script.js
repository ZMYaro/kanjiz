var xmlData;
var mode = "kanji";
var list;
var num;

function init() {
	document.addEventListener("keydown", keyPressed, true);
	setLists();
	loadLists();
}

function loadLists() {
	// show a loading message in the lists pane
	var listsPane = document.getElementById("lists");
	listsPane.innerHTML = "<p style=\"text-align:center;\">Loading...</p>";
	
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			if (xhr.status == 200) {
				dispLists(xhr.responseXML);
			} else { // else the status is 404/not found
				setTimeout("loadLists()", 1000);
				if (console && console.log) {
					console.log("Error loading list list.  Retrying in 1 second.");
				}
			}
		}
	}
	xhr.open("GET", "/lists/lists.xml", true);
	xhr.send("");
	
}
function dispLists(listList) {
	var listsPane = document.getElementById("lists");
	listsPane.innerHTML = "";
	
	var folders = listList.getElementsByTagName("folder"); // get all the folders
	
	for (var i = 0; i < folders.length; i++) {
		var newFolderCode = "";
		newFolderCode += "<button class=\"smallBtn\" id=\"folder" + i + "ExpandBtn\" onclick=\"expand(\'folder" + i + "\');\">+</button>";
		newFolderCode += "&nbsp;" + folders[i].getAttribute("name");
		
		newFolderCode += "<div class=\"expandable\" id=\"folder" + i + "\">";
		
		var lists = folders[i].getElementsByTagName("list"); // get all the lists
		
		var newItems = []; // array to store the new <div>s
		
		for (var j = 0; j < lists.length; j++) {
			newFolderCode += "<label for=\"" + lists[j].getElementsByTagName("id")[0].textContent + "\">";
			newFolderCode += "<input type=\"checkbox\" id=\"" + lists[j].getElementsByTagName("id")[0].textContent + "\" onclick=\"setLists();\"/>"; 
			newFolderCode += lists[j].getElementsByTagName("name")[0].textContent;
			newFolderCode += "</label>";
			newFolderCode += "<br/>";
		}
		
		newFolderCode += "</div>";
		
		listsPane.innerHTML += newFolderCode;
	}
}

function loadWord() {
	list = Math.floor(Math.random() * xmlData.length);
	num = Math.round(Math.random() * (xmlData[list].getElementsByTagName("listItem").length - 1));
	if (mode == "kanji") { // kanji mode
		document.getElementById("disp").innerHTML = "<span class=\"japanese\">" +
		xmlData[list].getElementsByTagName("listItem")[num].getElementsByTagName("kanji")[0].textContent +
		"</span>";
	} else if (mode == "kana") { // kana mode
		//alert("aoeu");
		document.getElementById("disp").innerHTML = "<span class=\"japanese\">" +
		xmlData[list].getElementsByTagName("listItem")[num].getElementsByTagName("kana")[0].textContent +
		"</span>";
	} else if (mode == "english") { // english mode
		//alert("aoeu");
		document.getElementById("disp").innerHTML = "<small>" +
		xmlData[list].getElementsByTagName("listItem")[num].getElementsByTagName("english")[0].textContent +
		"</small>";
	}
}

function showKanji() {
	// append the corresponding kanji
	document.getElementById("disp").innerHTML += "=<span class=\"japanese\">" +
	xmlData[list].getElementsByTagName("kanji")[num].textContent +
	"</span>";
}
function showKana() {
	// append the corresponding kana
	document.getElementById("disp").innerHTML += "=<span class=\"japanese\">" +
	xmlData[list].getElementsByTagName("kana")[num].textContent +
	"</span>";
}

function showEng() {
	// append the corresponding English translation
	document.getElementById("disp").innerHTML += "= <small>" + xmlData[list].getElementsByTagName("english")[num].textContent + "</small> ";
}


function showOptions() {
	document.getElementById("options").style.display = "block";
	
}
function hideOptions() {
	document.getElementById("options").style.display = "none";
}
function setMode() {
	if (document.getElementById("kanjiMode").checked) {
		mode = "kanji"
		document.getElementById("kanaControls").style.visibility = "hidden";
		document.getElementById("englishControls").style.visibility = "hidden";
		document.getElementById("kanjiControls").style.visibility = "visible";
		loadWord();
	} else if (document.getElementById("kanaMode").checked) {
		mode = "kana"
		document.getElementById("kanjiControls").style.visibility = "hidden";
		document.getElementById("englishControls").style.visibility = "hidden";
		document.getElementById("kanaControls").style.visibility = "visible";
		loadWord();
	} else if (document.getElementById("englishMode").checked) {
		mode = "english"
		document.getElementById("kanjiControls").style.visibility = "hidden";
		document.getElementById("kanaControls").style.visibility = "hidden";
		document.getElementById("englishControls").style.visibility = "visible";
		loadWord();
	}
}
function setLists() {
	xmlData = new Array();
	for (var i = 0; i < document.getElementsByTagName("input").length; i++) {
		if (document.getElementsByTagName("input")[i].type == "checkbox" && document.getElementsByTagName("input")[i].checked) {
			var newXML = loadXML(document.getElementsByTagName("input")[i].id);
//			var newXML = loadXML(document.getElementsByTagName("input")[i].id + ".xml");
			if (newXML != null) {
				xmlData.push(newXML);
			}
		}
	}
	if (xmlData.length == 0) {
		xmlData.push(loadXML("default"));
	}
	loadWord();
}



function expand(id) {
	var elem = document.getElementById(id);
	if (elem.style.height == "auto") {
		elem.style.height = "0px";
		document.getElementById(id + "ExpandBtn").innerHTML = "+";
	} else {
		elem.style.height = "auto";
		document.getElementById(id + "ExpandBtn").innerHTML = "&#8722;";
	}
}


function keyPressed(e) {
//	if (console && console.log) {
//		console.log(e.keyCode);
//	}
	switch (e.keyCode) {
		case 65: // A
			if (mode == "kanji") {
				loadWord();
			} else {
				showKanji();
			}
		break;
		case 68: // D
			if (mode == "english") {
				loadWord();
			} else {
				showEng();
			}
		break;
		case 69: // E
			if (mode == "english") {
				loadWord();
			} else {
				showEng();
			}
		break;
		case 70: // F
			showOptions();
		break;
		case 79: // O
			if (mode == "kana") {
				loadWord();
			} else {
				showKana();
			}
		break;
		case 83: // S
			if (mode == "kana") {
				loadWord();
			} else {
				showKana();
			}
		break;
		case 85: // U
			showOptions();
		break;
	}
}
