const { DeleteCommand } = require("@aws-sdk/lib-dynamodb");
const { ddb, TABLE_NAME } = require("../db.js");

module.exports.handler = async (event) => {
  try {
    const { itemId } = event.pathParameters;

    await ddb.send(
      new DeleteCommand({
        TableName: TABLE_NAME,
        Key: { itemId },
      }),
    );

    return {
      statusCode: 204,
      body: "",
    };
  } catch {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};
