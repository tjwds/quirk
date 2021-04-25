const formatHelp = (title, text) => `**${title}**: ${text}`;

module.exports = {
  command: "help",

  on: "message",

  fn({ text: title }) {
    const { helpText } = this;
    if (title) {
      const helpResponse = helpText[title];
      if (helpResponse) {
        this.reply(formatHelp(title, helpResponse));
      } else {
        this.reply(`hmmm, I don't know anything about ${title}, sorry!`);
      }
    } else {
      const topics = Object.keys(helpText);
      this.reply(
        topics.reduce(
          (prev, current, index, array) =>
            prev +
            formatHelp(current, helpText[current]) +
            (index === array.length - 1 ? "" : "\n"),
          ""
        )
      );
    }
  },
};
