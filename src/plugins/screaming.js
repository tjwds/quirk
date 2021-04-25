module.exports = {
  on: "ready",
  fn({ discordClient }) {
    discordClient.user.setActivity("the screaming", { type: "LISTENING" });
  },
};
