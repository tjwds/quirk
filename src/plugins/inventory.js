const { v4: uuidv4 } = require("uuid");
const { marshall } = require("@aws-sdk/util-dynamodb");

const db = require("../db");
const { botName, useDynamoDB } = require("../../settings");

const tableSchema = {
  TableName: "Inventory",
  KeySchema: [{ AttributeName: "uuid", KeyType: "HASH" }],
  AttributeDefinitions: [
    { AttributeName: "uuid", AttributeType: "S" },
    { AttributeName: "botName", AttributeType: "S" },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 1,
  },
  GlobalSecondaryIndexes: [
    {
      IndexName: "botName_index",
      KeySchema: [
        {
          AttributeName: "botName",
          KeyType: "HASH",
        },
      ],
      Projection: {
        ProjectionType: "ALL",
      },
      ProvisionedThroughput: {
        NumberOfDecreasesToday: 0,
        WriteCapacityUnits: 1,
        ReadCapacityUnits: 5,
      },
    },
  ],
};

if (useDynamoDB) {
  db.listTables({}).then((result) => {
    if (!result.TableNames.includes(tableSchema.TableName)) {
      db.createTable(tableSchema);
    }
  });
}

module.exports = [
  {
    command: "give",
    help: "[someone] [something] — gives someone something!",

    on: "message",
    requiredLength: 2,
    shouldRegister: useDynamoDB,

    fn({ text, member }) {
      const words = text.split(" ");
      const person = words[0];
      const thing = words.slice(1).join(" ");
      const givenBy = member.user.username;
      const data = {
        TableName: tableSchema.TableName,
        Item: marshall({
          uuid: uuidv4(),
          botName,
          givenBy,
          person,
          thing,
        }),
      };
      db.putItem(data).then((res) => {
        if (res instanceof Error) {
          this.reply("whoopsie!  I couldn't do that, for some reason.");
          return;
        }
        this.reply(`okay, I gave ${person} "${thing}"`);
      });
    },
  },
  {
    command: "inventory",
    help: "list the things that have been given to everyone",

    on: "message",
    shouldRegister: useDynamoDB,

    fn({ text }) {
      const data = {
        KeyConditionExpression: `botName = :b`,
        ExpressionAttributeValues: {
          ":b": { S: botName },
        },
        ProjectionExpression: "thing, person",
        TableName: tableSchema.TableName,
        IndexName: "botName_index",
      };
      db.query(data).then((res) => {
        if (res instanceof Error) {
          this.reply(
            "whoops, I don't know what happened, but I didn't do _that_…"
          );
          return;
        }
        const dict = {};
        res.Items.forEach((item) => {
          if (!dict[item.person.S]) {
            dict[item.person.S] = [];
          }
          dict[item.person.S].push(item.thing.S);
        });
        let people = Object.keys(dict);
        if (text) {
          people = people.filter((person) => person === text);
        }
        if (!people.length) {
          if (text) {
            this.reply(`${text} doesn't have anything!`);
          } else {
            this.reply(
              "nobody has anything!  You should give someone something."
            );
          }
          return;
        }
        this.reply(
          people.reduce(
            (previous, current) =>
              `${previous}\n**${current}**: ${dict[current].join(", ")}`,
            ""
          )
        );
      });
    },
  },
];
