function loadLists() {
	// show a loading message in the lists pane
	var listsPane = document.getElementById("listsPane");
	listsPane.innerHTML = "<p style='text-align:center; vertical-align:middle; margin-top:24px;'><img src='/imgs/loading_anim.gif' style='vertical-align:middle;'/> Loading</p>";
	
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			if (xhr.status == 200) {
				dispLists(xhr.responseXML);
			} else { // else the status is 404/not found
				setTimeout(loadLists, 1000);
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
	
	var folders = listList.getElementsByTagName("folder"); // get all the folders
	
	var folderElems = [];
	
	for (var i = 0; i < folders.length; i++) {
		var newFolder = document.createElement("div");
		newFolder.className = "listItem";
		newFolder.id = "folder" + i;
		newFolder.setAttribute("onclick", "if (document.getElementById(\"folderContents" + i + "\").style.height == \"auto\") {" +
			"document.getElementById(\"folderContents" + i + "\").style.height = \"0px\";" +
			"} else {" +
			"document.getElementById(\"folderContents" + i + "\").style.height = \"auto\";" +
			"}");
		newFolder.setAttribute("onclick", "document.getElementById(\"folderContents" + i + "\").classList.toggle(\"open\");");
		newFolder.innerHTML = "<img src=\"/flip/folder.png\" alt=\"\" style=\"display:inline-block; vertical-align:middle;\"/>&nbsp;" + folders[i].getAttribute("name");
		
		var newFolderContents = document.createElement("div");
		newFolderContents.className = "folderContents";
		newFolderContents.id = "folderContents" + i;
		
		var lists = folders[i].getElementsByTagName("list"); // get all the lists
		
		var newItems = []; // array to store the new <div>s
		
		for (var j = 0; j < lists.length; j++) {
			var newItem = document.createElement("div");
			newItem.className = "listItem";
			newItem.innerHTML = lists[j].getElementsByTagName("name")[0].textContent;
			if (lists[j].getElementsByTagName("description").length > 0) {
				newItem.innerHTML += "<br/><small>" + lists[j].getElementsByTagName("description")[0].textContent + "</small>";
			}
			newItem.setAttribute("onclick", "loadListItems(\"" + lists[j].getElementsByTagName("id")[0].textContent + "\");");
			newFolderContents.appendChild(newItem);
		}
		
		folderElems.push(newFolder);
		folderElems.push(newFolderContents);
	}
	
	listsPane.innerHTML = "";
	
	// show the new items
	// this is done after they are all created to reduce lag in displaying them, although it will likely be barely noticable in Chrome
	for (var i = 0; i < folderElems.length; i++) {
		listsPane.appendChild(folderElems[i]);
	}
}

function loadListItems(listId) {
	var listItemsPane = document.getElementById("listItemsPane");
	listItemsPane.innerHTML = "<p style='text-align:center; vertical-align:middle; margin-top:24px;'><img src='/imgs/loading_anim.gif' style='vertical-align:middle;'/> Loading</p>";
	
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			if (xhr.status == 200 && xhr.responseXML != null) {
				listItemsPaneHeader.innerHTML = xhr.responseXML.getElementsByTagName("name")[0].textContent;
				dispListItems(xhr.responseXML.getElementsByTagName("listItem"));
			} else {
				document.getElementById("listItemsPane").innerHTML = "<p>An error occurred while loading the list.</p>";
			}
		}
	}
	xhr.open("GET", "/lists/" + listId + ".xml", true);
	xhr.send("");
	
}

function dispListItems(listItems) {
	var newItems = [];
	
//	var list = loadXML(listId);
//	var listItems = list.getElementsByTagName("listItem");
	
	for (var i = 0; i < listItems.length; i++) {
		var newItem = document.createElement("div");
		newItem.className = "listItem";
		newItem.innerHTML = "<button>+</button>";
		newItem.innerHTML += "&nbsp;" + listItems[i].getElementsByTagName("english")[0].textContent + " / " + listItems[i].getElementsByTagName("kana")[0].textContent + " / " + listItems[i].getElementsByTagName("kanji")[0].textContent;
		newItem.setAttribute("data-english", listItems[i].getElementsByTagName("english")[0].textContent);
		newItem.setAttribute("data-kana", listItems[i].getElementsByTagName("kana")[0].textContent);
		newItem.setAttribute("data-kanji", listItems[i].getElementsByTagName("kanji")[0].textContent);
		newItem.setAttribute("onclick", "addItem(\"" + listItems[i].getElementsByTagName("english")[0].textContent + "\", \"" + listItems[i].getElementsByTagName("kana")[0].textContent + "\", \"" + listItems[i].getElementsByTagName("kanji")[0].textContent + "\");");
		newItems.push(newItem);
	}
	
	listItemsPane.innerHTML = "<button style='font-size:10pt;' onclick='addAllItems();'>Add all</button>";
	
	// show the new items
	// this is done after they are all created to reduce lag in displaying them, although it will likely be barely noticable in Chrome
	for (var i = 0; i < newItems.length; i++) {
		listItemsPane.appendChild(newItems[i]);
	}
}

