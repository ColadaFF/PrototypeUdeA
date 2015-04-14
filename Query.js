/**
 * Created by barcode on 13/04/15.
 */
db.colombia_format_3.mapReduce(function () {
    if (this.properties.DEPNAME === 'Antioquia') {
        emit(this._id, this);
    }
}, function (id, value) {
    futureCollection = {"type": "FeatureCollection"};
    if (!futureCollection.features) {
        futureCollection.features = []
    }
    futureCollection.push({type: 'Feature', properties: value.properties, geometry: value.geometry})
}, {out: {inline: 1}});


db.colombia_format_3.mapReduce(function () {
    if (this.properties.DEPNAME === 'Antioquia') {
        emit(this.properties.DEPNAME, {type: 'Feature', properties: this.properties, geometry: this.geometry});
    }
}, function (key, values) {
    var featureCollection = {"depName": key, "type": "FeatureCollection", "lenght": values.length};
    values.forEach(function (value) {
        for (var idx in value.features) {
            featureCollection.features++;
        }
    });
    return featureCollection;
}, {out: 'Antioquia_Municipios'});


var functionMap = function () {
    if (this.properties.DEPNAME === 'Antioquia') {
        emit(this.properties.DEPNAME, {type: 'Feature', properties: this.properties, geometry: this.geometry});
    }
};
var functionReduce = function (key, values) {
    var featureCollection = {"depName": key, "type": "FeatureCollection", "lenght": values.length, "features": []};
    var i = 0;
    values.forEach(function (value) {
        for (var idx in value.features) {
            featureCollection.features[i++] = value.features[idx];
        }
    });
    return featureCollection;
};
db.colombia_format_3.mapReduce(functionMap, functionReduce, {out: 'Antioquia_Municipios'});


// mongoimport --host 192.168.1.52 --port 27017 --jsonArray --file Documents/colombia_format_3.json


db.colombia_format_3.find({'properties.DEPNAME': 'Antioquia'}, {_id: 0, properties: 1, geometry: 1});

var getRand = function(min, max){
    return Math.floor(Math.random() * (max - min)) + min;
}
db.colombia_format_3.find({'properties.DEPNAME': 'Antioquia'}).forEach(function(departamento){
    departamento.properties.indicators = [];
    var deseases = ['Aterosclerosis', 'Bronquitis, enfisema y otras enfermedades pulmonares obstructivas crónicas', 'Cirrosis y otras enfermedades crónicas del hígado', 'Diabetes mellitus', 'Enfermedades cerebrovasculares'];
    for(var i = 0; i < deseases.length; i++){
        var indicator = {description: deseases[i], deathRates: []};
        departamento.properties.indicators[i] = indicator;
        for(var j = 0; j < 10; j++){
            indicator.deathRates[j] = {year: 2004+j, male: getRand(1, 40), female: getRand(1, 40)};
        }
    }
    db.colombia_format_3.save(departamento);
});

