'use strict';
const SNS = require('aws-sdk/clients/sns');
const snsClient = new SNS();
const snsTopicName = process.env.SNS_TOPIC_NAME;

exports.handler = async (event) => {
  console.log('Received event: ', event);
  if (event.request.session) {
    console.log('Session: ', JSON.stringify(event.request.session));
  }

  if (event.request.userNotFound) {
    // The user doesn't exist; fail auth
    event.response.issueTokens = false;
    event.response.failAuthentication = true;
  } else {
    if (
      event.request.session &&
      event.request.session.find(
        (attempt) => attempt.challengeName !== 'CUSTOM_CHALLENGE'
      )
    ) {
      // We only accept custom challenges; fail auth
      event.response.issueTokens = false;
      event.response.failAuthentication = true;
    } else if (
      event.request.session &&
      event.request.session.length >= 3 &&
      event.request.session.slice(-1)[0].challengeResult === false
    ) {
      // The user provided a wrong answer 3 times; fail auth
      event.response.issueTokens = false;
      event.response.failAuthentication = true;
    } else if (
      event.request.session &&
      event.request.session.length &&
      event.request.session.slice(-1)[0].challengeName === 'CUSTOM_CHALLENGE' && // Doubly stitched, holds better
      event.request.session.slice(-1)[0].challengeResult === true
    ) {
      // The user provided the right answer; succeed auth
      event.response.issueTokens = true;
      event.response.failAuthentication = false;
      if (event.request.userAttributes.email_verified === 'false') {
        await markEmailVerified(event);
      }
    } else {
      // The user did not provide a correct answer yet; present challenge
      event.response.issueTokens = false;
      event.response.failAuthentication = false;
      event.response.challengeName = 'CUSTOM_CHALLENGE';
    }
  }

  return event;
};

const markEmailVerified = async (event) => {
  console.log('inside markEmailVerified');

  const msgBody = {
    userPoolId: event.userPoolId,
    userId: event.request.userAttributes.sub,
    userName: event.userName,
  };

  const snsParams = {
    Subject: 'Email verified',
    Message: JSON.stringify(msgBody),
    MessageAttributes: {
      type: {
        DataType: 'String',
        StringValue: 'email_verified',
      },
      'update.user': {
        DataType: 'String',
        StringValue: 'true',
      },
    },
    TopicArn: snsTopicName,
  };

  const snsResult = await snsClient.publish(snsParams).promise();
  console.log('sendSnsMessage: result: ', snsResult);
};
