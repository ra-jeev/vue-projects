export default {
  setUser(state, { authUser, claims }) {
    if (authUser) {
      console.log(
        'setUser mutation called: authUser: ',
        authUser,
        'claims: ',
        claims,
        'time: ',
        Date.now()
      )

      const { uid, email, emailVerified, displayName, phoneNumber, photoURL } =
        authUser

      state.user = {
        id: uid,
        email,
        emailVerified,
        displayName,
        phoneNumber,
        photoURL,
        admin: claims.admin,
        partner: claims.partner,
        accessLevel: claims.accessLevel,
      }
    } else {
      state.user = null
    }
  },
  setUiState(state, uiState) {
    state.uiState = uiState
  },
  setActiveWorkshop(state, details) {
    state.activeWorkshop = details
  },
  setdemoBookingId(state, demoBookingId) {
    state.demoBookingId = demoBookingId
  },
}
