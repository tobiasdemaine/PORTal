/*
 * PORTal GEOLOCATION AUDIO ARTWORK
 */

var site, map;
var activeAudio = false;
var OpenedOutsideGeoLocation = false;
var lastOpenedAudio = false;
var circle = [];

function init(){
	setloaderUI();
	$.ajaxSetup({beforeSend: function(xhr){
  		if (xhr.overrideMimeType){
    		xhr.overrideMimeType("application/json");
  		}
	}
	});
	$.getJSON( "config.json", function(data) {
		site = data;
		setupUI();
		gMapInit();
		referrerTest();
		getLocation();
		$('meta[name=viewport]').remove();
		$('head').append('<meta name="viewport" content="width=device-width, maximum-scale=1.0, user-scalable=0">');
		$('meta[name=viewport]').remove();
		$('head').append('<meta name="viewport" content="width=device-width, initial-scale=yes">' );
	});
}

function setupUI(){
	header = document.createElement("div");
	header.setAttribute("id", "header");
	
	audioPlayer = document.createElement("div");
	audioPlayer.setAttribute("id", "audioPlayer");
	
	mapIndex = document.createElement("div");
	mapIndex.setAttribute("id", "mapIndex");
	
	aboutContent = document.createElement("div");
	aboutContent.setAttribute("id", "aboutContent");
	
	$("body").append(header, mapIndex, audioPlayer, aboutContent);
}	

function setloaderUI(){
	loader = document.createElement("div");
	loader.setAttribute("id", "loader");
	loader.setAttribute("class", "loader");
	loader.innerHTML = '<div class="container"><div class="ball"></div><div class="ball"></div><div class="ball"></div><div class="ball"></div><div class="ball"></div><div class="ball"></div><div class="ball"></div></div>';
	$("body").append(loader);
	
}	

function referrerTest(){
	if(window.location.href.indexOf("#")!= -1){
		x = window.location.href.split("#").pop();
		slots = [1,2,3,4,5];
		if(slots.indexOf(parseInt(x)) != -1){
			OpenedOutsideGeoLocation = true;
			activateAudio("track" + x)
		}else{
			activateMap();
		}
	}else{
		activateMap();
	}
}


function activateAudio(audioSlot){
	if(activeAudio == false){
		activeAudio = audioSlot;
		audioData = site.audio[audioSlot];
		
		title = document.createElement("h1");
		title.innerHTML = site.audio[audioSlot].title;
	
		returnLink = document.createElement("a");
		returnLink.setAttribute("id", "returnLink");
		returnLink.innerHTML = "<";
		$("#header").empty();
		$("#header").append(returnLink, title);
	
		$("#returnLink").unbind( "click" );
		$("#returnLink").click(function(){
			OpenedOutsideGeoLocation = false;
			$('#audioPlayer').velocity("slideUp", function(){
				activateMap();
			});
		
		});
	
		audioWrapper = document.createElement("div");
		audioWrapper.setAttribute("id", "audioWrapper");
		
		audioContent = document.createElement("div");
		audioContent.setAttribute("id", "audioContent");
		audioContent.innerHTML = "<p>" + site.audio[audioSlot].description + "</p>"
	
		$('#audioPlayer').empty()
		$('#audioPlayer').append(audioWrapper, audioContent);
	
		audio = document.createElement("audio");
		audio.setAttribute("id", audioSlot);
		audio.src = site.audio[audioSlot].audioFile;
		audio.controls = "controls";
		
		
	
		$('#audioWrapper').append(audio)
	
		var player = new MediaElementPlayer(audio, { stretching: 'responsive',
			success: function(mediaElement, originalNode, instance) {
				setTimeout(function(){
				$("#audioContent").height($("#mapIndex").height()-($("#audioWrapper").height() + $("#header").height()));
				}, 90);
			}
		});
	
		$('#' + audioSlot)[0].load();
 		$('#' + audioSlot)[0].play();
 		$('#audioPlayer').velocity("fadeIn", {duration: 1000 }, function(){
 		}); 
	}
}

function removeMedia() {
  $("audio").each(function(){
  	$(this)[0].pause();
    $(this)[0].src = '';
    $(this).children('source').prop('src', '');
    $(this).remove().length = 0;
  });
};

