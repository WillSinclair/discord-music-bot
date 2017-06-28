const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const os = require('os');
const bcrypt = require('bcryptjs');
const spawn = require('child_process').spawn;

// CONFIGURATION
const config = require('./config');
const port = process.env.PORT || 8000;

var musicBot = null;
var pid = null;

// manually set the publicly accessible directory
app.use(express.static(__dirname + '/public'));

// body-parser middleware
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());


app.get('/', (req, res) => {
	res.sendFile('./public/index.html');
});


/* socket stuff for executing shell commands */
io.on('connection', (socket) => {
	console.log('Client connected');
	// get the status of the music bot and send to the client right away
	if (musicBot != null && musicBot.pid != null) {
		socket.emit('bot-status', {
			status: 'on'
		});
	} else {
		socket.emit('bot-status', {
			status: 'off'
		});
	}

	socket.on('start-bot', (data, fn) => {
		// try to authenticate
		var isAuthenticated = false;
		try {
			var uname = data.username;
			var pwd = data.password;
			console.log(uname);
			console.log(pwd);
			// check if the user is in the config file
			var user = config.users[uname];
			if (user) {
				isAuthenticated = bcrypt.compareSync(pwd, config.users[uname]);
			}
		} catch (err) {
			fn(false);
			console.log('Auth failed for username "' + uname + '" and password "' + pwd + '"');
		}

		// start the bot if authenticated
		if (isAuthenticated) {
			fn(true);
			// check of the bot is running
			if (musicBot != null && musicBot.pid != null) {
				socket.send('Bot is already running');
			} else {
				spawnMusicBot(socket);
			}
		}
	});

	socket.on('disconnect', function () {
		console.log('Client disconnected');
	})
});


http.listen(port, () => {
	console.log('Listening on port ' + port);
	/*
	// uncomment this code to output the bcrypt hash of a password on start, and then paste that into config.js
	var pass = bcrypt.hashSync('testpass', 10);
	console.log(pass);
	*/
});


function spawnMusicBot(socket) {
	try {
		// set the executable based on the specified OS
		var executable = './run.sh';
		if (config.windows) {
			executable = 'run.bat'
		}

		musicBot = spawn(executable, {
			cwd: config.botPath
		}).on('error', function (err) {
			socket.send('Failed to start music bot at ' + config.botPath);
			socket.broadcast.send('Failed to start music bot at ' + config.botPath);
			console.log('Failed to start music bot at ' + config.botPath + ' : ' + err);
		});
		pid = musicBot.pid;
		musicBot.stdout.on('data', (data) => {
			socket.broadcast.send(`${data}`);
			socket.send(`${data}`);
		});
		musicBot.stderr.on('data', (data) => {
			socket.broadcast.send(`${data}`);
			socket.send(`${data}`);
		});
		musicBot.on('close', code => {
			socket.broadcast.send(`Bot exited with code ${code}`);
			socket.send(`Bot exited with code ${code}`);
		});
		socket.broadcast.emit('bot-started', {
			msg: 'Bot started'
		});
		socket.emit('bot-started', {
			msg: 'Bot started'
		});
		console.log('Bot started');
	} catch (err) {
		console.log('Bot died: ' + err);
		socket.broadcast.emit('bot-stopped', {
			msg: 'Bot Died'
		});
		socket.emit('bot-stopped', {
			msg: 'Died'
		});
	}
}