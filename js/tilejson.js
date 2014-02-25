/* Experimental vector tile layer for Leaflet
 * Uses D3 to render GeoJSON; faster than Leaflet's native.
 * Originally by Ziggy Jonsson: http://bl.ocks.org/ZJONSSON/5602552
 * Reworked by Nelson Minar: http://bl.ocks.org/NelsonMinar/5624141
 *
 * Todo:
 *   Make this work even if <svg> isn't in the DOM yet
 *   Make this work for tile types that aren't FeatureCollection
 *   Match D3 idioms for .classed(), .style(), etc
 *   Work on allowing feature popups, etc.
 */
L.TileLayer.d3_topoJSON =  L.TileLayer.extend({
    onAdd : function(map) {
        L.TileLayer.prototype.onAdd.call(this,map);
        this._path = d3.geo.path().projection(function(d) {
            var point = map.latLngToLayerPoint(new L.LatLng(d[1],d[0]));
            return [point.x,point.y];
        });
        this.on('tileunload',function(d) {
            if (d.tile.xhr) d.tile.xhr.abort();
            if (d.tile.nodes) d.tile.nodes.remove();
            d.tile.nodes = null;
            d.tile.xhr = null;
        });
    },
	onRemove : function(map) {
		L.TileLayer.prototype.onRemove.call(this,map);
		console.log("onRemove");
	},
    _loadTile : function(tile,tilePoint) {
        var self = this;
        this._adjustTilePoint(tilePoint);
 
        if (!tile.nodes && !tile.xhr) {
            tile.xhr = d3.json(this.getTileUrl(tilePoint),function(geoJson) {
                tile.xhr = null;
                tile.nodes = d3.select(map._container).select('svg').append('g');

                tile.nodes.selectAll('path')
                    .data(geoJson.features).enter()
                .append('text')
                .append('textPath')
                    .attr('xlink:href', self.options.id2)
                    .attr('class','text')
                    .text(self.options.text);

	            tile.nodes.selectAll('path')
	                .data(geoJson.features).enter()
	            .append('path')
	                .attr('d', self._path)
	                .attr('class', self.options.class)
	                .attr('style', self.options.style)
	                .attr('viewBox','0,0,100,100')
	                .attr('id', self.options.id);
                
				if (geoJson.features[0]) {
					var feature = geoJson.features[0];
					
					var name = "";
					name = feature.properties.name;
					if (name == null) name = "";
						
					if (feature.geometry.type == "Point" && feature.properties.kind != "path") {
						var kind = feature.properties.kind;
						//limit to certain kinds of POIs
						if (kind == 'bus_stop' || kind == 'tram_stop' || kind == 'cafe' || kind == 'restaurant' || kind == 'pub' || kind == 'cafe' || kind == 'telephone' || kind == 'bank' || kind == 'atm') {
							var poisLayer = L.geoJson(geoJson, {
								pointToLayer: function (feature, latlng) {
									var marker = L.marker(latlng, {icon: icons[kind]});
									if (name) {
										marker.bindPopup(name+" ["+kind+"]");
									} 
									else {
										marker.bindPopup("["+kind+"]");
									}
									return marker;
								}
							}).addTo(map);

							//add pois to geojson table
							$('#geojsonTable > tbody:last').append('<tr><td>'+name+'</td><td>'+kind+' <img src="'+icons[kind].options.iconUrl+'" width="18" height="18" /></td><td></tr>');
							//+feature.geometry.coordinates[0]+'</td><td>'+feature.geometry.coordinates[1]+'</td></tr>');

						} else {
							/*
								//rest of POIs
								var poisLayer = L.geoJson(geoJson, {
								pointToLayer: function (feature, latlng) {
									var marker = L.marker(latlng, {icon: defaultIcon});
									marker.bindPopup(feature.properties.name+" ["+feature.properties.kind+"]");
									return marker;
								}
							}).addTo(map);*/
						}
					}

					if (feature.geometry.type == "LineString") {
						initText();
						initColors();

						var highway = feature.properties.highway;
						if (highway) {
							if (!name) name = "";
							var icon;
							if (highway == "footway" || highway == "track") icon = "pitch";
							else icon = "car";
							$('#geojsonTable > tbody:last').append('<tr><td>'+name+'</td><td>'+highway+' <img src="icon/'+icon+'-24@2x.png" width="18" height="18" /></td><td></tr>');
							//+feature.geometry.coordinates[0]+'</td><td>'+feature.geometry.coordinates[1]+'</td></tr>');
						}
						
					}
					if (feature.geometry.type == "Polygon") {
						initBuildings();
						colorLand('#eee');
					}
				}
            });
        }
    }
});