function mapHeader(){
	
	title = document.createElement("h1");
	title.innerHTML = "<img src='assets/img/logo.png' />" + site.site.title;
	
	aboutLink = document.createElement("a");
	aboutLink.setAttribute("id", "aboutLink");
	aboutLink.innerHTML = "?";
	
	
	
	$("#header").empty();
	$("#header").append(aboutLink, title);
	
	$("#aboutLink").unbind( "click" );
	$("#aboutLink").click(function(){
		activateAbout();
	})
}

function activateMap(){
	activeAudio = false;
	
	$('#audioPlayer').hide();
	$('#aboutContent').hide();
	removeMedia();
	$('#audioPlayer').empty();
	mapHeader();
	$('#mapIndex').show();
}

function activateAbout(){
	
	title = document.createElement("h1");
	title.innerHTML = site.about.title;
	
	returnLink = document.createElement("a");
	returnLink.setAttribute("id", "returnLink");
	returnLink.innerHTML = "<";
	
	$("#header").empty();
	$("#header").append(returnLink, title);
	
	$("#returnLink").unbind( "click" );
	$("#returnLink").click(function(){
		$('#aboutContent').velocity("slideUp", function(){
			activateMap();	
		});
	});
	
	aboutDescription = document.createElement("div");
	aboutDescription.setAttribute("id", "aboutDescription");
	aboutDescription.innerHTML = "<p>" + site.about.description + "</p>";
	
	$('#aboutContent').empty()
	$('#aboutContent').append(aboutDescription);
	
	$('#aboutContent').velocity('fadeIn', {duration : 1000});
	
}

