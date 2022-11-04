const axios = require('axios')

exports.handler = async (event) => {
  const { FORM_DISCORD_WEBHOOK } = process.env
  const payload = JSON.parse(event.body).payload

  const embedObj = {
    title: `${payload.form_name.toUpperCase()} Submission`,
    description: `Referrer: __${payload.data.referrer}__`,
    timestamp: new Date(),
    color: 7103487,
    fields: [
      {
        name: 'Email Address',
        value: payload.data.email,
        inline: true,
      },
    ],
    footer: {
      text: `Form submitted`,
    },
  }

  if (payload.data.phone && payload.data.phone !== 'null') {
    embedObj.fields.push({
      name: 'Mobile number',
      value: payload.data.phone,
      inline: true,
    })
  }

  if (payload.form_name === 'contact-form') {
    embedObj.fields.push(
      { name: 'Full Name', value: payload.data.name, inline: true },
      { name: 'User Message: ', value: payload.data.message }
    )
  }

  try {
    await axios.post(FORM_DISCORD_WEBHOOK, {
      content: `_Woohoo!_ We just received a new form submission from __***${payload.data.email}***__`,
      embeds: [embedObj],
    })
  } catch (error) {
    console.log('discord webhook failed:: ==================')
    console.log(error)
  }
}
