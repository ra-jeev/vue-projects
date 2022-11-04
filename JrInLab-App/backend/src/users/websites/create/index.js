'use strict';

const AWS = require('aws-sdk');
const { ulid } = require('ulid');
const unzipper = require('unzipper');
const mime = require('mime-types');
const { sendResponse } = require('/opt/nodejs/apiResponse');

const tableName = process.env.TABLE_NAME;
const tempBucket = process.env.TEMP_BUCKET;
const prodBucket = process.env.PROD_BUCKET;
const domainSuffix = process.env.DOMAIN_SUFFIX;

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

const s3 = new AWS.S3();
const docClient = new AWS.DynamoDB.DocumentClient();
const ALLOWED_CONTENT_TYPES = [
  'text/html',
  'application/zip',
  'application/x-zip',
  'application/x-zip-compressed',
];

Error;

const getModifiedHtmlFileBuffer = (buffer, siteUrl) => {
  const script = `<script type="text/javascript" src="${
    siteUrl || '.'
  }/jrinlab.js"></script>`;
  console.log(`script line to add: ${script}`);
  const scriptBuffer = Buffer.from(script);
  const headEndTag = '</head>';
  const bodyEndTag = '</body>';
  const htmlEndTag = '</html>';

  // console.log('incoming buffer: ', buffer.toString());
  let index;
  if (buffer.includes(headEndTag)) {
    index = buffer.indexOf(headEndTag);
  } else if (buffer.includes(headEndTag.toUpperCase())) {
    index = buffer.indexOf(headEndTag.toUpperCase());
  } else if (buffer.includes(bodyEndTag)) {
    index = buffer.indexOf(bodyEndTag);
  } else if (buffer.includes(bodyEndTag.toUpperCase())) {
    index = buffer.indexOf(bodyEndTag.toUpperCase());
  } else if (buffer.includes(htmlEndTag)) {
    index = buffer.indexOf(htmlEndTag);
  } else if (buffer.includes(htmlEndTag.toUpperCase())) {
    index = buffer.indexOf(htmlEndTag.toUpperCase());
  }

  const finalBuffer = index
    ? Buffer.concat([buffer.slice(0, index), scriptBuffer, buffer.slice(index)])
    : Buffer.concat([buffer, scriptBuffer]);

  // console.log('final buffer: ', finalBuffer.toString());
  return finalBuffer;
};

const processFile = (file, metaInfo) => {
  const detectedMimeType = mime.lookup(file.path);
  const filePathLower = file.path.toLowerCase();

  if (file.type === 'Directory' && !filePathLower.includes('__macosx')) {
    const pathParts = file.path.split('/');
    console.log('DirPaths parts: ', pathParts);
    if (!metaInfo.root && !pathParts[1]) {
      metaInfo.root = pathParts[0];
    }
  } else if (
    file.type === 'File' &&
    detectedMimeType &&
    !filePathLower.includes('__macosx') &&
    !filePathLower.includes('thumbs.db')
  ) {
    const pathParts = file.path.split('/');
    console.log(
      `detectedMimeType: ${detectedMimeType}, filePaths parts: `,
      pathParts
    );
    if (
      !metaInfo.index &&
      (pathParts[0].includes('index.htm') ||
        (pathParts[1] && pathParts[1].includes('index.htm')))
    ) {
      metaInfo.index = file.path;
    }

    metaInfo.filesData.push({ type: detectedMimeType, file });
  } else {
    console.log(
      `dropping: ${file.path}, detectedMimeType: ${detectedMimeType}`
    );
  }
};

const deleteSubdomainEntry = async (subdomain) => {
  console.log(`deleting subdomain : ${subdomain}`);
  if (subdomain) {
    const deleteParams = {
      TableName: tableName,
      Key: {
        pk: `SUB-DOM#${subdomain}`,
        sk: `SUB-DOM#${subdomain}`,
      },
    };

    try {
      await docClient.delete(deleteParams).promise();
    } catch (err) {
      console.log('Failed to delete: ' + JSON.stringify(err));
    }
  }
};

const deleteTempBucketFile = async (filePath) => {
  console.log(`deleting temp file : ${filePath}`);
  if (filePath) {
    await s3
      .deleteObject({
        Bucket: tempBucket,
        Key: filePath,
      })
      .promise();
  }
};