function gMapInit() {
		$("#mapIndex").empty();
		mapDiv = document.createElement("h1");
		mapDiv.setAttribute("id", "mapDiv")
		$("#mapIndex").append(mapDiv)
        var mapCanvas = document.getElementById('mapIndex');
        
        var myLatlng = new google.maps.LatLng(site.site.map.centre.lat, site.site.map.centre.long);

        var mapOptions = {
          center: myLatlng,
          streetViewControl: false,
          zoom: site.site.map.zoom,
          mapTypeId: site.site.map.mapType,
          styles: [
			  {
			    "elementType": "labels.text.fill",
			    "stylers": [
			      {
			        "color": "#8ec3b9"
			      }
			    ]
			  },
			  {
			    "elementType": "labels.text.stroke",
			    "stylers": [
			      {
			        "color": "#1a3646"
			      }
			    ]
			  },
			  {
			    "featureType": "administrative.country",
			    "elementType": "geometry.stroke",
			    "stylers": [
			      {
			        "color": "#4b6878"
			      }
			    ]
			  },
			  {
			    "featureType": "administrative.land_parcel",
			    "elementType": "geometry.stroke",
			    "stylers": [
			      {
			        "color": "#64779e"
			      },
			      {
			        "visibility": "on"
			      }
			    ]
			  },
			  {
			    "featureType": "administrative.province",
			    "elementType": "geometry.stroke",
			    "stylers": [
			      {
			        "color": "#4b6878"
			      }
			    ]
			  },
			  {
			    "featureType": "landscape.man_made",
			    "elementType": "geometry.fill",
			    "stylers": [
			      {
			        "color": "#1d2c4d"
			      }
			    ]
			  },
			  {
			    "featureType": "landscape.man_made",
			    "elementType": "geometry.stroke",
			    "stylers": [
			      {
			        "color": "#64779e"
			      }
			    ]
			  },
			  {
			    "featureType": "landscape.natural",
			    "elementType": "geometry.fill",
			    "stylers": [
			      {
			        "color": "#64779e"
			      }
			    ]
			  },
			  {
			    "featureType": "poi",
			    "elementType": "geometry",
			    "stylers": [
			      {
			        "color": "#283d6a"
			      }
			    ]
			  },
			  {
			    "featureType": "poi",
			    "elementType": "labels.text.fill",
			    "stylers": [
			      {
			        "color": "#6f9ba5"
			      }
			    ]
			  },
			  {
    		  "featureType": "poi.business",
    			"stylers": [
      				{
    				    "visibility": "off"
      				}
    			]
  			  },
  			  {
    		  "featureType": "poi.government",
    			"stylers": [
      				{
    				    "visibility": "off"
      				}
    			]
  			  },
			  {
			    "featureType": "poi",
			    "elementType": "labels.text.stroke",
			    "stylers": [
			      {
			        "color": "#1d2c4d"
			      }
			    ]
			  },
			  {
			    "featureType": "poi.park",
			    "elementType": "geometry.fill",
			    "stylers": [
			      {
			        "color": "#023e58"
			      }
			    ]
			  },
			  {
			    "featureType": "poi.park",
			    "elementType": "labels.text.fill",
			    "stylers": [
			      {
			        "color": "#3C7680"
			      }
			    ]
			  },
			  {
			    "featureType": "road",
			    "elementType": "geometry",
			    "stylers": [
			      {
			        "color": "#304a7d"
			      }
			    ]
			  },
			  {
			    "featureType": "road",
			    "elementType": "labels.text.fill",
			    "stylers": [
			      {
			        "color": "#98a5be"
			      }
			    ]
			  },
			  {
			    "featureType": "road",
			    "elementType": "labels.text.stroke",
			    "stylers": [
			      {
			        "color": "#1d2c4d"
			      }
			    ]
			  },
			  {
			    "featureType": "road.highway",
			    "elementType": "geometry",
			    "stylers": [
			      {
			        "color": "#2c6675"
			      }
			    ]
			  },
			  {
			    "featureType": "road.highway",
			    "elementType": "geometry.stroke",
			    "stylers": [
			      {
			        "color": "#255763"
			      }
			    ]
			  },
			  {
			    "featureType": "road.highway",
			    "elementType": "labels.text.fill",
			    "stylers": [
			      {
			        "color": "#b0d5ce"
			      }
			    ]
			  },
			  {
			    "featureType": "road.highway",
			    "elementType": "labels.text.stroke",
			    "stylers": [
			      {
			        "color": "#023e58"
			      }
			    ]
			  },
			  {
			    "featureType": "transit",
			    "elementType": "labels.text.fill",
			    "stylers": [
			      {
			        "color": "#98a5be"
			      }
			    ]
			  },
			  {
			    "featureType": "transit",
			    "elementType": "labels.text.stroke",
			    "stylers": [
			      {
			        "color": "#1d2c4d"
			      }
			    ]
			  },
			  {
			    "featureType": "transit.line",
			    "elementType": "geometry.fill",
			    "stylers": [
			      {
			        "color": "#283d6a"
			      }
			    ]
			  },
			  {
			    "featureType": "transit.station",
			    "elementType": "geometry",
			    "stylers": [
			      {
			        "color": "#3a4762"
			      }
			    ]
			  },
			  {
			    "featureType": "water",
			    "elementType": "geometry",
			    "stylers": [
			      {
			        "color": "#0e1626"
			      }
			    ]
			  },
			  {
			    "featureType": "water",
			    "elementType": "labels.text.fill",
			    "stylers": [
			      {
			        "color": "#4e6d70"
			      }
			    ]
 			  }
			]


        }
        var map = new google.maps.Map(mapCanvas, mapOptions)
        google.maps.event.addListenerOnce(map, 'idle', function(){
    		$("#loader").velocity('fadeOut', { duration : 1000 }, function(){
    			$("#loader").hide();
    		})
		});
        var direction = [];
        var rMin = 1.5, rMax = 2;
        for (var key in site.audio) {
   		 	if (site.audio.hasOwnProperty(key)) {
   		 		direction[key] = 1;
   		 		audioLatlng = new google.maps.LatLng(site.audio[key].lat, site.audio[key].long);
        		
				
				circle[key] = new google.maps.Circle({
					audioSlot: key,
 		           	center: audioLatlng,
     		       	radius: 3,
     		       	strokeColor: "#f1f1f5",
      		      	strokeOpacity: 0.5,
      		     	strokeWeight: 1,
            		fillColor: "#f1f1f5",
            		fillOpacity: 0.3
        		});
        		
        		
        		circle[key].addListener('click', function() {
					OpenedOutsideGeoLocation = true;
					activateAudio(this.audioSlot);
				});
        		circle[key].setMap(map);
        	}
		}
		circle["me"] = new google.maps.Circle({
				center: myLatlng,
     		    radius: 1.5,
     		    strokeColor: "#ffffff",
      		    strokeOpacity: 0,
      		    strokeWeight: 1,
                fillColor: "#ffffff",
                fillOpacity: 0
        });
        circle["me"].setMap(map);
        direction["me"] = 1;
		
		setInterval(function() {
			for (var key in circle) {
            	var radius = circle[key].getRadius();
            	if ((radius > rMax) || (radius < rMin)) {
               		direction[key] *= -1;
           	 	}
           	 	circle[key].setRadius(radius + direction[key]);
        	}
        		
        }, 250);
        	
    	
        
		
}

