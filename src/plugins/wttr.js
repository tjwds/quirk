const fetch = require("node-fetch");

module.exports = {
  command: "weather",
  help: "tells you the weather for somewhere",

  on: "message",

  fn({ text: location }) {
    // TODO: check weather for all known locations if text is false
    fetch(`https://wttr.in/${location}?format=j1`)
      .then((res) => res.json())
      .then((res) =>
        this.reply(
          `${location}: ${res.current_condition[0].weatherDesc[0].value}, ${res.current_condition[0].temp_C}°C (${res.current_condition[0].temp_F}°F)`
        )
      );
  },
};
