exports.handler = async (event) => {
  console.log('Received event: ', event);
  const expectedAnswer =
    event.request.privateChallengeParameters?.secretLoginCode;
  console.log(`expectedAnswer: ${expectedAnswer}`);

  event.response.answerCorrect =
    event.request.challengeAnswer === expectedAnswer;

  return event;
};
