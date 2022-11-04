'use strict';

const mailgun = require('mailgun-js')({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_TRANSACTIONAL_SENDER_DOMAIN,
});
const { sendSnsMessage } = require('/opt/nodejs/snsMessage');
const fromEmail = process.env.TRANSACTIONAL_SEND_FROM_EMAIL;

const emailConfig = {
  'vedic-maths': {
    subject:
      "%recipient.name%, welcome to Manu Tripathi's Vedic Maths workshop with JrInLab",
    '120621-1600': {
      message:
        "Dear %recipient.name%,\n\nWe're thrilled to have %recipient.kidsName%'s registration for Manu Tripathi's Vedic Maths camp in association with JrInLab.\n\nThe camp will be conducted on June 12-17, 2021 (except Sunday, June 13), %recipient.timeSlot%.\n\nPlease note that the first session of the camp is free for all. You child can continue attending rest of the sessions after paying the camp fees.\n\nClass joining link for the first session: %recipient.classLink%\n\nA new link will be shared separately for rest of the sessions.\n\nFor any queries you can also reach out to us (Call / WhatsApp) at +91-8791727027 or reply to this email.\n\nCheers,\nThe JrInLab Team\n\nP. S. Can you do us a favour? Please help us spread the word and share the camp registration link with other parents like yourself. Camp Registration link: https://bit.ly/2SLgwsX",
      classLink: 'https://meet.google.com/fhc-ibra-hig',
    },
    '200721-1700': {
      classLink: 'https://meet.google.com/bfr-berb-cfa',
      message:
        "Dear %recipient.name%,\n\nWe're thrilled to have %recipient.kidsName%'s registration for Manu Tripathi's Vedic Maths workshop in association with JrInLab.\n\nThe workshop will be conducted between July 20-24, 2021, %recipient.timeSlot%. The class joining link will be shared with confirmed participants 24 hrs prior to the first session.\n\nWe'll get in touch with you on your mobile number to complete the registration formalities.\n\nFor any help/queries you can reach out to us (Call/WhatsApp) at +91-8791727027, or simply reply to this email.\n\nCheers,\nThe JrInLab Team\n\nP. S. Can you do us a favour? Please help us spread the word and share the camp registration link https://bit.ly/3wvfgbw with other parents like yourself.",
    },
    '120621-1100': {
      message:
        "Dear %recipient.name%,\n\nWe're thrilled to have %recipient.kidsName%'s registration for Manu Tripathi's Vedic Maths camp in association with JrInLab.\n\nThe camp will be conducted on June 12-17, 2021 (except Sunday, June 13), %recipient.timeSlot%.\n\nPlease note that the first session of the camp is free for all. You child can continue attending rest of the sessions after paying the camp fees.\n\nClass joining link for the first session: %recipient.classLink%\n\nA new link will be shared separately for rest of the sessions.\n\nFor any queries you can also reach out to us (Call / WhatsApp) at +91-8791727027 or reply to this email.\n\nCheers,\nThe JrInLab Team\n\nP. S. Can you do us a favour? Please help us spread the word and share the camp registration link with other parents like yourself. Camp Registration link: https://bit.ly/2SLgwsX",
      classLink: 'https://meet.google.com/tkz-mqqn-uet',
    },
  },
  'sg-coding-camp-2021': {
    templateName: 'winter-sg',
  },
  webinar: {
    templateName: 'webinar',
  },
  'summer-camp': {
    templateName: 'summer',
  },
  'kids-winter-camp-2021': {
    templateName: 'us-winter-camp',
  },
  payment: {
    templateName: 'payment',
    subject:
      'Payment receipt for your successful #codeagame workshop registration with JrinLab',
  },
  workshop: {
    templateName: 'workshop',
  },
  'sg-summer-camp': {
    templateName: 'summer-sg',
  },
  'camp-link': {
    subject: "%recipient.kidsName%'s %recipient.campName% joining details",
    templateName: 'camp-link',
  },
  default: {
    subject: '%recipient.name%, welcome to JrInLab',
    templateName: 'welcome',
  },
  'class-link': {
    subject:
      "%recipient.kidsName%'s coding class %recipient.type% successfully",
    templateName: 'class-link',
  },
};

const getMailgunFormatData = (recipients) => {
  if (recipients && Array.isArray(recipients)) {
    const formattedData = {
      emails: [],
      data: {},
    };

    for (const recipient of recipients) {
      formattedData.emails.push(recipient.email);
      formattedData.data[recipient.email] = {};

      for (const [key, value] of Object.entries(recipient)) {
        formattedData.data[recipient.email][key] = value;
      }
    }

    return formattedData;
  }

  return null;
};

const handleMailgunSend = async (
  subject,
  template,
  text,
  recipientsData,
  commonData
) => {
  const formattedData = getMailgunFormatData(recipientsData);
  if (formattedData && (template || text)) {
    const data = {
      from: `JrInLab Support <${fromEmail}>`,
      to: formattedData.emails,
      subject,
      'recipient-variables': JSON.stringify(formattedData.data),
    };

    if (template) {
      data.template = template;
      data['t:text'] = 'yes';
    } else {
      data.text = text;
    }

    if (commonData) {
      data['h:X-Mailgun-Variables'] = JSON.stringify(commonData);
    }

    try {
      const response = await mailgun.messages().send(data);
      console.log(response);

      return !!response.id;
    } catch (error) {
      console.log(error);
    }
  }

  return false;
};

