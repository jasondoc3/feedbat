var FeedbatApp = angular.module('FeedbatApp', []);

FeedbatApp.controller('FeedbatController', function ($scope) {
	$scope.view_title = "feedbat",
	$scope.titles = ['feedbat', 'Me'],

	$scope.openCommentView = function(){	
		$("#comment_view").removeClass('hide-sub-view animated bounceOutDown').addClass("animated bounceInUp")
	},
	
	$scope.closeCommentView = function() {
		$("#comment_view").removeClass('animated bounceInUp').addClass("animated bounceOutDown")
	},
	
	$scope.openTipView = function(){
		$("#tip_view").removeClass('hide-sub-view').addClass("animated bounceInUp")
	}
});

$(document).ready(function () {
	
});