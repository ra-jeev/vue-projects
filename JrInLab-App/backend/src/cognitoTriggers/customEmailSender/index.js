const SNS = require('aws-sdk/clients/sns');
const snsClient = new SNS();
const snsTopicName = process.env.SNS_TOPIC_NAME;

exports.handler = async (event) => {
  console.log('received event: ', JSON.stringify(event, null, 2));
  if (event.request.code) {
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
          Please click on the magic link below to verify your email address. 
        </p>
        <p>Alternatively, you can click on the below link to verify your email.</p>
        <a href="">localhost:3000/email-verify?id=${event.request.userAttributes.sub}&code=${event.request.code}</a>
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
  }
};

const sendSnsForEmail = async (email, secretCode) => {};
