const functions = require('firebase-functions')

const ignoreMeta = true

const handleMetaChange = (metaDetail, metaUpdate) => {
  if (!ignoreMeta) {
    metaDetail = metaDetail.toLowerCase().split(/[.,/="';:?\s|_-]/g)
    metaDetail.forEach((word) => {
      if (word) {
        metaUpdate.add(word)
      }
    })
  }
}

const handleInfoChange = (infoDetail, infoUpdate) => {
  infoDetail = infoDetail.toLowerCase()
  for (let index = 1; index <= infoDetail.length; index++) {
    infoUpdate.add(infoDetail.substring(0, index))
  }
}

const handleInfoFieldsChange = (key, data, update) => {
  if (key === 'otherContacts') {
    const otherContacts = data.otherContacts
    if (otherContacts) {
      otherContacts.forEach((contact) => {
        handleInfoChange(contact.phoneNo, update)
        handleInfoChange(
          `${contact.country.dialCode}-${contact.phoneNo}`,
          update
        )
      })
    }
  } else if (key === 'otherEmails') {
    const otherEmails = data.otherEmails
    if (otherEmails) {
      otherEmails.forEach((contact) => {
        handleInfoChange(contact.address, update)
      })
    }
  } else if (key === 'parentsPhone') {
    handleInfoChange(data.parentsPhone, update)
    handleInfoChange(`${data.country.dialCode}-${data.parentsPhone}`, update)
  } else {
    if (key === 'parentsName' || key === 'kidsName') {
      const names = data[key].split(' ')
      names.forEach((name) => {
        handleInfoChange(name, update)
      })
    }
    handleInfoChange(data[key], update)
  }
}

const getCalendarEventData = (payload, email, demoData) => {
  const demoDateTime = payload.schedule
  const event = {
    summary: `Customer call: ${demoData.parentsName} for ${demoData.kidsName}, ${demoData.kidsAge}`,
    description: `Phone No: ${demoData.parentsPhone}\nCRM Link: ${demoData.link}\n\nSummary: ${payload.summary}\nDetails: ${payload.description}`,
    start: {
      dateTime: demoDateTime.toDate(),
      timeZone: 'Asia/Kolkata',
    },
    end: {
      dateTime: new Date(demoDateTime.toMillis() + 10 * 60 * 1000), // 10 mins from start time
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
    resource: getCalendarEventData(payload, authorDetails.email, demoData),
  })
}

exports.onCustomerLogEntry = functions
  .region('asia-east2')
  .firestore.document('demos/{demoId}/logs/{logId}')
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
    const demoId = context.params.demoId
    const admin = require('../utils/firebaseAdmin').getAdmin()

    let calEventData = null

    try {
      await admin.firestore().runTransaction(async (transaction) => {
        const demoRef = admin.firestore().collection('demos').doc(demoId)
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

            if (payload.language) {
              update.languages = FieldValue.arrayUnion(payload.language)
            }

            if (payload.discounts && payload.discounts.length) {
              update.discounts = FieldValue.arrayUnion(...payload.discounts)
            }

            if (payload.tags && payload.tags.length) {
              update.tags = FieldValue.arrayUnion(...payload.tags)
              const tagsUpdate = {
                tags: FieldValue.arrayUnion(...payload.tags),
              }

              await admin
                .firestore()
                .collection('meta')
                .doc('global')
                .update(tagsUpdate)
            }

            if (payload.schedule) {
              update[`schedules.${payload.status.new}`] = payload.schedule
              update[`schedules.timeZone`] = payload.timeZone
              if (['warm', 'future', 'enrolled'].includes(payload.status.new)) {
                calEventData = {
                  parentsName: demoData.parentsName,
                  kidsName: demoData.kidsName,
                  kidsAge: demoData.kidsAge,
                  parentsPhone: `${demoData.country.dialCode}-${demoData.parentsPhone}`,
                  link: `https://jrinlab.com/admin/demo-requests/${demoId}`,
                }
              }
            }

            const metaUpdate = new Set()
            const infoUpdate = new Set()
            const validInfoKeys = [
              'parentsName',
              'kidsName',
              'parentsPhone',
              'parentsEmail',
              'otherContacts',
              'otherEmails',
            ]

            if (payload.data) {
              const dataKeys = Object.keys(payload.data)
              for (const key of dataKeys) {
                update[key] = payload.data[key]
                if (key === 'metaInfo') {
                  handleMetaChange(payload.data.metaInfo, metaUpdate)
                } else if (validInfoKeys.includes(key)) {
                  handleInfoFieldsChange(key, payload.data, infoUpdate)
                  const index = validInfoKeys.indexOf(key)
                  validInfoKeys.splice(index, 1)
                }
              }
            }

            const metaDetail = payload.summary.toLowerCase()
            if (metaDetail !== 'customer details changed') {
              handleMetaChange(metaDetail, metaUpdate)
            }

            if (infoUpdate.size) {
              for (const key of validInfoKeys) {
                handleInfoFieldsChange(key, demoData, infoUpdate)
              }
            }

            if (infoUpdate.size) {
              update[`searchable.info`] = Array.from(infoUpdate)
            }

            if (metaUpdate.size) {
              update[`searchable.meta`] = FieldValue.arrayUnion(
                ...Array.from(metaUpdate)
              )
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

            const metaUpdate = new Set()
            if (demoData.metaInfo) {
              handleMetaChange(demoData.metaInfo, metaUpdate)
            }

            for (const existingLogId in demoData.logs) {
              let logSummary = demoData.logs[existingLogId].summary
              if (existingLogId === logId) {
                logSummary = payload.summary
              }

              logSummary = logSummary.toLowerCase()
              if (logSummary !== 'customer details changed') {
                handleMetaChange(logSummary, metaUpdate)
              }
            }

            if (metaUpdate.size) {
              update[`searchable.meta`] = Array.from(metaUpdate)
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
