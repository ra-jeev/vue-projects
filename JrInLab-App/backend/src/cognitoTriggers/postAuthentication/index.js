const AWS = require('aws-sdk');
const cognitoServiceProvider = require('aws-sdk/clients/cognitoidentityserviceprovider');
const cognitoServiceClient = new cognitoServiceProvider();

const tableName = process.env.TABLE_NAME;
const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  console.log('Received event: ', event);
  if (
    event.request.userAttributes.email_verified !== 'true' &&
    (!event.request.clientMetadata ||
      event.request.clientMetadata.method !== 'pwd')
  ) {
    const params = {
      UserPoolId: event.userPoolId,
      UserAttributes: [
        {
          Name: 'email_verified',
          Value: 'true',
        },
      ],
    };

    if (event.userName) {
      params.Username = event.userName;
    }

    await cognitoServiceClient.adminUpdateUserAttributes(params).promise();

    const sub = event.request.userAttributes.sub;
    const dbParams = {
      TableName: tableName,
      Key: {
        pk: `USER#${sub}`,
        sk: `USER#${sub}`,
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

    try {
      const result = await docClient.update(dbParams).promise();
      console.log(
        'Updated user entry in DB: ',
        JSON.stringify(result, null, 2)
      );
    } catch (err) {
      console.error(
        'Unable to update user DB entry. Error JSON: ',
        JSON.stringify(err, null, 2)
      );
    }
  }

  return event;
};
