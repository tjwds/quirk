const fetch = require("node-fetch");

module.exports = {
  command: "translate",
  help: "translate text into English from any language… theoretically!",

  on: "message",
  requiredLength: 1,

  fn({ text }) {
    const sourceLang = "auto";
    const targetLang = "en";

    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURI(
      text
    )}`;

    try {
      fetch(url)
        .then((res) => res.json())
        .then((json) => this.reply(json[0][0][0]));
    } catch (error) {
      this.reply("whoops!  Something went wrong.");
    }
  },
};
