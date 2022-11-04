exports.handler = async (event) => {
  console.log('event received: ', event);
  event.response.autoConfirmUser = true;

  return event;
};
