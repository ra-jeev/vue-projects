export default {
  async createAccount(_, { account }) {
    await this.$fire.auth.createUserWithEmailAndPassword(
      account.email,
      account.password
    )

    await this.$fire.auth.currentUser.updateProfile({
      displayName: account.name,
    })
  },
  async signIn(_, { account }) {
    await this.$fire.auth.signInWithEmailAndPassword(
      account.email,
      account.password
    )
  },
  async signOut() {
    await this.$fire.auth.signOut()
  },
  async getSignInMethods({ commit }, { email }) {
    const methods = await this.$fire.auth.fetchSignInMethodsForEmail(email)
    let uiState = 'account'
    if (methods.length) {
      uiState = methods.includes('link') ? 'link' : 'password'
    }

    commit('setUiState', uiState)
  },
  setPageState({ commit }, uiState) {
    commit('setUiState', uiState)
  },
  async getActiveWorkshop({ commit }) {
    const workshopDoc = await this.$fire.firestore
      .collection('workshops')
      .doc('active')
      .get()
    if (workshopDoc.exists) {
      commit('setActiveWorkshop', { id: workshopDoc.id, ...workshopDoc.data() })
    }
  },
  async bookDemo({ commit }, { data }) {
    data.createdAt = this.$fireModule.firestore.FieldValue.serverTimestamp()
    data.updatedAt = this.$fireModule.firestore.FieldValue.serverTimestamp()
    data.status = 'fresh'
    data.logCount = 0

    const booking = await this.$fire.firestore.collection('demos').add(data)

    commit('setdemoBookingId', booking.id)
  },
  async bookRejectedDemo(_, { data }) {
    data.createdAt = this.$fireModule.firestore.FieldValue.serverTimestamp()
    data.updatedAt = this.$fireModule.firestore.FieldValue.serverTimestamp()
    data.status = 'fresh'
    data.logCount = 0

    // console.log('inside bookRejectedDemo: data:: ', data)

    await this.$fire.firestore.collection('rejectedDemos').add(data)
  },
  async getIsDuplicateRequest(_, { data }) {
    const snapshots = await this.$fire.firestore
      .collection('demos')
      .where('contacts', 'array-contains-any', [
        data.parentsEmail,
        `${data.country.dialCode}-${data.parentsPhone}`,
      ])
      .get()

    const docs = []
    snapshots.forEach((doc) => {
      docs.push({ id: doc.id, ...doc.data() })
    })

    return docs
  },
  async sendContactMessage(_, { data }) {
    data.createdAt = this.$fireModule.firestore.FieldValue.serverTimestamp()
    data.updatedAt = this.$fireModule.firestore.FieldValue.serverTimestamp()
    await this.$fire.firestore.collection('messages').add(data)
  },
  async sendPartnershipMessage(_, { data }) {
    data.createdAt = this.$fireModule.firestore.FieldValue.serverTimestamp()
    data.updatedAt = this.$fireModule.firestore.FieldValue.serverTimestamp()
    data.status = 'fresh'
    data.logCount = 0
    await this.$fire.firestore.collection('partnerships').add(data)
  },
  async createOrder(_, data) {
    const createOrder = this.$fire.functions.httpsCallable('createOrder')
    try {
      const paymentRef = this.$fire.firestore.collection('payments').doc()

      const orderResponse = await createOrder({
        paymentId: paymentRef.id,
        data,
      })

      // console.log('create order response:: ', orderResponse)

      await paymentRef.set({
        ...data,
        createdAt: this.$fireModule.firestore.FieldValue.serverTimestamp(),
        updatedAt: this.$fireModule.firestore.FieldValue.serverTimestamp(),
      })

      return orderResponse.data
    } catch (error) {
      // console.log('create order failed:: ', error)
    }
  },
  async verifyPayment(_, data) {
    const verifyOrderSignature = this.$fire.functions.httpsCallable(
      'verifyOrderSignature'
    )
    try {
      const response = await verifyOrderSignature(data)
      // console.log('verifyOrderSignature response:: ', response)
      return response.data
    } catch (error) {
      // console.log('verifyOrderSignature failed:: ', error)
      return error
    }
  },
}