const sendTextEmail = async (emailData) => {
  const data = {
    from: `JrInLab Support <${fromEmail}>`,
    ...emailData,
  };

  try {
    const response = await mailgun.messages().send(data);
    console.log(response);

    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const sendEmail = async (subject, template, recipientsData, commonData) => {
  return await handleMailgunSend(
    subject,
    template,
    null,
    recipientsData,
    commonData
  );
};

const sendPlainTextEmail = async (
  subject,
  text,
  recipientsData,
  commonData
) => {
  return await handleMailgunSend(
    subject,
    null,
    text,
    recipientsData,
    commonData
  );
};

const sendAuthEmail = async (payload) => {
  const data = {
    to: payload.toEmail,
    subject: payload.subject,
    text: payload.message,
  };

  if (payload.html) {
    data.html = payload.html;
  }

  return await sendTextEmail(data);
};

const getFirstName = (name) => {
  const nameParts = name.split(' ');
  let firstName = nameParts[0].toLowerCase();

  if (
    firstName.length <= 3 ||
    firstName.startsWith('mr') ||
    firstName.startsWith('dr') ||
    firstName.startsWith('ms') ||
    firstName.startsWith('mrs')
  ) {
    firstName = nameParts[1] ? `${nameParts[0]} ${nameParts[1]}` : nameParts[0];
  } else {
    firstName = nameParts[0];
  }

  return firstName;
};

const formatDateWithZone = (date, timeZone) => {
  const tDateFormatter = new Intl.DateTimeFormat('en', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZone: timeZone || 'Asia/Kolkata',
    timeZoneName: 'long',
  });

  return tDateFormatter.format(new Date(date));
};

const sendWelcomeEmail = async (payload) => {
  let emailQueued = false;
  let configKey = 'default';
  let commonData = null;

  if (payload.workshopName) {
    commonData = {};
    commonData.workshopName = payload.workshopName;
    commonData.workshopFee = payload.workshopFee;

    configKey = 'workshop';
  } else if (payload.schoolWebinar) {
    configKey = 'webinar';
  } else if (emailConfig[payload.page]) {
    configKey = payload.page;
  }

  const config = emailConfig[configKey];
  const defaultConfig = emailConfig.default;
  console.log(
    `configKey: ${configKey}, finalConfig: ${JSON.stringify(config)}`
  );

  const recipientsData = [
    {
      name: getFirstName(payload.parentsName),
      email: payload.parentsEmail,
      kidsName: getFirstName(payload.kidsName),
    },
  ];

  let message;
  if (payload.page === 'vedic-maths') {
    recipientsData[0].timeSlot = payload.timeSlot.label;
    const slot = config[payload.timeSlot.value];
    if (slot) {
      recipientsData[0].classLink = slot.classLink;
      message = slot.message;
    }
  }

  const subject = config.subject || defaultConfig.subject;
  if (config.templateName) {
    emailQueued = await sendEmail(
      subject,
      config.templateName,
      recipientsData,
      commonData
    );
  } else if (message) {
    emailQueued = await sendPlainTextEmail(
      subject,
      message,
      recipientsData,
      commonData
    );
  }

  return emailQueued;
};

const sendClassLinkEmail = async (payload, type) => {
  let emailQueued = false;

  const formattedDateParts = formatDateWithZone(
    payload.schedule,
    payload.timeZone
  ).split(', ');

  const timeParts = formattedDateParts[2].split(' ');
  const timePart = `${timeParts[0]} ${timeParts[1]}`;
  const timeZonePart = timeParts.slice(2).join(' ');

  const commonData = {
    demoDate: `${formattedDateParts[0]}, ${formattedDateParts[1]}`,
    demoTime: `${timePart} (${timeZonePart})`,
    classLink: payload.classLink,
  };

  const recipientsData = [
    {
      name: getFirstName(payload.parentsName),
      email: payload.parentsEmail,
      kidsName: getFirstName(payload.kidsName),
      type,
    },
  ];

  const config = emailConfig['class-link'];
  emailQueued = await sendEmail(
    config.subject,
    config.templateName,
    recipientsData,
    commonData
  );

  return emailQueued;
};

exports.handler = async (event) => {
  console.log('event: ', event);

  if (event.Records) {
    const promises = [];
    const allData = [];

    event.Records.forEach((record) => {
      if (record.EventSource === 'aws:sns') {
        const sns = record.Sns;
        console.log(sns);

        const attribs = sns.MessageAttributes;
        const payload = JSON.parse(sns.Message);
        const type = attribs.type.Value;

        if (type === 'auth') {
          promises.push(sendAuthEmail(payload));
          allData.push({ type, payload });
        } else if (type === 'demo') {
          promises.push(sendWelcomeEmail(payload));
          allData.push({ type, payload });
        } else if (['scheduled', 'rescheduled'].includes(type)) {
          promises.push(sendClassLinkEmail(payload, type));
          allData.push({ type, payload });
        }
      }
    });

    if (promises.length) {
      const results = await Promise.allSettled(promises);
      for (const index in results) {
        const result = results[index];
        const data = allData[index];
        if (result.status === 'fulfilled') {
          console.log('Email queue status: ', result.value);
          if (['demo', 'scheduled', 'rescheduled'].includes(data.type)) {
            await sendSnsMessage('Email queue status', data.payload, {
              status: {
                DataType: 'String',
                StringValue: `${result.value}`,
              },
              type: {
                DataType: 'String',
                StringValue: data.type === 'demo' ? 'welcome' : data.type,
              },
              'notify.discord': {
                DataType: 'String',
                StringValue: 'true',
              },
            });
          }
        } else {
          console.log('promise failed to fulfill: ', result.reason);
        }
      }
    }
  }

  return null;
};
