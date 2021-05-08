const { DynamoDB } = require("@aws-sdk/client-dynamodb");
const { dynamoDb } = require("../tokens.js");

const client = new DynamoDB(dynamoDb);

const clientAction = async function commitDynamoDBAction(task, schema) {
  try {
    const data = await client[task](schema);
    return data;
  } catch (err) {
    return err;
  }
};

const db = {
  createTable: async (schema) => {
    const res = await clientAction("createTable", schema);
    return res;
  },

  listTables: async (schema) => {
    const res = await clientAction("listTables", schema);
    return res;
  },

  getItem: async (schema) => {
    const res = await clientAction("getItem", schema);
    return res;
  },

  putItem: async (schema) => {
    const res = await clientAction("putItem", schema);
    return res;
  },

  query: async (schema) => {
    const res = await clientAction("query", schema);
    return res;
  },
};

module.exports = db;
