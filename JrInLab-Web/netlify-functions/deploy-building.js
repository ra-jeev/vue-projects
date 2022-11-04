const axios = require('axios')

exports.handler = async (event) => {
  const { DEPLOY_DISCORD_WEBHOOK } = process.env
  const payload = JSON.parse(event.body).payload

  const embedObj = {
    title: `New build from ${payload.branch.toUpperCase()} branch`,
    description: `Deploy URL: __${payload.deploy_ssl_url}__`,
    timestamp: new Date(payload.updated_at),
    color: 16753920,
    fields: [
      {
        name: 'Commit Message',
        value: payload.title,
      },
      {
        name: 'Commit Ref',
        value: payload.commit_ref,
      },
      {
        name: 'Build Id',
        value: payload.build_id,
      },
    ],
    footer: {
      text: `Build started`,
    },
  }

  try {
    await axios.post(DEPLOY_DISCORD_WEBHOOK, {
      content: `New build started from branch **${payload.branch}**, build id: ${payload.build_id}`,
      embeds: [embedObj],
    })
  } catch (error) {
    console.log('discord webhook failed:: ==================')
    console.log(error)
  }
}
