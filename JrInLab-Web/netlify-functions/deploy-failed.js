const axios = require('axios')

exports.handler = async (event) => {
  const { DEPLOY_DISCORD_WEBHOOK } = process.env
  const payload = JSON.parse(event.body).payload

  const embedObj = {
    title: `Build failed on ${payload.branch.toUpperCase()} branch`,
    description: `Error: **${payload.error_message}**`,
    timestamp: new Date(payload.updated_at),
    color: 16711680,
    fields: [
      {
        name: 'Build Id',
        value: payload.build_id,
      },
    ],
    footer: {
      text: `Build failed`,
    },
  }

  try {
    await axios.post(DEPLOY_DISCORD_WEBHOOK, {
      content: `Build failed on branch **${payload.branch}**, build id:: ${payload.build_id}`,
      embeds: [embedObj],
    })
  } catch (error) {
    console.log('discord webhook failed:: ==================')
    console.log(error)
  }
}
