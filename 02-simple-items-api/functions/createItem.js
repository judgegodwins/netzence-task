const { PutCommand } = require("@aws-sdk/lib-dynamodb");
const crypto = require("crypto");
const { ddb, TABLE_NAME } = require("../db.js");

module.exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);

    if (!body.name || !body.description) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid input" }),
      };
    }

    const item = {
      itemId: crypto.randomUUID(),
      name: body.name,
      description: body.description,
    };

    await ddb.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: item,
      }),
    );

    return {
      statusCode: 201,
      body: JSON.stringify(item),
    };
  } catch (err) {
    console.log("Error creating item:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Internal server error",
        error: err.message,
        stack: err.stack,
      }),
    };
  }
};
