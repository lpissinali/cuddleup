
//map stuff
var map;
var geocoder;
var marker;
var circle;
var circleRadius = 10000;
var selectedLat = null;
var selectedLong = null;
var selectedPosition = false;
var mapIncluded = false;
var markerClusterer = null;
var markers = [];
var savedData = null;
var firstTimeLoad = true;

function mapApiInit(callback)
{
    if (mapIncluded) return;
    mapIncluded = true;

    if (!callback) callback = 'mapInitialize';

    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://maps.googleapis.com/maps/api/js?language=en&sensor=false&libraries=places&callback=" + callback;
    document.body.appendChild(script);
}

function mapInitialize()
{
    var elem = $('#map-canvas');
    if (elem.length>0) {

        var lat = elem.attr('lat'); if (typeof lat=='undefined') lat = 49.2631;
        var lon = elem.attr('lon'); if (typeof lon=='undefined') lon = -123.106613;
        var latLon = new google.maps.LatLng(lat, lon);
        var mapOptions = {
            zoom: 15,
            center: latLon,
            //scrollwheel: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

        mapPlaceMarker(latLon, false, 'Your approximate location');
    }

    // Create the search box and link it to the UI element.
    if (map) {
        var input = document.getElementById('map_location_container');
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    }

    var input = document.getElementById('location');
    var searchBox = new google.maps.places.SearchBox(input);
    $(input).focus(function() {
        if ($(this).val()=='GPS') {
            $(this).parent().parent().find('.ico-location').removeClass('active');
            $(this).val('');
        }
    });

    $('#map-gps-button').click(function(e) {
        e.preventDefault();

        gl = navigator.geolocation;

        if (gl) {
            gl.getCurrentPosition(setMapPosition);
        }

    });

    // Listen for the event fired when the user selects an item from the
    // pick list. Retrieve the matching places for that item.
    google.maps.event.addListener(searchBox, 'places_changed', function() {
        var places = searchBox.getPlaces();

        var bounds = new google.maps.LatLngBounds();
        place = places[0];

        //console.log(place);

        $('#locationLat').val(place.geometry.location.lat());
        $('#locationLon').val(place.geometry.location.lng());

/*
        var service = new google.maps.places.PlacesService(document.getElementById('place_data'));

        service.getDetails({placeId:place.place_id}, function(placeData, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                console.log(placeData);
            }
        });*/


        if (map) {
            mapPlaceMarker(place.geometry.location, true, 'Your Location');


            // bounds.extend(place.geometry.location);

            //map.fitBounds(bounds);
            if (map.getZoom()>16) map.setZoom(16);
            if (map.getZoom()<14) map.setZoom(14);
        }
    });

}


function mapDrawCircle(selectedPosition, radius)
{
    if (circle) circle.setMap(null);
    if (!selectedPosition) return;
    if (!radius) radius = circleRadius;


    var options = {
        strokeColor: '#0000FF',
        strokeOpacity: 0,
        strokeWeight: 0,
        fillColor: '#0000FF',
        fillOpacity: 0.35,
        map: map,
        //draggable: true,
//                editable: true,
        center: selectedPosition,
        radius: radius
    };
    // Add the circle for this city to the map.
    circle = new google.maps.Circle(options);

    map.fitBounds(circle.getBounds());

}


function setMapPosition(position) {
    $('.ico-location').addClass('active');
    $('#location').focus();
    $('#location').val('GPS');

    lat = position.coords.latitude;
    lon = position.coords.longitude;

    $('#locationLat').val(position.coords.latitude);
    $('#locationLon').val(position.coords.longitude);

    if (map) {
        var location = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);

        mapPlaceMarker(location, true, 'Your Location');
        if (map.getZoom()<14) map.setZoom(14);

    }
}

function mapPlaceMarker(position, draggable, box) {
    if (!map) return;
    if (marker) marker.setMap(null);
    if (position===false) return;

    var pinColor = "2b5e79";
    var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=|" + pinColor,
        new google.maps.Size(21, 34)
        //new google.maps.Point(0,0),
        //new google.maps.Point(10, 34)
    );

    marker = new google.maps.Marker({
        position: position,
        animation: google.maps.Animation.BOUNCE,
        title: 'Selected location',
        draggable: draggable,
        icon: pinImage,
        map: map
    });


    if (draggable) {
        google.maps.event.addListener(marker, 'dragend', function()
        {
            $('#location').val('');
            $('#clear').hide();
            if (typeof setSelectedPosition == 'function') {
                setSelectedPosition(marker.getPosition());
            } else {
                mapPlaceMarker(marker.getPosition(), true);
            }

        });
    }

    map.panTo(position);


    if (box) {
        var infowindow = new google.maps.InfoWindow({
            content: box
        });

        infowindow.open(map,marker);
    }

    /*
     if ($('#form-search').length>0) {
     var bnds = map.getBounds();
     applyMapFilter(bnds);

     }
     */

}

