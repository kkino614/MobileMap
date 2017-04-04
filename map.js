    
	var bingApiKey = "ApTJzdkyN1DdFKkRAE6QIDtzihNaf6IWJsT-nQ_2eMoO4PN__0Tzhl2-WgJtXFSp";
	
    var scaleLineControl = new ol.control.ScaleLine();
    
    var nawiPosition = ol.proj.transform([0,0], 'EPSG:4326', 'EPSG:3857');
	
	var markerSource = new ol.source.Vector();
	
	function init(){
		
		var baseLayers = [];
		var bingStyles = ['Road', 'Aerial', 'AerialWithLabels'];
		var bingLabelNames = ['Bing Road', 'Bing Aerial', 'Bing Hybrid'];
		
		var geolocation = new ol.Geolocation({
			tracking: true
		})
		
		for(i=0;i<bingStyles.length;i++){
			baseLayers.push (new ol.layer.Tile ({
                title: bingLabelNames [i],
                type: 'base',
                visible: true,
                preload: Infinity,
                source: new ol.source.BingMaps ({
                    key: bingApiKey,
                    imagerySet: bingStyles [i]
                })
            }));
			
		}
		
		baseLayers.push (new ol.layer.Tile ({
            title: 'OpenStreetMap',
            type: 'base',
            visible: true,
            preload: Infinity,
            source: new ol.source.OSM ()
        }));
		
		geolocation.on ('change', function (){
            var currentPosition = ol.proj.transform (geolocation.getPosition (), 'EPSG:4326', 'EPSG:3857');

            // Use generic Marker function to indicate position on map
            drawMarker (currentPosition);

            // Disable geolocation after user position is known
            geolocation.setTracking (false);
        });
		
		 
		drawMarker(nawiPosition);
		
		var vectorLayer = new ol.layer.Vector({
			source: markerSource
		});
		
		vectorLayer.setZIndex(1);
		
		var map = new ol.Map({ 	  
	        layers: [
	            new ol.layer.Group({
	            	title: 'BaseMaps',
	            	layers: baseLayers
	            }),
	            new ol.layer.Group ({
                    title: 'Overlays',
                    combine: false,
                    layers: [
                        // add marker at NaWi position
                        vectorLayer
                    ]
                })
	        ],
	        
	        target: document.getElementById('map'),
	        view: new ol.View({
	        	center: nawiPosition,
	        	zoom: 3
	        }),
	        
	        
	        controls: ol.control.defaults({
		  		attributionOptions: ({
		  			collapsible: false
		  		})
	  		}).extend([
	  		 	scaleLineControl
	  		]),
	      });
		
		var element = document.getElementById('popup');

	      var popup = new ol.Overlay({
	    	  element: element,
	    	  positioning: 'bottom-center',
	    	  stopEvent: false,
	    	  offset: [0, -50]
	      });
	      map.addOverlay(popup);

	   // display popup on click
	      map.on('click', function(evt) {
	    	  var feature = map.forEachFeatureAtPixel(evt.pixel,
	    	  function(feature) {
	              return feature;
	          });
	        if (feature) {
	        	var coordinates = feature.getGeometry().getCoordinates();
	        	popup.setPosition(coordinates);
	        	$(element).popover({
	            'placement': 'top',
	            'html': true,
	            'content': feature.get('name')
	        	});
	        	$(element).popover('show');
	        	} else {
	        		$(element).popover('destroy');
	        	}
	      	});

	      // change mouse cursor when over marker
	    map.on('pointermove', function(e) {
	        if (e.dragging) {
	        	$(element).popover('destroy');
	        	return;
	        }
	        var pixel = map.getEventPixel(e.originalEvent);
	        var hit = map.hasFeatureAtPixel(pixel);
	        map.getTarget().style.cursor = hit ? 'pointer' : '';
	    });
	    
	    var layerSwitcher = new ol.control.LayerSwitcher ({
	    	tipLabel: 'Layers'
	    });

	    map.addControl(layerSwitcher);
	}
	
	

	
	
	/*var x = document.getElementById("demo");
    
    var iconFeature = new ol.Feature({
        geometry: new ol.geom.Point([0, 0]),
        name: 'Null Island',
        population: 4000,
        rainfall: 500
    });
    

    var iconStyle = new ol.style.Style({
        image: new ol.style.Icon(//** @type {olx.style.IconOptions}  
        ({
        anchor: [0.5, 106],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        src: 'https://openlayers.org/en/v4.0.1/examples/data/icon.png'
        }))
    });

    iconFeature.setStyle(iconStyle);*/
    
    function drawMarker(posMarker){
    	var marker = new ol.Feature({
    		geometry: new ol.geom.Point (posMarker)
    	})
    	
    	var markerStyle = new ol.style.Style({
    		image: new ol.style.Icon(({
    			scale: 0.1,
    			src: 'marker_world.png'
    		}))
    		
    	})
    	marker.setStyle(markerStyle);
    	
    	markerSource.addFeature(marker);
    	
    }

    /*var vectorSource = new ol.source.Vector({
        features: [iconFeature]
    });

    
    var rasterLayer = new ol.layer.Tile({
        source: new ol.source.TileJSON({
        url: 'https://api.tiles.mapbox.com/v3/mapbox.geography-class.json?secure',
        crossOrigin: ''
        })
    });*/
    

    
    init();
