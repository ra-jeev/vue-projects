'use strict';
const crypto = require('crypto');
const SNS = require('aws-sdk/clients/sns');
const snsClient = new SNS();
const snsTopicName = process.env.SNS_TOPIC_NAME;

exports.handler = async (event) => {
  console.log('Received event: ', event);
  let secretLoginCode;
  if (!event.request.session || !event.request.session.length) {
    // This is a new auth session
    // Generate a new secret login code and mail it to the user
    secretLoginCode = crypto.randomBytes(3).toString('hex').toUpperCase();
    console.log('secretLoginCode: ', secretLoginCode);
    await sendSnsForEmail(event.request.userAttributes.email, secretLoginCode);
  } else {
    // There's an existing session. Don't generate new digits but
    // re-use the code from the current session. This allows the user to
    // make a mistake when keying in the code and to then retry, rather
    // then needing to e-mail the user an all new code again.
    const previousChallenge = event.request.session.slice(-1)[0];
    console.log('previousChallenge: ', previousChallenge);
    console.log(
      'regex match: ',
      previousChallenge.challengeMetadata?.match(/CODE-([A-Z0-9]*)/)
    );
    secretLoginCode =
      previousChallenge.challengeMetadata?.match(/CODE-([A-Z0-9]*)/)?.[1];
    console.log('secretLoginCode: ', secretLoginCode);
  }

  // This is sent back to the client app
  event.response.publicChallengeParameters = {
    email: event.request.userAttributes.email,
  };

  // Add the secret login code to the private challenge parameters
  // so it can be verified by the "Verify Auth Challenge Response" trigger
  event.response.privateChallengeParameters = { secretLoginCode };

  // Add the secret login code to the session so it is available
  // in a next invocation of the "Create Auth Challenge" trigger
  event.response.challengeMetadata = `CODE-${secretLoginCode}`;

  return event;
};

const sendSnsForEmail = async (email, secretCode) => {
  const msgBody = {
    subject: `JrInLab confirmation code - ${secretCode}`,
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
