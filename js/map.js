var roadSizes = {
	'highway': '12px',
	'major_road': '8px',
	'minor_road': '4px',
	'rail': '1px',
	'path': '0.5px'
};

var roadColor = {
	'highway': '#F78545',
	'major_road': '#eee',
	'minor_road': '#ccc',
	'rail': '#aaa',
	'path': 'grey'
};

var label = new L.TileLayer.d3_topoJSON('http://tile.openstreetmap.us/vectiles-skeletron/{z}/{x}/{y}.json', {
	id: function(d) {return d.geometry.coordinates[1]},
	id2: function(d) {return '#' + d.geometry.coordinates[1]},
	text: function(d) {return d.properties.name},
})

var land = new L.TileLayer.d3_topoJSON('http://tile.openstreetmap.us/vectiles-land-usages/{z}/{x}/{y}.json', {
	class: function(d) {return 'landuse ' + d.properties.kind; console.log(d.properties.kind)},
	style: function(d) {return}
});

var building = new L.TileLayer.d3_topoJSON('http://tile.openstreetmap.us/vectiles-buildings/{z}/{x}/{y}.json', {
	class: 'building'
});

var road = new L.TileLayer.d3_topoJSON('http://tile.openstreetmap.us/vectiles-highroad/{z}/{x}/{y}.json', {
	class: function(d) { return d.properties.kind},
	style: function(d) { return 'stroke-width: ' + roadSizes[d.properties.kind] +'; stroke: ' + roadColor[d.properties.kind]},
});

var water = new L.TileLayer.d3_topoJSON('http://tile.openstreetmap.us/vectiles-water-areas/{z}/{x}/{y}.json', {
	class: 'water'
});

var pois = new L.TileLayer.d3_topoJSON('http://tile.openstreetmap.us/vectiles-pois/{z}/{x}/{y}.json', {
	class: function(d) {return 'pois ' + d.properties.kind; console.log(d.properties.kind)},
	text: function(d) {return d.properties.name },
	updateWhenIdle: true
});

//load pois icons
var icons = {};
$.getJSON("icon/maki.json", function(json) {
	$.each( json, function(key,entry) {
		var icon = L.icon({
			iconUrl: "icon/"+entry.icon+"-24@2x.png",
			iconSize:     [48, 48],
			iconAnchor:   [24, 24],
			popupAnchor:  [12, -12]
		});
		icons[entry.icon] = icon;
		$.each( entry.tags, function(key2,tag) {
			var icon = L.icon({
				iconUrl: "icon/"+entry.icon+"-24@2x.png",
				iconSize:     [48, 48],
				iconAnchor:   [24, 24],
				popupAnchor:  [12, -12]
			});
			icons[tag] = icon;
		});
	});
	//console.log(Object.keys(icons).length);
});
var defaultIcon = L.icon({
	iconUrl: "icon/marker-stroked-24@2x.png",
	iconSize:     [48, 48],
	iconAnchor:   [24, 24],
	popupAnchor:  [12, -12]
});

function onEachFeature(feature, layer) {
	var popupContent = "<p>I started out as a GeoJSON " +
			feature.geometry.type + ", but now I'm a Leaflet vector!</p>";
	if (feature.properties && feature.properties.popupContent) {
		popupContent += feature.properties.popupContent;
	}
	layer.bindPopup(popupContent);
}

// Add a fake GeoJSON line to coerce Leaflet into creating the <svg> tag that d3_geoJson needs
var dummy = new L.geoJson({'type': 'LineString','coordinates':[[0,0],[0,0]]});

var map = L.mapbox.map('map', null, {
	center: [48.33710,14.32039],
	zoom: 17,
	minZoom:14,
	//layers: [dummy]
	layers: [dummy, land, water, road, building, label]
});

var hash = new L.Hash(map);

var overlays = {
	'Land': land,
	'Water': water,
	'Buildings': building,
	'Roads': road,
	'Labels': label,
	'POIs': pois
};

L.control.layers(null, overlays, {position:'topleft'}).addTo(map);

/*var tileNum = 0;

var map = L.map('map', {
	center: [48.33710,14.32039],
	zoom: 17,
});

new L.Hash(map);

new L.geoJson({'type': 'LineString','coordinates':[[0,0],[0,0]]}).addTo(map);

new L.TileLayer.d3_topoJSON("http://tile.openstreetmap.us/vectiles-all/{z}/{x}/{y}.topojson",{
	updateWhenIdle:false
}).addTo(map);*/

/*
var map = L.map('map');

new L.Hash(map);

new L.geoJson({'type': 'LineString','coordinates':[[0,0],[0,0]]}).addTo(map);

var vectiles = new L.TileLayer.d3_topoJSON("http://tile.openstreetmap.us/vectiles-all/{z}/{x}/{y}.topojson",{
	updateWhenIdle:false
});

vectiles.on('load', function(){
   console.log('FINISHED LOADING TILES'); 
});

vectiles.on('tileload', function(ctx){
  console.log('load tile');
  console.log(vectiles._tilesToLoad);
});

map.addLayer(vectiles);

map.setView(new L.LatLng(48.33710,14.32039), 17);
*/
