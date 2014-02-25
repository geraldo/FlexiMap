$(function() {
	//svg fill pattern diagonal Hatch
	$('.leaflet-zoom-animated').prepend('<defs><pattern id="diagonalHatch" patternUnits="userSpaceOnUse" x="0" y="0" width="105" height="105"><g style="fill:none; stroke:black; stroke-width:1"><path d="M0 90 l15,15"/><path d="M0 75 l30,30"/><path d="M0 60 l45,45"/><path d="M0 45 l60,60"/><path d="M0 30 l75,75"/><path d="M0 15 l90,90"/><path d="M0 0 l105,105"/><path d="M15 0 l90,90"/><path d="M30 0 l75,75"/><path d="M45 0 l60,60"/><path d="M60 0 l45,45"/><path d="M75 0 l30,30"/><path d="M90 0 l15,15"/></g></pattern><pattern id="dotted" x="0" y="0" width="2" height="2" patternUnits="userSpaceOnUse"><circle cx="0" cy="0" r="1" style="stroke: none; fill: #000" /></pattern></defs>');
	//$('.leaflet-zoom-animated').append('<path class="building" d="M0 50 l100 -50 100 20 -50 50 -100 20z" viewBox="0,0,100,100" style="fill:url(#dotted);" />');

	$('.collapse.show-footer').on('show', function () {
		$("html, body").animate({ scrollTop: $(document).height() }, "slow");
	});

	$('#reset_btn').on('click', function () {
		$('#geojsonTable > tbody').empty();
	});

	$("#color-streets").spectrum({
		showInput: true,
		localStorageKey: "fleximap.streets.color",
		clickoutFiresChange: true,
		showInitial: true,
		showPalette: true,
		palette: [
		    ['black', 'white', 'blanchedalmond'],
		    ['rgb(255, 0, 0);', 'rgb(0, 255, 0);', 'rgb(0, 0, 255);']
		],
		change: function(color) {
			color.toHexString();
			colorStreets(color.toHexString());
		},
		move: function(color) {
			color.toHexString();
			colorStreets(color.toHexString());
		}
	});

	$("#color-buildings").spectrum({
		showInput: true,
		localStorageKey: "fleximap.buildings.color",
		clickoutFiresChange: true,
		showInitial: true,
		showPalette: true,
		palette: [
		    ['black', 'white', 'blanchedalmond'],
		    ['rgb(255, 0, 0);', 'rgb(0, 255, 0);', 'rgb(0, 0, 255);']
		],
		change: function(color) {
			color.toHexString();
			colorBuildings(color.toHexString());
		},
		move: function(color) {
			color.toHexString();
			colorBuildings(color.toHexString());
		}
	});

	$("#color-land").spectrum({
		showInput: true,
		localStorageKey: "fleximap.land.color",
		clickoutFiresChange: true,
		showInitial: true,
		showPalette: true,
		palette: [
		    ['black', 'white', 'blanchedalmond'],
		    ['rgb(255, 0, 0);', 'rgb(0, 255, 0);', 'rgb(0, 0, 255);']
		],
		change: function(color) {
			color.toHexString();
			colorLand(color.toHexString());
		},
		move: function(color) {
			color.toHexString();
			colorLand(color.toHexString());
		}
	});

	$("#color-water").spectrum({
		showInput: true,
		localStorageKey: "fleximap.water.color",
		clickoutFiresChange: true,
		showInitial: true,
		showPalette: true,
		palette: [
		    ['black', 'white', 'blanchedalmond'],
		    ['rgb(255, 0, 0);', 'rgb(0, 255, 0);', 'rgb(0, 0, 255);']
		],
		change: function(color) {
			color.toHexString();
			colorWater(color.toHexString());
		},
		move: function(color) {
			color.toHexString();
			colorWater(color.toHexString());
		}
	});

	$("#font-slider").slider({
		value:1,
		min: 0.8,
		max: 2.0,
		step: 0.1,
		slide: function(event, ui) {
			$("#font-size").val(ui.value+"em");
			textSize(ui.value);
		}
	});

	$("#text-color").spectrum({
		showInput: true,
		localStorageKey: "fleximap.text.color",
		clickoutFiresChange: true,
		showInitial: true,
		showPalette: true,
		palette: [
		    ['black', 'white', 'blanchedalmond'],
		    ['rgb(255, 0, 0);', 'rgb(0, 255, 0);', 'rgb(0, 0, 255);']
		],
		change: function(color) {
			color.toHexString();
			textColor(color.toHexString());
		},
		move: function(color) {
			color.toHexString();
			textColor(color.toHexString());
		}
	});

	$("#profil-select").on('change', function() {
		profilSelect(this.value);
	});

	$("#font-select").on('change', function() {
		textFont(this.value);
	});

	$("#transform-select").on('change', function() {
		textTransform(this.value);
	});

	$("input[name='font-weight']").on('change', function() {
		textWeight($('input[name="font-weight"]:checked').val());
	});

	//set default values
	$("#font-size").val($("#font-slider").slider("value")+"em");

	profilSelect("color-blind");
});

function initText() {
	textSize($("#font-slider").slider("value"));
	textColor($("#text-color").val());
	textFont($("#font-select").value);
	textTransform($("#transform-select").value);
};

function initBuildings() {
console.log("init");
	$(".building").css("stroke","#000");
	//$(".building").css("fill","url('#diagonalHatch')");
	//$(".building").css("fill","#fff");
	$(".building").css("stroke-width","2");
	$(".building").css("fill","#fff");
	//colorBuildings("url('#diagonalHatch')");

	//clone buildings for applying SVG pattern
	/*$(".building").each(function() {
		$(this).clone().attr('class','building2').insertAfter($(this));
	});

	$(".building2").css("stroke","#000");
	$(".building2").css("stroke-width","2");
	$(".building2").css("fill","url('#diagonalHatch')");

	colorLand("url('#dotted')");*/
}

function textSize(em) {
	$('.text').css('font-size',em+'em');
}

function textColor(col) {
	$('.text').css('fill',col);
	//$('.text').css('text-shadow','-2px 0 white, 0 2px white, 2px 0 white, 0 -2px white');
	$('.text').css('text-shadow: 0 0 0.2em white, 0 0 0.2em white, 0 0 0.2em white');
}

function textFont(font) {
	$('.text').css('font-family',font);
}

function textTransform(trans) {
	$('.text').css('text-transform',trans);
}

function textWeight(weight) {
	$('.text').css('font-weight',weight);
}

/* hide map overlays */
map.on('overlayremove', function(e) {
	switch (e.name){
		case 'Land':
			$('.landuse').css('display','none');
			break;
		case 'Water':
			$('.river').css('display','none');
			$('.water').css('display','none');
			break;
		case 'Buildings':
			$('.building').css('display','none');
			break;
		case 'Roads': 
			$('.highway').css('display','none');
			$('.major_road').css('display','none');
			$('.minor_road').css('display','none');
			$('.path').css('display','none');
			$('.rail').css('display','none');
			break;
		case 'POIs':
			$('.pois').css('display','none');
			$('.text').css('display','none');
			break;
		case 'Labels':
			$('.text').css('display','none');
	}
});

