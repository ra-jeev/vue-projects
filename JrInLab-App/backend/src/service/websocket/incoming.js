const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const tableName = process.env.TABLE_NAME;

exports.handler = async (event) => {
  console.log('Incoming event: ', event);
  if (event.requestContext.eventType === 'MESSAGE') {
    const body = JSON.parse(event.body);
    console.log(`messageType: ${body.type}`);
    if (body.type === 'PROJECT_SAVE') {
      const userId = event.requestContext.authorizer.user;
      const params = {
        TableName: tableName,
        Key: {
          pk: `USER#${userId}`,
          sk: `PROJ#${body.id}`,
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

      if (body.title) {
        params.UpdateExpression += ', #title = :title';
        params.ExpressionAttributeNames['#title'] = 'title';
        params.ExpressionAttributeValues[':title'] = body.title;
      }

      if (body.files) {
        params.UpdateExpression += ', #size = :size';
        params.ExpressionAttributeNames['#size'] = 'size';
        params.ExpressionAttributeValues[':size'] = body.files.data.length;

        params.UpdateExpression += ', #lastUpdatedFile = :lastUpdatedFile';
        params.ExpressionAttributeNames['#lastUpdatedFile'] = 'lastUpdatedFile';
        params.ExpressionAttributeValues[':lastUpdatedFile'] = body.files.name;
      }

      try {
        let result = await docClient.update(params).promise();
        console.log(
          'Updated project data in DB: result: ',
          JSON.stringify(result, null, 2)
        );

        if (body.files) {
          const fileParams = {
            TableName: tableName,
            Key: {
              pk: `PROJ#${body.id}`,
              sk: `FILE#${body.files.name}`,
            },
            UpdateExpression:
              'SET #updatedAt = :updatedAt, #data = :data, #size = :size',
            ExpressionAttributeNames: {
              '#updatedAt': 'updatedAt',
              '#data': 'data',
              '#size': 'size',
            },
            ExpressionAttributeValues: {
              ':updatedAt': new Date().toISOString(),
              ':data': body.files.data,
              ':size': body.files.data.length,
            },
            ReturnConsumedCapacity: 'INDEXES',
            ReturnValues: 'ALL_NEW',
          };

          result = await docClient.update(fileParams).promise();
          console.log(
            'Updated project file data in DB: result: ',
            JSON.stringify(result, null, 2)
          );
        }

        return { statusCode: 200, body: 'Request Successful.' };
      } catch (error) {
        console.error(
          'Unable to update. Error:',
          JSON.stringify(error, null, 2)
        );
      }
    }
  } else {
    console.log('Not handling this event type');
  }

  return { statusCode: 500, body: 'Request failed.' };
};
