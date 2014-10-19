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

/* scott's crap */
function Swipeable(el){
	var start_coords = {};
	var self = this;
	
	
    var isTouch = 'ontouchstart' in window;
	
	var start = (isTouch) ? 'touchstart' : 'mousedown';
	var end = (isTouch) ? 'touchend' : 'mouseup';
	
	this.getCoords = function(e){
		if(!(e instanceof TouchEvent)) return e; // for mouse stuff.
        
		data = e.touches && e.touches.length ? e.touches : e.changedTouches;
		return {
        x: data[0].pageX,
        y: data[0].pageY
      };
	}
	
	this._onStart = function(e){
		e = self.getCoords(e);
		start_coords.x = e.x;
		el.addEventListener(end,self._onEnd,false);
		console.log("hi")
	};
	
	this._onEnd = function(e){
		e = self.getCoords(e);
		el.removeEventListener(end,self._onEnd);
		if(e.x - start_coords.x > 100) $(el).addClass('animated fadeOutRight');
		else if(e.x - start_coords.x < -100) $(el).addClass('animated fadeOutLeft');
		console.log("bye");
	};
	
	el.addEventListener(start,this._onStart,false);
		
}

$(document).ready(function () {
var x = new Swipeable($("#current-feedbat")[0]);
	
});