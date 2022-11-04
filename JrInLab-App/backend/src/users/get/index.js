const AWS = require('aws-sdk');
const { sendResponse } = require('/opt/nodejs/apiResponse');

const tableName = process.env.TABLE_NAME;
const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  console.info('received:', event);

  const authorizerClaims = event.requestContext.authorizer.claims;
  if (!authorizerClaims) {
    return sendResponse(403, {
      message: 'Unauthorized to perform the requested operation',
    });
  }

  if (event.httpMethod !== 'GET') {
    return sendResponse(400, {
      message: 'Invalid request method',
    });
  }

  const params = {
    TableName: tableName,
    Key: {
      pk: `USER#${authorizerClaims.sub}`,
      sk: `USER#${authorizerClaims.sub}`,
    },
    ReturnConsumedCapacity: 'INDEXES',
  };

  try {
    let data = await docClient.get(params).promise();
    console.log('Get succeeded.:', JSON.stringify(data, null, 2));
    return sendResponse(200, {
      user: data.Item,
    });
  } catch (err) {
    console.error('Unable to query. Error:', JSON.stringify(err, null, 2));
    return sendResponse(500, { message: 'An error occurred' });
  }
};
