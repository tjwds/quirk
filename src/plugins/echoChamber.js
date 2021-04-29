let previousMessage = "@%#%235235@#%@#%gkldsjfgkdlsjg@#%@#%1";

module.exports = {
  on: "message",

  fn({ channel, text }) {
    if (text === previousMessage) {
      channel.send(text);
    }
    previousMessage = text;
  },
};
