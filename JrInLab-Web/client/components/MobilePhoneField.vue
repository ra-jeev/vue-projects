<template>
  <div id="mobileNumContainer" style="position: relative">
    <v-text-field
      ref="phone"
      v-bind="$attrs"
      v-model="phone.number"
      :error-messages="phoneErrors"
      :label="`${label} *`"
      :prefix="phone.country ? `${phone.country.calling_code}` : ''"
      :rules="phoneRules"
      :hint="hint"
      persistent-hint
      type="tel"
      required
      validate-on-blur
      class="mobile-num"
      @input="sanitizeMobileNumber"
    >
      <template #prepend-inner>
        <v-menu
          v-model="countryMenu"
          :close-on-content-click="false"
          :nudge-bottom="$attrs.dense === '' ? 44 : 60"
          absolute
          attach="#mobileNumContainer"
          min-width="100%"
        >
          <template #activator="{ on }">
            <v-btn
              :small="$attrs.dense"
              class="pl-2 pr-1"
              text
              v-on="on"
              @click.stop="$refs.phone.resetValidation()"
            >
              <template #default>
                <div
                  v-if="phone.country"
                  class="d-inline-flex align-center country-code"
                >
                  <span class="flag">{{ phone.country.flag }}</span>
                  <v-icon
                    :class="{ 'menu-icon--active': countryMenu }"
                    class="menu-icon"
                  >
                    $mdiMenuDown
                  </v-icon>
                </div>
              </template>
            </v-btn>
          </template>

          <v-card id="search">
            <v-text-field
              v-model="search"
              autofocus
              flat
              hide-details
              label="Search"
              solo
            />
            <v-divider />
            <v-list class="countries-list">
              <v-list-item
                v-for="item in countries"
                :key="item.code"
                link
                @click="onCountryChanged(item)"
              >
                <div class="d-flex align-center country-code">
                  <span class="flag">{{ item.flag }}</span>
                  <span class="name">{{ item.country }}</span>
                  <span class="code">{{ item.calling_code }}</span>
                </div>
              </v-list-item>
              <v-list-item v-if="!countries.length">
                No results found
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>
      </template>
    </v-text-field>
  </div>
</template>

<script>
import countriesData from '~/assets/data/countries.json'

export default {
  inheritAttrs: false,
  props: {
    value: {
      type: Object,
      required: true,
    },
    label: {
      type: String,
      default: `Parent's Mobile No.`,
    },
    defaultCountryCode: {
      type: Object,
      default: () => {
        return { name: 'India', dialCode: '+91' }
      },
    },
    hint: {
      type: String,
      default:
        'To change country, please click on the flag / dropdown menu icon',
    },
  },
  data() {
    return {
      allCountries: Object.freeze(countriesData),
      countryMenu: false,
      search: null,
      phoneRules: [
        (v) => !!v || `${this.label} is required`,
        this.validatePhone,
      ],
      phoneErrors: [],
    }
  },
  computed: {
    countries() {
      const countries = this.search
        ? this.allCountries.filter((countryObj) =>
            countryObj.country.toLowerCase().includes(this.search.toLowerCase())
          )
        : this.allCountries

      return countries
    },
    phone() {
      return this.value
    },
  },
  watch: {
    value(val) {
      if (val && val.country.dialCode) {
        this.findCountryCode()
      }
    },
  },
  mounted() {
    this.findCountryCode()
  },
  methods: {
    findCountryCode() {
      if (!this.phone.country || !this.phone.country.calling_code) {
        const country = this.countries.find((country) => {
          const matchObj = this.phone.country || this.defaultCountryCode
          return (
            country.calling_code === matchObj.dialCode &&
            country.country.toLowerCase() === matchObj.name.toLowerCase()
          )
        })

        this.phone.country = { ...country }
        this.phone.country.name = country.country
      }
    },
    validatePhone(v) {
      if (v) {
        if (this.phone.country && this.phone.country.mobileNoLen) {
          return (
            v.length === this.phone.country.mobileNoLen ||
            `Please enter a valid ${this.phone.country.mobileNoLen} digit mobile number`
          )
        } else {
          return (
            (v.length >= 6 && v.length <= 14) ||
            `Please enter a valid mobile number`
          )
        }
      }

      return `Please enter a valid mobile number`
    },
    sanitizeMobileNumber(value) {
      if (value) {
        const sanitizedValue = value.replace(/\D/g, '')
        if (sanitizedValue !== value) {
          this.phoneErrors.push('Only digits are allowed for this field')
          this.$nextTick(() => {
            this.phone.number = sanitizedValue
          })

          setTimeout(() => {
            this.phoneErrors = []
          }, 2000)
        } else {
          this.phoneErrors = []
        }
      }
    },
    onCountryChanged(country) {
      this.phone.country = country
      this.phone.country.name = country.country
      this.countryMenu = false
      this.$refs.phone.focus()
    },
  },
}
</script>

<style lang="scss" scoped>
.country-code {
  .flag {
    font-size: 24px;
    line-height: 1;
  }

  .name {
    margin-left: 8px;
  }

  .code {
    margin-left: 8px;
    font-size: 16px;
  }

  .menu-icon {
    font-size: 18px;
    transition: 0.3s all ease-in-out;
  }

  .menu-icon--active {
    transform: rotate(180deg);
  }
}

.countries-list {
  overflow-y: scroll;
  max-height: 200px;
}

#search {
  ::v-deep .v-input__slot {
    padding: 0 16px;
  }
}

.mobile-num {
  ::v-deep .v-input__prepend-inner {
    margin-top: 10px;
  }
}

.mobile-num.v-input--dense {
  ::v-deep .v-input__prepend-inner {
    margin-top: 6px !important;
  }
}
</style>
