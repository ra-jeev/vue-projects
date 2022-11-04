export default {
  isAuthenticated(state) {
    return !!state.user
  },
  user(state) {
    return state.user
  },
  userWebsites(state) {
    console.log('returning user websites: ', state.userWebsites)
    return state.userWebsites
  },
  userProjects(state) {
    console.log('returning user projects: ', state.userProjects)
    return state.userProjects
  },
  projectById: (state) => (id) => {
    console.log(`projectById: ${id}, `, state.projectsById[id])
    return state.projectsById[id]
  },
  uploadJob(state) {
    return state.uploadJob
  },
  siteUrl(state) {
    return state.siteUrl
  },
  pageTitle(state) {
    return state.pageTitle
  },
  showBack(state) {
    return state.showBack
  },
  saveCode(state) {
    console.log(
      `return saveCode: ${state.saveCode} from getter ----------------------`
    )
    return state.saveCode
  },
  remoteSaveWorking(state) {
    return state.remoteSaveWorking
  },
  drawer(state) {
    return state.drawer
  },
}
