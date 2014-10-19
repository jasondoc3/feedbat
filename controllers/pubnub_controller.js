function afterPhotoUpload(event, data) {
	var image_url = data.result.url;
	var image_id = data.result.public_id;
	pubnub.publish({
		channel: "feed_bat",
		message: {
			url: image_url,
			id: image_id
		},
		callback: function(message) {
			createNewChannel(image_id);
		}
	});
}

function createNewChannel(image_id) {
	pubnub.publish({
		channel: image_id + "-feedbat",
		message: {
			upvotes: 0,
			downvotes: 0
		}
		callback: function(m) {
			localStorage.feedbatImage = image_id + "-feedbat";
		}
	});
}

function afterUpvote(image_id){

}