const handleFailure = async (subdomain, filePath, errorCode, errorMessage) => {
  console.log(errorMessage);
  const promises = [
    deleteSubdomainEntry(subdomain),
    deleteTempBucketFile(filePath),
  ];

  await Promise.allSettled(promises);

  return sendResponse(errorCode, {
    message: errorMessage,
  });
};

const linkSubdomainToUser = async (
  userId,
  subdomain,
  siteUrl,
  projectId,
  date
) => {
  console.log(`linking subdomain ${subdomain} to user: ${userId}`);
  const data = {
    pk: `USER#${userId}`,
    sk: `SUB-DOM#${subdomain}`,
    subdomain,
    siteUrl,
    type: 'USER-SUB-DOM',
    createdAt: date,
    updatedAt: date,
  };

  if (projectId) {
    data.projectId = projectId;
  }

  const params = {
    TableName: tableName,
    Item: data,
    ReturnConsumedCapacity: 'INDEXES',
  };

  try {
    let result = await docClient.put(params).promise();
    console.log('Linked subdomain to user: ', JSON.stringify(result, null, 2));

    const userUpdateParams = {
      TableName: tableName,
      Key: {
        pk: `USER#${userId}`,
        sk: `USER#${userId}`,
      },
      UpdateExpression: 'SET #updatedAt = :updatedAt ADD #websitesCount :inc',
      ExpressionAttributeNames: {
        '#updatedAt': 'updatedAt',
        '#websitesCount': 'websitesCount',
      },
      ExpressionAttributeValues: {
        ':updatedAt': date,
        ':inc': 1,
      },
      ReturnConsumedCapacity: 'INDEXES',
      ReturnValues: 'ALL_NEW',
    };

    result = await docClient.update(userUpdateParams).promise();
    console.log(
      'updated website count for user: ',
      JSON.stringify(result, null, 2)
    );

    return result.Attributes.websitesCount;
  } catch (err) {
    console.error(
      'Unable to link subdomain. Error JSON: ',
      JSON.stringify(err, null, 2)
    );

    return {
      code: 500,
      body: {
        message: 'Some problem occurred. Please try again later.',
      },
    };
  }
};

const updateSubdomainEntry = async (subdomain) => {
  console.log(`updating subdomain ${subdomain} entry`);
  const params = {
    TableName: tableName,
    Key: {
      pk: `SUB-DOM#${subdomain}`,
      sk: `SUB-DOM#${subdomain}`,
    },
    UpdateExpression: 'SET #updatedAt = :updatedAt REMOVE #ttl',
    ExpressionAttributeNames: {
      '#updatedAt': 'updatedAt',
      '#ttl': 'ttl',
    },
    ExpressionAttributeValues: {
      ':updatedAt': new Date().toISOString(),
    },
    ReturnConsumedCapacity: 'INDEXES',
    ReturnValues: 'ALL_NEW',
  };

  try {
    let result = await docClient.update(params).promise();
    console.log(
      'Updated subdomain in DB: consumed capacity: ',
      JSON.stringify(result.ConsumedCapacity, null, 2)
    );
  } catch (err) {
    console.error(
      'Unable to update DB entry. Error JSON: ',
      JSON.stringify(err, null, 2)
    );
  }
};

const updateProjectEntry = async (
  userId,
  projectId,
  subdomain,
  siteUrl,
  date
) => {
  console.log(`updating project ${projectId} entry`);
  const params = {
    TableName: tableName,
    Key: {
      pk: `USER#${userId}`,
      sk: `PROJ#${projectId}`,
    },
    UpdateExpression:
      'SET #updatedAt = :updatedAt, #subdomain = :subdomain, #siteUrl = :siteUrl, #siteUpdated = :siteUpdated',
    ExpressionAttributeNames: {
      '#updatedAt': 'updatedAt',
      '#subdomain': 'subdomain',
      '#siteUrl': 'siteUrl',
      '#siteUpdated': 'siteUpdated',
    },
    ExpressionAttributeValues: {
      ':updatedAt': date,
      ':subdomain': subdomain,
      ':siteUrl': siteUrl,
      ':siteUpdated': date,
    },
    ReturnConsumedCapacity: 'INDEXES',
    ReturnValues: 'ALL_NEW',
  };

  try {
    let result = await docClient.update(params).promise();
    console.log(
      'Updated project entry in DB:: ',
      JSON.stringify(result, null, 2)
    );
  } catch (err) {
    console.error(
      'Unable to update DB entry. Error JSON: ',
      JSON.stringify(err, null, 2)
    );

    return {
      code: 500,
      body: {
        message: 'Failed to update the project',
      },
    };
  }
};

