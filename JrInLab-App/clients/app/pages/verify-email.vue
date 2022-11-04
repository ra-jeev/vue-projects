<template>
  <auth-view image="secure_login.svg">
    <template #default>
      <div class="auth-title">Enter your magic code</div>
      <div class="auth-prompt mt-6">
        Please check your email <strong>{{ email }} </strong> for a 6 character
        magic code we've sent just now.
      </div>
      <v-form
        ref="form"
        class="mb-10"
        lazy-validation
        @submit.prevent="submitOTP"
      >
        <div class="d-flex justify-space-between my-10">
          <v-text-field
            v-for="(n, i) in 6"
            :key="`index-${i}`"
            :ref="`otp${i}`"
            v-model="splitOTP[i]"
            :rules="otpRules"
            class="otp-box"
            flat
            height="64"
            hide-details
            outlined
            required
            solo
            validate-on-blur
            @input="(val) => onOtpInput(i, val)"
            @keydown="(evt) => onKeyboardEvent(evt, i)"
            @paste="onPasteEvent"
          />
        </div>
        <v-alert
          v-model="alert.show"
          border="left"
          class="text-left font-weight-medium"
          color="error"
          dismissible
          text
          type="error"
        >
          {{ alert.message }}
        </v-alert>

        <v-btn
          :disabled="loading"
          :loading="loading"
          class="font-weight-bold"
          color="primary"
          large
          type="submit"
        >
          Verify Code
        </v-btn>
      </v-form>
      <div v-if="resend.show" class="mt-n4 mb-6">
        <v-progress-circular v-if="resend.loading" />
        <a
          v-else-if="!resend.state"
          class="text-rem-1-125 font-weight-medium"
          @click.stop="resendMagicCode"
        >
          Resend Code
        </a>
        <span v-else-if="resend.state === 'done'">
          Code resent successfully
        </span>
      </div>
      <div class="text-rem-1-125 grey--text text--darken-1">
        Not able to find your code? Please check your
        <strong>spam / promotions</strong>
        folder.
      </div>
    </template>
  </auth-view>
</template>

