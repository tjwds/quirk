```javascript
module.exports = [
  {
    command: "name", // hmm
    help: "",

    on: "message", // or 'ready' or 'slash' or 'heartbeat'.
    requiredLength: 1, // or
    requiredLength: (len) => len > 0 && len < 5,
    shouldRegister: false, // if falsey but not undefined, will skip plugin

    fn: function ({ text, user, discordClient, channel, now }) {
      return "";
    },
  },
];
```
