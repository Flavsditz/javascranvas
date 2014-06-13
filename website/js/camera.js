/**
 * Camera.js
 * 
 * @author: Flavio Diez
 * @description: The script is used to control the actions of the camera object
 *               used throughout the site
 */

var video = $('video')[0];
var localMediaStream = null;

$(document).ready(function() {
	//load user reference line
	
	if (hasGetUserMedia()) {
		init();
	} else {
		// TODO: Present a better message to user (on screen)
		alert('getUserMedia() is not supported in your browser');
	}
});

function hasGetUserMedia() {
	return !!(navigator.getUserMedia || navigator.webkitGetUserMedia
			|| navigator.mozGetUserMedia || navigator.msGetUserMedia);
}

var errorCallback = function(e) {
	console.log('Ups...Error: ', e);
};

function init() {
	navigator.getUserMedia = navigator.getUserMedia
			|| navigator.webkitGetUserMedia || navigator.mozGetUserMedia
			|| navigator.msGetUserMedia;

	if (navigator.getUserMedia) {
		navigator.getUserMedia({
			video : {
				mandatory : {
					minWidth : 480,
					minHeight : 640,
					maxWidth : 480,
					maxHeight : 640
				}
			}
		}, function(stream) {
			localMediaStream = stream;
			camSuccess();
		}, errorCallback);
	} else {
		// TODO: find a fallback film
		// video.src = 'somevideo.webm'; // fallback.
	}

}

function camSuccess() {
	$("#takePic").on("click", snapshot);

	$(".securityWarning").remove();
	video.src = window.URL.createObjectURL(localMediaStream);
}

function snapshot() {
	if (localMediaStream) {
		
		var canvas = $('<canvas>');
		canvas.attr("width", "480");
		canvas.attr("height", "640");
		canvas.css("position", "absolute");
		canvas.css("top", "0");
		canvas.css("left", "0");
		
		canvas = canvas[0];
		
		$(".webcamWrapper").append(canvas);
		$(".saveOrCancel").show();
		$(".fotoOnly").hide();
		
		$("#acceptBtn").on("click", function(){
			
		});
		$("#cancelBtn").on("click", function(){
			$(".saveOrCancel").hide();
			$(".fotoOnly").show();
			$(".webcamWrapper canvas").remove();
		});
		
		var ctx = canvas.getContext('2d');
		
		ctx.drawImage(video, 0, 0);
		// "image/webp" works in Chrome.
		// Other browsers will fall back to image/png.
		document.querySelector('img').src = canvas.toDataURL('image/webp');
	}
}