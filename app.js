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
		
		condensed[cells[1].toString()] = (condensed[cells[1].toString()]) ? condensed[cells[1].toString()] + 1 : 1;
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
