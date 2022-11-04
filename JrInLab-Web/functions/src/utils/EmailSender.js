const functions = require('firebase-functions')

const getSendgridFormatData = (recipients) => {
  if (recipients && Array.isArray(recipients)) {
    const personalizations = []
    for (const recipient of recipients) {
      const data = {
        to: { email: recipient.email, name: recipient.name },
        dynamic_template_data: {},
      }

      for (const [key, value] of Object.entries(recipient)) {
        data.dynamic_template_data[key] = value
      }

      personalizations.push(data)
    }

    return personalizations
  }

  return null
}

const getMailgunFormatData = (recipients) => {
  if (recipients && Array.isArray(recipients)) {
    const formattedData = {
      emails: [],
      data: {},
    }

    for (const recipient of recipients) {
      formattedData.emails.push(recipient.email)
      formattedData.data[recipient.email] = {}

      for (const [key, value] of Object.entries(recipient)) {
        formattedData.data[recipient.email][key] = value
      }
    }

    return formattedData
  }

  return null
}

const handleMailgunSend = async (
  subject,
  template,
  text,
  recipientsData,
  commonData
) => {
  const mailgunConfig = functions.config().email.mailgun
  const senderConfig = functions.config().email.sender
  const mailgun = require('mailgun-js')({
    apiKey: mailgunConfig.api_key,
    domain: mailgunConfig.domain,
  })

  const formattedData = getMailgunFormatData(recipientsData)
  if (formattedData && (template || text)) {
    const data = {
      from: `JrInLab Support <${senderConfig.from}>`,
      to: formattedData.emails,
      subject,
      'recipient-variables': JSON.stringify(formattedData.data),
    }

    if (template) {
      data.template = template
      data['t:text'] = 'yes'
    } else {
      data.text = text
    }

    if (commonData) {
      data['h:X-Mailgun-Variables'] = JSON.stringify(commonData)
    }

    try {
      const response = await mailgun.messages().send(data)
      console.log(response)

      return !!response.id
    } catch (error) {
      console.log(error)
    }
  }

  return false
}

const handleSendgridSend = async (
  subject,
  template,
  recipientsData,
  commonData
) => {
  const sgMail = require('@sendgrid/mail')
  const senderConfig = functions.config().email.sender
  const sendGridConfig = functions.config().email.sendgrid
  sgMail.setApiKey(sendGridConfig.api_key)

  const formattedData = getSendgridFormatData(recipientsData)
  if (formattedData) {
    const data = {
      personalizations: formattedData,
      from: `JrInLab Support <${senderConfig.from}>`,
      subject,
      templateId: template,
    }

    if (commonData) {
      data.dynamic_template_data = commonData
    }

    try {
      await sgMail.send(data)
      return true
    } catch (error) {
      const { message, code, response } = error
      console.log(
        `email send to ${JSON.stringify(
          recipientsData
        )} failed with code:: ${code} - ${message}`
      )
      if (response) {
        console.log(JSON.stringify(response))
      }
    }
  }

  return false
}

exports.sendTextEmail = async (emailData) => {
  const emailConfig = functions.config().email
  const senderConfig = emailConfig.sender
  if (senderConfig.service === 'mailgun') {
    const mailgunConfig = emailConfig.mailgun
    const mailgun = require('mailgun-js')({
      apiKey: mailgunConfig.api_key,
      domain: mailgunConfig.domain,
    })

    const data = {
      from: `JrinLab Support <${senderConfig.from}>`,
      ...emailData,
    }

    try {
      const response = await mailgun.messages().send(data)
      console.log(response)

      return response
    } catch (error) {
      console.log(error)
      return error
    }
  }

  return {
    message: `Some error, senderConfig.service: ${senderConfig.service}`,
  }
}

exports.sendEmail = async (
  subject,
  template,
  recipientsData,
  commonData,
  service
) => {
  let result = false

  if (service === 'mailgun') {
    result = await handleMailgunSend(
      subject,
      template,
      null,
      recipientsData,
      commonData
    )
  } else if (service === 'sendgrid') {
    result = await handleSendgridSend()
  }

  return result
}

exports.sendPlainTextEmail = async (
  subject,
  text,
  recipientsData,
  commonData,
  service
) => {
  let result = false

  if (service === 'mailgun') {
    result = await handleMailgunSend(
      subject,
      null,
      text,
      recipientsData,
      commonData
    )
  }

  return result
}

let emailServiceConfig = null
exports.getEmailConfigs = async (admin) => {
  if (!emailServiceConfig) {
    const emailConfigsSnap = await admin
      .firestore()
      .collection('meta')
      .doc('emails')
      .get()

    if (emailConfigsSnap.exists) {
      const service = emailConfigsSnap.data().service
      emailServiceConfig = {
        service,
        ...emailConfigsSnap.data()[service],
      }
    }
  }

  return emailServiceConfig
}
