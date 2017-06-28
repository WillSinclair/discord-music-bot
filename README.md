# discord-music-bot
A webpage to control my discord music bot remotely
- See it in action [here](http://musicbot.longboy.es)

### About
This is a a single-page Node.js app that uses socket.io to start, stop, and monitor a discord [music bot](https://github.com/Just-Some-Bots/MusicBot) running on the same server.

I made this so that I could give people a credentials and they would be able to start my music bot without needing me to manually run it.

### Installation
- Dependencies
   - `nodejs` and `npm`
   - `nodejs-legacy` package (can be found in yum and apt-get repositories)
   - make sure you have a working [RhinoBot](https://github.com/Just-Some-Bots/MusicBot) in a directory under the same user as you plan to run this app
- Clone the repository and `cd` into the folder
- Run `npm install`
- In `config.js`:
   - Change `botPath` to the folder that your bot is in
   - Set `windows` based on whether you're running windows
   - Add your own users into the `users` object and delete the test user
- Run `npm test` to make sure that it's working and see the console output, and then run `npm start` once you're satisfied