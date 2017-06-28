// start socket
var socket = io(); // replace this with your server name or IP

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
	document.getElementById('bot-console-output').innerText += data.msg + '\n';
});

socket.on('bot-stopped', function (data) {
	$("#start-bot-btn").show();
	document.getElementById('bot-console-output').innerText += data.msg + '\n';
});

$("#start-bot-btn").on('click', function () {
	// socket.emit('start-bot', {
	// 	password: 'adminPassHere'
	// });
	$("#auth-modal").modal('show');
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

$("#bot-console-output").on('scroll', function () {
	var element = document.getElementById("bot-console-output");
	if (element.scrollTop == element.scrollHeight) {
		scrolled = false;
	}
	scrolled = true;
});