const functions = require('firebase-functions')

exports.onAccountCreation = functions
  .region('asia-east2')
  .auth.user()
  .onCreate(async (user) => {
    let accessLevel = 0
    const admins = functions.config().admin
    console.log(`admins:: ${JSON.stringify(admins)}`)
    if (admins) {
      for (const adminName in admins) {
        const adminDetails = admins[adminName]
        if (adminDetails.email === user.email) {
          accessLevel = parseInt(adminDetails.level)
          break
        }
      }
    }

    if (accessLevel) {
      const admin = require('../utils/firebaseAdmin').getAdmin()
      const customClaims = {
        admin: true,
        accessLevel,
      }

      await admin.auth().setCustomUserClaims(user.uid, customClaims)
      console.log('successfully set the custom user claims for => ', user.email)
    } else {
      console.log(
        `user.email === functions.config().admin check failed for ${user.email}`
      )
    }

    console.log('exiting onAccountCreation')
    return null
  })