const handleCreateFromArchive = async (
  subdomain,
  dirName,
  siteUrl,
  filePath
) => {
  let directory;
  try {
    directory = await unzipper.Open.s3(s3, {
      Bucket: tempBucket,
      Key: filePath,
    });
  } catch (error) {
    return handleFailure(
      subdomain,
      filePath,
      400,
      'Corrupted file. Unable to parse.'
    );
  }
  // console.log(directory);
  const processed = {
    root: null,
    index: null,
    filesData: [],
  };

  directory.files.forEach((file) => {
    processFile(file, processed);
  });

  console.log('======= processed Info =======', processed);
  if (!processed.index) {
    console.log('No index file, do clean up');
    return handleFailure(subdomain, filePath, 409, 'No index file found.');
  }

  const bufferPromises = [];
  const s3Promises = [];
  for (const fileData of processed.filesData) {
    bufferPromises.push(fileData.file.buffer());
  }

  const results = await Promise.allSettled(bufferPromises);
  console.log(
    `after buffer promise settled: totalPromises: ${bufferPromises.length}`
  );
  for (const index in results) {
    const result = results[index];
    const fileData = processed.filesData[index];
    console.log(
      `promise result: ${result.status}, file: ${fileData.file.path}`
    );
    if (result.status === 'fulfilled') {
      let buffer = result.value;
      if (fileData.type === 'text/html') {
        buffer = getModifiedHtmlFileBuffer(buffer, siteUrl);
      }

      let key =
        processed.index === fileData.file.path
          ? 'index.html'
          : processed.root && processed.index.includes(processed.root)
          ? fileData.file.path.slice(processed.root.length + 1) // +1 for '/'
          : fileData.file.path;

      const params = {
        Bucket: prodBucket,
        Key: `${dirName}/${key}`,
        Body: buffer,
        ContentType: fileData.type,
      };

      s3Promises.push(s3.upload(params).promise());
    }
  }

  if (s3Promises.length) {
    console.log('starting await of upload');
    await Promise.allSettled(s3Promises);
  }
};

const handleCreateFromHTML = async (dirName, siteUrl, filePath) => {
  const { Body } = await s3
    .getObject({
      Bucket: tempBucket,
      Key: filePath,
    })
    .promise();

  // console.log('Body is: ', Body);
  const buffer = getModifiedHtmlFileBuffer(Body, siteUrl);
  // console.log('final file buffer: ', buffer);
  const params = {
    Bucket: prodBucket,
    Key: `${dirName}/index.html`,
    Body: buffer,
    ContentType: 'text/html; charset=utf-8',
  };

  await s3.upload(params).promise();
};

const handleCreateFromProject = async (
  projectId,
  subdomain,
  siteUrl,
  user,
  date
) => {
  if (!subdomain || !/^[a-zA-Z0-9-]+$/.test(subdomain)) {
    return {
      code: 400,
      body: {
        message:
          'Invalid subdomain. Only letters, numbers and hyphens allowed.',
      },
    };
  } else if (RESERVED.includes(subdomain)) {
    return {
      code: 409,
      body: {
        message: 'This subdomain is not available.',
      },
    };
  }

  const projectParams = {
    TableName: tableName,
    KeyConditionExpression: '#pk = :pk AND begins_with(#sk, :sk)',
    ExpressionAttributeNames: {
      '#pk': 'pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':pk': `PROJ#${projectId}`,
      ':sk': `FILE`,
    },
    ReturnConsumedCapacity: 'INDEXES',
  };

  let result;
  const projectFiles = [];
  try {
    result = await docClient.query(projectParams).promise();
    console.log('Query succeeded.', JSON.stringify(result, null, 2));

    if (result.Items.length) {
      result.Items.forEach((item) => {
        projectFiles.push({
          name: item.name,
          data: item.data,
          mimeType: item.mimeType,
        });
      });
    } else {
      console.log("The project files query didn't return any result");
      return {
        code: 404,
        body: {
          message: 'No resources found for the said project.',
        },
      };
    }
  } catch (error) {
    console.log('Failed to fetch the project files: ', error);
    return {
      code: 500,
      body: {
        message: 'Could not fetch project files',
      },
    };
  }

  const params = {
    TableName: tableName,
    Item: {
      id: ulid(),
      pk: `SUB-DOM#${subdomain}`,
      sk: `SUB-DOM#${subdomain}`,
      name: subdomain,
      type: 'SUB-DOM',
      createdAt: date,
      updatedAt: date,
      user: {
        id: user.sub,
        name: user.name,
      },
      siteUrl,
    },
    ConditionExpression: 'attribute_not_exists(pk)',
    ReturnConsumedCapacity: 'INDEXES',
  };

  try {
    result = await docClient.put(params).promise();
    console.log(
      'Parsed and saved the sub-dom entry in DB: ',
      JSON.stringify(result, null, 2)
    );

    const s3Promises = [];
    projectFiles.forEach((file) => {
      const buffer = getModifiedHtmlFileBuffer(Buffer.from(file.data), siteUrl);

      console.log('final file buffer: ', buffer);
      const s3Params = {
        Bucket: prodBucket,
        Key: `${subdomain}/${file.name}`,
        Body: buffer,
        ContentType: `${file.mimeType}; charset=utf-8`,
      };

      console.log(`s3Params: ${JSON.stringify(s3Params)}`);
      s3Promises.push(s3.upload(s3Params).promise());
    });

    if (s3Promises.length) {
      console.log('starting await of upload');
      await Promise.allSettled(s3Promises);
    }
  } catch (err) {
    console.error(
      'Unable to add sub-dom entry. Error JSON: ',
      JSON.stringify(err, null, 2)
    );

    return {
      code: 409,
      body: {
        message: 'This subdomain already exists.',
      },
    };
  }
};

