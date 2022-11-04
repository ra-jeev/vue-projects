const functions = require('firebase-functions')
const {
  sendDiscordNotification,
  getEmbedObject,
} = require('../utils/DiscordHelper')
const { formatDate } = require('../utils/dateHelper')
const { getFirstName } = require('../utils/nameHelper')
const {
  sendEmail,
  sendPlainTextEmail,
  getEmailConfigs,
} = require('../utils/EmailSender')

const CONFIG_SHEET_ID = functions.config().spreadsheet.id
const DEMO_SHEET_NAME = functions.config().spreadsheet.demo_sheet
// const CONTACT_SHEET_NAME = functions.config().spreadsheet.contact_sheet

const handleDiscordNotification = async (payload, hasError, isSilent) => {
  const { discord } = functions.config()
  if (discord.hook.demo.enabled === 'true') {
    const discordUrl = discord.base_url + discord.hook.demo.url
    const message = `_Woohoo!_ We've just received a new demo request 🚀.`

    const embedTitle = hasError
      ? `Failed to queue welcome email`
      : isSilent
      ? `No welcome email sent for this request`
      : `Welcome email queued successfully`
    const embedDescription = `Request received through **${payload.page.toUpperCase()} page**`
    const embedFields = [
      {
        name: `Parent's Name`,
        value: payload.parentsName,
        inline: true,
      },
      {
        name: `Parent's Email Id`,
        value: payload.parentsEmail,
        inline: true,
      },
      {
        name: `Parent's Mobile No.`,
        value: `${payload.country ? payload.country.dialCode + '-' : ''}${
          payload.parentsPhone
        }`,
        inline: true,
      },
      {
        name: `Kid's Name`,
        value: payload.kidsName,
        inline: true,
      },
      {
        name: `Kid's Age`,
        value: payload.kidsAge,
        inline: true,
      },
    ]

    if (payload.query && Object.keys(payload.query).length) {
      embedFields.push({
        name: 'UTM Info',
        value: JSON.stringify(payload.query),
      })
    }

    const embedObj = getEmbedObject(
      embedTitle,
      embedDescription,
      embedFields,
      undefined,
      hasError ? 16711680 : undefined
    )

    await sendDiscordNotification(discordUrl, message, embedObj)
  }
}

const handleEmailSend = async (admin, payload) => {
  const emailConfig = await getEmailConfigs(admin)
  console.log(`emailConfig: ${JSON.stringify(emailConfig)}`)

  let emailQueued = false
  if (emailConfig) {
    let configKey = 'default'
    let commonData = null

    if (payload.workshopName) {
      commonData = {}
      commonData.workshopName = payload.workshopName
      commonData.workshopFee = payload.workshopFee

      configKey = 'workshop'
    } else if (payload.schoolWebinar) {
      configKey = 'webinar'
    } else if (emailConfig[payload.page]) {
      configKey = payload.page
    }

    const config = emailConfig[configKey]
    const defaultConfig = emailConfig.default
    console.log(
      `configKey: ${configKey}, finalConfig: ${JSON.stringify(config)}`
    )

    const recipientsData = [
      {
        name: getFirstName(payload.parentsName),
        email: payload.parentsEmail,
        kidsName: getFirstName(payload.kidsName),
      },
    ]

    let message
    if (payload.page === 'vedic-maths') {
      recipientsData[0].timeSlot = payload.timeSlot.label
      const slot = config[payload.timeSlot.value]
      if (slot) {
        recipientsData[0].classLink = slot.classLink
        message = slot.message
      }
    }

    const subject = config.subject || defaultConfig.subject
    if (config.templateName) {
      emailQueued = await sendEmail(
        subject,
        config.templateName,
        recipientsData,
        commonData,
        emailConfig.service
      )
    } else if (message) {
      emailQueued = await sendPlainTextEmail(
        subject,
        message,
        recipientsData,
        commonData,
        emailConfig.service
      )
    }
  }

  return emailQueued
}

