// start socket
var socket = io();

// assume that we need to show the auth modal until told otherwise
var requireAuth = true;


socket.on('message', function (msg) {
	document.getElementById('bot-console-output').innerText += msg + '\n';
	updateScroll();
});

socket.on('bot-status', function (data) {
	if (data.status === 'on') {
		$("#start-bot-btn").hide();
	} else {
		$("#start-bot-btn").show();
	}
});

socket.on('bot-started', function (data) {
	$("#start-bot-btn").hide();
	if (data.msg) {
		document.getElementById('bot-console-output').innerText += data.msg + '\n';
		updateScroll();		
	}
});

socket.on('bot-stopped', function (data) {
	$("#start-bot-btn").show();
	if (data.msg) {
		document.getElementById('bot-console-output').innerText += data.msg + '\n';
		updateScroll();		
	}
});

socket.on('no-auth', function(data){
	requireAuth = false;
});

$("#start-bot-btn").on('click', function () {
	if (requireAuth) {
		$("#auth-modal").modal('show');
	} else {
		socket.emit('start-bot');
	}
});


$("#auth-btn").on('click', function () {
	$("#auth-message").text("Authenticating...");
	socket.emit('start-bot', {
		username: $("#username").val().trim(),
		password: $("#password").val().trim()
	}, function (auth) {
		if (auth) {
			$("#auth-message").text("");
			$("#auth-modal").modal('hide');
		} else {
			$("#auth-message").text("Authentication failed");
		}
	});
});

/* DOM FUNCTIONS */
function scrollToBottom() {
	var element = document.getElementById("bot-console-output");
	element.scrollTop = element.scrollHeight;
}

var scrolled = false;

function updateScroll() {
	if (!scrolled) {
		var element = document.getElementById("bot-console-output");
		element.scrollTop = element.scrollHeight;
	}
}