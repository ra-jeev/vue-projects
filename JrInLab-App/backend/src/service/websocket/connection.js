const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const tableName = process.env.TABLE_NAME;

exports.handler = async (event) => {
  console.log('Incoming event: ', event);
  if (event.requestContext.eventType === 'CONNECT') {
    console.log('Saving the connection id in the DB');
    const putParams = {
      TableName: tableName,
      Item: {
        pk: `CID`,
        sk: `CID#${event.requestContext.connectionId}`,
        type: 'CID',
        cid: event.requestContext.connectionId,
        ttl: parseInt(Date.now() / 1000 + 3600),
      },
    };

    try {
      await docClient.put(putParams).promise();
    } catch (err) {
      return {
        statusCode: 500,
        body: 'Failed to connect: ' + JSON.stringify(err),
      };
    }
  } else if (event.requestContext.eventType === 'DISCONNECT') {
    console.log('Deleting the item in the DB');
    const deleteParams = {
      TableName: tableName,
      Key: {
        pk: `CID`,
        sk: `CID#${event.requestContext.connectionId}`,
      },
    };

    try {
      await docClient.delete(deleteParams).promise();
    } catch (err) {
      return {
        statusCode: 500,
        body: 'Failed to disconnect: ' + JSON.stringify(err),
      };
    }
  } else {
    console.log('Not handling this event type');
  }

  return { statusCode: 200, body: 'Request Successful.' };
};
