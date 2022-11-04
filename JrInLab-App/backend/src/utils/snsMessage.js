const SNS = require('aws-sdk/clients/sns');
const snsClient = new SNS();
const snsTopicName = process.env.SNS_TOPIC_NAME;

exports.sendSnsMessage = async (subject, msgPayload, msgAttributes) => {
  console.log('snsTopicName: ', snsTopicName);

  const snsParams = {
    Subject: subject,
    Message: JSON.stringify(msgPayload),
    MessageAttributes: msgAttributes,
    TopicArn: snsTopicName,
  };

  const snsResult = await snsClient.publish(snsParams).promise();
  console.log('sendSnsMessage: result: ', snsResult);
};
