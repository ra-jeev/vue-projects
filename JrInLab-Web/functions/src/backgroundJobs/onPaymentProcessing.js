const functions = require('firebase-functions')

const handlePaymentReceipt = async (admin, payload) => {
  const Razorpay = require('razorpay')
  const razorpayConfig = functions.config().razorpay
  const instance = new Razorpay({
    key_id: razorpayConfig.key_id,
    key_secret: razorpayConfig.key_secret,
  })

  try {
    const payment = await instance.payments.fetch(payload.razorpay_payment_id)
    console.log(`fetch payment details success:: ${JSON.stringify(payment)}`)

    const { formatDate } = require('../utils/dateHelper')
    const { sendEmail, getEmailConfigs } = require('../utils/EmailSender')

    const paymentTime = formatDate(new Date(payment.created_at * 1000)).split(
      ', '
    )

    const address = payload.address
    let finalAddress = ''
    finalAddress += address.addressLine ? `${address.addressLine}, ` : ''
    finalAddress += address.city ? `${address.city}, ` : ''
    finalAddress += address.state ? `${address.state}, ` : ''
    finalAddress += address.pinCode ? `${address.pinCode}, ` : ''
    finalAddress += address.country || ''
    if (
      finalAddress &&
      finalAddress[finalAddress.length - 1] === ' ' &&
      finalAddress[finalAddress.length - 2] === ','
    ) {
      finalAddress = finalAddress.substr(0, finalAddress.length - 2)
    }

    const commonData = {
      paymentId: payment.id,
      bookingId: payment.notes.bookingId,
      amount: payment.amount / 100,
      currency: payment.currency,
      paidOn: `${paymentTime[0]}, ${paymentTime[1]}`,
      method: `${payment.method}`,
      name: payment.notes.name,
      kidsName: payment.notes.kidsName,
      address: finalAddress,
      mobile: payment.contact,
      email: payment.email,
      workshopName: payment.notes.workshopName,
    }

    const recipientsData = [
      {
        name: payment.notes.name,
        email: payment.email,
      },
    ]

    const emailConfig = await getEmailConfigs(admin)
    let emailQueued = false
    if (emailConfig) {
      const config = emailConfig.payment
      emailQueued = await sendEmail(
        config.subject,
        config.templateNmae,
        recipientsData,
        commonData,
        emailConfig.service
      )
    }

    return emailQueued
  } catch (error) {
    console.log(`fetch payment details error:: `, JSON.stringify(error))
    // throw new functions.https.HttpsError('unknown', error.message)
  }

  return false
}

exports.onPaymentProcessing = functions
  .region('asia-east2')
  .firestore.document('payments/{paymentId}')
  .onWrite(async (change, context) => {
    const paymentId = context.params.paymentId
    if (!change.after.exists) {
      // The document has been deleted, so bail out
      console.log(
        `onPaymentProcessing: paymentId: ${paymentId} no after data exists, seems deleted, so bailing out...`
      )
      return null
    }

    const admin = require('../utils/firebaseAdmin').getAdmin()
    const payload = change.after.data()
    console.log(`onPaymentProcessing:: payload: ${JSON.stringify(payload)}`)

    if (!change.before.data()) {
      console.log('onPaymentProcessing: no before data, so it is a new entry')
      if (payload.address) {
        return admin
          .firestore()
          .collection('demos')
          .doc(payload.demoBookingId)
          .update({
            paymentId,
            address: { ...payload.address },
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          })
      }
    } else {
      console.log('onPaymentProcessing: it is an update entry')
      if (payload.razorpay_payment_id) {
        await handlePaymentReceipt(admin, payload)
        return admin
          .firestore()
          .collection('demos')
          .doc(payload.demoBookingId)
          .update({
            razorpay_payment_id: payload.razorpay_payment_id,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          })
      }
    }

    return null
  })
