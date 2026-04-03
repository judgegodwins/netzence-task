const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
  BatchWriteCommand,
} = require("@aws-sdk/lib-dynamodb");

const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const crypto = require("crypto");

const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const s3 = new S3Client({});

const TABLE_NAME = process.env.TABLE_NAME || process.env.FALLBACK_TABLE_NAME;

const BUCKET_NAME = process.env.BUCKET_NAME;

// SEED FUNCTION
module.exports.handler = async () => {
  console.log("Seeding table:", TABLE_NAME);

  const now = Date.now();

  const items = [
    {
      id: crypto.randomUUID(),
      name: "old item",
      createdAt: new Date(now - 40 * 24 * 60 * 60 * 1000).toISOString(), // 40 days ago
    },
    {
      id: crypto.randomUUID(),
      name: "old item 2",
      createdAt: new Date(now - 35 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: crypto.randomUUID(),
      name: "new item 2",
      createdAt: new Date(now).toISOString(),
    },
  ];

  for (const item of items) {
    await dynamo.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: item,
      }),
    );
  }

  console.log("Seed complete");
  return {
    message: "Seed complete",
    itemsInserted: items.length,
  };
};
