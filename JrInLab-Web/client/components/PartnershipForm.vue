<template>
  <v-form ref="form" lazy-validation @submit.prevent="submitForm">
    <v-card class="pa-4" outlined shaped>
      <v-card-title class="card-title">
        Get Your School The JrInLab Edge
      </v-card-title>
      <v-card-text class="mt-4">
        <v-text-field
          v-model="form.name"
          :rules="[requiredRules('Your name')]"
          append-icon="$mdiAccountOutline"
          label="Your name *"
          outlined
          required
          shaped
          validate-on-blur
        />
        <v-select
          v-model="form.role"
          :items="roles"
          :rules="[requiredRules('Your role')]"
          label="Your role at School *"
          outlined
          required
          shaped
        />
        <MobilePhoneField
          v-model="form.phone"
          append-icon="$mdiPhoneOutline"
          label="Your Mobile No."
          outlined
          shaped
        />
        <v-text-field
          v-model="form.school"
          :rules="[requiredRules('School name')]"
          append-icon="$mdiCastEducation"
          label="School name *"
          outlined
          required
          shaped
          validate-on-blur
        />
        <v-textarea
          v-model="form.message"
          append-icon="$mdiMessageTextOutline"
          label="Your Message"
          outlined
          rows="2"
          shaped
          validate-on-blur
        />
        <v-alert v-model="alert.show" :type="alert.type" prominent dismissible>
          {{
            alert.type === 'success'
              ? alert.message.success
              : alert.message.failure
          }}
        </v-alert>
        <v-btn
          :disabled="loading"
          :loading="loading"
          block
          color="secondary"
          rounded
          type="submit"
          x-large
        >
          Submit
          <v-icon right> $mdiArrowRight </v-icon>
        </v-btn>
      </v-card-text>
    </v-card>
  </v-form>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      form: {
        name: null,
        school: null,
        role: null,
        phone: { number: null, country: null },
        message: null,
      },
      loading: false,
      roles: [
        'School Owner',
        'Trustee / Director',
        'Principal',
        'Teacher',
        'Other',
      ],
      alert: {
        show: false,
        type: 'success',
        message: {
          success:
            "Thank you! Your request was successful. We'll reach out to you soon.",
          failure:
            'Oops! Failed to submit your message, please try again later.',
        },
      },
      requiredRules: (type) => {
        return (v) => !!v || `${type} is required.`
      },
    }
  },
  methods: {
    ...mapActions('user', ['sendPartnershipMessage']),
    async submitForm() {
      this.alert.show = false

      if (this.$refs.form.validate()) {
        this.loading = true
        try {
          const data = {
            name: this.form.name.trim(),
            school: this.form.school.trim(),
            role: this.form.role,
            phone: this.form.phone.number.trim(),
            country: {
              name: this.form.phone.country.name,
              dialCode: this.form.phone.country.calling_code,
            },
            query: this.$route.query,
          }

          if (this.form.message) {
            data.message = this.form.message.trim()
          }

          await this.sendPartnershipMessage({ data })

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

<style scoped>
.card-title {
  font-size: 2rem;
  line-height: 2.25rem;
  font-weight: 700;
  text-align: center;
  justify-content: center;
  letter-spacing: 0.0073529412em !important;
}

@media only screen and (max-width: 599px) {
  .card-title {
    font-size: 1.5rem;
    line-height: 1.75rem;
  }
}
</style>
