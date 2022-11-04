'use strict';

const AWS = require('aws-sdk');
const { ulid } = require('ulid');
const { sendResponse } = require('/opt/nodejs/apiResponse');

const tableName = process.env.TABLE_NAME;
const bucketName = process.env.TEMP_BUCKET;
const domainSuffix = process.env.DOMAIN_SUFFIX;

const s3 = new AWS.S3();
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

const ALLOWED_CONTENT_TYPES = [
  'text/html',
  'application/zip',
  'application/x-zip',
  'application/x-zip-compressed',
];

// Main Lambda entry point
exports.handler = async (event) => {
  console.info('received:', event);

  if (event.httpMethod !== 'POST') {
    return sendResponse(400, {
      message: 'Invalid request.',
    });
  }

  const body = JSON.parse(event.body);
  const subdomain = body.subdomain?.toLowerCase();
  const siteUrl = `https://${subdomain}.${domainSuffix.slice(2)}`; // Skipping the '*.' part of suffix
  const isEdit = body.isEdit;
  console.log(
    `Subdomain: ${subdomain}, isEdit: ${isEdit}, file mimeType: ${body.fileMimeType}`
  );

  if (!subdomain || !/^[a-zA-Z0-9-]+$/.test(subdomain)) {
    return sendResponse(400, {
      message: 'Invalid subdomain. Only letters, numbers and hyphens allowed.',
    });
  } else if (RESERVED.includes(subdomain)) {
    return sendResponse(409, {
      message: 'This subdomain is not available.',
    });
  } else if (!ALLOWED_CONTENT_TYPES.includes(body.fileMimeType)) {
    return sendResponse(415, {
      message: 'Invalid file type. Only html or zip file allowed.',
    });
  }

  const authorizerClaims = event.requestContext.authorizer.claims;
  console.log('authorizerClaims: ', authorizerClaims);
  let result;

  if (isEdit) {
    const getParams = {
      TableName: tableName,
      Key: {
        pk: `SUB-DOM#${subdomain}`,
        sk: `SUB-DOM#${subdomain}`,
      },
    };

    try {
      result = await docClient.get(getParams).promise();
      console.log('Retrieved subdomain: ', JSON.stringify(result, null, 2));

      if (result.Item.user.id !== authorizerClaims.sub) {
        console.log('The user ids do not match:');
        return sendResponse(403, {
          message: 'Subdomain ownership could not be established.',
        });
      }
    } catch (err) {
      console.error(
        'Unable to read subdomain entry. Error JSON: ',
        JSON.stringify(err, null, 2)
      );

      return sendResponse(500, {
        message: 'Some error occurred. Please try again later.',
      });
    }
  } else {
    const data = {
      id: ulid(),
      pk: `SUB-DOM#${subdomain}`,
      sk: `SUB-DOM#${subdomain}`,
      name: subdomain,
      type: 'SUB-DOM',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      user: {
        id: authorizerClaims.sub,
        name: authorizerClaims.name,
      },
      siteUrl,
      ttl: Date.now() / 1000 + 5 * 60, // Reserving the domain for 5 mins
    };

    const params = {
      TableName: tableName,
      Item: data,
      ConditionExpression: 'attribute_not_exists(pk)',
      ReturnConsumedCapacity: 'INDEXES',
    };

    try {
      result = await docClient.put(params).promise();
      console.log(
        'Parsed and saved in DB: consumed capacity: ',
        JSON.stringify(result.ConsumedCapacity, null, 2)
      );
    } catch (err) {
      console.error(
        'Unable to add request. Error JSON: ',
        JSON.stringify(err, null, 2)
      );

      return sendResponse(409, {
        message: 'This subdomain already exists.',
      });
    }
  }

  // if (!authorizerClaims) {
  //   return sendResponse(415, {
  //     message: 'Invalid file type. Only html or zip file allowed.',
  //   });
  // }

  result = await getUploadURLs(
    subdomain,
    siteUrl,
    body.fileName,
    body.fileMimeType
  );

  console.log('Result: ', result);
  return result;
};

const getUploadURLs = async function (
  subdomain,
  siteUrl,
  fileName,
  fileMimeType
) {
  const s3Params = {
    Bucket: bucketName,
    Key: `${subdomain}/${fileName}`,
    ContentType: fileMimeType,
  };

  console.log('getUploadURL: ', s3Params);
  const signedUrl = s3.getSignedUrl('putObject', s3Params);
  console.log('got signed url: ', signedUrl);

  return sendResponse(200, {
    uploadUrl: signedUrl,
    filePath: s3Params.Key,
    contentType: fileMimeType,
    subdomain,
    siteUrl,
  });
};
