const functions = require('firebase-functions')

const getCalendarEventData = (payload, email, demoData, timeInMins) => {
  const demoDateTime = payload.schedule
  const event = {
    summary: `School call: ${demoData.name} (${demoData.role}) for ${demoData.school}`,
    description: `Phone No: ${demoData.phone}\nCRM Link: ${demoData.link}\n\nSummary: ${payload.summary}\nDetails: ${payload.description}`,
    start: {
      dateTime: demoDateTime.toDate(),
      timeZone: 'Asia/Kolkata',
    },
    end: {
      dateTime: new Date(
        demoDateTime.toMillis() + (timeInMins || 10) * 60 * 1000
      ), // 10 mins from start time
      timeZone: 'Asia/Kolkata',
    },
    reminders: {
      useDefault: false,
      overrides: [{ method: 'popup', minutes: 15 }],
    },
    conferenceData: null,
    attendees: [{ email }],
  }

  return event
}

let calendarSvc = null
const createCalendarEvent = async (payload, demoData) => {
  const subject = functions.config().google.service_acc.user

  if (!calendarSvc && subject) {
    const { google } = require('googleapis')
    const path = require('path')

    const auth = new google.auth.GoogleAuth({
      keyFile: path.join(
        __dirname,
        `../${process.env.GCLOUD_PROJECT}.jwt.keys.json`
      ),
      scopes: 'https://www.googleapis.com/auth/calendar',
      clientOptions: { subject },
    })

    const client = await auth.getClient()
    calendarSvc = google.calendar({
      version: 'v3',
      auth: client,
    })
  }

  if (!calendarSvc) {
    console.log(`not able to create calendarSvc:: subject: ${subject}`)
    return
  }

  const admin = require('../utils/firebaseAdmin').getAdmin()
  const authorDetails = await admin.auth().getUser(payload.author.id)

  await calendarSvc.events.insert({
    calendarId: 'c_49kegp1vm9cp0c24d877drmefk@group.calendar.google.com',
    conferenceDataVersion: 1,
    sendUpdates: 'all',
    resource: getCalendarEventData(
      payload,
      authorDetails.email,
      demoData,
      payload.status.new === 'scheduled' ? 60 : 10
    ),
  })
}

exports.onSchoolLogEntry = functions
  .region('asia-east2')
  .firestore.document('partnerships/{requestId}/logs/{logId}')
  .onWrite(async (change, context) => {
    const logId = context.params.logId

    if (!change.after.exists) {
      // The document has been deleted, so bail out
      console.log(
        `LogId: ${logId} no after data exists, seems deleted, so bailing out...`
      )
      return null
    }

    if (!change.before.exists) {
      console.log(`LogId: ${logId} doesn't have old data...it's a create entry`)
    }

    const payload = change.after.data()
    const requestId = context.params.requestId
    const admin = require('../utils/firebaseAdmin').getAdmin()

    let calEventData = null

    try {
      await admin.firestore().runTransaction(async (transaction) => {
        const demoRef = admin
          .firestore()
          .collection('partnerships')
          .doc(requestId)
        const demoSnap = await transaction.get(demoRef)

        if (demoSnap.exists) {
          const demoData = demoSnap.data()
          const FieldValue = admin.firestore.FieldValue

          if (!demoData.logs || !demoData.logs[logId]) {
            const update = {
              updatedAt: FieldValue.serverTimestamp(),
              logCount: FieldValue.increment(1),
            }

            // Without using the dot notation, we will overwrite the logs
            update[`logs.${logId}`] = {
              summary: payload.summary,
              createdAt: payload.createdAt,
              updatedAt: payload.updatedAt,
              author: payload.author,
            }

            if (payload.status) {
              update.status = payload.status.new
              update[`logs.${logId}`].status = payload.status
            }

            if (payload.schedule) {
              update[`schedules.${payload.status.new}`] = payload.schedule
              update[`schedules.timeZone`] = payload.timeZone
              if (
                ['scheduled', 'warm', 'future', 'enrolled'].includes(
                  payload.status.new
                )
              ) {
                calEventData = {
                  name: demoData.name,
                  role: demoData.role,
                  school: demoData.school,
                  phone: `${demoData.country.dialCode}-${demoData.phone}`,
                  link: `https://jrinlab.com/admin/school-requests/${requestId}`,
                }
              }
            }

            return transaction.update(demoRef, update)
          } else if (
            demoData.logs[logId] &&
            payload.summary !== demoData.logs[logId].summary
          ) {
            const update = {
              updatedAt: FieldValue.serverTimestamp(),
            }

            update[`logs.${logId}.summary`] = payload.summary
            update[`logs.${logId}.updatedAt`] = payload.updatedAt

            for (const existingLogId in demoData.logs) {
              let logSummary = demoData.logs[existingLogId].summary
              if (existingLogId === logId) {
                logSummary = payload.summary
              }

              logSummary = logSummary.toLowerCase()
            }

            return transaction.update(demoRef, update)
          } else {
            return Promise.reject(
              new Error(`This log has already been processed`)
            )
          }
        } else {
          return Promise.reject(new Error('No such demo exists...'))
        }
      })

      if (calEventData) {
        await createCalendarEvent(payload, calEventData)
      }
    } catch (error) {
      console.log('onCustomerLogEntry transaction failed with error:: ', error)
    }

    return null
  })
