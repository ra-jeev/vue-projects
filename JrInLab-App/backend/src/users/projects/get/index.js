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
      ':pk': `PROJ#${event.pathParameters.projectId}`,
      ':sk': `FILE`,
    },
    ReturnConsumedCapacity: 'INDEXES',
  };

  const files = [];
  try {
    const projectRes = await docClient
      .get({
        TableName: tableName,
        Key: {
          pk: `USER#${event.pathParameters.id}`,
          sk: `PROJ#${event.pathParameters.projectId}`,
        },
      })
      .promise();
    console.log('Get succeeded.', JSON.stringify(projectRes, null, 2));
    const result = await docClient.query(params).promise();
    console.log('Query succeeded.', JSON.stringify(result, null, 2));

    if (result.Items.length) {
      result.Items.forEach((item) => {
        files.push({
          name: item.name,
          data: item.data,
          mimeType: item.mimeType,
          size: item.size,
          mode: item.mode,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        });
      });
    } else {
      console.log("The project file query didn't return any result");
    }

    const data = {
      message: 'Success!',
      data: {
        title: projectRes.Item.title,
        id: projectRes.Item.id,
        size: projectRes.Item.size,
        files: projectRes.Item.files,
        lastUpdatedFile: projectRes.Item.lastUpdatedFile,
        createdAt: projectRes.Item.createdAt,
        updatedAt: projectRes.Item.updatedAt,
        projectFiles: files,
      },
    };

    return sendResponse(200, data);
  } catch (err) {
    console.error('Unable to query. Error:', JSON.stringify(err, null, 2));
    return sendResponse(500, { message: 'An error occurred' });
  }
};
