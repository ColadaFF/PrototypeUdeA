/**
 * Created by barcode on 4/13/15.
 */


var map = L.map('map', {drawControl: true}).setView([7.1613433, -75.573896, 8], 7);

// Initialise the FeatureGroup to store editable layers
var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);
var jsonCords;
map.on('draw:created', function (e) {
    var type = e.layerType,
        layer = e.layer,
        response = [];
    e.layer._latlngs.forEach(function (value) {
        var current = [value.lng, value.lat];
        response.push(current);
    });
    jsonCords = response;

    // Do whatever else you need to. (save to db, add to map etc)
    map.addLayer(layer);
});


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


// control that shows state info on hover
var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

info.update = function (props) {
    if (props) {
        var value = $('#optionSelect').val();
        var desease = {
            name: "",
            male: 0,
            female: 0
        };

        if (value != '-1') {
            for (var j = 0; j < props.indicators[value].deathRates.length; j++) {
                var rate = props.indicators[value].deathRates[j];
                desease.male += rate.male;
                desease.female += rate.female;
            }

            this._div.innerHTML = (props ? '<h4>Información detallada</h4>' +
            '<b> Municipio: </b>' + props.MUNNAME +
            '<br /> <Strong> Hombres: </Strong>' + desease.male + '<br />' +
            '<Strong> Mujeres: </Strong>' + desease.female + '<br />'
                : 'Seleccione un municipio');
        }
    } else {
        this._div.innerHTML = ' <h4>Información detallada</h4> Seleccione un municipio';
    }

};

info.addTo(map);


function getColorLegend(d) {
    return d > 47 ? '#800026' :
        d > 44 ? '#BD0026' :
            d > 41 ? '#E31A1C' :
                d > 38 ? '#FC4E2A' :
                    d > 35 ? '#FD8D3C' :
                        d > 25 ? '#FEB24C' :
                            d > 10 ? '#FED976' :
                                '#FFEDA0';
}


// get color depending on population density value
function getColor(feature) {
    var indicators = feature.properties.indicators;
    var d = 0;
    if ($('#optionSelect').val() === '-1') {
        for (var i = 0; i < indicators.length; i++) {
            for (var j = 0; j < indicators[i].deathRates.length; j++) {
                var rate = indicators[i].deathRates[j];
                d += (rate.male + rate.female);
            }
        }
        d /= (10 * 5);
    } else {
        var deseaseIndex = parseInt($('#optionSelect').val());
        for (var j = 0; j < indicators[deseaseIndex].deathRates.length; j++) {
            var rate = indicators[deseaseIndex].deathRates[j];
            d += (rate.male + rate.female);
        }
        d /= 10;
    }
    return d > 47 ? '#800026' :
        d > 44 ? '#BD0026' :
            d > 41 ? '#E31A1C' :
                d > 38 ? '#FC4E2A' :
                    d > 35 ? '#FD8D3C' :
                        d > 25 ? '#FEB24C' :
                            d > 10 ? '#FED976' :
                                '#FFEDA0';
}


function style(feature) {
    return {
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7,
        fillColor: getColor(feature)
    };
}

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }

    info.update(layer.feature.properties);
}

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

var geojson;

function loadData() {
    $.ajax({
        url: '/collection/antioquia',
        success: function (data, textStatus, jqXHR) {
            geojson = L.geoJson(data, {
                style: style,
                onEachFeature: onEachFeature
            });
            geojson.addTo(map);
            var legend = L.control({position: 'bottomright'});

            legend.onAdd = function (map) {
                var div = L.DomUtil.create('div', 'info legend'),
                    grades = [0, 10, 25, 35, 38, 41, 44, 47],
                    labels = [],
                    from, to;

                for (var i = 0; i < grades.length; i++) {
                    from = grades[i];
                    to = grades[i + 1];

                    labels.push(
                        '<i style="background:' + getColorLegend(from + 1) + '"></i> ' +
                        from + (to ? '&ndash;' + to : '+'));
                }

                div.innerHTML = labels.join('<br>');
                return div;
            };

            legend.addTo(map);
        }
    });
}
function generarJSON() {

}
GeoData = {};
(function ($) {
    $('select').selectpicker();
    $('#optionSelect').on('change', function (e) {
        geojson.setStyle(style);
    });
    loadData();
    $('#generar').click(function (e) {
        e.preventDefault();
        var depCode = $('#DEP_P_CODE').val();
        var depName = $('#DEPNAME').val();
        var munCode = $('#MUN_P_CODE').val();
        var munName = $('#MUNNAME').val();
        var obj = {
            "geometry": {
                "coordinates": [[jsonCords]],
                "type": "MultiPolygon"
            },
            "geometry_name": "the_geom",
            "id": "division_municipal_de_colombia_1.1",
            "properties": {
                "DEPNAME": depName,
                "OBJECTID": 1.0000000000000000,
                "HRparent": "CO" + depCode,
                "HRpcode": "CO" + depCode + munCode,
                "MUNNAME": munName,
                "MUN_P_CODE": depCode + '' + munCode,
                "MUN_Pcode": "CO" + depCode + munCode,
                "DEP_P_CODE": depCode,
                "DEP_Pcode": "CO" + depCode,
                "HRname": munName,
                "Pe_Need": 0.0000000000000000
            },
            "type": "Feature"
        };
        var getRand = function(min, max){
            return Math.floor(Math.random() * (max - min)) + min;
        };
        obj.properties.indicators = [];
        var deseases = ['Aterosclerosis', 'Bronquitis, enfisema y otras enfermedades pulmonares obstructivas cr�nicas', 'Cirrosis y otras enfermedades cr�nicas del h�gado', 'Diabetes mellitus', 'Enfermedades cerebrovasculares'];
        for(var i = 0; i < deseases.length; i++){
            var indicator = {description: deseases[i], deathRates: []};
            obj.properties.indicators[i] = indicator;
            for(var j = 0; j < 10; j++){
                indicator.deathRates[j] = {year: 2004+j, male: getRand(1, 40), female: getRand(1, 40)};
            }
        }
        $("#textAreaGeo").text(JSON.stringify(obj));
    });
})(jQuery);