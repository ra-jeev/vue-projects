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
    KeyConditionExpression: '#pk = :pk AND begins_with(#sk, :sk)',
    ExpressionAttributeNames: {
      '#pk': 'pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':pk': `USER#${authorizerClaims.sub}`,
      ':sk': `PROJ#`,
    },
    ReturnConsumedCapacity: 'INDEXES',
  };

  const items = [];
  try {
    let data = await docClient.query(params).promise();
    console.log('Query succeeded.', data);
    console.log('capacity:', JSON.stringify(data.ConsumedCapacity, null, 2));
    if (data.Items.length) {
      items.push(...data.Items);
      items.sort((item1, item2) => {
        return item1.updatedAt < item2.updatedAt ? 1 : -1; // descending order
      });
    } else {
      console.log("The Query didn't return any result");
    }

    const result = {
      message: 'Success!',
      items,
    };

    return sendResponse(200, result);
  } catch (err) {
    console.error('Unable to query. Error:', JSON.stringify(err, null, 2));
    return sendResponse(500, { message: 'An error occurred' });
  }
};
