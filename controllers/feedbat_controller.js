var FeedbatApp = angular.module('FeedbatApp', []);

FeedbatApp.controller('FeedbatController', function ($scope) {
	$scope.view_title = "feedbaat",

	$scope.aTestFunction = function(i) {
		alert('called');
	}
});

$(document).ready(function () {
	
});