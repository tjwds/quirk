# Quirk

Quirk is a friendly framework for creating friendly bots on Discord.

## Installation

- Go to the [Discord Developer Console](https://discord.com/developers/applications)
- Create a new application
- Go to Bot, then create a bot
- Copy the bot's client id from OAuth2 -> client id, then, in your browser, navigate to https://discord.com/oauth2/authorize?client_id=CLIENT_ID_GOES_HERE&scope=bot
- Select the server you want to add the bot to and add it
- Make sure your bot belongs to a role with adequate permissions
- Back on the bots settings page, copy the token and paste it in tokens.js
- Also set up any existing settings in settings.js that you want
- npm install, node index.js
- consider using pm2 to keep your bot persistently alive

## … still todo …

- Import all the old commands
- Add real documentation
- Set up union of bot hotels
