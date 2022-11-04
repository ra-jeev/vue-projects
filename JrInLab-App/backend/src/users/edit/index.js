const AWS = require('aws-sdk');

const cognitoServiceProvider = require('aws-sdk/clients/cognitoidentityserviceprovider');
const cognitoServiceClient = new cognitoServiceProvider();

const { sendResponse } = require('/opt/nodejs/apiResponse');

const tableName = process.env.TABLE_NAME;
const docClient = new AWS.DynamoDB.DocumentClient();

const handleSnsEvent = async (event) => {
  const promises = [];

  event.Records.forEach((record) => {
    if (record.EventSource === 'aws:sns') {
      const sns = record.Sns;
      console.log(`snsData: ${JSON.stringify(sns)}`);
      const attribs = sns.MessageAttributes;
      const payload = JSON.parse(sns.Message);
      const type = attribs.type.Value;

      if (type === 'email_verified') {
        // Update cognito for each event
        // Update dynamoDB for each event
        const params = {
          UserPoolId: payload.userPoolId,
          UserAttributes: [
            {
              Name: 'email_verified',
              Value: 'true',
            },
          ],
        };

        if (payload.userName) {
          params.Username = payload.userName;
        }

        promises.push(
          cognitoServiceClient.adminUpdateUserAttributes(params).promise()
        );

        const dbParams = {
          TableName: tableName,
          Key: {
            pk: `USER#${payload.userId}`,
            sk: `USER#${payload.userId}`,
          },
          UpdateExpression:
            'SET #updatedAt = :updatedAt, #emailVerified = :emailVerified',
          ExpressionAttributeNames: {
            '#updatedAt': 'updatedAt',
            '#emailVerified': 'emailVerified',
          },
          ExpressionAttributeValues: {
            ':updatedAt': new Date().toISOString(),
            ':emailVerified': true,
          },
          ReturnConsumedCapacity: 'INDEXES',
          ReturnValues: 'ALL_NEW',
        };

        promises.push(docClient.update(dbParams).promise());
      }
    }
  });

  if (promises.length) {
    const results = await Promise.allSettled(promises);
    console.log(
      'result of user update operation: ',
      JSON.stringify(results, null, 2)
    );
  }
};

exports.handler = async (event) => {
  console.info('received:', event);

  if (event.Records) {
    return await handleSnsEvent(event);
  }

  const authorizerClaims = event.requestContext.authorizer.claims;
  console.log(
    `pathParams.id: ${
      event.pathParameters.id
    }, authorizerClaims: ${JSON.stringify(authorizerClaims)}`
  );

  if (!authorizerClaims || authorizerClaims.sub !== event.pathParameters.id) {
    return sendResponse(403, {
      message: 'Unauthorized to perform the requested operation',
    });
  }

  const body = JSON.parse(event.body);

  if (event.httpMethod !== 'PATCH') {
    return sendResponse(400, {
      message: 'Invalid request method',
    });
  }

  const params = {
    TableName: tableName,
    Key: {
      pk: `USER#${event.pathParameters.id}`,
      sk: `USER#${event.pathParameters.id}`,
    },
    UpdateExpression: 'SET #updatedAt = :updatedAt',
    ExpressionAttributeNames: {
      '#updatedAt': 'updatedAt',
    },
    ExpressionAttributeValues: {
      ':updatedAt': new Date().toISOString(),
    },
    ReturnConsumedCapacity: 'INDEXES',
    ReturnValues: 'ALL_NEW',
  };

  Object.keys(body).forEach((key) => {
    params.UpdateExpression += `, #${key} = :${key}`;
    params.ExpressionAttributeNames[`#${key}`] = key;
    params.ExpressionAttributeValues[`:${key}`] = body[key];
  });

  console.log('final update params: ', JSON.stringify(params, null, 2));

  try {
    const result = await docClient.update(params).promise();
    console.log('Update succeeded.:', JSON.stringify(result, null, 2));
    return sendResponse(200, {
      message: 'Ok',
      user: result.Attributes,
    });
  } catch (err) {
    console.error('Unable to update. Error:', JSON.stringify(err, null, 2));
    return sendResponse(500, { message: 'An error occurred' });
  }
};
