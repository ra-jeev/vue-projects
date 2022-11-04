const { onBookDemo } = require('./src/backgroundJobs/onBookDemo')
const { onBookingChanged } = require('./src/backgroundJobs/onBookingChanged')
const {
  onCustomerLogEntry,
} = require('./src/backgroundJobs/onCustomerLogEntry')
const { onAccountCreation } = require('./src/backgroundJobs/onAccountCreation')
const googleOAuthFunctions = require('./src/google-auth')
const { sendFollowUpEmail } = require('./src/httpsEndPoints/sendFollowUpEmail')
const { doDbChores } = require('./src/httpsEndPoints/doDbChores')
const testFunctions = require('./src/testFunctions')
const superAdminFunctions = require('./src/httpsEndPoints/superAdmin')
const { onContactMessage } = require('./src/backgroundJobs/onContactMessage')
const {
  onPartnershipMessage,
} = require('./src/backgroundJobs/onPartnershipMessage')
const { onSchoolLogEntry } = require('./src/backgroundJobs/onSchoolLogEntry')
const { createOrder } = require('./src/httpsCallable/createOrder')
const {
  verifyOrderSignature,
} = require('./src/httpsCallable/verifyOrderSignature')
const { sendEmail } = require('./src/httpsCallable/sendEmail')
const {
  onPaymentProcessing,
} = require('./src/backgroundJobs/onPaymentProcessing')
const { onRejectedDemo } = require('./src/backgroundJobs/onRejectedDemo')
const {
  sendBulkTextEmails,
} = require('./src/httpsEndPoints/sendBulkTextEmails')
const { sendBatchEmails } = require('./src/httpsEndPoints/sendBatchEmails')
const { onMailgunCall } = require('./src/httpsEndPoints/emailWebhooks')

exports.onBookDemo = onBookDemo
exports.onBookingChanged = onBookingChanged
exports.onCustomerLogEntry = onCustomerLogEntry
exports.onAccountCreation = onAccountCreation
exports.authgoogleapi = googleOAuthFunctions.authGoogleApi
exports.oauthcallback = googleOAuthFunctions.oAuthCallback
exports.sendFollowUpEmail = sendFollowUpEmail
exports.doDbChores = doDbChores
exports.changeUserAccessLevel = superAdminFunctions.changeUserAccessLevel
exports.adminCreateUser = superAdminFunctions.adminCreateUser
exports.onContactMessage = onContactMessage
exports.onPartnershipMessage = onPartnershipMessage
exports.onSchoolLogEntry = onSchoolLogEntry
exports.createOrder = createOrder
exports.verifyOrderSignature = verifyOrderSignature
exports.sendEmail = sendEmail
exports.onPaymentProcessing = onPaymentProcessing
exports.onRejectedDemo = onRejectedDemo
exports.sendBulkTextEmails = sendBulkTextEmails
exports.sendBatchEmails = sendBatchEmails

exports.testemailsend = testFunctions.testEmailSend
exports.createCalendarEvent = testFunctions.createCalendarEvent
exports.getPaymentDetails = testFunctions.getPaymentDetails
exports.checkTimingThing = testFunctions.checkTimingThing
exports.onMailgunCall = onMailgunCall
