const settings = require("../../settings");
const SETTINGS = require("../../settings");

const on = "message";

const randomColor = (ofTheDay, england) => {
  const rand16 = () => {
    let answer = Math.floor(Math.random() * 256).toString(16);
    if (answer.length === 1) {
      answer = `0${answer}`;
    }
    return answer;
  };
  const color = `${rand16()}${rand16()}${rand16()}`;
  const colorWord = england ? "colour" : "color";
  const prelude = ofTheDay
    ? `Your ${colorWord} of the day`
    : `Your ${colorWord}`;
  return `${prelude} is #${color}.\nhttps://htmlcolors.com/color-image/${color}.png`;
  // https://htmlcolors.com/color-image/d1c4e9.png
};

let lastDayRun = 0;

module.exports = [
  {
    command: "color",
    help: "gives you a random color",

    on,

    fn() {
      this.reply(randomColor());
    },
  },
  {
    command: "colour",
    on,

    fn() {
      this.reply(randomColor(false, true));
    },
  },
  {
    on: "heartbeat",
    fn({ discordClient, now }) {
      if (now.getUTCHours() !== 13 || now.getUTCMinutes() !== 0) {
        return;
      }
      if (now.getUTCDate() === lastDayRun) {
        return;
      }
      lastDayRun = now.getUTCDate();
      const channel = discordClient.channels.cache.find(
        (ch) => ch.name === SETTINGS.artChannel
      );
      if (channel) {
        channel.send(randomColor(true));
      }
    },

    shouldRegister: settings.yellingChannel,
  },
];
