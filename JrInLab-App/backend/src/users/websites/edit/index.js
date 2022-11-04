'use strict';

const AWS = require('aws-sdk');
const unzipper = require('unzipper');
const mime = require('mime-types');
const { sendResponse } = require('/opt/nodejs/apiResponse');

const tableName = process.env.TABLE_NAME;
const tempBucket = process.env.TEMP_BUCKET;
const prodBucket = process.env.PROD_BUCKET;
const s3 = new AWS.S3();
const docClient = new AWS.DynamoDB.DocumentClient();
const ALLOWED_CONTENT_TYPES = [
  'text/html',
  'application/zip',
  'application/x-zip',
  'application/x-zip-compressed',
];

const getModifiedHtmlFileBuffer = (buffer, siteUrl) => {
  // console.log(buffer.toString());
  const script = `<script type="text/javascript" src="${
    siteUrl || '.'
  }/jrinlab.js"></script>`;
  console.log(`script line to add: ${script}`);
  const scriptBuffer = Buffer.from(script);
  const headEndTag = '</head>';
  const bodyEndTag = '</body>';
  const htmlEndTag = '</html>';

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

  // console.log(finalBuffer.toString());
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

const handleFailure = async (filePath, errorCode, errorMessage) => {
  console.log(errorMessage);
  await deleteTempBucketFile(filePath);

  return sendResponse(errorCode, {
    message: errorMessage,
  });
};

const deleteExistingFiles = async (subdomain) => {
  let result = await s3
    .listObjectsV2({
      Bucket: prodBucket,
      Prefix: `${subdomain}/`,
    })
    .promise();
  console.log('s3 listObjectsV2 result: ', JSON.stringify(result, null, 2));

  if (result.Contents.length) {
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
  }
};

const updateDbEntries = async (userId, subdomain, date, projectId) => {
  console.log(`updating subdomain ${subdomain} entry for user: ${userId}`);
  const params = {
    TableName: tableName,
    Key: {
      pk: `SUB-DOM#${subdomain}`,
      sk: `SUB-DOM#${subdomain}`,
    },
    UpdateExpression: 'SET #updatedAt = :updatedAt',
    ExpressionAttributeNames: {
      '#updatedAt': 'updatedAt',
    },
    ExpressionAttributeValues: {
      ':updatedAt': date,
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

    params.Key.pk = `USER#${userId}`;
    result = await docClient.update(params).promise();
    console.log(
      'Updated user subdomain entry in DB: consumed capacity: ',
      JSON.stringify(result.ConsumedCapacity, null, 2)
    );

    if (projectId) {
      const projectParams = {
        TableName: tableName,
        Key: {
          pk: `USER#${userId}`,
          sk: `PROJ#${projectId}`,
        },
        UpdateExpression:
          'SET #updatedAt = :updatedAt, #siteUpdated = :siteUpdated',
        ExpressionAttributeNames: {
          '#updatedAt': 'updatedAt',
          '#siteUpdated': 'siteUpdated',
        },
        ExpressionAttributeValues: {
          ':updatedAt': date,
          ':siteUpdated': date,
        },
        ReturnConsumedCapacity: 'INDEXES',
        ReturnValues: 'ALL_NEW',
      };

      result = await docClient.update(projectParams).promise();
      console.log(
        'Updated project entry in DB:: ',
        JSON.stringify(result, null, 2)
      );
    }
  } catch (err) {
    console.error(
      'Unable to updated DB entry. Error JSON: ',
      JSON.stringify(err, null, 2)
    );
  }
};

const handleUpdateFromProject = async (projectId, subdomain, siteUrl) => {
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

    await deleteExistingFiles(subdomain);

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
  } catch (error) {
    console.log('Failed to fetch the project files: ', error);
    return {
      code: 500,
      body: {
        message: 'Could not fetch project files',
      },
    };
  }
};

exports.handler = async (event) => {
  console.info('received:', event);

  const body = JSON.parse(event.body);

  const filePath = body.filePath;
  const mimeType = body.contentType;
  const siteUrl = body.siteUrl;
  const subdomain = event.pathParameters.subdomain;
  const authorizerClaims = event.requestContext.authorizer.claims;
  const projectId = body.projectId;

  console.log(
    `filePath : ${filePath}, mimeType: ${mimeType}, subdomain: ${subdomain}`
  );

  if (event.httpMethod !== 'PATCH') {
    return handleFailure(filePath, 400, 'Invalid request method');
  } else if (!subdomain) {
    return handleFailure(filePath, 400, 'Missing subdomain information.');
  }

  if (projectId) {
    const error = await handleUpdateFromProject(
      body.projectId,
      subdomain,
      siteUrl
    );

    if (error) {
      return sendResponse(error.code, error.body);
    }

    const date = new Date().toISOString();
    await updateDbEntries(authorizerClaims.sub, subdomain, date, projectId);

    console.log('Done, now returning');
    return sendResponse(200, {
      message: 'Ok',
      siteUpdated: date,
      updatedAt: date,
    });
  } else {
    if (!filePath) {
      return handleFailure(filePath, 400, 'Invalid filepath provided.');
    } else if (!mimeType || !ALLOWED_CONTENT_TYPES.includes(mimeType)) {
      return handleFailure(filePath, 400, 'Invalid mime type passed.');
    }

    const dirName = filePath.split('/')[0];
    if (mimeType !== 'text/html') {
      let directory;
      try {
        directory = await unzipper.Open.s3(s3, {
          Bucket: tempBucket,
          Key: filePath,
        });
      } catch (error) {
        return handleFailure(filePath, 400, 'Corrupted file. Unable to parse.');
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
        return handleFailure(filePath, 409, 'No index file found.');
      }

      await deleteExistingFiles(subdomain);

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
    } else {
      const { Body } = await s3
        .getObject({
          Bucket: tempBucket,
          Key: filePath,
        })
        .promise();

      // console.log('Body is: ', Body);
      const buffer = getModifiedHtmlFileBuffer(Body, siteUrl);

      const params = {
        Bucket: prodBucket,
        Key: `${dirName}/index.html`,
        Body: buffer,
        ContentType: 'text/html',
      };

      await s3.upload(params).promise();
    }

    const date = new Date().toISOString();
    const finalPromises = [
      deleteTempBucketFile(filePath),
      updateDbEntries(authorizerClaims.sub, subdomain, date),
    ];

    await Promise.allSettled(finalPromises);
  }

  console.log('Done, now returning');
  return sendResponse(200, {
    message: 'Ok',
  });
};
