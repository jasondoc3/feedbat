function afterPhotoUpload(event, data) {
	var image_url = data.result.url;
	var image_id = data.result.public_id;
	pubnub.publish({
		channel: "feed_bat",
		message: {
			url: image_url,
			id: image_id,
			uuid: localStorage.feed_bat_uuid,
		},
		callback: function(message) {
			createNewChannel(image_id, image_url);
		}
	});
	$('#my-current-feedbat').attr('src', image_url);
}

function createNewChannel(image_id, image_url) {
	$('#downvote-value').html(0);
	$('#upvote-value').html(0);
	parseComments([]);

	if(localStorage.feed_bat_image_channel) {
		pubnub.unsubscribe({ channel: localStorage.feed_bat_image_channel });
	}

	pubnub.publish({
		channel: image_id + "-feedbat",
		message: {
			upvotes: 0,
			downvotes: 0,
			comments:[]
		},
		callback: function(m) {
			/* so the user can subscribe to his / her current channel */
			localStorage.feed_bat_image_channel = image_id + "-feedbat";
			localStorage.feed_bat_image_url = image_url;

			pubnub.subscribe({
				channel: image_id + "-feedbat",
				message: function(m) { console.log(m); },
				callback: function() {} 
			});
		}
	});
}

function getFeedBatData() {
	pubnub.history({
    channel: 'feed_bat',
    count: 10,
    callback: function(feedbats) {
    	window.feedbats = feedbats[0];
    	var random_index = Math.floor(Math.random()*window.feedbats.length);

    	if(localStorage.feed_bat_uuid) {
    		while(window.feedbats[random_index].uuid == localStorage.feed_bat_uuid) {
    			random_index = Math.floor(Math.random()*window.feedbats.length);
    		}
    	}

    	getVoteData(random_index);
    }
	});
}

var feed_comments = new Array();
function parseComments(arr){
	feed_comments = new Array();
	if(!arr) arr = [];
	console.log(arr);
	for(var i = 0; i < arr.length; i++) feed_comments.push(arr[i]);
	var cont = $("#comment_view_comments");
	cont.empty();
	for(var i = 0; i < feed_comments.length; i++) cont.append(
		$("<li />",{text:feed_comments[i]}).append(
			$("<img />",{class:"comment_blurb",src:"images/comment_blurb.png"})
		)
	);
}


function getVoteData(random_index) {
  pubnub.history({
    channel: window.feedbats[random_index].id + '-feedbat',
    count: 1,
    callback: function(m) {
    	var vote_data = m[0][0];
			$('#current-feedbat').attr('src', window.feedbats[random_index].url);
			$('#downvote-value').html(vote_data.downvotes);
			$('#upvote-value').html(vote_data.upvotes);
			parseComments(vote_data.comments);
			$('#upvote-current-feedbat, #downvote-current-feedbat').attr("data-channel", window.feedbats[random_index].id + "-feedbat");
			setTimeout(function() { $('#current-feedbat').removeClass(); }, 600);

			pubnub.subscribe({
				channel: window.feedbats[random_index].id + '-feedbat',
				message: function(m) { console.log(m) },
				callback: function(m) {
					$('#upvote-value').html(m.upvotes);
					$('#downvote-value').html(m.downvotes);
					parseComments(m.comments);
				}
			});
    }
  });
}

function upVote() {
	var channel = $(this).attr('data-channel');
	var upvotes = parseInt($('#upvote-value').html()) + 1;
	var downvotes = parseInt($('#downvote-value').html());

	pubnub.publish({
		channel: channel,
		message: {
			upvotes: upvotes,
			downvotes: downvotes,
			comments: feed_comments
		},
		callback: function(m) {
			var val = parseInt($('#upvote-value').html());
			$('#upvote-value').html(val + 1);
			nextFeedBat(channel);
		}
	});
}

function downVote() {
	var channel = $(this).attr('data-channel');
	var upvotes = parseInt($('#upvote-value').html());
	var downvotes = parseInt($('#downvote-value').html()) + 1;

	pubnub.publish({
		channel: channel,
		message: {
			upvotes: upvotes,
			downvotes: downvotes,
			comments: feed_comments
		},
		callback: function(m) {
			var val = parseInt($('#downvote-value').html());
			$('#downvote-value').html(val + 1);
			nextFeedBat(channel);
		}
	});
}

function addComment(comm) {
	var channel = $("#upvote-current-feedbat").attr('data-channel');
	var upvotes = parseInt($('#upvote-value').html());
	var downvotes = parseInt($('#downvote-value').html());
	feed_comments.push(comm);

	pubnub.publish({
		channel: channel,
		message: {
			upvotes: upvotes,
			downvotes: downvotes,
			comments: feed_comments
		},
		callback: function(m) {
			parseComments(feed_comments);
		}
	});
}

function switchData(next_view) {
	if(next_view == "mybat") {
		var prev_channel = $('#upvote-current-feedbat').attr('data-channel');
		pubnub.unsubscribe({ channel: prev_channel });
		pubnub.history({
			channel: localStorage.feed_bat_image_channel,
			count: 1,
			callback: function(m) {
				var img_data = m[0][0];
				$('#downvote-value').html(img_data.downvotes);
				$('#upvote-value').html(img_data.upvotes);
				parseComments(img_data.comments);
				// update comments

				pubnub.subscribe({
					channel: localStorage.feed_bat_image_channel,
					message: function(m) { console.log(m) },
					callback: function(m) {
						$('#upvote-value').html(m.upvotes);
						$('#downvote-value').html(m.downvotes);
						parseComments(m.comments);
					}
			});
			}
		});
	} else {
		if(localStorage.feed_bat_image_channel) {
			pubnub.unsubscribe({ channel: localStorage.feed_bat_image_channel });
		}
		$('#current-feedbat').attr('src', "");
		var random_index = getRandomIndex();
		getVoteData(random_index);
	}
}

function nextFeedBat(previous_channel) {
	var random_index = getRandomIndex();
	pubnub.unsubscribe({ channel: previous_channel });
	getVoteData(random_index);
}

function listenForFeedBats(feedbat) {
	window.feedbats.push(feedbat);
}

function getRandomIndex() {
	var random_index = Math.floor(Math.random()*window.feedbats.length);

	if(localStorage.feed_bat_uuid) {
    while(window.feedbats[random_index].uuid == localStorage.feed_bat_uuid) {
    	random_index = Math.floor(Math.random()*window.feedbats.length);
    }
	}
	return random_index;
}
