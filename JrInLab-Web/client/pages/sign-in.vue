<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" lg="6" align="center">
        <Logo height="56" dark />
        <v-card class="mt-8">
          <v-card-title class="display-1 justify-center font-weight-bold">
            Sign In
          </v-card-title>
        </v-card>
        <v-card class="mt-4">
          <v-card-title primary-title class="subheading">
            {{
              uiState === 'account' ? 'Create account' : 'Sign in with email'
            }}
          </v-card-title>
          <v-divider />
          <v-form ref="form" lazy-validation @submit.prevent="nextClicked">
            <v-card-text>
              <v-text-field
                ref="email"
                v-model="form.email"
                :rules="emailRules"
                label="Your email address"
                type="email"
                validate-on-blur
                outlined
                required
              />
              <v-text-field
                v-if="uiState === 'account'"
                v-model="form.name"
                :rules="nameRules"
                :autofocus="uiState === 'account'"
                label="Your name"
                outlined
                required
                validate-on-blur
              />
              <v-text-field
                v-if="uiState === 'account' || uiState === 'password'"
                v-model="form.password"
                :append-icon="showPassword ? '$mdiEyeOff' : '$mdiEye'"
                :type="showPassword ? 'text' : 'password'"
                :rules="passwordRules"
                :label="
                  uiState === 'account'
                    ? 'Create your password'
                    : 'Your password'
                "
                :autofocus="uiState === 'password'"
                hint="At least 8 characters"
                validate-on-blur
                outlined
                required
                @click:append="showPassword = !showPassword"
              />
              <v-alert v-if="error" :value="true" type="error" dismissible>
                {{ error }}
              </v-alert>
            </v-card-text>
            <v-card-actions class="px-4 pt-0 pb-4">
              <v-spacer />
              <v-btn color="primary" text @click="cancelClicked">
                Cancel
              </v-btn>
              <v-btn
                :disabled="loading"
                :loading="loading"
                color="primary"
                type="submit"
              >
                {{ uiState === 'email' ? 'Next' : 'Submit' }}
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  layout: 'auth',
  data() {
    return {
      form: {
        email: '',
        password: '',
        name: null,
      },
      showPassword: false,
      currentStep: 'email',
      nameRules: [(v) => !!v || 'Please enter your name'],
      emailRules: [
        (v) => !!v || 'Please enter your email address',
        (v) =>
          /^[\w.+-]+@([\w-]+\.)+[\w-]+\S$/.test(v) ||
          'Please enter a valid Email address',
      ],
      passwordRules: [
        (v) => !!v || 'Please enter your password',
        (v) => (v && v.length >= 8) || 'Password must be min 8 characters',
      ],
      loading: false,
      error: null,
    }
  },
  head() {
    return {
      title: 'Login to your account',
      meta: [
        {
          hid: 'robots',
          name: 'robots',
          content: 'noindex',
        },
      ],
    }
  },
  computed: {
    ...mapGetters('user', ['isLoggedIn', 'uiState']),
  },
  watch: {
    isLoggedIn(newVal, oldVal) {
      if (newVal) {
        const path = this.$route.query.next || '/admin'
        this.$router.push(path)
      }
    },
  },
  mounted() {
    this.$refs.email.focus()
  },
  methods: {
    ...mapActions('user', [
      'getSignInMethods',
      'createAccount',
      'signIn',
      'setPageState',
    ]),
    onSuccess() {
      this.loading = false
      this.$refs.form.reset()
      this.setPageState('email')
    },
    onError(error) {
      this.loading = false
      this.error = error.toString()
    },
    async checkUserExists() {
      this.loading = true
      this.error = null
      try {
        await this.getSignInMethods({ email: this.form.email })
      } catch (error) {
        this.error = error.toString()
      }
      this.loading = false
    },
    async submitUserCredentials() {
      this.loading = true
      this.error = null
      try {
        await this.signIn({
          account: {
            email: this.form.email,
            password: this.form.password,
          },
        })
        this.onSuccess()
      } catch (error) {
        this.error = error.toString()
        this.loading = false
      }
    },
    async createUserAccount() {
      this.loading = true
      this.error = null
      try {
        await this.createAccount({
          account: {
            email: this.form.email,
            name: this.form.name,
            password: this.form.password,
          },
        })
        this.onSuccess()
      } catch (error) {
        this.onError(error)
        this.loading = false
      }
    },
    nextClicked() {
      if (this.$refs.form.validate()) {
        switch (this.uiState) {
          case 'email':
            this.checkUserExists()
            break
          case 'password':
            this.submitUserCredentials()
            break
          case 'account':
            this.createUserAccount()
            break
        }
      }
    },
    cancelClicked() {
      this.$refs.form.reset()
      this.loading = false
      this.error = null
      this.setPageState('email')
      this.$refs.email.focus()
    },
  },
}
</script>
