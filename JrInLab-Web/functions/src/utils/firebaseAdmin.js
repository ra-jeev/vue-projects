let isFirebaseInited = false

exports.getAdmin = () => {
  const admin = require('firebase-admin')

  if (!isFirebaseInited) {
    admin.initializeApp()
    isFirebaseInited = true
  }

  return admin
}
