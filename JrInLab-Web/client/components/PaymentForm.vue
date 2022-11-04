<template>
  <v-form ref="form" lazy-validation @submit.prevent="bookDemoClass">
    <div v-if="selectedSlot.date && selectedSlot.time" class="slot-info">
      Your picked slot:
      <strong>
        {{ selectedSlot.date.date }},
        {{ selectedSlot.time.time }}
      </strong>
    </div>
    <v-text-field
      v-model="form.parentsName"
      :rules="parentNameRules"
      dense
      label="Parent's Name *"
      outlined
      required
      validate-on-blur
    />
    <v-text-field
      v-model="form.parentsEmail"
      :rules="emailRules"
      dense
      label="Parent's Email ID *"
      outlined
      type="email"
      required
      validate-on-blur
    />
    <MobilePhoneField v-model="form.phone" dense outlined />
    <v-text-field
      v-model="form.kidsName"
      :rules="kidsNameRules"
      dense
      label="Kid's Name *"
      outlined
      required
      validate-on-blur
    />
    <v-text-field
      ref="kidsAge"
      v-model="form.kidsAge"
      :rules="kidsAgeRules"
      :error-messages="ageErrors"
      dense
      label="Kid's Age *"
      suffix="years"
      outlined
      required
      validate-on-blur
      @input="sanitizekidsAge"
    />
    <v-alert v-model="alert.show" :type="alert.type" prominent dismissible>
      {{
        alert.type === 'success' ? alert.message.success : alert.message.failure
      }}
    </v-alert>
    <v-row>
      <v-col>
        <v-btn rounded block text color="primary" @click="$emit('go-back')">
          <v-icon left> $mdiArrowLeft </v-icon>
          Back
        </v-btn>
      </v-col>
      <v-col>
        <v-btn
          :disabled="loading"
          :loading="loading"
          rounded
          block
          color="primary"
          type="submit"
        >
          {{ buttonText }}
          <v-icon right> $mdiArrowRight </v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <div class="terms-text">
      By clicking {{ buttonText }}, you agree to our
      <a :href="termsUrl" target="_blank">Terms of Use</a>
      and
      <a :href="privacyUrl" target="_blank"> Privacy Policy </a>.
    </div>
  </v-form>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    selectedSlot: {
      type: Object,
      required: true,
    },
    btnText: {
      type: String,
      required: true,
    },
    formPage: {
      type: String,
      required: true,
    },
    directEnroll: {
      type: Boolean,
      default: false,
    },
    workshopName: {
      type: String,
      required: true,
    },
    workshopFee: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      form: {
        parentsName: null,
        parentsEmail: null,
        phone: {
          country: null,
          number: null,
        },
        kidsName: null,
        kidsAge: null,
      },
      loading: false,
      alert: {
        show: false,
        type: 'success',
        message: {
          success: `Thank you! Your request was submitted successfully. We'll get back to you shortly.`,
          failure: `Oops! Failed to submit your request, please try again later.`,
        },
      },
      parentNameRules: [(v) => !!v || `Parent's name is required`],
      kidsNameRules: [(v) => !!v || `Kids's name is required`],
      kidsAgeRules: [(v) => !!v || `Kid's age is required`],
      emailRules: [
        (v) => !!v || `Parent's email ID is required`,
        (v) =>
          /^[\w.+-]+@([\w-]+\.)+[\w-]+\S$/.test(v) ||
          `Please enter a valid email ID`,
      ],
      ageErrors: [],
    }
  },
  computed: {
    buttonText() {
      return this.workshopFee ? this.btnText : 'Submit'
    },
    termsUrl() {
      const resolvedUrl = this.$router.resolve({
        path: '/terms',
        query: this.$route.query,
      })

      return resolvedUrl.href
    },
    privacyUrl() {
      const resolvedUrl = this.$router.resolve({
        path: '/privacy',
        query: this.$route.query,
      })

      return resolvedUrl.href
    },
  },
  methods: {
    ...mapActions('user', ['bookDemo']),
    sanitizekidsAge(value) {
      if (value) {
        const sanitizedValue = value.replace(/\D/g, '')
        if (sanitizedValue !== value) {
          this.ageErrors.push('Only digits are allowed for this field')
          this.$nextTick(() => {
            this.form.kidsAge = sanitizedValue
          })

          setTimeout(() => {
            this.ageErrors = []
          }, 2000)
        } else {
          this.ageErrors = []
        }
      }
    },
    async bookDemoClass() {
      this.alert.show = false
      if (this.$refs.form.validate()) {
        const data = {
          page: this.formPage,
          parentsName: this.form.parentsName.trim(),
          parentsEmail: this.form.parentsEmail.trim(),
          parentsPhone: this.form.phone.number.trim(),
          country: {
            name: this.form.phone.country.name,
            dialCode: this.form.phone.country.calling_code,
          },
          kidsName: this.form.kidsName.trim(),
          kidsAge: this.form.kidsAge.trim(),
          query: this.$route.query,
        }

        if (this.selectedSlot.time) {
          data.timeSlot = this.selectedSlot.time.name
          data.workshopName = this.workshopName
          data.workshopFee = this.workshopFee
        }

        data.directEnroll = this.directEnroll

        try {
          this.loading = true
          await this.bookDemo({ data })
          this.$refs.kidsAge.blur()
          this.$refs.form.reset()
          this.alert.type = 'success'
        } catch (error) {
          this.alert.type = 'error'
        }

        // this.alert.show = true
        this.loading = false
        this.$emit('form-filled', data)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.slot-info {
  font-size: 1rem;
  line-height: 1.625;
  margin-bottom: 16px;
  color: rgba(0, 0, 0, 0.6);
}

.terms-text {
  font-size: 1.125rem;
  text-align: center;
  margin-top: 20px;
}
</style>
