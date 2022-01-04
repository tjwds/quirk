const SpotifyWebApi = require("spotify-web-api-node");
const SETTINGS = require("../../settings");
const tokens = require("../../tokens.js");

let lastDayRun = 0;

const api = new SpotifyWebApi(tokens.spotify);
const playlist = "2RTJBV6krqlbufBRnwtxwa"

const getRandomSong = () =>
  new Promise((resolve) => {
    api.clientCredentialsGrant().then((data) => {
      api.setAccessToken(data.body.access_token);
      api.setRefreshToken(data.body.refresh_token);

      api.getPlaylistTracks(playlist).then((playlistData) => {
        const tracks = playlistData.body.items;
        const randomIndex = Math.floor(Math.random() * tracks.length);
        const item = tracks[randomIndex];
        resolve(`Your song of the day: https://open.spotify.com/track/${item.track.id}`)
      });
    });
  });

module.exports = [
  {
    on: "heartbeat",
    fn({ discordClient, now }) {
      if (now.getUTCHours() !== 17 || now.getUTCMinutes() !== 0) {
        return;
      }
      if (now.getUTCDate() === lastDayRun) {
        return;
      }
      lastDayRun = now.getUTCDate();
      // TODO
      const channel = discordClient.channels.cache.find(
        (ch) => ch.name === SETTINGS.songOfTheDayChannel
      );
      if (channel) {
        getRandomSong().then(text => channel.send(text));
      }
    },

    shouldRegister: tokens.spotify,
  },
];