function addItem(eng, kana, kanji) {
	if (list.indexOf([eng, kana, kanji]) != -1) {
		// confirm duplicates
		if (!confirm("You already added this item to the list.  Do you want to add a duplicate?")) {
			return;
		}
	}
	
	var userListPane = document.getElementById("userListPane");
	var listItem = document.createElement("div"); // create the HTML list item
	listItem.className = "listItem";
	listItem.innerHTML = "<button onclick=\"removeItem(this.parentElement);\">&times;</button>";
	listItem.innerHTML += "&nbsp;" + eng + " / " + kana + " / " + kanji;
	listItem.setAttribute("data-english", eng);
	listItem.setAttribute("data-kana", kana);
	listItem.setAttribute("data-kanji", kanji);
	userListPane.appendChild(listItem); // add it to the visible list
	list.push({"english":eng, "kana":kana, "kanji":kanji});
	// ^^ add it to the actual list array
	
	saveUserList();
	restart();
}
function addAllItems() {
	var listItems = document.getElementById("listItemsPane").getElementsByClassName("listItem");
	for (var i = 0; i < listItems.length; i++) {
		addItem(listItems[i].getAttribute("data-english"), listItems[i].getAttribute("data-kana"), listItems[i].getAttribute("data-kanji"));
	}
}
function removeItem(listItem) {
	var listItems = listItem.parentElement.getElementsByClassName("listItem");
	for (var i = 0; i < listItems.length; i++) {
		if (listItems[i] == listItem) {
			list.splice(i, 1);
			break;
		}
	}
	listItem.parentElement.removeChild(listItem);
	current--;
	while (current >= list.length - 1) {
		current--;
	}
	saveUserList();
	nextCard();
}
function clearUserList() {
	document.getElementById("userListPane").innerHTML = "<button style='font-size:10pt;' onclick='shuffleUserList();'>Shuffle List</button><button style='font-size:10pt;' onclick='clearUserList();'>Clear List</button>";
	list = [];
	saveUserList();
	restart();
}
function shuffleUserList() {
	list.sort(function() {return (Math.random() - 0.5);});
	
	var userListPane = document.getElementById("userListPane");
	
	userListPane.innerHTML = "<button style='font-size:10pt;' onclick='shuffleUserList();'>Shuffle List</button><button style='font-size:10pt;' onclick='clearUserList();'>Clear List</button>";
	
	for (var i = 0; i < list.length; i++) {
		var listItem = document.createElement("div"); // create the HTML list item
		listItem.className = "listItem";
		listItem.innerHTML = "<button onclick=\"removeItem(this.parentElement);\">&times;</button>";
		listItem.innerHTML += "&nbsp;" + list[i][0] + " / " + list[i][1] + " / " + list[i][2];
		userListPane.appendChild(listItem); // add it to the visible list
	}
	
	saveUserList();
	restart();
}

function convertToXML(listName, listArray, kanjiInd, kanaInd, engInd) {
	var listXML = ﻿"<?xml version=\"1.0\" encoding=\"utf-8\"?>\n" +
		"<!DOCTYPE kanjiList SYSTEM \"http://kanji-z.appspot.com/lists/kanjiList.dtd\">\n" +
		"<kanjiList>" +
		"<name>" + listName + "</name>";
	
	for (var i = 0; i < listArray.length; i++) {
		listXML += "<listItem>" +
			"<kanji>" + listArray[i][kanjiInd] + "</kanji>" +
			"<kana>" + listArray[i][kanaInd] + "</kana>" +
			"<english>" + listArray[i][engInd] + "</english>" +
			"</listItem>";
	}
	
	listXML += "</kanjiList>";
	
	return listXML;
}

function saveUserList() {
	/*if (list.length == 0) {
		localStorage.userList = "";
		return;
	}
	localStorage.userList = list[0].english + "/\\/" + list[0].kana + "/\\/" + list[0].kanji;
	for (var i = 0; i < list.length; i++) {
		localStorage.userList += ";,;";
		localStorage.userList += list[i].english + "/\\/" + list[i].kana + "/\\/" + list[i].kanji;
	}*/
	setSetting("list", JSON.stringify(list));
}
