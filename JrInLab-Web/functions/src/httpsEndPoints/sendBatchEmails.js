const functions = require('firebase-functions')

exports.sendBatchEmails = functions
  .region('asia-east2')
  .https.onCall(async (payload, context) => {
    // const payload = req.body

    console.log(`sendBatchEmails enter:: `, JSON.stringify(payload))
    if (!context.auth || !context.auth.uid) {
      console.log('No auth information present')
      throw new functions.https.HttpsError(
        'permission-denied',
        'Unauthorized Access'
      )
    }

    console.log(`calling email: ${context.auth.token.email}`)

    if (
      !payload.to ||
      !payload.recipientData ||
      !payload.subject ||
      !payload.message
    ) {
      console.log('Invalid payload object')
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Missing required fields'
      )

      // return res.status(400).send({
      //   message: `Missing subject, message or filter fields`,
      // })
    }

    const { sendTextEmail } = require('../utils/EmailSender')

    const data = {
      to: payload.to,
      subject: payload.subject,
      text: payload.message,
      'recipient-variables': payload.recipientData,
    }

    try {
      if (payload.send) {
        const result = await sendTextEmail(data)
        console.log(`sendTextEmail success:: `, result)
        return {
          ...result,
        }
        // return res.status(200).send({
        //   ...result,
        //   data: recipientVariables,
        // })
      } else {
        return {
          message: 'Did not send the emails',
        }

        // return res.status(200).send({
        //   message: 'Did not send the emails',
        //   data: recipientVariables,
        // })
      }
    } catch (error) {
      console.log(`sendBatchEmails error:: `, JSON.stringify(error))
      throw new functions.https.HttpsError('unknown', error.message)
      // return res.status(500).send(JSON.stringify(error))
    }
  })