/* GEOLOCATION */
function getLocation() {
    if (navigator.geolocation) {
    	navigator.geolocation.watchPosition(testLocation, geoError, geoOptions);
    	
    } else {
    	circle["me"].setOptions({fillOpacity:0, strokeOpacity:0});
        console.log("Geolocation is not supported by this browser.");
    }
}

function geoError() {
	console.log("GEOLOCATION ERROR : no position available.");
}

var geoOptions = {
  	enableHighAccuracy: true, 
  	maximumAge        : 30000, 
  	timeout           : 27000
};

      
function testLocation(p) {
	if(typeof(circle) !== "undefined"){
		circle["me"].setCenter(new google.maps.LatLng(p.coords.latitude, p.coords.longitude));
		circle["me"].setOptions({fillOpacity:0.8, strokeOpacity:1});
	}
	if(OpenedOutsideGeoLocation == false){
		bounds = getBoundingBox([p.coords.latitude, p.coords.longitude], site.site.map.geoLocationBoundingBoxSize)
		for (var slot in site.audio) {
			if(site.audio[slot].lat > bounds[1]){
				if(site.audio[slot].lat < bounds[3]){
					if(site.audio[slot].long > bounds[0]){
						if(site.audio[slot].long < bounds[2]){
							if(activeAudio !== slot){
								if(lastOpenedAudio !== slot){
									activateAudio(slot);
									lastOpenedAudio = slot;
								}
							}
							break;					
						}else{
							testAudioShutdown();
						}
					}else{
						testAudioShutdown();
					}
				}else{
					testAudioShutdown();
				}
			}else{
				testAudioShutdown();
			}
		}
	}
}

function testAudioShutdown(){
	lastOpenedAudio = false;
	if(activeAudio !== false){
		activateMap();
	}
}




function getBoundingBox(centerPoint, distance) {
	var MIN_LAT, MAX_LAT, MIN_LON, MAX_LON, R, radDist, degLat, degLon, radLat, radLon, minLat, maxLat, minLon, maxLon, deltaLon;
  	if (distance < 0) {
    	return 'Illegal arguments';
  	}
  	Number.prototype.degToRad = function () {
    	return this * (Math.PI / 180);
  	};
  	Number.prototype.radToDeg = function () {
    	return (180 * this) / Math.PI;
  	};
  	MIN_LAT = (-90).degToRad();
  	MAX_LAT = (90).degToRad();
  	MIN_LON = (-180).degToRad();
  	MAX_LON = (180).degToRad();
  	R = 6378.1;
  	radDist = distance / R;
  	degLat = centerPoint[0];
  	degLon = centerPoint[1];
  	radLat = degLat.degToRad();
  	radLon = degLon.degToRad();
  	minLat = radLat - radDist;
  	maxLat = radLat + radDist;
  	minLon = void 0;
  	maxLon = void 0;
  	deltaLon = Math.asin(Math.sin(radDist) / Math.cos(radLat));
  	if (minLat > MIN_LAT && maxLat < MAX_LAT) {
    	minLon = radLon - deltaLon;
    	maxLon = radLon + deltaLon;
    	if (minLon < MIN_LON) {
      		minLon = minLon + 2 * Math.PI;
    	}
    	if (maxLon > MAX_LON) {
      		maxLon = maxLon - 2 * Math.PI;
    	}
  	}else {
    	minLat = Math.max(minLat, MIN_LAT);
    	maxLat = Math.min(maxLat, MAX_LAT);
    	minLon = MIN_LON;
    	maxLon = MAX_LON;
  	}
  	return [
    	minLon.radToDeg(),
    	minLat.radToDeg(),
    	maxLon.radToDeg(),
    	maxLat.radToDeg()
  		];
};

window.addEventListener("orientationchange", function() {
    $("#audioContent").height($("#mapIndex").height()-($("#audioWrapper").height() + $("#header").height()));
});

$(function() {
  init();
});