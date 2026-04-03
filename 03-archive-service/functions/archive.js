const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  ScanCommand,
  BatchWriteCommand,
} = require("@aws-sdk/lib-dynamodb");

const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const dynamoClient = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(dynamoClient);

const s3 = new S3Client({});

const TABLE_NAME = process.env.TABLE_NAME || process.env.FALLBACK_TABLE_NAME;
const BUCKET_NAME = process.env.BUCKET_NAME;

module.exports.handler = async () => {
  const THIRTY_DAYS_AGO = Date.now() - 30 * 24 * 60 * 60 * 1000;

  let itemsToArchive = [];
  let lastEvaluatedKey;

  // scan dynamodb for items older than 30 days
  do {
    const result = await dynamo.send(
      new ScanCommand({
        TableName: TABLE_NAME,
        ExclusiveStartKey: lastEvaluatedKey,
      }),
    );

    const oldItems = (result.Items || []).filter((item) => {
      return new Date(item.createdAt).getTime() < THIRTY_DAYS_AGO;
    });

    itemsToArchive.push(...oldItems);

    lastEvaluatedKey = result.LastEvaluatedKey;
  } while (lastEvaluatedKey);

  if (itemsToArchive.length === 0) {
    console.log("No items to archive");
    return;
  }

  // upload to s3
  const fileKey = `archives/archive-${Date.now()}.json`;

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileKey,
      Body: JSON.stringify(itemsToArchive, null, 2),
      ContentType: "application/json",
    }),
  );

  console.log(`archived ${itemsToArchive.length} items`);

  //  delete from dynamodb
  const chunks = [];
  for (let i = 0; i < itemsToArchive.length; i += 25) {
    chunks.push(itemsToArchive.slice(i, i + 25));
  }

  for (const chunk of chunks) {
    await dynamo.send(
      new BatchWriteCommand({
        RequestItems: {
          [TABLE_NAME]: chunk.map((item) => ({
            DeleteRequest: {
              Key: { id: item.id },
            },
          })),
        },
      }),
    );
  }

  console.log("deleted archived items from dynamoDB");

  return {
    archiveFileKey: fileKey,
    itemsArchivedLength: itemsToArchive.length,
    itemsArchived: itemsToArchive,
  }
};
