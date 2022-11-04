const axios = require('axios')

exports.handler = async (event) => {
  const { DEPLOY_DISCORD_WEBHOOK } = process.env
  const payload = JSON.parse(event.body).payload

  const mins = Math.floor(payload.deploy_time / 60)
  const secs = payload.deploy_time % 60

  const embedObj = {
    title: `Build deployed in ${mins}m ${secs}s from ${payload.branch.toUpperCase()} branch`,
    description: `Deploy URL: __${payload.deploy_ssl_url}__`,
    timestamp: new Date(payload.published_at),
    color: 383493,
    fields: [
      {
        name: 'Build Id',
        value: payload.build_id,
      },
    ],
    footer: {
      text: `Build deployed`,
    },
  }

  try {
    await axios.post(DEPLOY_DISCORD_WEBHOOK, {
      content: `Build deployed in ${mins}m ${secs}s from branch **${payload.branch}**, build id: ${payload.build_id}`,
      embeds: [embedObj],
    })
  } catch (error) {
    console.log('discord webhook failed:: ==================')
    console.log(error)
  }
}
