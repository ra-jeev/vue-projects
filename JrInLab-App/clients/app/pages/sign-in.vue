<template>
  <auth-view image="login.svg">
    <template #default>
      <div class="auth-title">Sign in to JrInLab</div>
      <v-form
        ref="form"
        class="mt-12"
        lazy-validation
        @submit.prevent="submitClicked"
      >
        <v-text-field
          v-model="form.email"
          :error-messages="errors"
          :rules="emailRules"
          label="Enter your email address"
          type="email"
          validate-on-blur
          outlined
          required
        />
        <v-text-field
          v-if="method === 'pwd'"
          v-model="form.password"
          :rules="passwordRules"
          label="Enter your password"
          type="password"
          validate-on-blur
          outlined
          required
        />
        <v-btn
          :disabled="loading"
          :loading="loading"
          block
          class="font-weight-bold"
          color="primary"
          large
          type="submit"
        >
          {{
            method === 'code'
              ? 'Get Magic Sign in code'
              : 'Sign in with password'
          }}
        </v-btn>
        <v-alert
          v-if="method === 'code'"
          class="mt-4 mb-0 text-left"
          color="primary"
          icon="$mdiInformation"
          prominent
          text
        >
          We will send a magic code to your email address for an easy &amp;
          password-less sign in.
        </v-alert>
        <div class="mt-4">OR</div>
        <v-btn
          block
          class="font-weight-bold mt-4"
          color="primary"
          large
          outlined
          @click.stop="secondaryBtnClicked"
        >
          {{
            method === 'code'
              ? 'Sign in with Password'
              : 'Get Magic Sign in code'
          }}
        </v-btn>
      </v-form>
      <div class="auth-prompt mt-6">
        Don't have an account?
        <nuxt-link to="/sign-up" class="app-link font-weight-bold">
          Sign up now
        </nuxt-link>
      </div>
    </template>
  </auth-view>
</template>

<script>
export default {
  name: 'SignInPage',
  layout: 'auth',
  data() {
    return {
      form: {
        email: '',
        password: null,
      },
      loading: false,
      method: 'code',
      errors: [],
      emailRules: [
        (v) => !!v || 'Please enter your email address',
        (v) =>
          /^[\w.+-]+@([\w-]+\.)+[\w-]+\S$/.test(v) ||
          'Please enter a valid Email address',
      ],
      passwordRules: [(v) => !!v || 'Please enter your password'],
    }
  },
  methods: {
    secondaryBtnClicked() {
      if (this.method === 'code') {
        this.method = 'pwd'
      } else if (this.method === 'pwd') {
        this.method = 'code'
        this.form.password = null
      }
    },
    async submitClicked() {
      console.log('submit clicked')
      this.errors = []
      if (this.$refs.form.validate()) {
        console.log('form validated')
        this.loading = true
        try {
          await this.$auth.signIn(this.form.email, this.form.password)

          if (this.method === 'code') {
            this.$router.push({
              name: 'verify-email',
              params: { email: this.form.email },
            })
          } else {
            this.$router.replace('/')
          }
        } catch (error) {
          this.errors.push(
            `Is this the correct email address? If you don't have an account, you can create one by clicking the link below.`
          )
        }

        this.loading = false
      }
    },
  },
}
</script>
