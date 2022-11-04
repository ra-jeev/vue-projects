class WebSocketSvc {
  constructor(store, config, $auth) {
    this.$auth = $auth
    this.$store = store
    this.wssUrl = config.APP_WSS_API_GW_URL
    console.log(`this.wssUrl: ${this.wssUrl}`)
  }

  connect() {
    console.log('inside connect web socket: existing value: ', this.connection)
    if (!this.connection) {
      const urlWithToken = `${
        this.wssUrl
      }?authorization=${this.$auth.getAccessToken()}`
      this.connection = new WebSocket(urlWithToken)
      console.log('inside connect: connection: ', this.connection)
      this.connection.onmessage = this.onMessage
      this.connection.onopen = this.onConnect
      this.connection.onclose = this.onClose
      this.connection.onerror = this.onError
      this.connection.socketSvc = this
    }
  }

  disconnect() {
    console.log(
      'inside disconnect web socket with connection:: ',
      this.connection
    )

    if (
      this.connection &&
      this.connection.readyState === this.connection.OPEN
    ) {
      console.log('Closing the connection:')
      this.connection.close()
    }
  }

  onConnect(event) {
    console.log('onConnect', event)
    console.log('Successfully connected to the echo websocket server...')
    console.log('this: ', this)

    this.socketSvc.$store.commit('setRemoteSaveWorking', true)
    this.intervalTimer = setInterval(() => {
      console.log('this.OPEN: ', this.OPEN)
      if (this.readyState === this.OPEN) {
        this.send(
          JSON.stringify({ type: 'HEARTBEAT', message: 'heartbeat message' })
        )
        console.log('heartbeat sent')
      }
    }, 1 * 60 * 1000)
  }

  onClose(event) {
    console.log('onClose', event)
    if (this.intervalTimer) {
      clearInterval(this.intervalTimer)
      this.intervalTimer = null
    }

    if (this.socketSvc) {
      this.socketSvc.$store.commit('setRemoteSaveWorking', false)
      this.socketSvc.connection = null
    }

    console.log('in onClose: this: ', this)
  }

  onError(event) {
    console.log('onError', event)
    if (this.intervalTimer) {
      clearInterval(this.intervalTimer)
      this.intervalTimer = null
    }

    if (this.socketSvc) {
      this.socketSvc.$store.commit('setRemoteSaveWorking', false)
      this.socketSvc.connection = null
    }
  }

  onMessage(event) {
    console.log('onRemoteMessage: ', event)
    // this.socketSvc.$store.dispatch(
    //   'handleRemoteUpdates',
    //   JSON.parse(event.data)
    // )
  }

  sendMessage(message) {
    console.log(
      `inside sendMessage: ${this.connection?.readyState}, message: ${message}`
    )
    if (
      this.connection &&
      this.connection.readyState === this.connection.OPEN
    ) {
      this.connection.send(message)
      console.log('message sent')
      return true
    }

    return false
  }
}

export default ({ store, $config, $auth }, inject) => {
  console.log(`the inner config: ${JSON.stringify($config, null, 2)}`)
  const wssSvc = new WebSocketSvc(store, $config, $auth)
  inject('wss', wssSvc)
}
