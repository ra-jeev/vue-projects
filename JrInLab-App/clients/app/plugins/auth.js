const { Auth } = require('@aws-amplify/auth')

class AuthService {
  constructor($axios, $config, $store) {
    this.$axios = $axios
    this.$store = $store
    this.$accessToken = null

    const config = {
      Auth: {
        userPoolId: $config.USER_POOL_ID,
        userPoolWebClientId: $config.APP_CLIENT_ID,
      },
    }

    Auth.configure(config)
  }

  async signIn(email, password) {
    this.cognitoUser = await Auth.signIn(email, password)
    console.log('after sign in : ', this.cognitoUser)

    if (password) {
      await this.isAuthenticated()
    }
  }

  async signOut() {
    await Auth.signOut()
    console.log('after sign out in auth service')
    this.$store.commit('setUser', null)
  }

  async verifyEmail() {
    console.log('inside auth.verifyEmail')
    await Auth.verifyCurrentUserAttribute('email')
  }

  async answerCustomChallenge(answer) {
    this.cognitoUser = await Auth.sendCustomChallengeAnswer(
      this.cognitoUser,
      answer
    )

    console.log('answerCustomChallenge: this.cognitoUser: ', this.cognitoUser)
    return this.isAuthenticated()
  }

  getPublicChallengeParameters() {
    return this.cognitoUser.challengeParam
  }

  async signUp(email, fullName, password) {
    const params = {
      username: email,
      password: password || this.getRandomString(30),
      attributes: {
        name: fullName,
      },
    }

    await Auth.signUp(params)
  }

  getRandomString(bytes) {
    const randomValues = new Uint8Array(bytes)
    window.crypto.getRandomValues(randomValues)
    return Array.from(randomValues).map(this.intToHex).join('')
  }

  intToHex(nr) {
    return nr.toString(16).padStart(2, '0')
  }

  async getSession() {
    const session = await Auth.currentSession()
    this.$accessToken = session.getAccessToken().getJwtToken()
    this.$axios.setToken(session.getIdToken().getJwtToken(), 'Bearer')
    console.log('getSession: session: ', session)
    return session
  }

  getAccessToken() {
    return this.$accessToken
  }

  async isAuthenticated() {
    try {
      const session = await this.getSession()

      // const userDetails = await this.getUserDetails()
      // const user = {}
      // userDetails.forEach((detail) => {
      //   const detailName = detail.getName()
      //   const detailValue = detail.getValue()
      //   user[detailName === 'sub' ? 'id' : detailName] = detailValue
      // })
      // this.$store.commit('setUser', user)

      console.log(
        'session.getAccessToken().decodePayload(): ',
        session.getAccessToken().decodePayload()
      )

      const userId = session.getAccessToken().decodePayload().sub
      await this.$store.dispatch('fetchUser', userId)
      return true
    } catch {
      return false
    }
  }

  async getUserDetails() {
    if (!this.cognitoUser) {
      this.cognitoUser = await Auth.currentAuthenticatedUser()
    }

    return await Auth.userAttributes(this.cognitoUser)
  }
}

export default async ({ $axios, $config, store }, inject) => {
  const authService = new AuthService($axios, $config, store)
  inject('auth', authService)

  await authService.isAuthenticated()
}
