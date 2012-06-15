define(
	[ "async!http://maps.google.com/maps/api/js?key=AIzaSyAdnRPLZjeMzP7VQGzWi21Cqjnt2YXJGHE&sensor=true&libraries=places!callback" ],
	function() {
		return {
			addMapToCanvas: function( mapCanvas, lat, lng ) {
				var pos = new google.maps.LatLng(lat,lng),
					geocoder = new google.maps.Geocoder(),
					infowindow = new google.maps.InfoWindow();

				var myOptions = {
					zoom: 12,
					center: pos,
					mapTypeId: google.maps.MapTypeId.ROADMAP
				};

				// create map
				var map = new google.maps.Map( mapCanvas, myOptions ),
					service = new google.maps.places.PlacesService(map);

				// Add marker for user position
				var userMarker = new google.maps.Marker({ position: pos, map: map, icon:'http://maps.google.com/mapfiles/marker_black.png'});

				// reverse geoencode - show location when user clicked
				geocoder.geocode({'latLng': pos}, function(results, status) {
					if (status == google.maps.GeocoderStatus.OK && results[1]) {
						google.maps.event.addListener(userMarker, 'click', function() {
							infowindow.setContent(results[1].formatted_address);
							infowindow.open(map, this);
						});
					}
				}); 

				// search for places near user
				service.search({ location: pos, radius: 1000, types: ['bar','cafe','restaurant'] }, callback);

				function callback(results, status) {
					if (status == google.maps.places.PlacesServiceStatus.OK) {
						for (var i = 0; i < results.length; i++) {
							createMarker(results[i]);
						}
					}
				}

				function createMarker(place) {
					var placeLoc = place.geometry.location;
					var marker = new google.maps.Marker({ map: map, position: place.geometry.location, title: place.name });
					google.maps.event.addListener(marker, 'click', function() {
						infowindow.setContent(place.name);
						infowindow.open(map, this);
					});
				}


				return map;
			}		
		}

	}
);
