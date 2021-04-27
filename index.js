const { readdirSync } = require("fs");
const { join } = require("path");

const Discord = require("discord.js");
const TOKENS = require("./tokens.js");
const settings = require("./settings.js");

const discordClient = new Discord.Client();

const helpText = {};
const commands = {};
const beforeReply = [];

// run heartbeat every second
const loopFunctions = [];
setInterval(() => {
  const now = new Date();
  loopFunctions.forEach((fn) => fn({ discordClient, now }));
}, 1000);

const pluginDirectory = join(__dirname, "src", "plugins");
readdirSync(pluginDirectory).forEach((file) => {
  if (!file.endsWith("js")) {
    return;
  }
  // eslint-disable-next-line import/no-dynamic-require, global-require
  let plugin = require(join(pluginDirectory, file));
  if (!Array.isArray(plugin)) {
    plugin = [plugin];
  }
  plugin.forEach(
    ({ command, fn, on, help, requiredLength, shouldRegister }) => {
      if (typeof shouldRegister !== "undefined" && !shouldRegister) {
        return;
      }
      commands[command] = { command, fn, on, help };

      if (command && help) {
        helpText[command] = help;
      }

      if (!on) {
        return;
      }

      if (on === "heartbeat") {
        loopFunctions.push(fn);
      } else if (on === "beforeReply") {
        beforeReply.push(fn);
      } else {
        discordClient.on(on, (event) => {
          const now = new Date();
          const text = (event && event.content) || "";
          const textSplit = text.split(" ");

          // don't respond to self
          if (event?.member && event.member.user.id === discordClient.user.id) {
            return;
          }

          // don't act on empty messages (though they can have attachments)
          // may want to reconsider this later!
          if (event instanceof Discord.Message && !text) {
            return;
          }

          if (
            command &&
            text &&
            (textSplit[0]?.toLocaleLowerCase() !== settings.botName ||
              textSplit[1]?.toLocaleLowerCase() !== command)
          ) {
            return;
          }

          const textWithoutCommand = textSplit.slice(2).join(" ");

          if (requiredLength) {
            if (typeof requiredLength === "number") {
              if (
                textSplit.length <
                (command ? requiredLength + 2 : requiredLength + 1)
              ) {
                return;
              }
            } else if (typeof requiredLength === "function") {
              if (
                !requiredLength(command ? requiredLength + 1 : requiredLength)
              ) {
                return;
              }
            }
          }

          fn.call(
            {
              reply(replyText) {
                const replyArgs = { text: replyText, channel: event?.channel };
                beforeReply.forEach((beforeReplyFn) =>
                  beforeReplyFn(replyArgs)
                );
                return event?.reply(replyArgs.text);
              },
              channel: event?.channel,
              commands,
              helpText,
            },
            {
              text: command ? textWithoutCommand : text,
              channel: event?.channel?.name,
              member: event?.member,
              discordClient,
              now,
            }
          );
        });
      }
    }
  );
});

discordClient.login(TOKENS.discordToken);

discordClient.on("ready", () => {
  console.log(`Logged in as ${discordClient.user.tag}!`);
});
