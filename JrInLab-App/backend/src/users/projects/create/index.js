'use strict';

const AWS = require('aws-sdk');
const { ulid } = require('ulid');
const mime = require('mime-types');
const { sendResponse } = require('/opt/nodejs/apiResponse');

const tableName = process.env.TABLE_NAME;
const docClient = new AWS.DynamoDB.DocumentClient();

const createProjectForUser = async (userId, title, lastUpdatedFile, files) => {
  console.log(`creating new project for user: ${userId}`);
  const id = ulid();
  const projectData = {
    pk: `USER#${userId}`,
    sk: `PROJ#${id}`,
    id,
    title,
    files: [],
    size: 0,
    type: 'USER-PROJ',
    lastUpdatedFile,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const transactParams = {
    TransactItems: [
      {
        Put: {
          TableName: tableName,
          Item: projectData,
        },
      },
    ],
    ReturnConsumedCapacity: 'INDEXES',
  };

  const processedFiles = [];
  files.forEach((file) => {
    const mimeType = mime.lookup(file.name);
    console.log(`file: ${file.name}, fileLength: ${file.data.length}`);
    const fileData = {
      pk: `PROJ#${id}`,
      sk: `FILE#${file.name}`,
      name: file.name,
      data: file.data,
      type: 'PROJ-FILE',
      mimeType,
      size: file.data.length,
      mode: file.mode,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    processedFiles.push({
      name: fileData.name,
      data: fileData.data,
      mimeType,
      size: fileData.size,
      mode: fileData.mode,
      createdAt: fileData.createdAt,
      updatedAt: fileData.updatedAt,
    });

    projectData.size += fileData.size;
    projectData.files.push({
      name: fileData.name,
      type: fileData.mimeType,
    });

    console.log(`final item size: ${JSON.stringify(fileData).length}`);
    transactParams.TransactItems.push({
      Put: { TableName: tableName, Item: fileData },
    });
  });

  console.log('calling transaction for the db');

  const result = await docClient.transactWrite(transactParams).promise();
  console.log(
    'Parsed and saved in DB: consumed capacity: ',
    JSON.stringify(result, null, 2)
  );

  return {
    message: 'Success!',
    data: {
      title: projectData.title,
      id: projectData.id,
      size: projectData.size,
      files: projectData.files,
      lastUpdatedFile: projectData.lastUpdatedFile,
      createdAt: projectData.createdAt,
      updatedAt: projectData.updatedAt,
      projectFiles: processedFiles,
    },
  };
};

exports.handler = async (event) => {
  console.info('received:', event);

  const body = JSON.parse(event.body);

  const title = body.title;
  const lastUpdatedFile = body.lastUpdatedFile;
  const files = body.files;
  const authorizerClaims = event.requestContext.authorizer.claims;
  const pathParams = event.pathParameters;

  console.log(`projectName : ${title}, projectFiles: ${JSON.stringify(files)}`);

  if (event.httpMethod !== 'POST') {
    return sendResponse(400, {
      message: 'Invalid request method',
    });
  } else if (!title) {
    return sendResponse(400, {
      message: 'No project title provided',
    });
  }

  try {
    const result = await createProjectForUser(
      pathParams.id,
      title,
      lastUpdatedFile,
      files
    );

    console.log('Done, now returning');
    return sendResponse(200, result);
  } catch (err) {
    console.error(
      'Unable to link subdomain. Error JSON: ',
      JSON.stringify(err, null, 2)
    );
  }

  return sendResponse(500, {
    message: 'Some problem occurred. Please try again later.',
  });
};
