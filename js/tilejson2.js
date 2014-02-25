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
	_load : function(tile) {
		console.log("load:"+tile);
	},
    onLoad : function(tile) {
		console.log("load:"+tile);
	},
    _loadTile : function(tile,tilePoint) {
        var self = this;
        this._adjustTilePoint(tilePoint);
 
        if (!tile.nodes && !tile.xhr) {
            tile.xhr = d3.json(this.getTileUrl(tilePoint),function(error, geoJson) {
 
                var pois = topojson.feature(geoJson, geoJson.objects.pois);
                var labels = topojson.feature(geoJson, geoJson.objects.skeletron);
				var landUsages = topojson.feature(geoJson, geoJson.objects['land-usages']);
                var buildings = topojson.feature(geoJson, geoJson.objects.buildings);
                var road = topojson.feature(geoJson, geoJson.objects.highroad);
                var water = topojson.feature(geoJson, geoJson.objects['water-areas']);

				/* water, land, roads, buildings */
                tile.nodes = d3.select(map._container).select('svg').append('g');
                tile.nodes.selectAll('path')
     
                    .data(landUsages.features).enter()
                        .append('path')
                            .attr('d', self._path)
                            .attr('class',function(d){
                                if(d.properties.area < 6496310){
                                    return d.properties.kind +' landuse'     
                                }else{
                                    return d.properties.kind +' landuse nodraw'     
                                }   
                            })

                    .data(water.features).enter()
                        .append('path')
                            .attr('d', self._path)
                            .attr('class','water')
                     
                    .data(buildings.features).enter()
                        .append('path')
                            .attr('d', self._path)
                            .attr('class','building')
 
                    .data(road.features).enter()
                        .append('path')
                            .attr('d', self._path)
                            .attr('class',function(d){
                                return d.properties.kind
                            })

                     /*POIS are not cool right now*/
                     .data(pois.features).enter()
                         .append('path')
                             .attr('d', self._path)
                             .attr('class', self.options.class)
                             .attr('class',function(d){
                                 console.log(d.properties.kind)
                             });

				/* texts */
				tile.nodes = d3.select(map._container).select('svg').append('g');
				tile.nodes.selectAll('path')

                    .data(labels.features).enter()
                        .append('text')
					    .append('textPath')
					        .attr('xlink:href',function(d){
                                return '#' + d.geometry.coordinates[1]
                            })
					        .attr('class','text')
					        .text(function(d){
                                return d.properties.name
                            })

				/* path for texts */
				tile.nodes = d3.select(map._container).select('svg').append('g');
				tile.nodes.selectAll('path')

                    .data(labels.features).enter()
						.append('path')
					        .attr('d', self._path)
					        .attr('viewBox','0,0,100,100')
					        .attr('id',function(d){
                                return d.geometry.coordinates[1]
                            })

	         });
        }


		tileNum++;

		if (tileNum == this._tilesToLoad) {
			console.log("all tiles loaded");
			
		}
    }
});
