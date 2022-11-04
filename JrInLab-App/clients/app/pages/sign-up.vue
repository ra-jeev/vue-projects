<template>
  <auth-view image="maker_launch.svg">
    <template #default>
      <div class="auth-title">Sign up for JrInLab</div>
      <v-form
        ref="form"
        class="mt-8"
        lazy-validation
        @submit.prevent="submitClicked"
      >
        <v-window v-model="signUpStep">
          <v-window-item ref="window_1" :value="1">
            <v-text-field
              v-model="form.name"
              :rules="[requiredRules('Name')]"
              label="Enter your name"
              validate-on-blur
              outlined
              required
            />

            <v-text-field
              v-model="form.email"
              :rules="[requiredRules('Email'), emailRules]"
              label="Enter your email address"
              type="email"
              validate-on-blur
              outlined
              required
            />
          </v-window-item>
          <v-window-item ref="window_2" :value="2">
            <v-text-field
              v-model="form.password"
              :rules="[requiredRules('Password')]"
              label="Create your password"
              type="password"
              validate-on-blur
              outlined
              required
            />
            <v-text-field
              v-model="form.verifyPassword"
              :rules="passwordMatchRules"
              label="Retype your password"
              type="password"
              validate-on-blur
              outlined
              required
            />
          </v-window-item>
        </v-window>

        <!-- <v-btn
                :disabled="loading"
                :loading="loading"
                block
                class="font-weight-bold"
                color="primary"
                large
                type="submit"
              >
                Get Sign up code
              </v-btn> -->

        <v-row justify="center">
          <v-col cols="12">
            <v-btn
              :disabled="loading"
              :loading="loading"
              block
              class="font-weight-bold"
              color="primary"
              type="submit"
            >
              {{
                signUpStep === 1
                  ? 'Sign Up Using Magic Code'
                  : 'Create your account'
              }}
            </v-btn>
            <v-alert
              v-if="signUpStep === 1"
              class="mt-4 mb-0 text-left"
              color="primary"
              icon="$mdiInformation"
              prominent
              text
            >
              We will send a magic code to your email address for an easy &amp;
              password-less sign up.
            </v-alert>
          </v-col>
          <span v-if="signUpStep === 1"> OR </span>
          <v-col cols="12">
            <v-btn
              block
              class="font-weight-bold"
              color="primary"
              outlined
              @click.stop="secondaryBtnClicked"
            >
              {{ signUpStep === 1 ? 'Sign up with Password' : 'Back' }}
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
      <div class="auth-prompt mt-4">
        Already have an account?
        <nuxt-link class="app-link font-weight-bold" to="/sign-in">
          Sign in now
        </nuxt-link>
      </div>
      <div class="mt-4 grey--text text--darken-1">
        By signing up, you agree to our
        <a
          class="app-link"
          href="https://www.jrinlab.com/terms"
          target="_blank"
        >
          Terms of Use
        </a>
        &amp;
        <a
          class="app-link"
          href="https://www.jrinlab.com/privacy"
          target="_blank"
        >
          Privacy Policy
        </a>
      </div>
    </template>
  </auth-view>
</template>

<script>
export default {
  name: 'SignupPage',
  layout: 'auth',
  data() {
    return {
      form: {
        email: '',
        name: '',
        password: null,
        verifyPassword: null,
      },
      loading: false,
      signUpStep: 1,
      requiredRules: (type) => {
        return (v) => !!v || `${type} can't be empty.`
      },
      emailRules: (v) =>
        /^[\w.+-]+@([\w-]+\.)+[\w-]+\S$/.test(v) ||
        'Please enter a valid Email address',
      passwordMatchRules: [
        (v) => !!v || 'Please retype your password',
        (v) => {
          if (v) {
            if (v !== this.form.password) {
              return 'Entered passwords do not match.'
            }
            return true
          }
          return 'Password verification failed'
        },
      ],
    }
  },

  methods: {
    secondaryBtnClicked() {
      console.log(
        `secondaryBtnClicked clicked: this.signUpStep : ${this.signUpStep}`
      )
      if (this.signUpStep === 1) {
        if (this.$refs.form.validate()) {
          this.signUpStep++
        } else {
          let hasError = false
          for (const child of this.$refs[`window_${this.signUpStep}`]
            .$children) {
            if (child.hasError) {
              hasError = true
              break
            }
          }

          if (!hasError) {
            this.signUpStep++
          }
        }
      } else {
        this.signUpStep--
      }
    },
    async submitClicked() {
      console.log(`submit clicked:`)
      if (this.$refs.form.validate()) {
        if (this.signUpStep === 1) {
          this.form.password = null
          this.form.verifyPassword = null
        }

        this.loading = true
        console.log('form validated:: this.form: ', JSON.stringify(this.form))

        try {
          await this.$auth.signUp(
            this.form.email,
            this.form.name,
            this.form.password
          )

          await this.$auth.signIn(this.form.email, this.form.password)

          // if (this.form.password) {
          //   await this.$auth.verifyEmail()
          // }

          if (this.signUpStep === 1) {
            this.$router.push({
              name: 'verify-email',
              params: { email: this.form.email },
            })
          } else {
            this.$router.replace('/')
          }
        } catch (error) {
          console.log('Sign up error: ', error)
          console.log('Error message: ', error.message || 'Unknown')
        }

        this.loading = false
      }
    },
  },
}
</script>
