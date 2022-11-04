<template>
  <MarketingContainer>
    <template #header-bg>
      <div class="header-bg" />
    </template>
    <template #header>
      <div class="page-headline">
        #Coding Workshop
        <v-icon dark large right> $mdiLaptop </v-icon>
      </div>
    </template>
    <template #default>
      <div
        style="min-height: 400px"
        :class="{
          'd-flex align-center':
            detailsLoading || !activeWorkshop || activeWorkshop.archived,
        }"
      >
        <v-row v-if="detailsLoading" justify="center" no-gutters>
          <v-progress-circular color="primary" indeterminate size="48" />
        </v-row>

        <template v-else>
          <v-row v-if="activeWorkshop && !activeWorkshop.archived">
            <v-col cols="12" sm="6">
              <v-card class="form-container" flat>
                <v-window id="form" v-model="step">
                  <v-window-item :value="1">
                    <v-card-text>
                      <v-img :src="activeWorkshop.thumb" contain />

                      <div class="form-title mt-6">
                        {{ currentTitle }}
                      </div>

                      <div class="mt-1">
                        <v-chip
                          v-for="tag in activeWorkshop.tags"
                          :key="tag"
                          class="tag tag--small ma-1"
                          color="accent"
                          label
                          small
                        >
                          {{ tag }}
                        </v-chip>
                      </div>
                      <v-row class="mt-5">
                        <v-col>
                          <div class="details-label">
                            {{ activeWorkshop.duration.label }}
                          </div>
                          <div class="details-text">
                            {{ activeWorkshop.duration.value }}
                          </div>
                        </v-col>
                        <v-col v-if="activeWorkshop.sessions">
                          <div class="details-label">
                            {{ activeWorkshop.sessions.label }}
                          </div>
                          <div class="details-text">
                            {{ activeWorkshop.sessions.value }}
                          </div>
                        </v-col>
                      </v-row>
                      <v-row class="mt-2">
                        <v-col>
                          <div class="details-label">
                            {{ activeWorkshop.ages.label }}
                          </div>
                          <div class="details-text">
                            {{ activeWorkshop.ages.value }}
                          </div>
                        </v-col>
                        <v-col>
                          <div class="details-label">
                            {{ activeWorkshop.fee.label }}
                          </div>
                          <div class="details-text">
                            <template v-if="activeWorkshop.fee.value">
                              {{
                                `${activeWorkshop.fee.currency} ${activeWorkshop.fee.value} Only`
                              }}
                            </template>
                            <template v-else> Absolutely Free </template>
                          </div>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col>
                          <div class="details-label">
                            {{ activeWorkshop.schedules.label }}
                          </div>
                          <v-chip-group
                            v-model="selectedSlot.dateIndex"
                            active-class="primary white--text"
                            column
                          >
                            <v-chip
                              v-for="schedule in activeWorkshop.schedules.dates"
                              :key="schedule.name"
                              filter
                            >
                              {{ schedule.date }}
                            </v-chip>
                          </v-chip-group>
                        </v-col>
                      </v-row>
                      <v-row v-if="slots.length">
                        <v-col class="pt-0">
                          <div class="details-label">
                            {{ activeWorkshop.schedules.slotLabel }}
                          </div>
                          <v-chip-group
                            v-model="selectedSlot.timeIndex"
                            active-class="primary white--text"
                            column
                          >
                            <v-chip
                              v-for="slot in slots"
                              :key="slot.name"
                              :disabled="slot.full"
                              filter
                            >
                              <span :class="{ 'slot-full': slot.full }">
                                {{ slot.time }}
                              </span>
                              <span v-if="slot.full" class="ml-1">FULL</span>
                            </v-chip>
                          </v-chip-group>
                        </v-col>
                      </v-row>
                      <v-btn
                        rounded
                        block
                        color="primary"
                        class="mt-4"
                        @click="onRegisterForWorkshop"
                      >
                        {{ buttonText }}
                        <v-icon right> $mdiArrowRight </v-icon>
                      </v-btn>
                    </v-card-text>
                  </v-window-item>

                  <v-window-item :value="2">
                    <v-card-text>
                      <div class="form-title">
                        {{ currentTitle }}
                      </div>

                      <PaymentForm
                        :workshop-fee="activeWorkshop.fee.value"
                        :workshop-name="activeWorkshop.title"
                        :selected-slot="selectedSlot"
                        btn-text="Next"
                        direct-enroll
                        form-page="code-a-game"
                        class="mt-4"
                        @form-filled="onPersonalDetailsFilled"
                        @go-back="step--"
                      />
                    </v-card-text>
                  </v-window-item>

                  <v-window-item :value="3">
                    <v-card-text>
                      <div class="form-title">
                        {{ currentTitle }}
                      </div>

                      <v-form
                        ref="subform"
                        class="mt-4"
                        lazy-validation
                        @submit.prevent="handlePayment"
                      >
                        <v-text-field
                          v-model="form.addressLine"
                          dense
                          label="Address"
                          outlined
                          required
                          validate-on-blur
                        />

                        <v-text-field
                          v-model="form.city"
                          :rules="cityRules"
                          dense
                          label="City *"
                          outlined
                          required
                          validate-on-blur
                        />

                        <v-autocomplete
                          v-if="form.country.country === 'India'"
                          v-model="form.state"
                          :items="states"
                          :rules="stateRules"
                          dense
                          label="State *"
                          outlined
                          required
                          validate-on-blur
                        />

                        <v-text-field
                          v-else
                          v-model="form.state"
                          dense
                          label="State / County"
                          outlined
                          required
                          validate-on-blur
                        />

                        <!-- <v-text-field
                        v-model="form.country"
                        :rules="countryRules"
                        readonly
                        dense
                        label="Country *"
                        outlined
                        required
                        validate-on-blur
                      /> -->

                        <v-autocomplete
                          v-model="form.country"
                          :items="countries"
                          :rules="countryRules"
                          dense
                          item-text="country"
                          label="Country *"
                          outlined
                          required
                          return-object
                          validate-on-blur
                        />

                        <v-text-field
                          v-model="form.pinCode"
                          dense
                          label="Pin code"
                          outlined
                          required
                          validate-on-blur
                        />

                        <v-btn
                          :disabled="loading"
                          :loading="loading"
                          rounded
                          block
                          color="primary"
                          type="submit"
                        >
                          Pay now
                          <v-icon right> $mdiCreditCardOutline </v-icon>
                        </v-btn>
                      </v-form>
                    </v-card-text>
                  </v-window-item>

                  <v-window-item :value="4">
                    <v-card-text>
                      <div class="form-title text-center">
                        {{ currentTitle }}
                      </div>
                      <v-row
                        align="center"
                        justify="center"
                        style="min-height: 200px"
                      >
                        <div class="text-center">
                          <div class="grey--text title mb-4">
                            Please wait...
                          </div>
                          <v-progress-circular
                            v-if="confirmingPayment"
                            color="primary"
                            indeterminate
                            size="36"
                          />
                        </div>
                      </v-row>
                    </v-card-text>
                  </v-window-item>
                </v-window>
                <v-alert
                  v-model="alert.show"
                  type="error"
                  prominent
                  dismissible
                >
                  {{ alert.text }}
                </v-alert>
              </v-card>
            </v-col>
            <v-col cols="12" sm="6" order-sm="first">
              <v-card flat class="assertions-container transparent">
                <div
                  v-for="(benefit, index) in activeWorkshop.benefits"
                  :key="`benefit_${index}`"
                  class="assertion"
                >
                  <div class="assertion-title d-flex align-center">
                    <v-icon left class="assertion-check"> $mdiCheck </v-icon>
                    {{ benefit.title }}
                  </div>
                  <div class="assertion-text" v-text="benefit.description" />
                </div>
                <v-btn
                  class="mt-6 hidden-sm-and-up"
                  large
                  rounded
                  block
                  color="primary"
                  @click="onSecondaryRegister"
                >
                  {{ buttonText }}
                  <v-icon right> $mdiArrowUp </v-icon>
                </v-btn>
              </v-card>
            </v-col>
          </v-row>
          <v-row v-else align="center" justify="center">
            <v-col cols="12" sm="8" md="6" align="center">
              <div class="no-workshop">
                <h2 class="no-workshop--title">No active workshops found</h2>
                <div class="mt-10 no-workshop--description">
                  We'll be back with new workshops shortly. <br />
                  Register for a free demo class instead.
                </div>
              </div>
              <CtaBtn
                btn-text="Book a free demo class"
                color="primary"
                to="register"
                class="mt-12"
                large
              />
            </v-col>
          </v-row>
        </template>
      </div>
    </template>
    <template #details>
      <div class="section bg--lighter">
        <v-container>
          <GallerySection
            :media="media"
            header="Some games created by our students"
          />
          <v-row
            v-if="activeWorkshop && !activeWorkshop.archived"
            justify="center"
            no-gutters
          >
            <v-btn
              class="mt-6"
              large
              rounded
              color="primary"
              @click="onSecondaryRegister"
            >
              {{ buttonText }}
              <v-icon right> $mdiArrowUp </v-icon>
            </v-btn>
          </v-row>
        </v-container>
      </div>
    </template>
  </MarketingContainer>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import countriesData from '~/assets/data/countries.json'

