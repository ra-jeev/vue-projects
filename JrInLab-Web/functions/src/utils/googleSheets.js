const functions = require('firebase-functions')

let oAuthTokens = null
let sheetsService = null

exports.getSheetsService = async () => {
  if (!sheetsService) {
    if (!oAuthTokens) {
      const admin = require('../utils/firebaseAdmin').getAdmin()

      const snapshot = await admin
        .firestore()
        .collection('authTokens')
        .doc('firebase-functions')
        .get()

      console.log('got some snapshot for authTokens call')

      oAuthTokens = snapshot.data()
    }

    const { OAuth2Client } = require('google-auth-library')
    const { google } = require('googleapis')

    const CONFIG_CLIENT_ID = functions.config().google.oauth.client_id
    const CONFIG_CLIENT_SECRET = functions.config().google.oauth.client_secret
    const FUNCTIONS_REDIRECT = `https://${process.env.GCLOUD_PROJECT}.web.app/oauthcallback`

    const functionsOauthClient = new OAuth2Client(
      CONFIG_CLIENT_ID,
      CONFIG_CLIENT_SECRET,
      FUNCTIONS_REDIRECT
    )

    functionsOauthClient.setCredentials(oAuthTokens)

    sheetsService = google.sheets({
      version: 'v4',
      auth: functionsOauthClient,
    }).spreadsheets
  }

  return sheetsService
}
