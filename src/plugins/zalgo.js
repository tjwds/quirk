const zalgo = require("to-zalgo");

module.exports = {
  command: "zalgo",
  help: "h̔́̃e̓̓̔ ̓͂̈l̽̽͋ȋ͌ͩv̎̈̒eͩ͋̀s̳̑͛",

  on: "message",
  requiredLength: 1,

  fn({ text }) {
    this.reply(zalgo(text));
  },
};