export default {
  layout: 'marketing',
  data() {
    return {
      countries: Object.freeze(countriesData),
      detailsLoading: false,
      confirmingPayment: false,
      loading: false,
      selectedSlot: {
        dateIndex: undefined,
        timeIndex: undefined,
        date: null,
        time: null,
      },
      alert: {
        show: false,
        text: null,
        options: {
          slot: 'Please pick a time slot by clicking on your preferred workshop date',
          order: 'Failed to process your request, please try again.',
          payment:
            'Failed to confirm your payment. Please get in touch with us at support@jrinlab.com',
        },
      },
      savedReferenceId: null,
      personalDetails: {},
      form: {
        addressLine: null,
        city: null,
        state: null,
        country: 'India',
        pinCode: null,
      },
      states: [
        'Andhra Pradesh',
        'Arunachal Pradesh',
        'Assam',
        'Bihar',
        'Chattisgarh',
        'Delhi',
        'Goa',
        'Gujarat',
        'Haryana',
        'Himachal Pradesh',
        'Jammu and Kashmir',
        'Jharkhand',
        'Karnataka',
        'Kerala',
        'Lakshadweep Islands',
        'Madhya Pradesh',
        'Maharashtra',
        'Manipur',
        'Meghalaya',
        'Mizoram',
        'Nagaland',
        'Odisha',
        'Pondicherry',
        'Punjab',
        'Rajasthan',
        'Sikkim',
        'Tamil Nadu',
        'Telangana',
        'Tripura',
        'Uttar Pradesh',
        'Uttarakhand',
        'West Bengal',
        'Andaman and Nicobar Islands',
        'Chandigarh',
        'Dadra and Nagar Haveli',
        'Daman and Diu',
        'Ladakh',
      ],
      step: 1,
      cityRules: [(v) => !!v || `City is required`],
      stateRules: [(v) => !!v || `State is required`],
      countryRules: [(v) => !!v || `Country is required`],
      media: [
        {
          src: require('~/assets/images/thumb-tunnel.jpg'),
          alt: 'Tunnel game created by our student Aditi',
          vidsrc: 'https://www.youtube.com/embed/d1k9qDZs3yk',
        },
        {
          src: require('~/assets/images/thumb-cat-mouse.jpg'),
          alt: 'Cat chasing mouse game by Aniruddh',
          vidsrc: 'https://www.youtube.com/embed/GHfSbWzNcs4',
        },
        {
          src: require('~/assets/images/thumb-ping-pong.jpg'),
          alt: 'Ping pong game created by Abhay',
          vidsrc: 'https://www.youtube.com/embed/_vZYNlh3LzE',
        },
        {
          src: require('~/assets/images/thumb-chatbot.jpg'),
          alt: 'Yogita created a chatbot using Scratch',
          vidsrc: 'https://www.youtube.com/embed/7bABkBj4LLw',
        },
        {
          src: require('~/assets/images/cover_shooting_game.png'),
          alt: 'Cool shooting game created by Arsh',
          vidsrc: 'https://www.youtube.com/embed/HyLk-TiD0o8',
        },
      ],
    }
  },
  head() {
    return {
      title: `#CodeAGame workshop for kids, ages 8-12 years`,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: `#CodeAGame online workshop for kids, ages 8-12 years. Kids will learn the nuances of game design and development, and code a complete game on Scratch during the workshop.`,
        },
      ],
      script: [{ src: 'https://checkout.razorpay.com/v1/checkout.js' }],
    }
  },
  computed: {
    ...mapGetters('user', ['activeWorkshop', 'demoBookingId']),
    currentTitle() {
      switch (this.step) {
        case 1:
          return this.activeWorkshop.title
        case 2:
          return `Enter your details`
        case 3:
          return `Enter billing details`
        default:
          return `Confirming your payment`
      }
    },
    slots() {
      const slots = []
      if (this.selectedSlot.date) {
        slots.push(...this.selectedSlot.date.slots)
      }

      return slots
    },
    buttonText() {
      return this.activeWorkshop.fee.value
        ? 'Register & Pay Now'
        : 'Register Now'
    },
  },
  watch: {
    'selectedSlot.dateIndex'(newVal) {
      if (newVal !== undefined) {
        this.selectedSlot.date = this.activeWorkshop.schedules.dates[newVal]
      } else {
        this.selectedSlot.date = null
      }

      this.selectedSlot.timeIndex = undefined
    },
    'selectedSlot.timeIndex'(newVal) {
      if (newVal !== undefined) {
        this.alert.show = false
        this.selectedSlot.time = this.slots[newVal]
      } else {
        this.selectedSlot.time = null
      }
    },
  },
  created() {
    this.fetchWorkshopDetails()
  },
  mounted() {
    const routeRefId = this.$route.query.reference
    if (localStorage.reference) {
      const localRef = JSON.parse(localStorage.reference)

      if (routeRefId && routeRefId === localRef.id) {
        this.personalDetails = {}
        this.savedReferenceId = localRef.id
        Object.assign(this.personalDetails, localRef.personalDetails)
        this.step = 3
      }
    }
  },
  methods: {
    ...mapActions('user', [
      'createOrder',
      'verifyPayment',
      'getActiveWorkshop',
    ]),
    async fetchWorkshopDetails() {
      this.detailsLoading = true
      await this.getActiveWorkshop()
      this.detailsLoading = false
    },
    onSecondaryRegister() {
      this.$vuetify.goTo('#form')
      // this.onRegisterForWorkshop()
    },
    onRegisterForWorkshop() {
      this.alert.show = false
      if (this.selectedSlot.time !== null) {
        this.step++
        this.$vuetify.goTo('#form')
      } else {
        this.alert.text = this.alert.options.slot
        this.alert.show = true
      }
    },
    onPersonalDetailsFilled(details) {
      if (details) {
        Object.assign(this.personalDetails, details)

        if (details.country) {
          const matchedCountry = this.countries.find(
            (country) => country.calling_code === details.country.dialCode
          )
          if (matchedCountry) {
            this.form.country = matchedCountry
          }
        }

        if (!this.activeWorkshop.fee.value) {
          this.handleRegistrationConfirmation('/thank-you')
        } else {
          this.$router.replace({
            path: `/code-a-game`,
            query: { reference: this.demoBookingId, ...this.$route.query },
          })

          localStorage.reference = JSON.stringify({
            id: this.demoBookingId,
            personalDetails: {
              parentsName: this.personalDetails.parentsName,
              kidsName: this.personalDetails.kidsName,
              parentsEmail: this.personalDetails.parentsEmail,
              parentsPhone: this.personalDetails.parentsPhone,
              country: this.personalDetails.country,
            },
          })

          this.step++
          this.$vuetify.goTo('#form')
        }
      }
    },
    handleRegistrationConfirmation(routePath) {
      if (this.activeWorkshop.track) {
        this.$fb.track(this.activeWorkshop.track, {
          currency: this.activeWorkshop.fee.currency,
          value: this.activeWorkshop.fee.value,
        })
      }

      this.$router.replace({
        path: routePath,
        query: { reference: this.demoBookingId || this.savedReferenceId },
      })
    },
    async paymentResponseHandler(response) {
      this.confirmingPayment = true
      this.step++

      const verifyPaymentResponse = await this.verifyPayment({
        order_id: this.personalDetails.order.id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
        receipt: this.personalDetails.order.receipt,
      })

      if (verifyPaymentResponse && verifyPaymentResponse.status === 'ok') {
        this.handleRegistrationConfirmation('/payment-done')
      } else {
        this.alert.text = `${
          this.alert.options.payment
        } Your booking reference id: ${
          this.demoBookingId || this.savedReferenceId
        }`
        this.alert.show = true
      }
    },
    async handlePayment() {
      if (this.$refs.subform.validate()) {
        this.loading = true

        const data = {
          name: this.personalDetails.parentsName,
          email: this.personalDetails.parentsEmail,
          phone: `${this.personalDetails.country.dialCode}${this.personalDetails.parentsPhone}`,
          address: { ...this.form },
          fee: this.activeWorkshop.fee,
          demoBookingId: this.demoBookingId || this.savedReferenceId,
        }

        data.address.country = this.form.country.country

        const order = await this.createOrder(data)

        this.loading = false

        if (order) {
          this.personalDetails.order = { ...order }

          const {
            $config: { razorpayKey },
          } = this

          const handler = this.paymentResponseHandler
          const options = {
            key: razorpayKey,
            name: data.name,
            description: `Payment for ${this.personalDetails.kidsName} registration for ${this.activeWorkshop.title}`,
            amount: order.amount_due,
            currency: order.currency,
            order_id: order.id,
            handler,
            prefill: {
              name: data.name,
              email: data.email,
              contact: data.phone,
            },
            modal: {
              ondismiss: () => {
                alert(`Payment Failed`)
              },
            },
            notes: {
              name: data.name,
              kidsName: this.personalDetails.kidsName,
              workshopName: this.activeWorkshop.title,
              paymentId: order.receipt,
              bookingId: this.demoBookingId || this.savedReferenceId,
            },
          }

          const rzp1 = new window.Razorpay(options)
          rzp1.open()
        } else {
          this.alert.text = this.alert.options.order
          this.alert.show = true
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~/assets/colors.scss';

.slot-full {
  text-decoration: line-through;
}

.card-inner-container {
  padding: 16px;
}

.details-label {
  font-size: 0.9rem;
  line-height: 1.25;
  color: rgba(0, 0, 0, 0.6);
  margin-bottom: 2px;
}

.details-text {
  font-size: 1.125rem;
  line-height: 1.375;
  font-weight: 500;
}

.tag {
  font-weight: 500;
}

.tag--small {
  padding: 0 8px;
}

.header-bg {
  background: url('~assets/images/rocket-pattern.svg'),
    linear-gradient(
      to bottom left,
      rgba(107, 99, 255, 0.3),
      rgba(40, 56, 203, 0.6)
    ),
    #6c63ff;
  height: 500px;
}

.assertion-check {
  background-color: rgba(0, 0, 0, 0.18);
  font-size: 18px;
  padding: 4px;
  border-radius: 50%;
}

.page-headline,
.page-subheader {
  font-size: 2rem;
  font-weight: 500;
  line-height: 2.5rem;
  letter-spacing: normal !important;
  padding: 12px;
  color: white;
}

.no-workshop {
  letter-spacing: normal !important;
  text-align: center;

  &--title {
    font-size: 1.5rem;
    line-height: 1.5rem;
    font-weight: 500;
  }

  &--description {
    font-size: 1.125rem;
    line-height: 1.625rem;
  }
}

.page-subheader {
  font-size: 1.375rem;
  line-height: 1.625rem;
  font-weight: 400;
}

.form-container,
.assertions-container {
  padding: 12px 24px;
}

.form-title {
  font-size: 1.5rem !important;
  font-weight: 500;
  line-height: 1.75rem;
  letter-spacing: 0.0125em !important;
}

.assertions-container {
  .assertion {
    .assertion-title {
      font-size: 1.25rem;
      font-weight: 500;
    }

    .assertion-text {
      margin-top: 8px;
      font-size: 1rem;
    }
  }

  .assertion + .assertion {
    margin-top: 32px;
  }
}

@media only screen and (max-width: 599px) {
  .card-inner-container {
    padding: 0 12px;
  }

  .page-headline {
    font-size: 1.375rem;
    line-height: 1.625rem;
  }

  .page-subheader {
    font-size: 1rem;
    line-height: 1.375rem;
  }

  .form-container,
  .assertions-container {
    padding: 12px;

    .assertion {
      .assertion-title {
        font-size: 1rem;
      }
    }
  }

  .form-title {
    font-size: 1.125rem !important;
    line-height: 1.5rem;
  }
}

.play-btn {
  transition: 0.3s all cubic-bezier(0.455, 0.03, 0.515, 0.955);
}

.play-btn--hovered {
  transform: scale(1.2);
}
</style>
