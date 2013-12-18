function loadXML(list) {
	var url = "/lists/" + list + ".xml";
	
	var newXMLData;
//	try {
	// load the XML file
	var xhttp;
	if (window.XMLHttpRequest) {
		xhttp = new XMLHttpRequest();
	} else { // for IE 5/6
		xhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xhttp.open("GET", url, false);
	xhttp.send("");
	newXMLData = xhttp.responseXML;
//	} catch (e) {
//		alert("Could not find the specified file.");
//	}
	if (newXMLData == null) { // ------------------ if nothing was neturned
		alert("Error loading \"" + url + "\"."); // return an error
		return null;
	}
	if (newXMLData.getElementsByTagName("listItem").length <= 0) { // if there are no <listItem>s
		alert("This file (" + url + ") contains no kanjis!"); // ------------------ return an error
		return null;
	}
//	alert("Loaded \"" + url + "\".");
	return newXMLData;
}
