<template>
  <v-container>
    <v-row justify="center">
      <v-progress-linear v-show="loading" color="primary" indeterminate />
      <v-col
        v-if="user && !user.onboardingDone"
        cols="12"
        sm="10"
        md="8"
        lg="7"
      >
        <v-card class="mt-4">
          <v-card-title class="font-weight-medium headline">
            Just a few details more
          </v-card-title>
          <v-card-text>
            <v-form ref="form" lazy-validation @submit.prevent="onFormSubmit">
              <v-window v-model="onboardingStep" class="pt-2">
                <v-window-item ref="window_1" :value="1">
                  <v-menu
                    ref="menu"
                    v-model="menu"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template #activator="{ on, attrs }">
                      <v-text-field
                        ref="dob"
                        v-model="form.dob"
                        :rules="[requiredRules('Date of birth')]"
                        label="Please enter your date of birth"
                        validate-on-blur
                        outlined
                        required
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      />
                    </template>
                    <v-date-picker
                      v-model="form.dob"
                      :active-picker.sync="activePicker"
                      :max="
                        new Date(
                          Date.now() - new Date().getTimezoneOffset() * 60000
                        )
                          .toISOString()
                          .substring(0, 10)
                      "
                      min="1950-01-01"
                      @change="saveDOB"
                    />
                  </v-menu>
                  <v-select
                    v-model="form.gender"
                    :rules="[requiredRules('Gender')]"
                    :items="genders"
                    label="Please select your gender"
                    validate-on-blur
                    outlined
                    required
                  />
                </v-window-item>
                <v-window-item ref="window_2" :value="2">
                  <v-text-field
                    v-model="form.school"
                    label="Please enter your school"
                    validate-on-blur
                    outlined
                  />
                  <!-- <v-text-field
                    v-model="form.city"
                    :rules="[requiredRules('City')]"
                    label="Please enter your city"
                    validate-on-blur
                    outlined
                    required
                  /> -->
                  <v-autocomplete
                    v-model="form.country"
                    :items="countries"
                    :rules="[requiredRules('Country')]"
                    item-text="country"
                    label="Please select your country"
                    outlined
                    return-object
                    required
                    validate-on-blur
                  />
                </v-window-item>
              </v-window>
              <v-row>
                <v-col cols="6">
                  <v-btn
                    :disabled="onboardingStep === 1"
                    block
                    class="font-weight-bold"
                    color="primary"
                    large
                    outlined
                    @click.stop="onboardingStep--"
                  >
                    Back
                  </v-btn>
                </v-col>
                <v-col cols="6">
                  <v-btn
                    :disabled="loading"
                    :loading="loading"
                    block
                    class="font-weight-bold"
                    color="primary"
                    large
                    type="submit"
                  >
                    {{ onboardingStep === 2 ? 'Submit & Get started' : 'Next' }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col v-else cols="12" sm="10" md="8" lg="7">
        <template v-if="userWebsites && userWebsites.length">
          <div class="d-flex align-center mt-4">
            <div class="font-weight-medium headline">
              All Websites ({{ userWebsites ? userWebsites.length : 0 }})
            </div>
            <v-spacer />
            <v-btn
              v-if="!userWebsites || userWebsites.length < 3"
              color="primary"
              small
              @click.stop="createWebsite"
            >
              <v-icon left>$mdiPlus</v-icon>
              New website
            </v-btn>
          </div>
          <WebsiteCard
            v-for="website in userWebsites"
            :key="website.subdomain"
            :website-details="website"
            class="mt-4"
          />
        </template>

        <div v-else-if="!loading" class="text-center mt-12">
          <div class="headline grey--text text--darken-2">
            You've no live website
          </div>

          <img
            src="~/assets/images/building_websites.svg"
            alt="Depiction of build your website"
            class="mt-12"
            height="244"
          />
          <div class="mt-12">
            <p class="grey--text text--darken-2">
              Start by uploading your website's files
            </p>
            <v-btn color="primary" large @click.stop="createWebsite">
              <v-icon left> $mdiRocketLaunch </v-icon>
              Launch Your Website
            </v-btn>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'DashboardPage',
  data() {
    return {
      loading: false,
      form: {
        gender: '',
        school: '',
        dob: '',
        city: '',
        country: '',
      },
      genders: ['Male', 'Female', 'Others', 'Prefer not to answer'],
      countries: null,
      activePicker: null,
      menu: false,
      requiredRules: (type) => {
        return (v) => !!v || `${type} can't be empty.`
      },
      onboardingStep: 1,
      MAX_STEPS: 2,
    }
  },
  async fetch() {
    console.log('inside fetch: this.user: ', this.user)
    if (this.user.onboardingDone) {
      this.$store.commit('setPageTitle', 'My Websites')
      this.loading = true
      await this.fetchUserWebsites()
      this.loading = false
    } else {
      this.$store.commit('setPageTitle', 'Complete Onboarding')
      const { default: countries } = await import(
        '~/assets/data/countries.json'
      )

      this.countries = Object.freeze(countries)
    }
  },
  computed: {
    ...mapGetters(['user', 'userWebsites']),
  },
  watch: {
    menu(val) {
      val && setTimeout(() => (this.activePicker = 'YEAR'))
    },
  },
  methods: {
    ...mapActions(['fetchUserWebsites', 'completeUserOnboarding']),
    saveDOB(date) {
      this.$refs.menu.save(date)
      this.$refs.dob.focus()
    },
    canShare() {
      return navigator.share
    },
    createWebsite() {
      this.$router.push('/launch-site')
    },
    async onFormSubmit() {
      if (this.$refs.form.validate()) {
        if (this.onboardingStep < this.MAX_STEPS) {
          this.onboardingStep++
          return
        }

        this.loading = true
        this.form.country = {
          name: this.form.country.country,
          code: this.form.country.code,
          dialCode: this.form.country.calling_code,
        }

        try {
          await this.completeUserOnboarding(this.form)
          this.$store.commit('setPageTitle', 'My Websites')
        } catch (error) {
          console.log('user onboarding failed; ', error)
        }

        this.loading = false
      } else if (this.onboardingStep < this.MAX_STEPS) {
        let hasError = false
        for (const child of this.$refs[`window_${this.onboardingStep}`]
          .$children) {
          if (child.hasError) {
            hasError = true
            break
          }
        }

        if (!hasError) {
          this.onboardingStep++
        }
      }
    },
  },
}
</script>
