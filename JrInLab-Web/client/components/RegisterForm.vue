<template>
  <v-form ref="form" lazy-validation @submit.prevent="bookDemoClass">
    <v-text-field
      v-model="form.parentsName"
      :rules="parentNameRules"
      label="Parent's Name *"
      outlined
      required
      validate-on-blur
    />
    <v-text-field
      v-model="form.parentsEmail"
      :rules="emailRules"
      label="Parent's Email ID *"
      outlined
      type="email"
      required
      validate-on-blur
    />
    <MobilePhoneField
      v-model="form.phone"
      :default-country-code="defaultCountryCode"
      :hint="mobileNumberHint"
      outlined
    />
    <v-text-field
      v-model="form.kidsName"
      :rules="kidsNameRules"
      label="Kid's Name *"
      outlined
      required
      validate-on-blur
    />
    <v-select
      v-if="schoolWebinar"
      v-model="form.kidsGrade"
      :items="grades"
      :rules="kidsGradeRules"
      label="Kid's Grade *"
      outlined
      required
      validate-on-blur
    />
    <v-text-field
      ref="kidsAge"
      v-model="form.kidsAge"
      :rules="kidsAgeRules"
      :error-messages="ageErrors"
      label="Kid's Age *"
      suffix="years"
      outlined
      required
      validate-on-blur
      @input="sanitizekidsAge"
    />
    <template v-if="timeSlots && timeSlots.length">
      <div :class="{ 'error--text': timeSlotError }" class="radio-label">
        Please pick your <strong>preferred time slot</strong>
      </div>
      <v-radio-group
        ref="timeSlot"
        v-model="form.timeSlot"
        :mandatory="timeSlotMandatory"
        :rules="timeSlotRules"
        class="mt-0 mb-3"
        row
      >
        <v-radio
          v-for="timeSlot in timeSlots"
          :key="timeSlot.value"
          :label="timeSlot.label"
          :value="timeSlot.value"
        />
      </v-radio-group>
    </template>
    <template v-if="batches && batches.length">
      <div :class="{ 'error--text': batchError }" class="radio-label">
        Please select your
        <strong>
          preferred {{ isTypeWorkshop ? 'workshop(s)' : 'camp(s)' }}
        </strong>
      </div>
      <v-checkbox
        v-for="batch in batches"
        :key="batch.value"
        v-model="form.batches"
        :value="batch.value"
        class="mt-2"
        hide-details
      >
        <template #label>
          <span :class="{ 'error--text': batchError }">{{ batch.label }}</span>
        </template>
      </v-checkbox>
      <div class="mb-4" />
    </template>
    <template v-if="getLaptopAvailability">
      <div :class="{ 'error--text': laptopError }" class="radio-label">
        Do you've a <strong>laptop / desktop</strong> for the classes?
      </div>
      <v-radio-group
        ref="laptop"
        v-model="form.hasLaptop"
        :rules="laptopRules"
        class="mt-0 mb-3"
        row
      >
        <v-radio :value="true" label="Yes" />
        <v-radio :value="false" label="No" />
      </v-radio-group>
    </template>
    <v-alert v-model="alert.show" :type="alert.type" prominent dismissible>
      {{
        alert.type === 'success' ? alert.message.success : alert.message.failure
      }}
    </v-alert>
    <v-btn
      :color="btnColor"
      :disabled="loading"
      :loading="loading"
      class="font-weight-bold"
      block
      large
      rounded
      type="submit"
    >
      {{ btnText }}
      <v-icon right> $mdiArrowRight </v-icon>
    </v-btn>
    <div class="terms-text">
      By clicking submit, you agree to our
      <a :href="termsUrl" target="_blank">Terms of Use</a>
      and
      <a :href="privacyUrl" target="_blank"> Privacy Policy </a>.
    </div>
  </v-form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  props: {
    btnText: {
      type: String,
      required: true,
    },
    btnColor: {
      type: String,
      default: 'primary',
    },
    fbTrackEvent: {
      type: String,
      default: undefined,
    },
    googleTrackEvent: {
      type: String,
      default: undefined,
    },
    formPage: {
      type: String,
      required: true,
    },
    directEnroll: {
      type: Boolean,
      default: false,
    },
    successPage: {
      type: String,
      default: undefined,
    },
    schoolWebinar: {
      type: Boolean,
      default: false,
    },
    defaultCountryCode: {
      type: Object,
      default: () => {
        return { name: 'India', dialCode: '+91' }
      },
    },
    laptopMandatory: {
      type: Boolean,
      default: true,
    },
    getLaptopAvailability: {
      type: Boolean,
      default: true,
    },
    timeSlots: {
      type: Array,
      default: undefined,
    },
    timeSlotMandatory: {
      type: Boolean,
      default: false,
    },
    batches: {
      type: Array,
      default: undefined,
    },
    isTypeWorkshop: {
      type: Boolean,
      default: true,
    },
    workshopName: {
      type: String,
      default: null,
    },
    campaignName: {
      type: String,
      default: null,
    },
    workshopFee: {
      type: Number,
      default: 0,
    },
    mobileNumberHint: {
      type: String,
      default:
        'To change country, please click on the flag / dropdown menu icon',
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
        kidsGrade: null,
        promoCode: null,
        timeSlot: null,
        hasLaptop: null,
        batches: [],
      },
      loading: false,
      alert: {
        show: false,
        type: 'success',
        errors: {
          age: `Thank you for your interest. Unfortunately we don't have any suitable course for this age group at the moment.`,
          laptop: `Thank you for your interest, but a laptop / desktop is a must to attend the demo class.`,
          default: `Oops! Failed to submit your request, please try again later.`,
        },
        message: {
          success: `Thank you! Your request was submitted successfully. We'll get back to you within the next 24 Hrs.`,
          failure: `Oops! Failed to submit your request, please try again later.`,
        },
      },
      parentNameRules: [(v) => !!v || `Parent's name is required`],
      kidsNameRules: [(v) => !!v || `Kids's name is required`],
      kidsAgeRules: [(v) => !!v || `Kid's age is required`],
      kidsGradeRules: [(v) => !!v || `Kid's grade is required`],
      timeSlotRules: [(v) => !!v || `Please pick your preferred slot`],
      emailRules: [
        (v) => !!v || `Parent's email ID is required`,
        (v) =>
          /^[\w.+-]+@([\w-]+\.)+[\w-]+\S$/.test(v) ||
          `Please enter a valid email ID`,
      ],
      laptopRules: [
        (v) =>
          !!v ||
          v === false ||
          `Please select your laptop / desktop availability`,
      ],
      ageErrors: [],
      grades: [
        { text: 'Class IV', value: '4' },
        { text: 'Class V', value: '5' },
        { text: 'Class VI', value: '6' },
        { text: 'Class VII', value: '7' },
        { text: 'Class VIII', value: '8' },
        { text: 'Class IX', value: '9' },
        { text: 'Class X', value: '10' },
      ],
      laptopError: false,
      timeSlotError: false,
      batchError: false,
    }
  },
  computed: {
    ...mapGetters('user', ['demoBookingId']),
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
  watch: {
    'form.hasLaptop'() {
      this.laptopError = false
    },
    'form.timeSlot'() {
      this.timeSlotError = false
    },
    'form.batches'() {
      this.batchError = false
    },
  },
  methods: {
    ...mapActions('user', ['bookDemo', 'bookRejectedDemo']),
    sanitizekidsAge(value) {
      if (value) {
        const sanitizedValue = value.replace(/\D/g, '')
        if (sanitizedValue !== value) {
          this.ageErrors = ['Only numbers are allowed for this field']
          this.$nextTick(() => {
            this.form.kidsAge = sanitizedValue
          })

          setTimeout(() => {
            this.ageErrors = []
          }, 2000)
        } else {
          const removeLeadingZeroes = value.replace(/^0/g, '')
          this.$nextTick(() => {
            this.form.kidsAge = removeLeadingZeroes
          })

          this.ageErrors = []
        }
      }
    },
    async bookDemoClass() {
      this.alert.show = false

      if (this.$refs.form.validate()) {
        let error
        if (this.form.kidsAge < 5 || this.form.kidsAge > 15) {
          error = this.alert.errors.age
        } else if (this.laptopMandatory && !this.form.hasLaptop) {
          error = this.alert.errors.laptop
        }

        if (this.batches && this.batches.length && !this.form.batches.length) {
          this.batchError = true
          return
        }

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

        data.directEnroll = this.directEnroll
        if (this.schoolWebinar) {
          data.directEnroll = true
          data.kidsGrade = this.form.kidsGrade
          data.schoolWebinar = true
        }

        if (this.getLaptopAvailability) {
          data.hasLaptop = this.form.hasLaptop
        }

        if (this.timeSlots && this.timeSlots.length) {
          const slot = this.timeSlots.find(
            (slot) => slot.value === this.form.timeSlot
          )

          data.timeSlot = slot
        }

        if (this.workshopName) {
          data.workshopName = this.workshopName
          data.workshopFee = this.workshopFee
        }

        if (this.batches && this.batches.length) {
          data.batches = this.form.batches
        }

        if ((!data.query || !data.query.utm_campaign) && this.campaignName) {
          if (!data.query) {
            data.query = {}
          }

          data.query.utm_campaign = this.campaignName
        }

        try {
          const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
          const offset = new Date().getTimezoneOffset()
          data.systemTime = {
            zone: timezone || 'Not found',
            offset: offset || 'Not found',
          }
        } catch (err) {}

        if (error) {
          try {
            await this.bookRejectedDemo({ data })
          } catch (error) {}

          this.alert.type = 'error'
          this.alert.message.failure = error
          this.alert.show = true
          return
        }

        try {
          this.loading = true
          await this.bookDemo({ data })
          if (this.fbTrackEvent) {
            this.$fb.track(this.fbTrackEvent, {
              currency: 'INR',
              value: '1',
              booking_id: this.demoBookingId,
            })
          }

          if (this.googleTrackEvent) {
            this.$fire.analytics.logEvent(this.googleTrackEvent, {
              currency: 'INR',
              value: '1',
              booking_id: this.demoBookingId,
            })

            this.$gtag.event('conversion', {
              send_to: 'AW-419410625/y6cfCI-928EDEMHl_scB',
              currency: 'INR',
              value: '1',
              booking_id: this.demoBookingId,
            })
          }

          this.$refs.kidsAge.blur()
          this.$refs.form.reset()
          this.alert.type = 'success'
          if (this.successPage) {
            this.$router.replace({
              path: this.successPage,
              query: { reference: this.demoBookingId },
            })
          } else {
            this.alert.show = true
          }
        } catch (error) {
          this.alert.type = 'error'
          this.alert.show = true
          this.alert.message.failure = this.alert.errors.default
        }

        this.loading = false
      }

      if (this.$refs.laptop && this.$refs.laptop.hasError) {
        this.laptopError = true
      }

      if (this.$refs.timeSlot && this.$refs.timeSlot.hasError) {
        this.timeSlotError = true
      }

      if (this.batches && this.batches.length && !this.form.batches.length) {
        this.batchError = true
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.radio-label {
  font-size: 1rem;
  letter-spacing: 0.0125em !important;
}

.terms-text {
  text-align: center;
  margin-top: 20px;
}
</style>
