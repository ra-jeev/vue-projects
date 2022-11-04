const axios = require('axios')

const defaultAuthor = {
  name: '🦄 Admins at JrinLab',
}

exports.getEmbedObject = (
  title,
  description,
  fields,
  author = defaultAuthor,
  color = 7103487
) => {
  const embedObject = {
    title,
    description,
    author,
    timestamp: new Date(),
    color,
  }

  if (fields) {
    embedObject.fields = fields
  }

  return embedObject
}

exports.sendDiscordNotification = async (webhookUrl, message, embedObj) => {
  try {
    await axios.post(webhookUrl, {
      content: message,
      embeds: [embedObj],
    })
  } catch (error) {
    console.log(error)
  }
}
