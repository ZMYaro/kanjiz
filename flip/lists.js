function loadLists() {
	var xHttpReq = new XMLHttpRequest();
	xHttpReq.open("GET", "/lists/lists.txt", false);
	xHttpReq.send("");
	var listList = xHttpReq.responseText;
	listList = listList.split("\n");
	
	for (var i = 0; i < listList.length; i++) {
		if (listList[i] != "") {
			lists.push(loadXML(listList[i]));
		}
	}
	
	dispLists();
}

function dispLists() {
	var listsPane = document.getElementById("listsPane");
	listsPane.innerHTML = "<p style='text-align:center; vertical-align:middle; margin-top:24px;'><img src='/imgs/loading_anim.gif' style='vertical-align:middle;'/> Loading</p>";
	var newItems = [];
	for (var i = 0; i < lists.length; i++) {
		var newItem = document.createElement("div");
		newItem.className = "listItem";
		newItem.innerHTML = lists[i].getElementsByTagName("name")[0].textContent;
		if (lists[i].getElementsByTagName("description").length > 0) {
			newItem.innerHTML += "<br/>" + lists[i].getElementsByTagName("description")[0].textContent;
		}
/*		if (lists[i].getElementsByTagName("description").length > 0) {
			newItem.title = lists[i].getElementsByTagName("description")[0].textContent;
		}*/
		newItem.setAttribute("onclick", "dispListItems(" + i + ");");
		newItem.id = "listSelector-" + i;
		newItems.push(newItem);
	}
	
	listsPane.innerHTML = "";
	
	// show the new items
	// this is done after they are all created to reduce lag in displaying them, although it will likely be barely noticable in Chrome
	for (var i = 0; i < newItems.length; i++) {
		listsPane.appendChild(newItems[i]);
	}
}

function dispListItems(listNum) {
	var listItemsPane = document.getElementById("listItemsPane");
	listItemsPane.innerHTML = "<p style='text-align:center; vertical-align:middle; margin-top:24px;'><img src='/imgs/loading_anim.gif' style='vertical-align:middle;'/> Loading</p>";
	var newItems = [];
	var listItems = lists[listNum].getElementsByTagName("listItem");
	for (var i = 0; i < listItems.length; i++) {
		var newItem = document.createElement("div");
		newItem.className = "listItem";
		newItem.innerHTML = listItems[i].getElementsByTagName("english")[0].textContent + " / " + listItems[i].getElementsByTagName("kana")[0].textContent + " / " + listItems[i].getElementsByTagName("kanji")[0].textContent;
		newItem.id = "listItemSelector-" + listNum + "-" + i;
		newItem.setAttribute("data-list-num", listNum);
		newItem.setAttribute("data-list-item-num", i);
		newItem.setAttribute("onclick", "addItem(this);");
		newItems.push(newItem);
	}
	
	listItemsPane.innerHTML = "<button style='font-size:10pt;' onclick='addAllItems();'>Add all</button>";
	
	listItemsPaneHeader.innerHTML = lists[listNum].getElementsByTagName("name")[0].textContent;
	
	// show the new items
	// this is done after they are all created to reduce lag in displaying them, although it will likely be barely noticable in Chrome
	for (var i = 0; i < newItems.length; i++) {
		listItemsPane.appendChild(newItems[i]);
	}
}

function addItem(item) {
	try {
//		var listNum = parseInt(item.id.split("-")[1]);
//		var listItemNum = parseInt(item.id.split("-")[2]);
		var listNum = parseInt(item.getAttribute("data-list-num"));
		var listItemNum = parseInt(item.getAttribute("data-list-item-num"));
	} catch(e) {
		alert("We tried to add the item, but it seems to have vanished!  Please try again later (you may want to refresh the app).");
		return;
	}
	
	var xmlListItem = lists[listNum].getElementsByTagName("listItem")[listItemNum]; // get the list item from the list XML
	if (list.indexOf({"english":xmlListItem.getElementsByTagName("english")[0].textContent, "kana":xmlListItem.getElementsByTagName("kana")[0].textContent, "kanji":xmlListItem.getElementsByTagName("kanji")[0].textContent}) != -1) {
		// confirm duplicates
		if (!confirm("You already added this item to the list.  Do you want to add a duplicate?")) {
			return;
		}
	}
	
	var userListPane = document.getElementById("userListPane");
	var listItem = document.createElement("div"); // create the HTML list item
	listItem.className = "listItem";
	listItem.innerHTML = xmlListItem.getElementsByTagName("english")[0].textContent + " / " + xmlListItem.getElementsByTagName("kana")[0].textContent + " / " + xmlListItem.getElementsByTagName("kanji")[0].textContent;
	userListPane.appendChild(listItem); // add it to the visible list
	list.push({"english":xmlListItem.getElementsByTagName("english")[0].textContent, "kana":xmlListItem.getElementsByTagName("kana")[0].textContent, "kanji":xmlListItem.getElementsByTagName("kanji")[0].textContent});
	// ^^ add it to the actual list array
	
	restart();
}
function addAllItems() {
	var listItems = document.getElementById("listItemsPane").getElementsByClassName("listItem");
	for (var i = 0; i < listItems.length; i++) {
		addItem(listItems[i]);
	}
	restart();
}
function clearUserList() {
	document.getElementById("userListPane").innerHTML = "<button style='font-size:10pt;' onclick='shuffleUserList();'>Shuffle List</button><button style='font-size:10pt;' onclick='clearUserList();'>Clear List</button>";
	list = [];
	restart();
}
function shuffleUserList() {
	list.sort(function() {return (Math.random() - 0.5);});
	
	var userListPane = document.getElementById("userListPane");
	
	userListPane.innerHTML = "<button style='font-size:10pt;' onclick='shuffleUserList();'>Shuffle List</button><button style='font-size:10pt;' onclick='clearUserList();'>Clear List</button>";
	
	for (var i = 0; i < list.length; i++) {
		var listItem = document.createElement("div"); // create the HTML list item
		listItem.className = "listItem";
		listItem.innerHTML = list[i][0] + " / " + list[i][1] + " / " + list[i][2];
		userListPane.appendChild(listItem); // add it to the visible list
	}
	
	restart();
}
