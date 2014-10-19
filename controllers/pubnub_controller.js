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
			createNewChannel(image_id);
		}
	});
	$('#my-current-feedbat').attr('src', image_url);
}

function createNewChannel(image_id) {
	pubnub.publish({
		channel: image_id + "-feedbat",
		message: {
			upvotes: 0,
			downvotes: 0
		},
		callback: function(m) {
			/* so the user can subscribe to his / her current channel */
			localStorage.feed_bat_image = image_id + "-feedbat";
		}
	});
}

function getFeedBatData() {
	pubnub.history({
    channel: 'feed_bat',
    count: 10,
    callback: function(feedbats) { 
    	window.feedbats = feedbats[0];
    }
	});
}

function listenForFeedBats(feedbat) {
	window.feedbats.push(feedbat);
}

function updateVotes(feedbat) {

}