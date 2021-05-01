const randomWords = require("random-words");
const SETTINGS = require("../../settings.js");

let secretWord = randomWords();
let secretWordRole;
console.log(`pst, the secret word is ${secretWord}`);

module.exports = {
  on: "message",

  shouldRegister: SETTINGS.secretWordRole,

  fn: async function secretWordAssigner({ discordClient, text, member }) {
    if (!secretWordRole) {
      // dumb hack to set the secret word role
      const guild = await discordClient.guilds.fetch(SETTINGS.guildId);
      secretWordRole = await guild.roles.fetch(SETTINGS.secretWordRole);
    }

    const secretWordRegex = new RegExp(
      `(?:^|[ .!-,;()[]{}/'"])${secretWord}(?:$|[ .!-,;()[]{}/'"])`
    );
    if (text.toLocaleLowerCase().match(secretWordRegex)) {
      secretWordRole.members.forEach((secretMember) => {
        secretMember.roles.remove(secretWordRole);
      });
      member.roles.add(secretWordRole);
      this.reply(
        `YOU SAID THE SECRET WORD!!!  IT WAS ${secretWord.toLocaleUpperCase()}.  NOW IT WILL BE SOMETHING ELSE. https://media.giphy.com/media/iQShAmyijieEU/giphy.gif`
      );
      secretWord = randomWords();
      console.log(`pst, now it's ${secretWord}`);
    }
  },
};
