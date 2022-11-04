export default {
  async fetchUser({ commit }, userId) {
    console.log(`calling fetch user for: ${userId}`)
    const response = await this.$axios.get(`/users/${userId}`)

    console.log('fetch user response: ', response)
    const user = {
      ...response.data.user,
    }
    commit('setUser', user)
  },
  async completeUserOnboarding({ getters, commit }, data) {
    const userId = getters.user.id
    data.onboardingDone = true
    const response = await this.$axios.patch(`/users/${userId}`, data)
    console.log(
      `completeUserOnboarding response: ${JSON.stringify(response.data)}`
    )
    commit('setUser', { ...response.data.user })
  },
  async signOut() {
    await this.$auth.signOut()
  },
  async checkSubdomainAvailability(_, subdomain) {
    const response = await this.$axios.get(`/websites/checkSubdomain`, {
      params: {
        subdomain,
      },
    })

    console.log('checkSubdomainAvailability response: ', response)
  },
  async getSignedUploadUrl({ getters, commit }, uploadInfo) {
    const response = await this.$axios.post('/websites/signedUrl', uploadInfo)

    console.log('getSignedUploadUrl response: ', response)
    console.log(`uploadJob: ${JSON.stringify(response.data)}`)
    commit('setUploadJob', response.data)
  },
  async uploadDataToUrl({ getters }, { subdomain, dataUrl }) {
    const uploadJob = getters.uploadJob
    console.log(
      `uploadDataToUrl: subdomain: ${subdomain}, uploadJob: ${JSON.stringify(
        uploadJob
      )}`
    )
    if (
      uploadJob &&
      uploadJob.subdomain.toLowerCase() === subdomain.toLowerCase()
    ) {
      const urlParts = dataUrl.split(',')
      const buffer = Buffer.from(urlParts[1], 'base64')

      const blobData = new Blob([buffer], {
        type: urlParts[0].split(':')[0],
      })

      const res = await this.$axios.put(uploadJob.uploadUrl, blobData, {
        transformRequest: [
          (data, headers) => {
            delete headers.common.Authorization
            delete headers.Authorization

            return data
          },
        ],
      })

      console.log(`upload job res: ${JSON.stringify(res.statusText)}`)
    } else {
      const response = await this.$axios.delete(`/websites/${subdomain}`)
      console.log(
        `release subdomain response: ${JSON.stringify(response.data)}`
      )
      throw new Error('Failed to upload your file. Please try again later.')
    }
  },
  async processUpload({ commit, getters }, { subdomain, isEdit, project }) {
    const uploadJob = getters.uploadJob
    const userId = getters.user.id

    console.log(
      `processUpload: subdomain: ${subdomain}, uploadJob: ${JSON.stringify(
        uploadJob
      )}`
    )

    let res
    if (project) {
      if (isEdit) {
        res = await this.$axios.patch(
          `/users/${userId}/websites/${subdomain}`,
          {
            projectId: project.id,
            siteUrl: project.siteUrl,
          }
        )

        commit('updateUserProject', {
          id: project.id,
          siteUpdated: res.data.siteUpdated,
          updatedAt: res.data.updatedAt,
        })
      } else {
        res = await this.$axios.post(`/users/${userId}/websites`, {
          projectId: project.id,
          subdomain,
        })

        commit('setSiteUrl', res.data.siteUrl)
        commit('updateWebsitesCount', res.data.websitesCount)
        commit('updateUserProject', {
          id: project.id,
          siteUrl: res.data.siteUrl,
          subdomain: res.data.subdomain,
          siteUpdated: res.data.siteUpdated,
          updatedAt: res.data.updatedAt,
        })
      }

      console.log(`processUpload Result: ${JSON.stringify(res.data)}`)
    } else if (
      uploadJob &&
      uploadJob.subdomain.toLowerCase() === subdomain.toLowerCase()
    ) {
      if (isEdit) {
        res = await this.$axios.patch(
          `/users/${userId}/websites/${subdomain}`,
          {
            filePath: uploadJob.filePath,
            contentType: uploadJob.contentType,
            siteUrl: uploadJob.siteUrl,
          }
        )
      } else {
        res = await this.$axios.post(`/users/${userId}/websites`, {
          filePath: uploadJob.filePath,
          contentType: uploadJob.contentType,
          siteUrl: uploadJob.siteUrl,
          subdomain: uploadJob.subdomain,
        })
      }

      console.log(`processUpload Result: ${JSON.stringify(res.data)}`)
      commit('setSiteUrl', uploadJob.siteUrl)
    } else {
      throw new Error(
        'Failed to link the subdomain to you. Please try again later'
      )
    }
  },
  async fetchUserWebsites({ getters, commit }) {
    const userId = getters.user.id
    const response = await this.$axios.get(`/users/${userId}/websites`)

    commit('setUserWebsites', response.data.items)
  },
  async deleteUserWebsite({ getters, commit }, subdomain) {
    const userId = getters.user.id
    const response = await this.$axios.delete(
      `/users/${userId}/websites/${subdomain}`
    )
    console.log(`deleteUserWebsite response: ${JSON.stringify(response.data)}`)
    commit('deleteUserWebsite', subdomain)
    if (response.data.websitesCount) {
      commit('updateWebsitesCount', response.data.websitesCount)
    }
  },
  goBack() {
    if (
      this.$router.currentRoute.path === this.$router.history._startLocation
    ) {
      this.$router.replace('/')
    } else {
      this.$router.back()
    }
  },
  async getUserProjects({ commit, getters }) {
    const userId = getters.user.id
    const response = await this.$axios.get(`/users/${userId}/projects`)
    console.log(`getUserProjects response: ${JSON.stringify(response.data)}`)
    commit('setUserProjects', response.data.items)
  },
  async getUserProjectById({ commit, getters }, id) {
    const userId = getters.user.id
    const response = await this.$axios.get(`/users/${userId}/projects/${id}`)
    console.log(`getUserProjectById response: ${JSON.stringify(response.data)}`)
    commit('setUserProjectById', response.data.data)
  },
  async createUserProject({ commit, getters }, data) {
    const userId = getters.user.id
    const response = await this.$axios.post(`/users/${userId}/projects`, data)
    commit('setUserProjectById', response.data.data)
    console.log(`createUserProject response: ${JSON.stringify(response.data)}`)
    return response.data.data.id
  },
  openWebSocket() {
    console.log('$wss: ', this.$wss)
    if (this.$wss) {
      this.$wss.connect()
    }
  },
  closeWebSocket() {
    if (this.$wss) {
      this.$wss.disconnect()
    }
  },
  saveUserCode({ getters, commit }, changes) {
    console.log('inside saveUserCode action')
    const userId = getters.user.id
    changes.userId = userId
    changes.type = 'PROJECT_SAVE'

    const sent = this.$wss.sendMessage(JSON.stringify(changes))
    if (sent) {
      commit('updateActiveProjectData', changes)
    }
  },
}
