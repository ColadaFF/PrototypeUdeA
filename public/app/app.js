/**
 * Created by barcode on 4/14/15.
 */
(function () {

    'use strict';

    var app = angular.module('prototypeUForm', []);
    app.factory('jsonService', function jsonService($http) {
        return {
            getJSON: getJSON
        };

        function getJSON() {
            var data = $http.get('http://localhost:3000/collection/antioquia/names');
            return data;
        }
    });
})();