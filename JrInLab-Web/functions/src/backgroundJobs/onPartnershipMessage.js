const functions = require('firebase-functions')
const {
  sendDiscordNotification,
  getEmbedObject,
} = require('../utils/DiscordHelper')

const handleDiscordNotification = async (payload) => {
  const { discord } = functions.config()
  if (discord.hook.contact.enabled === 'true') {
    const discordUrl = discord.base_url + discord.hook.contact.url
    const message = `New PARTNERSHIP message received from **${payload.name}**`

    const embedTitle = `Partnership form submission`
    const embedDescription = `Request received through SCHOOL-PARTNERSHIPS page`
    const embedFields = [
      {
        name: `Contact Name`,
        value: payload.name,
        inline: true,
      },
      {
        name: `Role at School`,
        value: payload.role,
        inline: true,
      },
      {
        name: `Mobile No.`,
        value: `${payload.country.dialCode}-${payload.phone}`,
        inline: true,
      },
      {
        name: `School Name`,
        value: payload.school,
        inline: true,
      },
    ]

    if (payload.message) {
      embedFields.push({
        name: `User message`,
        value: payload.message,
      })
    }

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

exports.onPartnershipMessage = functions
  .region('asia-east2')
  .firestore.document('partnerships/{message}')
  .onCreate((snap) => {
    return handleDiscordNotification(snap.data(), true)
  })
