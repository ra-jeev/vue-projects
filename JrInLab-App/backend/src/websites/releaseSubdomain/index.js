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

  if (event.httpMethod !== 'DELETE') {
    return sendResponse(400, {
      message: 'Invalid request method',
    });
  }

  const pathParams = event.pathParameters;
  console.info('Path params: ', pathParams);

  const params = {
    TableName: tableName,
    Key: {
      pk: `SUB-DOM#${pathParams.subdomain}`,
      sk: `SUB-DOM#${pathParams.subdomain}`,
    },
    ConditionExpression: `#user.#id = :userId`,
    ExpressionAttributeNames: {
      '#user': 'user',
      '#id': 'id',
    },
    ExpressionAttributeValues: {
      ':userId': authorizerClaims.sub,
    },
  };

  try {
    const result = await docClient.delete(params).promise();

    console.log(
      'delete subdomain entry result: ',
      JSON.stringify(result, null, 2)
    );

    return sendResponse(200, {
      message: 'Ok!',
    });
  } catch (error) {
    console.log(
      'failed to release subdomain with error: ',
      JSON.stringify(error, null, 2)
    );

    return sendResponse(403, {
      message: 'Unauthorized to perform the requested operation',
    });
  }
};
