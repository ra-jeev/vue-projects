const dynamodb = require('aws-sdk/clients/dynamodb');
const apiGwManagementApi = require('aws-sdk/clients/apigatewaymanagementapi');
const docClient = new dynamodb.DocumentClient();

const apiGwManagementApiClient = new apiGwManagementApi({
  apiVersion: '2018-11-29',
  endpoint: process.env.END_POINT,
});

const tableName = process.env.TABLE_NAME;

exports.handler = async (event) => {
  let connectionData;
  console.log('Entered with event data: ', event);

  try {
    connectionData = await docClient
      .query({
        TableName: tableName,
        KeyConditionExpression: '#pk = :pk',
        ExpressionAttributeNames: {
          '#pk': 'pk',
        },
        ExpressionAttributeValues: {
          ':pk': 'CID',
        },
        ProjectionExpression: 'cid',
      })
      .promise();
  } catch (e) {
    console.log('Failed to fetch connection data: ', e);
    return { statusCode: 500, body: e.stack };
  }

  console.log('Connection Data', connectionData);

  const snsData = event.Records[0].Sns;
  const message = JSON.parse(snsData.Message);
  console.log('Message to send: ', message);

  const postCalls = connectionData.Items.map(async ({ cid }) => {
    try {
      await apiGwManagementApiClient
        .postToConnection({
          ConnectionId: cid,
          Data: snsData.Message,
        })
        .promise();
    } catch (e) {
      console.log('failed in postToConnection call: ', e);
      if (e.statusCode === 410) {
        console.log(`Found stale connection, deleting ${cid}`);
        await docClient
          .delete({
            TableName: tableName,
            Key: { pk: 'CID', sk: `CID#${cid}` },
          })
          .promise();
      } else {
        throw e;
      }
    }
  });

  try {
    const results = await Promise.all(postCalls);
    console.log('Result of post data: ', results);
  } catch (e) {
    console.log('failed in Promise.all: ', e);
    return { statusCode: 500, body: e.stack };
  }

  return { statusCode: 200, body: 'Data sent.' };
};
