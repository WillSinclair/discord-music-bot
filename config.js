/*
config.js

CHANGE THE VALUES IN THIS FILE IN ORDER FOR THE APP TO WORK
*/

module.exports = {
	// store the path to your bot's folder here
	'botPath': '/home/will/Music/MusicBot',

	// change this to true if you're running this from windows
	'windows': false,
	
	// enable this to require password authentication
	'requireAuth': false,

	// this is an object with mappings of user -> passhash
	'users': {
		// to get the hashes that go here, uncomment the code in the http.listen() function in server.js
		// this user's password is 'testPass'
		'testUser': '$2a$10$g6R1JYwb6X.diIK1.aTj5.E2.WghEq5F1j7sHw0Wplzku7Q6swGrO'
	}
};
