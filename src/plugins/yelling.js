const { yellingChannel } = require("../../settings.js");

module.exports = [
  {
    on: "message",

    shouldRegister: yellingChannel,

    fn({ channelName, text }) {
      if (channelName !== yellingChannel) {
        return;
      }
      if (text.toLocaleUpperCase() !== text) {
        this.reply("YOU'RE MUMBLING!");
      }
    },
  },
  {
    on: "beforeReply",

    shouldRegister: yellingChannel,

    fn(replyObject) {
      if (replyObject.channel.name !== yellingChannel) {
        return;
      }

      // eslint-disable-next-line no-param-reassign
      replyObject.text = replyObject.text.toLocaleUpperCase();
    },
  },
];
