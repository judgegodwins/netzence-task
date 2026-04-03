const { UpdateCommand } = require("@aws-sdk/lib-dynamodb");
const { ddb, TABLE_NAME } = require("../db.js");

module.exports.handler = async (event) => {
  try {
    const { itemId } = event.pathParameters;
    const body = JSON.parse(event.body);

    if (!body.name || !body.description) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid input" }),
      };
    }

    const result = await ddb.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { itemId },
        UpdateExpression: "SET #n = :name, description = :desc",
        ExpressionAttributeNames: {
          "#n": "name",
        },
        ExpressionAttributeValues: {
          ":name": body.name,
          ":desc": body.description,
        },
        ReturnValues: "ALL_NEW",
      }),
    );

    return {
      statusCode: 200,
      body: JSON.stringify(result.Attributes),
    };
  } catch {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};
