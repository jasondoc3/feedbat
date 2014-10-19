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
	pubnub.publish({
		channel: image_id + "-feedbat",
		message: {
			upvotes: 0,
			downvotes: 0
		},
		callback: function(m) {
			/* so the user can subscribe to his / her current channel */
			localStorage.feed_bat_image_channel = image_id + "-feedbat";
			localStorage.feed_bat_image_url = image_url;
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

function getVoteData(random_index) {
  pubnub.history({
    channel: window.feedbats[random_index].id + '-feedbat',
    count: 1,
    callback: function(m) {
    	var vote_data = m[0][0];
			$('#current-feedbat').attr('src', window.feedbats[random_index].url);
			$('#downvote-value').html(vote_data.downvotes);
			$('#upvote-value').html(vote_data.upvotes);
			$('#upvote-current-feedbat, #downvote-current-feedbat').attr("data-channel", window.feedbats[random_index].id + "-feedbat");
			setTimeout(function() { $('#current-feedbat').removeClass(); }, 600);

			pubnub.subscribe({
				channel: window.feedbats[random_index].id + '-feedbat',
				message: function(m) { console.log(m) },
				callback: function(m) {
					$('#upvote-value').html(m.upvotes);
					$('#downvote-value').html(m.downvotes);
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
			downvotes: downvotes
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
			downvotes: downvotes
		},
		callback: function(m) {
			var val = parseInt($('#downvote-value').html());
			$('#downvote-value').html(val + 1);
			nextFeedBat(channel);
		}
	});
}

function nextFeedBat(previous_channel) {
	var random_index = Math.floor(Math.random()*window.feedbats.length);
	pubnub.unsubscribe({ channel: previous_channel });
	getVoteData(random_index);
}

function listenForFeedBats(feedbat) {
	window.feedbats.push(feedbat);
}
