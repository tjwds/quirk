let previousMessage = "@%#%235235@#%@#%gkldsjfgkdlsjg@#%@#%1";
let previousChannel = "dfsjkldsfkjldsfjkl!@%$!#%!#%";

module.exports = {
  on: "message",

  fn({ channel, text }) {
    const channelName = channel.name;
    if (text === previousMessage && channelName === previousChannel) {
      channel.send(text);
    }
    previousMessage = text;
    previousChannel = channelName;
  },
};
