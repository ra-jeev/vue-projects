const functions = require('firebase-functions')

exports.verifyOrderSignature = functions
  .region('asia-east2')
  .https.onCall(async (data) => {
    const text = data.order_id + '|' + data.razorpay_payment_id
    const crypto = require('crypto')
    const razorpayConfig = functions.config().razorpay
    const signature = crypto
      .createHmac('sha256', razorpayConfig.key_secret)
      .update(text)
      .digest('hex')

    if (signature === data.razorpay_signature) {
      const admin = require('../utils/firebaseAdmin').getAdmin()
      await admin.firestore().collection('payments').doc(data.receipt).update({
        razorpay_order_id: data.order_id,
        razorpay_payment_id: data.razorpay_payment_id,
        razorpay_signature: data.razorpay_signature,
      })

      return { status: 'ok', message: 'Successful Payment' }
    } else {
      throw new functions.https.HttpsError('unknown', 'Signature mismatch')
    }
  })
