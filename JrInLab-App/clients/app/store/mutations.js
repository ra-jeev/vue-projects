export default {
  setUser(state, user) {
    console.log('inside setUser mutation: user: ', user)
    state.user = user
  },
  updateWebsitesCount(state, websitesCount) {
    state.user.websitesCount = websitesCount
  },
  setUserWebsites(state, websites) {
    state.userWebsites = websites
  },
  setUserProjects(state, projects) {
    console.log('this ======= ', this)
    state.userProjects = projects
  },
  updateUserProject(state, changes) {
    console.log('updateUserProject: ', changes)
    const project = state.userProjects.find(
      (project) => project.id === changes.id
    )

    console.log(
      `updateUserProject: mutation: found project ${JSON.stringify(project)}`
    )
    if (project) {
      if (changes.siteUrl) {
        this._vm.$set(project, 'siteUrl', changes.siteUrl)
      }

      if (changes.updatedAt) {
        project.updatedAt = changes.updatedAt
      }

      if (changes.subdomain) {
        project.subdomain = changes.subdomain
      }

      if (changes.siteUpdated) {
        project.siteUpdated = changes.siteUpdated
      }
    }
  },
  setUserProjectById(state, project) {
    state.projectsById[project.id] = project
  },
  updateActiveProjectData(state, update) {
    console.log('updating active user project data: ', update)
    const project = state.projectsById[update.id]
    console.log('existing project: ', project)
    if (update.title) {
      project.title = update.title
    }

    if (update.siteUrl) {
      this._vm.$set(project, 'siteUrl', update.siteUrl)
    }

    if (update.updatedAt) {
      project.updatedAt = update.updatedAt
    }

    if (update.files) {
      const file = project.projectFiles.find(
        (file) => file.name === update.files.name
      )
      file.data = update.files.data
      file.size = update.files.data.length
    }
  },
  setUploadJob(state, uploadJob) {
    state.uploadJob = uploadJob
  },
  setSiteUrl(state, url) {
    state.siteUrl = url
  },
  setPageTitle(state, title) {
    state.pageTitle = title
  },
  showBack(state, show) {
    state.showBack = show
  },
  saveCode(state, save) {
    console.log(`inside save code mutation: ${save}`)
    state.saveCode = save
  },
  setRemoteSaveWorking(state, working) {
    console.log(`inside setRemoteSaveWorking mutation: ${working}`)
    state.remoteSaveWorking = working
  },
  deleteUserWebsite(state, subdomain) {
    if (state.userWebsites) {
      const index = state.userWebsites.findIndex(
        (website) => website.subdomain === subdomain
      )
      console.log(`deleteUserWebsite: mutation: found index ${index}`)
      if (index !== -1) {
        state.userWebsites.splice(index, 1)
      }
    }
  },
  toggleDrawer(state) {
    state.drawer = !state.drawer
    console.log(`toggleDrawer mutation final val: ${state.drawer}`)
  },
}
