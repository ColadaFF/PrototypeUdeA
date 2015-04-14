/**
 * Created by barcode on 4/14/15.
 */
(function () {

    'use strict';

    var app = angular.module('prototypeUForm', ['formly', 'formlyBootstrap']);
    app.run(function (formlyConfig) {
        formlyConfig.setWrapper({
            name: 'loading',
            templateUrl: 'loading.html'
        });
    });
    app.controller('prototypeFormCtrl', function prototypeFormCtrl(formlyVersion) {
        var vm = this;
        vm.onSubmit = onSubmit;
        vm.title = 'Agregar Indicadores';
        vm.env = {
            angularVersion: angular.version.full,
            formlyVersion: formlyVersion
        };
        vm.model = {
        };
        vm.formFields = [
            {
                key: 'municipiosProto',
                type: 'select',
                wrapper: 'loading',
                templateOptions: {
                    label: 'Municipio',
                    options: [],
                    valueProp: '_id',
                    labelProp: 'properties.HRname',
                    required: true,
                    placeholder: 'Seleccione un municipio de la lista'
                },
                controller: /* @ngInject */ function ($scope, jsonService) {
                    $scope.to.loading = jsonService.getJSON().then(function (response) {
                        $scope.to.options = response.data;
                        return response;
                    });
                }
            }
        ];

        vm.originalFields = angular.copy(vm.fields);

        // function definition
        function onSubmit() {
            alert(JSON.stringify(vm.model), null, 2);
        }
    });
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