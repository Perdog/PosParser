
function startCount(left, total, $el) {
	if ($el[0].disabled == 'undefined' || $el[0].disabled == null) {
		$el[0].disabled = false;
	}
	
	if (!$el[0].disabled) {
		$el[0].disabled = true;
		progress(left, total, $el.next());
	}
}


function progress(timeleft, timetotal, $element) {
	
	var progressBarWidth = timeleft * $element.width() / timetotal;
	$element.find('div').animate({width: progressBarWidth}, 0, 'linear');
	
	if (timeleft > 0) {
		setTimeout(function() {
			progress(timeleft - 1, timetotal, $element);
		}, 1000);
		
		var m = Math.floor(timeleft/60);
		var timeRemaining = ((m > 0) ? m + "M " : "") + Math.floor(timeleft%60) + "S";
		
		$element.find('span').text(timeRemaining);
	} else {
		$element.find('div').animate({width: 0}, 1, 'linear');
		$element.find('span').text("Spawned");
		
		var loc = $element.parent().parent()["0"].firstElementChild.firstElementChild.value;//.find('input');
		var size = $element.prev()[0].id;
		$element.prev()[0].disabled = false;
		
		notify("Ding!", {body: "A " + size + " compound should be available in " + loc});
	}
}

function createSection($element) {
	var newRow = document.createElement("TR");
	var newBox = document.createElement("TD");
	var sysName = document.createElement("INPUT");
	sysName.setAttribute("type", "form-control");
	sysName.setAttribute("placeholder", "Enter system name here");
	//newBox.setAttribute("style", "vertical-align: middle")
	newBox.appendChild(sysName);
	newRow.appendChild(newBox);
	
	for (var i = 0; i < 4; i++)
	{
		var td = document.createElement("TD");
		var button = document.createElement("BUTTON");
		var barCont = document.createElement("DIV");
		var bar = document.createElement("DIV");
		
		// Assign shit to button
		button.setAttribute("id", (i === 0) ? "novice" : ((i === 1) ? "small" : ((i === 2) ? "medium" : "large")));
		button.setAttribute("type", "button");
		button.setAttribute("class", "btn btn-warning btn-block timer-button");
		button.setAttribute("onClick", "startCount(1740, 1740, $(this))");
		button.innerHTML = "Completed";
		
		// Assign shit to bar container
		barCont.setAttribute("id", "progressBar");
		barCont.setAttribute("class", "progress");
		
		// Assign shit to the actual bar
		bar.setAttribute("class", "progress-bar progress-bar-info");
		bar.setAttribute("style", "width: 0%");
		barCont.appendChild(bar);
		barCont.appendChild(document.createElement("SPAN"));
		
		// Assign everything to the td
		td.appendChild(button);
		td.appendChild(barCont);
		
		// Assign td to the row
		newRow.appendChild(td);
	}
	
	
	var table = document.getElementById("table-parent");
	table.appendChild(newRow);
}

function CheckPerms() {
	if (!("Notification" in window)) {
		console.log("Notifications not possible on this browser");
	} else if (Notification.permission === "default") {
		Notification.requestPermission(function (perm) {
			if (perm === "granted") {
				var not = notify("Thanks!", {body: "You will now be notified when plexs spawn!"});
			}
		});
	}
}

function notify(title, options) {
	
	if (!("Notification" in window) || Notification.permission !== "granted") {
		return;
	}
	
	title = title || "Time's up!";
	
	var o = {
		body: options.body || "",
		icon: options.icon || './notify.png'
	}
	var n = new Notification(title, o);
}

$(document).ready(function() {
	CheckPerms();
});

$('.create-button').click(function() {
	createSection($(this));
});




// Scan parser

$('#parse').click(function() {
	var parsed = parse($('#scanned').val())
	$('#results').html(parsed);
});

var condensed = {};
var rows;

function parse(text) {
	condensed = {};
	rows = text.split('\n');
	
	for (var i = 0; i < rows.length; i++) {
		var cells = rows[i].split('\t');
		
		condensed[cells[2].toString()] = (condensed[cells[2].toString()]) ? condensed[cells[2].toString()] + 1 : 1;
	}
	
	var finalString = "";
	
	var firstPass = true;
	for (p in condensed) {
		if (!firstPass) {
			finalString += ", ";
		} else {
			firstPass = false;
		}
		
		finalString += p + " x" + condensed[p];
	}
	
	return finalString;
};

/*
35833	Fliet - Ticonderoga	Fortizar	0 m
35825	Fliet - Stop and Swap	Raitaru	1,092 km
35832	Fliet - William Henry Technical Outpost	Astrahus	1,108 km
35826	Fliet - Robotics Fabrication Factory	Azbel	2,118 km
*/
