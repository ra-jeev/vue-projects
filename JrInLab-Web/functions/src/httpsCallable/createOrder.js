const functions = require('firebase-functions')

exports.createOrder = functions
  .region('asia-east2')
  .https.onCall(async (payload) => {
    console.log(`createOrder enter: data::`, JSON.stringify(payload))

    const data = payload.data
    const paymentId = payload.paymentId

    const Razorpay = require('razorpay')
    const razorpayConfig = functions.config().razorpay
    const instance = new Razorpay({
      key_id: razorpayConfig.key_id,
      key_secret: razorpayConfig.key_secret,
    })

    const options = {
      amount: data.fee.value * 100,
      currency: data.fee.currency,
      receipt: paymentId,
      payment_capture: true,
      notes: {
        name: data.name,
        email: data.email,
        phone: data.phone,
      },
    }

    try {
      const order = await instance.orders.create(options)
      console.log(`createOrder success:: `, order)
      return {
        ...order,
      }
    } catch (error) {
      console.log(`createOrder error:: `, JSON.stringify(error))
      throw new functions.https.HttpsError('unknown', error.message)
    }
  })