<script>
export default {
  name: 'VerifyEmailPage',
  layout: 'auth',
  data() {
    return {
      splitOTP: { 0: '', 1: '', 2: '', 3: '', 4: '', 5: '' },
      pastedText: null,
      loading: false,
      alert: {
        show: false,
        message: null,
      },
      email: null,
      otpRules: [(v) => !!v || 'Please enter your email address'],
      resend: {
        show: false,
        lading: false,
        state: 'done',
      },
    }
  },
  beforeMount() {
    this.email = this.$route.params.email
    if (!this.email) {
      this.$router.replace('/sign-in')
    }
  },
  methods: {
    onKeyboardEvent(event, index) {
      // console.log(`onKeyboardEvent: index: ${index}, event: `, event)
      if (event.keyCode === 37) {
        // Arrow Left
        if (index > 0) {
          this.$refs[`otp${index - 1}`][0].focus()
          setTimeout(() => {
            this.$refs[`otp${index - 1}`][0].$refs.input.setSelectionRange(1, 1)
          }, 10)
        } else {
          setTimeout(() => {
            this.$refs.otp0[0].$refs.input.setSelectionRange(1, 1)
          }, 10)
        }
      }

      if (event.keyCode === 39 && index < 5) {
        // Arrow Right
        if (
          !this.splitOTP[`${index}`] ||
          this.$refs[`otp${index}`][0].$refs.input.selectionEnd !== 0
        ) {
          this.$refs[`otp${index + 1}`][0].focus()
        }
      }

      if (event.keyCode === 8) {
        // Backspace
        if (index > 0 && !this.splitOTP[`${index}`]) {
          this.$refs[`otp${index - 1}`][0].focus()
        }
      }
    },
    handlePastedText(index) {
      // console.log(`handle pasted text: ${this.pastedText}, index: ${index}`)
      const splitChars = this.pastedText.trim().split('')
      this.$nextTick(() => {
        let ite, j
        for (ite = index, j = 0; ite < 6 && j < splitChars.length; ite++, j++) {
          this.splitOTP[`${ite}`] = splitChars[j]
        }

        if (ite === 6) {
          this.$refs.otp5[0].focus()
        } else {
          this.$refs[`otp${ite}`][0].focus()
        }

        // console.log('done with next tick on pasted text: ', splitChars)
      })
      // console.log('exit handle pasted text')
    },
    onPasteEvent(event) {
      this.pastedText = event.clipboardData.getData('text')
      this.pastedText = this.pastedText.toUpperCase().replace(/[^A-Z0-9]/g, '')
      // console.log('onPasteEvent: ', event)
      if (this.alert.show) {
        this.alert.show = false
      }
    },
    onOtpInput(index, value) {
      if (value) {
        if (this.alert.show) {
          this.alert.show = false
        }

        const sanitizedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '')
        // console.log(`onOtpInput: index: ${index}, value: ${value}`)
        if (index < 5) {
          if (sanitizedValue.length > 1) {
            if (this.pastedText) {
              this.handlePastedText(index)
              this.pastedText = null
            } else {
              this.$nextTick(() => {
                this.splitOTP[`${index}`] = sanitizedValue[0]
              })
            }
          } else {
            this.$nextTick(() => {
              this.splitOTP[`${index}`] = sanitizedValue[0]
            })

            if (sanitizedValue[0]) {
              this.$refs[`otp${index + 1}`][0].focus()
            }
          }
        } else {
          this.$nextTick(() => {
            this.splitOTP['5'] = sanitizedValue[0]
          })
        }

        // console.log(`this.splitOTP: ${JSON.stringify(this.splitOTP)}`)
      }
    },
    async submitOTP() {
      this.alert.show = false
      const finalOTP = Object.values(this.splitOTP).join('')
      console.log(`finalOTP: ${finalOTP}`)

      if (this.$refs.form.validate()) {
        this.loading = true
        try {
          const loginSucceeded = await this.$auth.answerCustomChallenge(
            finalOTP
          )
          console.log('loginSucceeded: ', loginSucceeded)
          if (loginSucceeded) {
            this.$router.replace('/')
          } else {
            this.alert.message =
              'Incorrect code. Please try again with the correct code.'
            this.alert.show = true
          }
        } catch (error) {
          console.log('error in OTP: ', error)

          this.alert.message = 'Verification failed. Please try again.'
          if (error.code === 'NotAuthorizedException') {
            if (error.message === 'Incorrect username or password.') {
              this.alert.message =
                'Exhausted maximum attempts. Please retry sign in.'
            } else if (error.message === 'Invalid session for the user.') {
              this.alert.message =
                'Magic code expired. Please request a new code.'
            }

            this.resend.loading = false
            this.resend.show = true
            this.resend.state = null
          }

          this.alert.show = true
        }

        this.loading = false
        for (const i in this.splitOTP) {
          this.splitOTP[i] = ''
        }
      } else {
        this.alert.message =
          'Please enter the magic code you received in your email.'
        this.alert.show = true
      }
    },
    async resendMagicCode() {
      try {
        this.resend.loading = true
        await this.$auth.signIn(this.email)
        this.resend.state = 'done'
      } catch (error) {
        console.log('failed to request another code: ', error)
        this.alert.message =
          'Not able to resend magic code. Please try again later.'
        this.alert.show = true
      }

      this.resend.loading = false
    },
  },
}
</script>

<style lang="scss" scoped>
.otp-box {
  max-width: 13%;

  ::v-deep input {
    text-align: center;
    font-size: 1.75rem;
    line-height: 1.2;
  }
}

.link-disabled {
  pointer-events: none;
  opacity: 0.5;
}
</style>
