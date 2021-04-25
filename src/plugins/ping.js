module.exports = {
  command: "ping",

  on: "message",

  fn() {
    this.reply("pong");
  },
};
