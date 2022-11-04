const functions = require('firebase-functions')

exports.changeUserAccessLevel = functions
  .region('asia-east2')
  .https.onRequest(async (req, res) => {
    const params = req.body
    console.log(`changeUserAccessLevel:: req.body:: ${JSON.stringify(params)}`)
    if (!params) {
      return res.status(400).send(`Request body was empty`)
    } else if (!params.emailId || !params.type || !params.accessLevel) {
      return res
        .status(400)
        .send(
          `No email Id ${params.emailId}, or type ${params.type}, or accessLevel ${params.accessLevel} was provided`
        )
    }

    const admin = require('../utils/firebaseAdmin').getAdmin()
    try {
      const user = await admin.auth().getUserByEmail(params.emailId)
      const customClaims = {
        accessLevel: params.accessLevel,
      }
      customClaims[params.type] = true

      await admin.auth().setCustomUserClaims(user.uid, customClaims)
      console.log('successfully changed UserAccessLevel for => ', user.email)
    } catch (error) {
      console.log(error)
      return res
        .status(404)
        .send(`No user with email Id ${params.emailId} found in database`)
    }

    console.log('exiting onAccountCreation')
    return res
      .status(200)
      .send(`successfully changed UserAccessLevel for ${params.emailId}`)
  })

const allowedUserTypes = ['admin', 'partner', 'affiliate']
const allowedAccessLevels = [1, 3, 7, 15]

exports.adminCreateUser = functions
  .region('asia-east2')
  .https.onCall(async (payload, context) => {
    const params = payload
    console.log(`adminCreateUser:: payload:: ${JSON.stringify(payload)}`)

    if (!context.auth || !context.auth.uid) {
      console.log('No auth information present')
      throw new functions.https.HttpsError(
        'permission-denied',
        'Unauthorized Access'
      )
    }

    console.log(`adminCreateUser:: auth:: ${JSON.stringify(context.auth)}`)

    if (!params) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Missing required fields'
      )
    } else if (
      !params.email ||
      !params.name ||
      !params.type ||
      !params.accessLevel
    ) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        `No email Id ${params.email}, or displayName: ${params.name}, or type ${params.type}, or accessLevel ${params.accessLevel} was provided`
      )
    } else if (!allowedUserTypes.includes(params.type)) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        `Invalid user type ${params.type} requested`
      )
    } else if (!allowedAccessLevels.includes(params.accessLevel)) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        `Invalid accessLevel: ${params.accessLevel} requested`
      )
    }

    const admin = require('../utils/firebaseAdmin').getAdmin()
    try {
      const data = {
        email: params.email,
        emailVerified: false,
        password: '!nLabJr@123',
        displayName: params.name,
      }

      if (params.id) {
        data.uid = params.id
      }

      const user = await admin.auth().createUser(data)

      console.log('create user response: ', JSON.stringify(user, null, 2))

      const customClaims = {
        accessLevel: params.accessLevel,
      }
      customClaims[params.type] = true

      await admin.auth().setCustomUserClaims(user.uid, customClaims)
      console.log(`successfully changed UserAccessLevel for => ${user.email}`)
    } catch (error) {
      console.log(error)

      throw new functions.https.HttpsError('unknown', error.message)
    }

    console.log('exiting adminCreateUser')
    return {
      message: `successfully created ${params.name} with email ${params.email}`,
    }
  })
