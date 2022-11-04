const functions = require('firebase-functions')
const {
  sendDiscordNotification,
  getEmbedObject,
} = require('../utils/DiscordHelper')

const handleDiscordNotification = async (payload) => {
  const { discord } = functions.config()
  if (discord.hook.contact.enabled === 'true') {
    const discordUrl = discord.base_url + discord.hook.contact.url
    const message = `New contact message received from **${payload.name}**`

    const embedTitle = `Contact form submission`
    const embedDescription = `Request received through CONTACT-US page`
    const embedFields = [
      {
        name: `Full Name`,
        value: payload.name,
        inline: true,
      },
      {
        name: `Email Id`,
        value: payload.email,
        inline: true,
      },
      {
        name: `Mobile No.`,
        value: `${payload.country.dialCode}-${payload.phone}`,
        inline: true,
      },
      {
        name: `User message`,
        value: payload.message,
      },
    ]

    if (payload.query && Object.keys(payload.query).length) {
      embedFields.splice(embedFields.length - 1, 0, {
        name: 'UTM Info',
        value: JSON.stringify(payload.query),
      })
    }

    const embedObj = getEmbedObject(embedTitle, embedDescription, embedFields)

    await sendDiscordNotification(discordUrl, message, embedObj)
  }
}

exports.onContactMessage = functions
  .region('asia-east2')
  .firestore.document('messages/{messageId}')
  .onCreate((snap) => {
    return handleDiscordNotification(snap.data(), true)
  })
