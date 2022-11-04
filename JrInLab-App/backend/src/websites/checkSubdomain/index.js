'use strict';

const AWS = require('aws-sdk');
const { sendResponse } = require('/opt/nodejs/apiResponse');

const tableName = process.env.TABLE_NAME;
const docClient = new AWS.DynamoDB.DocumentClient();

const RESERVED = [
  'www',
  'admin',
  'app',
  'dev-app',
  'staging-app',
  'dev',
  'dev-admin',
  'staging',
  'staging-admin',
  'internal',
  'test',
  'stage',
  'jrinlab',
];

// Main Lambda entry point
exports.handler = async (event) => {
  console.info('received:', event);

  if (event.httpMethod !== 'GET') {
    return sendResponse(400, {
      message: 'Invalid request.',
    });
  }

  const subdomain = event.queryStringParameters.subdomain.toLowerCase();
  console.log(`Subdomain: ${subdomain}`);

  if (!subdomain || !/^[a-zA-Z0-9-]+$/.test(subdomain)) {
    return sendResponse(400, {
      message: 'Invalid subdomain. Only letters, numbers and hyphens allowed.',
    });
  } else if (RESERVED.includes(subdomain)) {
    return sendResponse(409, {
      message: 'This subdomain is not available.',
    });
  }

  const authorizerClaims = event.requestContext.authorizer.claims;
  console.log('authorizerClaims: ', authorizerClaims);

  const params = {
    TableName: tableName,
    Key: {
      pk: `SUB-DOM#${subdomain}`,
      sk: `SUB-DOM#${subdomain}`,
    },
    ReturnConsumedCapacity: 'INDEXES',
  };

  try {
    const result = await docClient.get(params).promise();
    console.log(
      `Returned the item related to ${subdomain}: `,
      JSON.stringify(result, null, 2)
    );

    if (!result.Item) {
      return sendResponse(200, {
        message: 'This subdomain is available.',
      });
    }
  } catch (err) {
    console.error(
      'Unable to get subdomain entry. Error JSON: ',
      JSON.stringify(err, null, 2)
    );
  }

  console.log(`Subdomain not available: ${subdomain}`);

  return sendResponse(409, {
    message: 'This subdomain already exists.',
  });
};