exports.handler = async (event) => {
  console.info('received:', event);

  const body = JSON.parse(event.body);
  const subdomain = body.subdomain.toLowerCase();
  const filePath = body.filePath;
  const authorizerClaims = event.requestContext.authorizer.claims;

  if (event.httpMethod !== 'POST') {
    if (body.projectId) {
      return sendResponse(400, {
        message: 'Invalid request method',
      });
    }

    return handleFailure(subdomain, filePath, 400, 'Invalid request method');
  } else if (!subdomain) {
    if (body.projectId) {
      return sendResponse(400, {
        message: 'Missing subdomain information.',
      });
    }

    return handleFailure(
      subdomain,
      filePath,
      400,
      'Missing subdomain information.'
    );
  }

  const siteUrl =
    body.siteUrl || `https://${subdomain}.${domainSuffix.slice(2)}`; // Skipping the '*.' part of suffix

  console.log(`subdomain: ${subdomain}, siteUrl: ${siteUrl}`);

  if (body.projectId) {
    const date = new Date().toISOString();
    const error = await handleCreateFromProject(
      body.projectId,
      subdomain,
      siteUrl,
      authorizerClaims,
      date
    );

    if (error) {
      return sendResponse(error.code, error.body);
    }

    const res = await linkSubdomainToUser(
      authorizerClaims.sub,
      subdomain,
      siteUrl,
      body.projectId,
      date
    );

    await updateProjectEntry(
      authorizerClaims.sub,
      body.projectId,
      subdomain,
      siteUrl,
      date
    );

    console.log('Done, now returning');
    return sendResponse(200, {
      message: 'Ok',
      siteUrl,
      subdomain,
      siteUpdated: date,
      updatedAt: date,
      websitesCount: res,
    });
  } else {
    const mimeType = body.contentType;

    console.log(`filePath : ${filePath}, mimeType: ${mimeType}`);

    if (!filePath) {
      return handleFailure(
        subdomain,
        filePath,
        400,
        'Invalid filepath provided.'
      );
    } else if (!mimeType || !ALLOWED_CONTENT_TYPES.includes(mimeType)) {
      return handleFailure(
        subdomain,
        filePath,
        400,
        'Invalid mime type passed.'
      );
    }

    const dirName = filePath.split('/')[0];
    if (mimeType !== 'text/html') {
      await handleCreateFromArchive(subdomain, dirName, siteUrl, filePath);
    } else {
      await handleCreateFromHTML(dirName, siteUrl, filePath);
    }

    const finalPromises = [
      linkSubdomainToUser(authorizerClaims.sub, subdomain, siteUrl),
      updateSubdomainEntry(subdomain),
      // deleteTempBucketFile(filePath),
    ];

    await Promise.allSettled(finalPromises);
  }

  console.log('Done, now returning');
  return sendResponse(200, {
    message: 'Ok',
  });
};
