const functions = require('firebase-functions')

exports.onRejectedDemo = functions
  .region('asia-east2')
  .firestore.document('rejectedDemos/{demoId}')
  .onCreate(async (snap, context) => {
    const payload = snap.data()

    try {
      const admin = require('../utils/firebaseAdmin').getAdmin()
      const searchable = [
        `${payload.country.dialCode}-${payload.parentsPhone}`,
        payload.parentsPhone,
        payload.parentsEmail,
        payload.parentsName,
        ...payload.parentsName.split(' '),
        payload.kidsName,
        ...payload.kidsName.split(' '),
      ]

      const info = new Set()
      searchable.forEach((term) => {
        term = term.toLowerCase()
        for (let index = 1; index <= term.length; index++) {
          info.add(term.substring(0, index))
        }
      })

      const update = {}
      update[`searchable.info`] = Array.from(info)

      await admin
        .firestore()
        .collection('rejectedDemos')
        .doc(context.params.demoId)
        .update(update)
    } catch (error) {
      console.log(
        `failed to add searchable info for rejected demo:: ${error.message}`
      )
    }

    return null
  })
