/**
 * Created by barcode on 4/13/15.
 */


var map = L.map('map').setView([7.1613433,-75.573896,8], 8);

L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
    '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: 'examples.map-20v6611k'
}).addTo(map);

function onEachFeature(feature, layer) {
    layer.on({
        click: zoomToFeature
    });
}

GeoData = {};
(function ($) {
    $.ajax({
        url: 'http://localhost:3000/collection/antioquia',
        success: function (data, textStatus, jqXHR){
            L.geoJson(data).addTo(map);
        }
    });
})(jQuery)



