const fetch = require("node-fetch");
const { weatherLocations } = require("../../settings");

const getWeather = function resolveLocationToWeatherString(location) {
  return new Promise((resolve) => {
    fetch(`https://wttr.in/${location}?format=j1`)
      .then((res) => res.json())
      .then((res) =>
        resolve(
          `${location}: ${res.current_condition[0].weatherDesc[0].value}, ${res.current_condition[0].temp_C}°C (${res.current_condition[0].temp_F}°F)`
        )
      );
  });
};

module.exports = {
  command: "weather",
  help: "tells you the weather for somewhere",

  on: "message",

  fn({ text: location }) {
    if (!location && weatherLocations) {
      Promise.all(
        weatherLocations.map((loc) => getWeather(loc))
      ).then((responses) =>
        this.reply(
          responses.reduce(
            (prev, current, index, array) =>
              prev + current + (index === array.length - 1 ? "" : "\n"),
            ""
          )
        )
      );
    } else {
      getWeather(location).then((res) => this.reply(res));
    }
  },
};
