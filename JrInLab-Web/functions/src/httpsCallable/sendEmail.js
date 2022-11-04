const functions = require('firebase-functions')

exports.sendEmail = functions
  .region('asia-east2')
  .https.onCall(async (payload, context) => {
    console.log(`sendEmailToCustomer enter:: `, JSON.stringify(payload))
    if (!context.auth || !context.auth.uid) {
      console.log('No auth information present')
      throw new functions.https.HttpsError(
        'permission-denied',
        'Unauthorized Access'
      )
    }

    console.log(`calling email: ${context.auth.token.email}`)

    const { sendTextEmail } = require('../utils/EmailSender')

    const data = {
      to: payload.to,
      bcc: context.auth.token.email,
      subject: payload.subject,
      text: payload.message,
    }

    try {
      const result = await sendTextEmail(data)
      console.log(`sendTextEmail success:: `, result)
      return {
        ...result,
      }
    } catch (error) {
      console.log(`sendTextEmail error:: `, JSON.stringify(error))
      throw new functions.https.HttpsError('unknown', error.message)
    }
  })
