const { GetCommand } = require("@aws-sdk/lib-dynamodb");
const { ddb, TABLE_NAME } = require("../db.js");

module.exports.handler = async (event) => {
  try {
    const { itemId } = event.pathParameters;

    const result = await ddb.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { itemId },
      }),
    );

    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Item not found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result.Item),
    };
  } catch {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};
