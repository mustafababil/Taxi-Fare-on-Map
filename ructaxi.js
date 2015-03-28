
var map, iconA, iconB, directionDisplay, directionsService = new google.maps.DirectionsService();

google.maps.Map.prototype.markers = new Array();

google.maps.Map.prototype.addMarker = function (marker) {
    this.markers[this.markers.length] = marker;

    if (marker.title == "A") {
        (setMapCenter()(marker.getPosition()));
    }
    if (this.markers.length > 1) {
        (redraw()());
    }
};

google.maps.Map.prototype.getMarkers = function () {
    return this.markers;
};

google.maps.Map.prototype.clearMarkers = function () {
    for (var i = 0; i < this.markers.length; i++) {
        this.markers[i].setMap(null);
    }
    this.markers = new Array();
};

var routings;
var talt = ni = 0;
var departLat, departLng, departCord, arriveLat, arriveLng, arriveCord;

function initmap() {	//creates the map
	directionsDisplay = new google.maps.DirectionsRenderer({
        suppressMarkers: true
    });
	var DKLatLng = createLatLng(55.6374355, 12.0897751);   //Roskilde's coordinations

	var options = {
        zoom: 15,
        center: DKLatLng,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false
    };

    map = new google.maps.Map(document.getElementById("map"), options);
    //directionsDisplay.setMap(map);
}

function initialize() {		
	iconB = new google.maps.MarkerImage("http://maps.gstatic.com/intl/en_ALL/mapfiles/icon_greenB.png", null, null, new google.maps.Point(0, 38));
    iconA = new google.maps.MarkerImage("http://maps.gstatic.com/intl/en_ALL/mapfiles/icon_greenA.png", null, null, new google.maps.Point(0, 38));
    
    google.maps.event.addListener(map, "click", function (event) {
        createMarker(event.latLng);
    });
}


function createMarker(pos) {
    if (map.markers.length < 1) {   //Create first marker "A"
        var markerTitle = "A";
        var markerIcon = iconA;
    } else {
        if (map.markers.length == 1) {  //Create second marker "B"
            var markerTitle = "B";
            var markerIcon = iconB;
        } else {
            return
        }
    }
    var marker = new google.maps.Marker({
        position: pos,
        map: map,
        icon: markerIcon,
        title: markerTitle,
        draggable: true
    });

    google.maps.event.addListener(marker, "dragend", dragendEvent(marker));
    
    map.addMarker(marker);
}

function dragendEvent(obj) {
	return function() {
		(redraw()());	
	}
}

function redraw() {
    return function () {
        //findRoute(this.getMarkers()[0].getPosition(), this.getMarkers()[1].getPosition());	//doesn't work
        findRoute(map.markers[0].getPosition(), map.markers[1].getPosition());
    }
}


function findRoute(a, b) {      //Draws the route between 2 coordinations: a and b
	directionsDisplay.setMap(map);
	var request = {
		origin: a,
		destination: b,
		travelMode: google.maps.DirectionsTravelMode.DRIVING,
		optimizeWaypoints: true,
        provideRouteAlternatives: true
	};

	directionsService.route(request, function (response, status) {
		if (status == google.maps.DirectionsStatus.OK) {
			routings = response.routes;
            talt = response.routes.length;
            directionsDisplay.setDirections(response);

            if (talt > 1) {
                $("#alternative").attr("disabled", false);
            } else {
                $("#alternative").attr("disabled", "disabled");
            }

            setTimeout("dirOnHead(0)", 200);
        }
	});

}


function dirOnHead(routeIndex) {
    $("#distance").html("Distance: <b>" + routings[routeIndex].legs[0].distance.text + "</b>");
    var dist = routings[routeIndex].legs[0].distance.value;
    var start = 40.00;  //Starting fare for taxi
    var p100m = 1.4;    //Price for each 100m in Danish Krone

    $(".titel").text("Alternative Routes: " + talt);

    //Receive departure address
    departLat = map.markers[0].getPosition().lat();
    departLng = map.markers[0].getPosition().lng();
    departCord = departLat + ',' + departLng;

    $.ajax({
        url: "http://geo.oiorest.dk/adresser/" + departCord + ".json?callback=?",
        dataType: "json",
        success: findDepartAddr
      });

    //Receive arrival address
    arriveLat = map.markers[1].getPosition().lat();
    arriveLng = map.markers[1].getPosition().lng();
    arriveCord = arriveLat + ',' + arriveLng;

    $.ajax({
        url: "http://geo.oiorest.dk/adresser/" + arriveCord + ".json?callback=?",
        dataType: "json",
        success: findArriveAddr
      });

    //Calculate and show the price
    $("#price").html("Price: <b>" + (start + (dist / 100 * p100m)).toFixed(2) + " kr</b>");
}

function findDepartAddr(adresse) {    //designs the departure address and publish it on the top of page
    var tekst = "From: " + adresse.vejnavn.navn + ' ' + adresse.husnr + ', ' + adresse.postnummer.nr + ' ' + adresse.postnummer.navn;
    $("#departAddress").text(tekst);
}

function findArriveAddr(adresse) {    //designs the arrival address and publish it on the top of page
    var tekst = "To: " + adresse.vejnavn.navn + ' ' + adresse.husnr + ', ' + adresse.postnummer.nr + ' ' + adresse.postnummer.navn;
    $("#arriveAddress").text(tekst);
}

function createLatLng(la, lo) {
    return new google.maps.LatLng(la, lo);
}

function setMapCenter() {
    return function (pos) {
        map.setCenter(pos);
    }
}

function alterit() {
    ni = (ni === talt - 1) ? 0 : directionsDisplay.getRouteIndex() + 1;
    directionsDisplay.setRouteIndex(ni);
    dirOnHead(ni);
}

function starter() {
	initmap();
	initialize();


	$("button#alternative").click(function () {
        alterit();
    });

}
