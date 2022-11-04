const functions = require('firebase-functions')

const { OAuth2Client } = require('google-auth-library')

const CONFIG_CLIENT_ID = functions.config().google.oauth.client_id
const CONFIG_CLIENT_SECRET = functions.config().google.oauth.client_secret
const FUNCTIONS_REDIRECT = `https://${process.env.GCLOUD_PROJECT}.web.app/oauthcallback`
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets']

const functionsOauthClient = new OAuth2Client(
  CONFIG_CLIENT_ID,
  CONFIG_CLIENT_SECRET,
  FUNCTIONS_REDIRECT
)

// Need to call this function from a browser to set up Google-OAuth
// for interactions with Google APIs
exports.authGoogleApi = functions.https.onRequest((req, res) => {
  res.set('Cache-Control', 'private, max-age=0, s-maxage=0')
  res.redirect(
    functionsOauthClient.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      prompt: 'consent' /*,
      state: getIdToken(req) */, // This is used if we want to expose these functions only to the admins
    })
  )
})

// after you grant access, you will be redirected to the URL for this Function
// this Function stores the tokens to your Firebase database
exports.oAuthCallback = functions.https.onRequest(async (req, res) => {
  const admin = require('../utils/firebaseAdmin').getAdmin()

  res.set('Cache-Control', 'private, max-age=0, s-maxage=0')
  const code = req.query.code
  try {
    const { tokens } = await functionsOauthClient.getToken(code)
    // Now tokens contains an access_token and an optional refresh_token. Save them.
    await admin
      .firestore()
      .collection('authTokens')
      .doc('firebase-functions')
      .set(tokens)

    return res
      .status(200)
      .send(
        'App successfully configured with new Credentials. ' +
          'You can now close this page.'
      )
  } catch (error) {
    return res.status(400).send(error)
  }
})