const handleLeadsMeta = async (admin, payload) => {
  try {
    await admin.firestore().runTransaction(async (transaction) => {
      const leadsMetaRef = admin.firestore().collection('meta').doc('leads')
      const leadsMetaSnap = await transaction.get(leadsMetaRef)
      if (leadsMetaSnap.exists) {
        const existingMeta = leadsMetaSnap.data()
        const FieldValue = admin.firestore.FieldValue
        const query = payload.query

        const source = query.utm_source || 'Unknown'
        const campaign = query.utm_campaign || 'Unknown'
        const medium = query.utm_medium || 'Unknown'
        const term = query.utm_term || 'Unknown'
        const content = query.utm_content || 'Unknown'
        const page = payload.page || 'Unknown'

        const update = {}
        if (!existingMeta.pages.includes(page)) {
          update.pages = FieldValue.arrayUnion(page)
        }

        if (
          !existingMeta.campaigns[`${campaign}`] ||
          !existingMeta.campaigns[`${campaign}`].includes(source)
        ) {
          update[`campaigns.${campaign}`] = FieldValue.arrayUnion(source)
        }

        if (
          !existingMeta.sources[`${source}`] ||
          !existingMeta.sources[`${source}`].includes(campaign)
        ) {
          update[`sources.${source}`] = FieldValue.arrayUnion(campaign)
        }

        if (!existingMeta.medium.includes(medium)) {
          update.medium = FieldValue.arrayUnion(medium)
        }

        if (!existingMeta.content.includes(content)) {
          update.content = FieldValue.arrayUnion(content)
        }

        if (!existingMeta.terms.includes(term)) {
          update.terms = FieldValue.arrayUnion(term)
        }

        console.log(
          `final update object for leads meta:: ${JSON.stringify(update)}`
        )

        if (Object.keys(update).length) {
          return transaction.update(leadsMetaRef, update)
        }
      }
    })
  } catch (error) {
    console.log('handleLeadsMeta failed with error: ', error)
  }
}

exports.onBookDemo = functions
  .region('asia-east2')
  .firestore.document('demos/{demoId}')
  .onCreate(async (snap, context) => {
    const payload = snap.data()
    const skipEmail = payload.skipEmail

    const sheetsService =
      await require('../utils/googleSheets').getSheetsService()
    const admin = require('../utils/firebaseAdmin').getAdmin()

    try {
      await sheetsService.values.append({
        spreadsheetId: CONFIG_SHEET_ID,
        range: `'${DEMO_SHEET_NAME}'!A:L`,
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        resource: {
          values: [
            [
              context.params.demoId,
              formatDate(payload.createdAt),
              payload.page,
              payload.parentsName,
              payload.parentsEmail,
              payload.parentsPhone,
              payload.kidsName,
              payload.kidsAge,
              payload.status,
            ],
          ],
        },
      })

      if (payload.query && payload.query.ref_id) {
        const affiliates = functions.config().spreadsheet.affiliates
        if (affiliates) {
          const affiliate = Object.values(affiliates).find(
            (afs) => afs.ref_id === payload.query.ref_id
          )

          if (affiliate) {
            await sheetsService.values.append({
              spreadsheetId: affiliate.sheet_id,
              range: `Sheet1!A:F`,
              valueInputOption: 'USER_ENTERED',
              insertDataOption: 'INSERT_ROWS',
              resource: {
                values: [
                  [
                    context.params.demoId,
                    formatDate(payload.createdAt),
                    payload.parentsName,
                    `'${payload.country.dialCode}-${payload.parentsPhone}`,
                    `${payload.kidsName}, ${payload.kidsAge}`,
                    'Fresh',
                  ],
                ],
              },
            })
          }
        }
      }
    } catch (error) {
      console.log(`failed to write to spreadsheet:: ${error.message}`)
    }

    try {
      const searchable = [
        `${payload.country.dialCode}-${payload.parentsPhone}`,
        payload.parentsPhone,
        payload.parentsEmail,
        payload.parentsName,
        ...payload.parentsName.split(' '),
        payload.kidsName,
        ...payload.kidsName.split(' '),
      ]

      const info = new Set()
      searchable.forEach((term) => {
        term = term.toLowerCase()
        for (let index = 1; index <= term.length; index++) {
          info.add(term.substring(0, index))
        }
      })

      const update = {}
      update[`searchable.info`] = Array.from(info)
      if (skipEmail) {
        update.skipEmail = admin.firestore.FieldValue.delete()
      }

      await admin
        .firestore()
        .collection('demos')
        .doc(context.params.demoId)
        .update(update)

      if (payload.query || payload.page) {
        await handleLeadsMeta(admin, payload)
      }
    } catch (error) {
      console.log('Failed to update searchable or leads meta...', error)
    }

    if (!skipEmail) {
      const emailSent = await handleEmailSend(admin, payload)
      if (emailSent) {
        try {
          await handleDiscordNotification(payload)
        } catch (error) {
          console.log(
            'failed to send discord notification for class link:: ',
            error
          )
        }

        return null
      }

      await handleDiscordNotification(payload, true)
    } else {
      console.log(
        `${payload.parentsName}: No email notification as skipEmail ${skipEmail}`
      )

      try {
        await handleDiscordNotification(payload, false, true)
      } catch (error) {
        console.log(
          'failed to send discord notification for class link:: ',
          error
        )
      }
    }

    return null
  })
