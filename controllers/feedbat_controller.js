

var FeedbatApp = angular.module('FeedbatApp', []).run(function() {
    FastClick.attach(document.body);
  });

FeedbatApp.controller('FeedbatController', function ($scope) {
	$scope.view_title = "feed",
	$scope.titles = ['feed', 'me'],

	$scope.rotateParentViews = function(where){
		var i;
		var this_view;
		var next_view;
		var prev_view;

		//click next view
		if(where === 'next') {
			for(i=0;i<$scope.titles.length;i++) {
				if($('#view_title').text() == $scope.titles[i]) {
					this_view = $scope.titles[i];
					if(i==($scope.titles.length - 1)) {
						next_view = $scope.titles[0];
						$('#view_title').text($scope.titles[0]);
					}
					else {
						next_view = $scope.titles[i+1];
						$('#view_title').text($scope.titles[i+1])
					}
					break;
				}
			}

			switchData(next_view);
			$("#" + this_view).removeClass('bring-to-front animated bounceInRight bounceInLeft');
			$("#" + next_view).removeClass('hide-view').addClass("animated bounceInRight bring-to-front");
			/*setTimeout(function() {
				$("#" + this_view).addClass('hide-view')
			}, 1000);*/
		}
		// click previous view
		if(where === 'prev') {
			for(i=0;i<$scope.titles.length;i++) {
				if($('#view_title').text() == $scope.titles[i]) {
					this_view = $scope.titles[i]
					if(i==0) {
						prev_view = $scope.titles[$scope.titles.length - 1];
						$('#view_title').text($scope.titles[$scope.titles.length - 1])
					}
					else{
						prev_view = $scope.titles[i-1];
						$('#view_title').text($scope.titles[i-1])
					}
					break;
				}
			}
			switchData(next_view);
			$("#" + this_view).removeClass('bring-to-front animated bounceInRight bounceInLeft');
			$("#" + prev_view).removeClass('hide-view').addClass("animated bounceInLeft bring-to-front");
		}
	},

	$scope.takeMeToTheFeed = function() {
		if($('#view_title').text() == 'feed')
			return;

		var i;
		var curr_view;
		for(i=0;i<$scope.titles.length;i++) {
			if($('#view_title').text() == $scope.titles[i]) {
				curr_view = $scope.titles[i];
				break;
			}
		}
		console.log(curr_view);
		$("#" + curr_view).removeClass('bring-to-front animated bounceInRight bounceInLeft');
		$("#feedbat").removeClass('hide-view').addClass("animated bounceInRight bring-to-front");
		$('#view_title').text('feedbat');
	},

	$scope.openCommentView = function(){
		$("#comment_view").removeClass('hide-view animated bounceOutDown').addClass("animated bounceInUp ");

	},
	
	$scope.closeCommentView = function() {
		$("#comment_view").removeClass('animated bounceInUp').addClass("animated bounceOutDown");
	},
	
	$scope.openTipView = function(){

	}
	
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
		var direction;
		e = self.getCoords(e);
		el.removeEventListener(end,self._onEnd);
		if(e.x - start_coords.x > 100) {
			$(el).addClass('animated fadeOutRight');
			direction = 'right';
		} else if(e.x - start_coords.x < -100) {
			$(el).addClass('animated fadeOutLeft');
			direction = 'left';
			console.log("bye");
		}

		setTimeout(function() {
			if(direction == "right") {
				$('#upvote-current-feedbat').click();
			} else {
				$('#downvote-current-feedbat').click();
			}
		}, 300);
	};
	
	el.addEventListener(start,this._onStart,false);
		
}

$(document).ready(function () {
var x = new Swipeable($("#current-feedbat")[0]);
window.scrollTo(0,1);
	var comment_input = $("#comment_input")[0];
	comment_input.addEventListener('keydown',function(e){
		if(e.keyCode == 13 && $(this).val() != ""){
			addComment( $(this).val() );
			$(this).val("");
		}
	},false);
	comment_input.addEventListener('focus',function(e){
		if($(this).val() == "Enter a comment here...") $(this).val("");
	},false);
	comment_input.addEventListener('blur',function(e){
		if($(this).val() == "") $(this).val("Enter a comment here...");
	},false);
	
});