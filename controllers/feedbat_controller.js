var FeedbatApp = angular.module('FeedbatApp', []);

FeedbatApp.controller('FeedbatController', function ($scope) {
	$scope.view_title = "feedbaat",

	$scope.aTestFunction = function(i) {
		alert('called');
	}

	$scope.openCommentView= function(){
		$("#comment_view").removeClass('hide-sub-view').addClass("animated bounceInUp")
	}
	$scope.openTipView = function(){
		$("#tip_view").removeClass('hide-sub-view').addClass("animated bounceInUp")
	}
});

$(document).ready(function () {
	
});