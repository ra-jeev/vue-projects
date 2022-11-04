'use strict';

const AWS = require('aws-sdk');
const tableName = process.env.TABLE_NAME;
const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  console.info('received:', event);

  if (event.request.userAttributes.sub) {
    const now = new Date().toISOString();
    const params = {
      TableName: tableName,
      Item: {
        pk: `USER#${event.request.userAttributes.sub}`,
        sk: `USER#${event.request.userAttributes.sub}`,
        id: event.request.userAttributes.sub,
        type: 'USER',
        name: event.request.userAttributes.name,
        email: event.request.userAttributes.email,
        emailVerified: event.request.userAttributes.email_verified === 'true',
        createdAt: now,
        updatedAt: now,
        onboardingDone: false,
      },
      ReturnConsumedCapacity: 'INDEXES',
    };

    try {
      const result = await docClient.put(params).promise();
      console.log(
        `Saved user details in DB for ${event.request.userAttributes.sub}: `,
        JSON.stringify(result, null, 2)
      );
    } catch (err) {
      console.error(
        `Unable to save user data for ${event.request.userAttributes.sub}. Error JSON: `,
        JSON.stringify(err, null, 2)
      );
    }
  } else {
    console.log('No user id present so skipping');
  }

  return event;
};

const sendSnsForEmail = async (id, email) => {
  const secretLoginCode = crypto.randomBytes(3).toString('hex').toUpperCase();
  const msgBody = {
    subject: `Welcome to JrInLab - Please verify your email`,
    message: `Your email confirmation magic code is given below. Type / paste it into your browser window for logging into JrInLab.\n\n${secretCode}`,
    html: `<html>
    <body>
      <img
        height="36px"
        src="https://firebasestorage.googleapis.com/v0/b/jrinlab.appspot.com/o/logos%2Fsmall%2Fjrinlab-yellow.png?alt=media&token=9a0d4548-4480-4cdc-bc27-c7429739ea67"
        style="background-color: #6c63ff; padding: 12px; border-radius: 8px"
      />
      <h2>Confirm your email address</h2>
      <p>
        Your email confirmation magic code is given below. Type / paste it into
        your browser window for signing into JrInLab.
      </p>
      <h3>Your code: ${secretCode}</h3>
      <p>Alternatively, you can click on the below link to verify your email.</p>
      <p></p><a href="">localhost:3000/email-verify?id=${id}&code=${secretLoginCode}</a></p>
      <p>This code / link is valid only for the next 24 hours.</p>
    </body>
  </html>`,
    toEmail: email,
  };

  const snsParams = {
    Subject: 'Auth challenge',
    Message: JSON.stringify(msgBody),
    MessageAttributes: {
      type: {
        DataType: 'String',
        StringValue: 'auth',
      },
      'notify.email': {
        DataType: 'String',
        StringValue: 'true',
      },
    },
    TopicArn: snsTopicName,
  };

  const snsResult = await snsClient.publish(snsParams).promise();
  console.log('sendSnsMessage: result: ', snsResult);
};
