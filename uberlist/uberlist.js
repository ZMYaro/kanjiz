function init() {
	var xhttp;
	if (window.XMLHttpRequest) {
		xhttp = new XMLHttpRequest();
	} else { // for IE 5/6
		xhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xhttp.open("GET", "/lists/lists.txt", false);
	xhttp.send("");
	
	if (location.hash.length < 2) {
		var lists = xhttp.responseText;
		lists = lists.split("\n");
	} else {
		var lists = location.hash.substring(1, location.hash.length);
		lists = lists.split(",");
	}
	for (var i = 0; i < lists.length; i++) {
		if (lists[i] != "") {
			loadList(lists[i]);
		}
	}
}

function loadList(listName) {
	var vocabTable = document.getElementById("vocabTable");
	
	var listXML = loadXML(listName);
	var newHeaderRow = document.createElement("tr");
	var newHeader = document.createElement("th");
	newHeader.setAttribute("colspan", "3");
	newHeader.style.textAlign = "center";
	try {
		newHeader.innerHTML = listXML.getElementsByTagName("name")[0].childNodes[0].nodeValue;
	} catch(e) {
		alert("List " + listName + " has no <name>.");
	}
	newHeaderRow.appendChild(newHeader);
	vocabTable.appendChild(newHeaderRow);
	for (var j = 0; j < listXML.getElementsByTagName("listItem").length; j++) {
		newVocabRow = document.createElement("tr");
		newKanjiCell = document.createElement("td");
		try {
			newKanjiCell.innerHTML = listXML.getElementsByTagName("listItem")[j].getElementsByTagName("kanji")[0].childNodes[0].nodeValue;
		} catch(e) {}
		newVocabRow.appendChild(newKanjiCell);
		newKanaCell = document.createElement("td");
		try {
			newKanaCell.innerHTML = listXML.getElementsByTagName("listItem")[j].getElementsByTagName("kana")[0].childNodes[0].nodeValue;
		} catch(e) {}
		newVocabRow.appendChild(newKanaCell);
		newEngCell = document.createElement("td");
		try {
			newEngCell.innerHTML = listXML.getElementsByTagName("listItem")[j].getElementsByTagName("english")[0].childNodes[0].nodeValue;
		} catch(e) {}
		newVocabRow.appendChild(newEngCell);
		
		vocabTable.appendChild(newVocabRow);
	}
}

function loadSpecificList() {
	var bk = document.getElementById("bk").value;
	var ch = document.getElementById("ch").value;
	var l = document.getElementById("l").value;
	if (bk == "" || ch == "" || l == "") {
		location.hash = "";
		location.reload();
	} else {
		location.hash = ("bk" + bk + "_ch" + ch + "_l" + l);
		location.reload();
	}
}
