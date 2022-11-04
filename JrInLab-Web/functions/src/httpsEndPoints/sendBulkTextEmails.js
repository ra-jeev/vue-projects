const functions = require('firebase-functions')

exports.sendBulkTextEmails = functions
  .region('asia-east2')
  .https.onCall(async (payload, context) => {
    // const payload = req.body

    console.log(`sendBulkTextEmails enter:: `, JSON.stringify(payload))
    if (!context.auth || !context.auth.uid) {
      console.log('No auth information present')
      throw new functions.https.HttpsError(
        'permission-denied',
        'Unauthorized Access'
      )
    }

    console.log(`calling email: ${context.auth.token.email}`)

    if (!payload.filters || !payload.subject || !payload.message) {
      console.log('Invalid payload object')
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Missing required fields'
      )

      // return res.status(400).send({
      //   message: `Missing subject, message or filter fields`,
      // })
    }

    const admin = require('../utils/firebaseAdmin').getAdmin()
    const { getFirstName } = require('../utils/nameHelper')

    const demosRef = admin.firestore().collection('demos')

    let query = demosRef
    for (const filter of payload.filters) {
      query = query.where(filter.field, filter.clause, filter.value)
    }

    const snapshots = await query.get()

    console.log(`initial result size: ${snapshots.size}`)
    const recipientVariables = {}
    const rejectedEntries = []
    const emailList = new Set()
    snapshots.forEach((doc) => {
      const data = doc.data()

      if (data.query && data.query.utm_source === 'an') {
        console.log(`skipping audience network source: ${data.parentsName}`)
        rejectedEntries.push({
          name: data.parentsName,
          reason: 'an',
          email: data.parentsEmail,
          id: doc.id,
          kidsName: data.kidsName,
        })
      } else if (!emailList.has(data.parentsEmail)) {
        emailList.add(data.parentsEmail)

        recipientVariables[data.parentsEmail] = {
          name: getFirstName(data.parentsName),
          kidsName: getFirstName(data.kidsName),
        }
      } else {
        console.log(`duplicate entry for :: ${data.parentsEmail}`)
        rejectedEntries.push({
          name: data.parentsName,
          reason: 'duplicate',
          email: data.parentsEmail,
          id: doc.id,
          kidsName: data.kidsName,
        })
      }
    })

    const { sendTextEmail } = require('../utils/EmailSender')

    console.log('final customer length: ', emailList.size)
    const emails = Array.from(emailList)

    const MAX_SIZE = 500
    const promises = []
    const resultData = []
    if (emailList.size > MAX_SIZE) {
      for (let index = 0; index < emailList.size; index = index + MAX_SIZE) {
        let end = index + MAX_SIZE
        if (end > emailList.size) {
          end = emailList.size
        }

        const emailsSubset = emails.slice(index, end)

        const localRecVars = {}
        for (const email of emailsSubset) {
          localRecVars[email] = recipientVariables[email]
        }

        const data = {
          to: emailsSubset,
          subject: payload.subject,
          text: payload.message,
          'recipient-variables': localRecVars,
        }

        resultData.push({ to: emailsSubset, data: localRecVars })
        if (payload.send) {
          const promise = sendTextEmail(data)
          promises.push(promise)
        }

        console.log(`sending batch email for index: ${index} - ${end}`)
        console.log(`recipientsData:: ${JSON.stringify(data)}`)
      }
    } else {
      const data = {
        to: emails,
        bcc: 'rajeev@jrinlab.com',
        subject: payload.subject,
        text: payload.message,
        'recipient-variables': recipientVariables,
      }

      resultData.push({ ...recipientVariables })
      if (payload.send) {
        const promise = sendTextEmail(data)
        promises.push(promise)
      }
    }

    console.log(`before sending promises length:: ${promises.length}`)

    try {
      if (payload.send) {
        const result = await Promise.all(promises)
        console.log(`sendTextEmail success:: `, result)
        return {
          ...result,
          data: resultData,
        }
        // return res.status(200).send({
        //   ...result,
        //   data: recipientVariables,
        // })
      } else {
        return {
          message: 'Did not send the emails',
          data: resultData,
        }

        // return res.status(200).send({
        //   message: 'Did not send the emails',
        //   data: recipientVariables,
        // })
      }
    } catch (error) {
      console.log(`sendBulkTextEmails error:: `, JSON.stringify(error))
      throw new functions.https.HttpsError('unknown', error.message)
      // return res.status(500).send(JSON.stringify(error))
    }
  })
