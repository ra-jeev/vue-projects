const AWS = require('aws-sdk');
const { sendResponse } = require('/opt/nodejs/apiResponse');

const tableName = process.env.TABLE_NAME;
const docClient = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();
const prodBucket = process.env.PROD_BUCKET;

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
  const userId = authorizerClaims.sub;
  console.info('Path params: ', pathParams);

  const params = {
    TableName: tableName,
    Key: {
      pk: `USER#${userId}`,
      sk: `SUB-DOM#${pathParams.subdomain}`,
    },
    ReturnValues: 'ALL_OLD',
  };

  try {
    // Delete the sub-dom entry linked to the user
    const deletedEntry = await docClient.delete(params).promise();
    console.log(`deletedEntry: ${JSON.stringify(deletedEntry)}`);

    // Delete the standalone sub-dom entry
    params.Key.pk = `SUB-DOM#${pathParams.subdomain}`;
    await docClient.delete(params).promise();

    let result = await s3
      .listObjectsV2({
        Bucket: prodBucket,
        Prefix: `${pathParams.subdomain}/`,
      })
      .promise();
    console.log('s3 listObjectsV2 result: ', JSON.stringify(result, null, 2));

    const deleteObjectsParams = {
      Bucket: prodBucket,
      Delete: {
        Objects: [],
      },
    };

    result.Contents.forEach((item) => {
      deleteObjectsParams.Delete.Objects.push({ Key: item.Key });
    });

    result = await s3.deleteObjects(deleteObjectsParams).promise();
    console.log('s3 deleteObjects result: ', JSON.stringify(result, null, 2));

    if (deletedEntry.Attributes.projectId) {
      const projectId = deletedEntry.Attributes.projectId;
      const updateParams = {
        TableName: tableName,
        Key: {
          pk: `USER#${userId}`,
          sk: `PROJ#${projectId}`,
        },
        UpdateExpression:
          'SET #updatedAt = :updatedAt REMOVE #subdomain, #siteUrl, #siteUpdated',
        ExpressionAttributeNames: {
          '#updatedAt': 'updatedAt',
          '#subdomain': 'subdomain',
          '#siteUrl': 'siteUrl',
          '#siteUpdated': 'siteUpdated',
        },
        ExpressionAttributeValues: {
          ':updatedAt': new Date().toISOString(),
        },
        ReturnConsumedCapacity: 'INDEXES',
        ReturnValues: 'ALL_NEW',
      };

      let updateRes = await docClient.update(updateParams).promise();
      console.log(
        `updated project entry: res: ${JSON.stringify(updateRes, null, 2)}`
      );

      const userUpdateParams = {
        TableName: tableName,
        Key: {
          pk: `USER#${userId}`,
          sk: `USER#${userId}`,
        },
        UpdateExpression:
          'SET #updatedAt = :updatedAt, #websitesCount = #websitesCount - :dec',
        ExpressionAttributeNames: {
          '#updatedAt': 'updatedAt',
          '#websitesCount': 'websitesCount',
        },
        ExpressionAttributeValues: {
          ':updatedAt': new Date().toISOString(),
          ':dec': 1,
        },
        ReturnConsumedCapacity: 'INDEXES',
        ReturnValues: 'ALL_NEW',
      };

      updateRes = await docClient.update(userUpdateParams).promise();
      console.log(
        `updated user entry: res: ${JSON.stringify(updateRes, null, 2)}`
      );

      return sendResponse(200, {
        message: 'Ok!',
        websitesCount: updateRes.Attributes.websitesCount,
      });
    }

    return sendResponse(200, {
      message: 'Ok!',
    });
  } catch (error) {
    console.log(
      'failed to delete with error: ',
      JSON.stringify(error, null, 2)
    );
    return sendResponse(500, { message: 'An error occurred' });
  }

  //   const params = {
  //     RequestItems: {
  //       [tableName]: [
  //         {
  //           DeleteRequest: {
  //             Key: {
  //               pk: `SUB-DOM#${pathParams.subdomain}`,
  //               sk: `SUB-DOM#${pathParams.subdomain}`,
  //             }
  //           }
  //         },
  //         {
  //           DeleteRequest: {
  //             Key: {

  //             }
  //           }
  //         }
  //       ],
  //     },
  //     ReturnConsumedCapacity: 'INDEXES',
  //   };

  //   Key:{
  //     "PK": PK,
  //     "SK": SK
  // }

  // const params = {
  //   TableName: tableName,
  //   KeyConditionExpression: '#pk = :pk AND begins_with(#sk, :sk)',
  //   ExpressionAttributeNames: {
  //     '#pk': 'pk',
  //     '#sk': 'sk',
  //   },
  //   ExpressionAttributeValues: {
  //     ':pk': `USER#${authorizerClaims.sub}`,
  //     ':sk': `SUB-DOM`,
  //   },
  //   ProjectionExpression: 'subdomain, siteUrl, createdAt, updatedAt',
  //   ReturnConsumedCapacity: 'INDEXES',
  // };

  // const items = [];
  // try {
  //   let data = await docClient.query(params).promise();
  //   console.log('Query succeeded.', data);
  //   console.log('capacity:', JSON.stringify(data.ConsumedCapacity, null, 2));
  //   if (data.Items.length) {
  //     items.push(...data.Items);
  //   } else {
  //     console.log("The Query didn't return any result");
  //   }

  //   const result = {
  //     message: 'Success!',
  //     items,
  //   };

  //   return sendResponse(200, result);
  // } catch (err) {
  //   console.error('Unable to query. Error:', JSON.stringify(err, null, 2));
  //   return sendResponse(500, { message: 'An error occurred' });
  // }
};
