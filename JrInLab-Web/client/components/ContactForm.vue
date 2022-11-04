<template>
  <v-form ref="form" lazy-validation @submit.prevent="submitContactForm">
    <v-text-field
      v-model="form.name"
      :rules="nameRules"
      append-icon="$mdiAccountOutline"
      label="Name"
      outlined
      required
      shaped
      validate-on-blur
    />
    <MobilePhoneField
      v-model="form.phone"
      append-icon="$mdiPhoneOutline"
      label="Mobile No."
      outlined
      shaped
    />
    <v-text-field
      v-model="form.email"
      :rules="emailRules"
      append-icon="$mdiEmailOutline"
      label="Email address"
      outlined
      required
      shaped
      type="email"
      validate-on-blur
    />
    <v-textarea
      v-model="form.message"
      :rules="messageRules"
      append-icon="$mdiMessageTextOutline"
      label="Message / Feedback"
      outlined
      rows="3"
      shaped
      validate-on-blur
    />
    <v-alert v-model="alert.show" :type="alert.type" prominent dismissible>
      {{
        alert.type === 'success' ? alert.message.success : alert.message.failure
      }}
    </v-alert>
    <v-btn
      :disabled="loading"
      :loading="loading"
      x-large
      color="primary"
      type="submit"
    >
      Send Message
      <v-icon right> $mdiArrowRight </v-icon>
    </v-btn>
  </v-form>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      form: {
        name: null,
        email: null,
        phone: { number: null, country: null },
        message: null,
      },
      loading: false,
      alert: {
        show: false,
        type: 'success',
        message: {
          success: 'Thank you! Your message was sent successfully.',
          failure:
            'Oops! Failed to submit your message, please try again later.',
        },
      },
      nameRules: [(v) => !!v || 'Name is required'],
      emailRules: [
        (v) => !!v || 'Email is required',
        (v) =>
          /^[\w.+-]+@([\w-]+\.)+[\w-]+\S$/.test(v) || 'Email must be valid',
      ],
      messageRules: [(v) => !!v || 'Meesage / Feedback is required'],
    }
  },
  methods: {
    ...mapActions('user', ['sendContactMessage']),
    async submitContactForm() {
      this.alert.show = false

      if (this.$refs.form.validate()) {
        this.loading = true
        try {
          const data = {
            name: this.form.name.trim(),
            email: this.form.email.trim(),
            phone: this.form.phone.number.trim(),
            country: {
              name: this.form.phone.country.name,
              dialCode: this.form.phone.country.calling_code,
            },
            message: this.form.message.trim(),
            query: this.$route.query,
          }

          await this.sendContactMessage({ data })

          this.$refs.form.reset()
          this.alert.type = 'success'
        } catch (error) {
          this.alert.type = 'error'
        }

        this.alert.show = true
        this.loading = false
      }
    },
  },
}
</script>
