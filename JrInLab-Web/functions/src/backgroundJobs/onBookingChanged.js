const functions = require('firebase-functions')
const uuid = require('uuid')

const {
  sendDiscordNotification,
  getEmbedObject,
} = require('../utils/DiscordHelper')
const { formatDate, formatDateWithZone } = require('../utils/dateHelper')
const { getFirstName } = require('../utils/nameHelper')
const { sendEmail, getEmailConfigs } = require('../utils/EmailSender')

let calendarSvc = null

const entryTitle = (kidsName, kidsAge, parentsName) => {
  return `JrinLab Coding Class - ${kidsName}, ${kidsAge} (${parentsName})`
}

const entryDescription = (kidsName) => {
  return `We've scheduled the demo coding class for ${kidsName} with JrinLab as per your requested date and time.\n\nTo join the class please click on the included Google Meet link from a laptop.\n\nRequest you to please join the class on time.\n\nThanks,\nTeam JrinLab`
}

const getCreateEventData = (payload) => {
  const demoDateTime = payload.schedules.scheduled
  const defaultAttendees = functions.config().google.calendar.def_attendees

  const event = {
    summary: entryTitle(payload.kidsName, payload.kidsAge, payload.parentsName),
    location: payload.classLink,
    description: entryDescription(payload.kidsName),
    start: {
      dateTime: demoDateTime.toDate(),
      timeZone: 'Asia/Kolkata',
    },
    end: {
      dateTime: new Date(demoDateTime.toMillis() + 60 * 60 * 1000), // 1hr from start time
      timeZone: 'Asia/Kolkata',
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'popup', minutes: 60 },
        { method: 'popup', minutes: 15 },
      ],
    },
    conferenceData: {
      createRequest: {
        requestId: uuid.v4(),
        conferenceSolutionKey: { type: 'hangoutsMeet' },
      },
    },
  }

  if (defaultAttendees) {
    const attendees = []
    for (const attendee in defaultAttendees) {
      attendees.push({ email: defaultAttendees[attendee] })
    }

    event.attendees = attendees
  }

  return event
}

const getPatchEventData = (payload) => {
  const demoDateTime = payload.schedules.scheduled

  const event = {
    start: {
      dateTime: demoDateTime.toDate(),
      timeZone: 'Asia/Kolkata',
    },
    end: {
      dateTime: new Date(demoDateTime.toMillis() + 60 * 60 * 1000), // 1hr from start time
      timeZone: 'Asia/Kolkata',
    },
  }

  return event
}

const createCalendarEvent = async (type, payload) => {
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

  if (type === 'create') {
    const event = await calendarSvc.events.insert({
      calendarId: 'primary',
      conferenceDataVersion: 1,
      sendUpdates: 'all',
      resource: getCreateEventData(payload),
    })

    return event.data
  } else if (type === 'update') {
    await calendarSvc.events.patch({
      calendarId: 'primary',
      eventId: payload.calEventId,
      conferenceDataVersion: 1,
      sendUpdates: 'all',
      resource: getPatchEventData(payload),
    })
  }
}

const handleDiscordNotification = async (payload, type, hasError) => {
  const { discord } = functions.config()
  if (discord.hook.demo.enabled === 'true' || hasError) {
    const discordUrl = discord.base_url + discord.hook.demo.url
    const message = hasError
      ? `Failed to send class link email to ${payload.parentsName}'s email id ${payload.parentsEmail}`
      : `Class link email sent to *${payload.parentsName}'s* email id _${payload.parentsEmail}_`

    const embedTitle = `Demo ${type} for ${payload.kidsName}, ${payload.kidsAge}`
    const embedDescription = `Demo Date - __${formatDate(
      payload.schedules.scheduled.toDate()
    )}__`

    const embedFields = []
    if (payload.classLink) {
      embedFields.push({
        name: `Class Link`,
        value: payload.classLink,
      })
    }

    const embedObj = getEmbedObject(
      embedTitle,
      embedDescription,
      embedFields,
      undefined,
      hasError ? 16711680 : 383493
    )

    await sendDiscordNotification(discordUrl, message, embedObj)
  }
}

const handleEmailSend = async (admin, payload, type) => {
  const emailConfig = await getEmailConfigs(admin)
  let emailQueued = false
  if (emailConfig) {
    const formattedDateParts = formatDateWithZone(
      payload.schedules.scheduled,
      payload.schedules.timeZone
    ).split(', ')

    const timeParts = formattedDateParts[2].split(' ')
    const timePart = `${timeParts[0]} ${timeParts[1]}`
    const timeZonePart = timeParts.slice(2).join(' ')

    const commonData = {
      demoDate: `${formattedDateParts[0]}, ${formattedDateParts[1]}`,
      demoTime: `${timePart} (${timeZonePart})`,
      classLink: payload.classLink,
    }

    const recipientsData = [
      {
        name: getFirstName(payload.parentsName),
        email: payload.parentsEmail,
        kidsName: getFirstName(payload.kidsName),
        type,
      },
    ]

    const config = emailConfig['class-link']
    emailQueued = await sendEmail(
      config.subject,
      config.templateName,
      recipientsData,
      commonData,
      emailConfig.service
    )
  }

  return emailQueued
}

const validStatesReschedule = [
  'fresh',
  'retry',
  'future',
  'reschedule',
  'scheduled',
  'enrolled',
]

const getChangeType = (oldData, newData) => {
  let type = 'discard'
  if (
    newData.status === 'scheduled' &&
    validStatesReschedule.includes(oldData.status)
  ) {
    if (!oldData.schedules || !oldData.schedules.scheduled) {
      type = 'scheduled'
    } else if (
      !oldData.schedules.scheduled.isEqual(newData.schedules.scheduled)
    ) {
      type = 'rescheduled'
    } else if (
      oldData.schedules.scheduled.isEqual(newData.schedules.scheduled)
    ) {
      console.log(
        `oldStatus: ${oldData.status}, newStatus: ${newData.status}, timestamp is same`
      )
    }
  }

  return type
}

exports.onBookingChanged = functions
  .region('asia-east2')
  .firestore.document('demos/{demoId}')
  .onUpdate(async (change, context) => {
    const changeType = getChangeType(change.before.data(), change.after.data())
    console.log(`inside onBookingChanged function:: changeType: ${changeType}`)
    const payload = change.after.data()
    if (changeType !== 'discard') {
      console.log('onBookingChanged:: existing classLink: ', payload.classLink)
      const admin = require('../utils/firebaseAdmin').getAdmin()
      if (changeType === 'scheduled') {
        try {
          const eventData = await createCalendarEvent('create', payload)
          if (
            eventData.conferenceData.createRequest.status.statusCode ===
            'success'
          ) {
            payload.classLink = eventData.hangoutLink
            const emailSent = await handleEmailSend(admin, payload, changeType)
            if (emailSent) {
              await handleDiscordNotification(payload, changeType)
            }

            return admin
              .firestore()
              .collection('demos')
              .doc(context.params.demoId)
              .update({
                classLink: eventData.hangoutLink,
                calEventId: eventData.id,
              })
          }
        } catch (error) {
          console.log(error)
        }

        await handleDiscordNotification(payload, changeType, true)
      } else if (changeType === 'rescheduled') {
        console.log(`inside reschedule:: calEventId: ${payload.calEventId}`)
        await createCalendarEvent('update', payload)
        const emailSent = await handleEmailSend(admin, payload, changeType)
        if (emailSent) {
          return handleDiscordNotification(payload, changeType)
        }

        await handleDiscordNotification(payload, changeType, true)
      }
    }

    return null
  })
