export default {
  user(state) {
    return state.user
  },
  isLoggedIn(state) {
    return !!state.user
  },
  isAdmin(state) {
    return state.user && state.user.admin === true
  },
  isPartner(state) {
    console.log('inside getter isPartner: ', state.user)
    return state.user && state.user.partner === true
  },
  isSuperAdmin(state) {
    return (
      state.user && state.user.admin === true && state.user.accessLevel === 15
    )
  },
  uiState(state) {
    return state.uiState
  },
  activeWorkshop(state) {
    return state.activeWorkshop
  },
  demoBookingId(state) {
    return state.demoBookingId
  },
}
