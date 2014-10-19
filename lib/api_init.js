/* Initialize our pubnub variables */
pubnub = PUBNUB.init({
	publish_key   : "pub-c-0d0c2fe8-2f46-4835-babd-6cf2543ae1ba", 
	subscribe_key : "sub-c-047bf4d6-5704-11e4-a7f8-02ee2ddab7fe"
});

/* Initialize our cloudinary configuration */
$(document).ready(function() {
	$.cloudinary.config({ cloud_name: "feedbat", api_key: '299886898613445' });
	$('#upload_image').unsigned_cloudinary_upload("jason1234", { cloud_name: 'feedbat'}).bind('cloudinarydone', afterPhotoUpload);
	$('.cloudinary-fileupload').attr('accept', 'image/*;capture=camera');
	$('#upload_image_idv').css('position', 'absolute');
	$('#upload_image_div').css('z-index', '100');

	pubnub.subscribe({
		channel: 'feed_bat',
		messsage: function(m) { console.log(m) },
		callback: function() { alert('hey');} 
	});
});
