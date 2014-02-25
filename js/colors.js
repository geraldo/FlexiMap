function profilSelect(profil) {
console.log(profil);
	if (profil == "strong-vi") {
		$("#color-streets").spectrum("set", "black");
		$("#color-buildings").spectrum("set", "white");
		$("#color-land").spectrum("set", "#eee");
		$("#color-water").spectrum("set", "black");
		initColors();
	}
	else if (profil == "color-blind") {
		$("#color-streets").spectrum("set", "#F99");
		$("#color-buildings").spectrum("set", "black");
		$("#color-land").spectrum("set", "#FEC");
		$("#color-water").spectrum("set", "#ADD");
		initColors();
	}
}

function initColors() {
	colorStreets($("#color-streets").val());
	colorBuildings($("#color-buildings").val());
	colorLand($("#color-land").val());
	colorWater($("#color-water").val());
}

function colorStreets(col) {
	$('.highway').css('stroke',col);
	$('.major_road').css('stroke',col);
	$('.minor_road').css('stroke',col);
	$('.path').css('stroke',col);
	$('.rail').css('stroke',col);
}

function colorBuildings(col) {
console.log(col);
	$('.building').css('stroke',col);
	$('.place_of_worship').css('fill',col);
	$('.fuel').css('fill',col);
	$('.library').css('fill',col);
	$('.industrial').css('fill',col);
	$('.commercial').css('fill',col);
	$('.hospital').css('fill',col);
}

function colorLand(col) {
	//$('.landuse').css('fill',col);
	$('.pitch').css('fill',col);
	$('.farm').css('fill',col);
	$('.garden').css('fill',col);
	$('.forest').css('fill',col);
	$('.quarry').css('fill',col);
	$('.wood').css('fill',col);
	$('.scrub').css('fill',col);
	$('.sports_centre').css('fill',col);
	$('.playground').css('fill',col);
	$('.pedestrian').css('fill',col);
	$('.village_green').css('fill',col);
	$('.common').css('fill',col);
	$('.grass').css('fill',col);
	$('.park').css('fill',col);
	$('.golf_course').css('fill',col);
	$('.parking').css('fill',col);
	$('.library').css('fill',col);
	$('.university').css('fill','#fff');
	$('.residential').css('fill',col);
	$('.retail').css('fill',col);
}

function colorWater(col) {
	$('.river').css('fill',col);
	$('.water').css('fill',col);
	$('.water').css('stroke',col);
}


