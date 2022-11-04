<template>
  <v-container class="invoice-container">
    <v-progress-linear v-if="loading" indeterminate large />
    <template v-else-if="currentCustomer">
      <div class="dark-band mb-3" />
      <v-row justify="space-between">
        <v-col cols="7">
          <div class="headline font-weight-medium primary--text">
            Edulabtech Solutions Pvt Ltd
          </div>
          <div>
            LG 006, DLF Grand Mall, Mehrauli Gurgaon Road,
            <br />
            DLF Phase 1, Sector 28,
            <br />
            Gurgaon, Haryana 122001 IN
            <br />
            <br />
            <strong>CIN:</strong>
            <span>U80900HR2020PTC085915</span>
            <br />
            <template v-if="!installment.data.noGST">
              <strong> GSTIN: </strong>
              <span>06AAFCE8740B1ZW</span>
            </template>
          </div>
        </v-col>
        <v-col cols="5" align="right">
          <div class="primary px-6 py-4 d-inline-flex">
            <logo-base dark height="56" />
          </div>
          <br />
          <br />
          <div class="invoice-text">Tax Invoice</div>
          <div class="invoice-number">Invoice No.: {{ invoiceNumber }}</div>
        </v-col>
      </v-row>
      <v-row justify="space-between" class="my-3">
        <v-col cols="7">
          <strong>Bill To</strong>
          <br />
          <strong>{{ currentCustomer.parentsName }}</strong>
          <br />
          <template v-if="currentCustomer.gstin">
            {{ currentCustomer.gstin.company }}
            <br />
          </template>
          <span style="white-space: pre-wrap">{{ address }}</span>
          <br />
          <span>Phone: {{ phoneNo }}</span>
          <br />
          <span>Email: {{ currentCustomer.parentsEmail }}</span>
          <template v-if="currentCustomer.gstin">
            <br />
            <span>
              <strong>GSTIN:</strong> {{ currentCustomer.gstin.number }}
            </span>
          </template>
          <br />
          <br />
          <template v-if="!installment.data.noGST">
            <strong>Place of Supply:</strong>
            <span>{{ placeOfSupply }}</span>
            <template v-if="outsideIndia">
              <br />
              <strong>Country of Supply:</strong>
              <span>{{ currentCustomer.address.country }}</span>
            </template>
          </template>
        </v-col>
        <v-col cols="5" align="right">
          <strong>Invoice Date</strong>
          <br />
          <span>{{ invoiceDate | shortDateFilter }}</span>
          <br />
          <strong>Terms</strong><br />
          <span>Due on Receipt</span><br />
          <strong>Due Date</strong><br />
          <span>{{ invoiceDate | shortDateFilter }}</span>
        </v-col>
      </v-row>
      <v-divider class="mt-2 mb-2 grey lighten-1" />
      <v-row no-gutters class="px-1 py-2" justify="space-between">
        <v-col cols="8">
          <span class="invoice-pricing-header">Description</span>
        </v-col>
        <v-col v-if="!installment.data.noGST" cols="2">
          <span class="invoice-pricing-header">HSN/SAC</span>
        </v-col>
        <v-col cols="2" align="right">
          <span class="invoice-pricing-header">Amount</span>
        </v-col>
      </v-row>
      <v-row
        no-gutters
        class="px-1 py-1 grey lighten-3"
        justify="space-between"
      >
        <v-col cols="7">
          <span>
            {{ description }}
          </span>
        </v-col>
        <v-col cols="1" />
        <v-col v-if="!installment.data.noGST" cols="2">
          <span>999294</span>
        </v-col>
        <v-col cols="2" align="right">
          <span>
            {{
              (installment.data.currency || '₹') +
              ' ' +
              installment.data.actualPrice
            }}
          </span>
        </v-col>
      </v-row>
      <v-row
        v-if="discount"
        no-gutters
        class="px-1 py-1"
        justify="space-between"
      >
        <v-col cols="6">
          <span>Discount @ {{ discount }}%</span>
        </v-col>
        <v-col cols="3" align="right">
          <span>
            {{
              (installment.data.currency || '₹') +
              ' ' +
              (installment.data.actualPrice - installment.data.amountPaid)
            }}
          </span>
        </v-col>
      </v-row>
      <v-row
        :class="{ 'grey lighten-3': discount }"
        no-gutters
        class="px-1 py-1"
      >
        <span>&nbsp;</span>
      </v-row>
      <v-row
        :class="{ 'grey lighten-3': !discount }"
        no-gutters
        class="px-1 py-1"
        justify="space-between"
      >
        <v-col cols="6">
          <span>Subtotal (Before Tax)</span>
        </v-col>
        <v-col cols="3" align="right">
          <span>
            {{ (installment.data.currency || '₹') + ' ' + baseAmount }}
          </span>
        </v-col>
      </v-row>
      <v-row
        :class="{ 'grey lighten-3': discount }"
        no-gutters
        class="px-1 py-1"
      >
        <span>&nbsp;</span>
      </v-row>
      <template v-if="!installment.data.noGST">
        <v-row
          :class="{ 'grey lighten-3': !discount }"
          no-gutters
          class="px-1 py-1"
          justify="space-between"
        >
          <v-col cols="6">
            <span>State GST (SGST) @ 9%</span>
          </v-col>
          <v-col cols="3" align="right">
            <span>
              {{ dividedGST }}
            </span>
          </v-col>
        </v-row>
        <v-row
          :class="{ 'grey lighten-3': discount }"
          no-gutters
          class="px-1 py-1"
          justify="space-between"
        >
          <v-col cols="6">
            <span>Central GST (CGST) @ 9%</span>
          </v-col>
          <v-col cols="3" align="right">
            <span>
              {{ dividedGST }}
            </span>
          </v-col>
        </v-row>
        <v-row
          :class="{ 'grey lighten-3': !discount }"
          no-gutters
          class="px-1 py-1"
          justify="space-between"
        >
          <v-col cols="6">
            <span>Integrated GST (IGST) @ 18%</span>
          </v-col>
          <v-col cols="3" align="right">
            <span>
              {{ integratedGST }}
            </span>
          </v-col>
        </v-row>
      </template>
      <v-row no-gutters class="px-1 py-1 mt-4" justify="space-between">
        <v-col cols="6">
          <span>Total in Words</span>
          <br />
          <span class="total-words">
            {{
              totalInWords(
                installment.data.amountPaid,
                installment.data.currency
              )
            }}
          </span>
        </v-col>
        <v-col cols="5" align="right">
          <span class="total-amount">TOTAL:</span>
          <span class="total-amount ml-4">
            {{
              (installment.data.currency || '₹') +
              ' ' +
              installment.data.amountPaid
            }}
          </span>
        </v-col>
      </v-row>
      <v-row
        v-if="outsideIndia"
        no-gutters
        class="px-1 py-1 mt-4"
        justify="end"
      >
        <v-col cols="7" align="right" class="declaration-text">
          SUPPLY MEANT FOR EXPORT UNDER BOND OR LETTER OF UNDERTAKING WITHOUT
          PAYMENT OF INTEGRATED TAX
        </v-col>
      </v-row>
      <div class="dark-band mt-6" />
    </template>
    <template v-else>
      <div class="mt-16 text-center">
        <h2 class="display-2">No customer data</h2>
        <p class="mt-6 headline">
          Not able to find the related entry, please recheck!!
        </p>
      </div>
    </template>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  layout: 'empty',
  data() {
    return {
      loading: false,
      months: [
        'First',
        'Second',
        'Third',
        'Fourth',
        'Fifth',
        'Sixth',
        'Seventh',
        'Eighth',
        'Ninth',
        'Tenth',
      ],
      units: [
        '', // to account for 0
        'One',
        'Two',
        'Three',
        'Four',
        'Five',
        'Six',
        'Seven',
        'Eight',
        'Nine',
      ],
      tens: [
        'Ten',
        'Eleven',
        'Twelve',
        'Thirteen',
        'Fourteen',
        'Fifteen',
        'Sixteen',
        'Seventeen',
        'Eighteen',
        'Nineteen',
      ],
      tenMultiples: [
        '', // to account for 0
        '', // t0 account for 10
        'Twenty',
        'Thirty',
        'Forty',
        'Fifty',
        'Sixty',
        'Seventy',
        'Eighty',
        'Ninety',
      ],
      statesWithCode: {
        'Andhra Pradesh': '37',
        'Arunachal Pradesh': '12',
        Assam: '18',
        Bihar: '10',
        Chattisgarh: '22',
        Delhi: '07',
        Goa: '30',
        Gujarat: '24',
        Haryana: '06',
        'Himachal Pradesh': '02',
        'Jammu and Kashmir': '01',
        Jharkhand: '20',
        Karnataka: '29',
        Kerala: '32',
        'Lakshadweep Islands': '31',
        'Madhya Pradesh': '23',
        Maharashtra: '27',
        Manipur: '14',
        Meghalaya: '17',
        Mizoram: '15',
        Nagaland: '13',
        Odisha: '21',
        Pondicherry: '34',
        Punjab: '03',
        Rajasthan: '08',
        Sikkim: '11',
        'Tamil Nadu': '33',
        Telangana: '36',
        Tripura: '16',
        'Uttar Pradesh': '09',
        Uttarakhand: '05',
        'West Bengal': '19',
        'Andaman and Nicobar Islands': '35',
        Chandigarh: '04',
        'Dadra and Nagar Haveli': '26',
        'Daman and Diu': '25',
        Ladakh: '38',
        'Other Territory': '97',
      },
    }
  },
  head() {
    return {
      title: this.currentCustomer
        ? `${this.invoiceNumber} ${this.currentCustomer.parentsName}`
        : 'invoice',
      titleTemplate: '',
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
    ...mapGetters('admin', ['currentCustomer']),
    installment() {
      const installments = this.currentCustomer.course.installments
      console.log('installments: ', installments)
      let paymentDetails
      const index = this.$route.query.index
      if (index && Array.isArray(installments)) {
        paymentDetails = { inFull: false, data: installments[index] }
      } else {
        paymentDetails = { inFull: true, data: installments }
      }

      return paymentDetails
    },
    placeOfSupply() {
      return this.outsideIndia
        ? 'Outside India'
        : `${this.currentCustomer.address.state} (${
            this.statesWithCode[this.currentCustomer.address.state]
          })`
    },
    outsideIndia() {
      return this.currentCustomer.address.country !== 'India'
    },
    sameState() {
      return this.currentCustomer.address.state === 'Haryana'
    },
    description() {
      const courses = {
        beginner: 'Coding Foundations',
        advanced: 'Advanced Coding & Game Design',
        scratchGameDev: 'Scratch Game Development',
        scratchPackage: 'Scratch Coding Course Package',
        advancedPackage: 'Advanced Coding Course Package',
        fullPackage: 'Coding Course Package',
        appDev: 'App Development',
        pythonBasics: 'Python Basics',
        pythonIntermediate: 'Python Intermediate',
        pythonGameDev: 'Python Game Development',
        computer: 'Computer',
      }

      const optedCourse = this.currentCustomer.course.course

      let description
      if (optedCourse.includes('summer')) {
        description = 'Summer Camp Fees'
        if (!this.installment.inFull) {
          description = `Summer Camp Fees ${
            this.months[this.$route.query.index]
          } Installment`
        }
      } else if (optedCourse.includes('vedic-maths')) {
        description = 'Vedic Maths Camp Fees'
      } else if (optedCourse.includes('learn-2-code')) {
        description = 'Learn2Code Workshop Fees'
      } else if (optedCourse.includes('sg-camp-scratch')) {
        description = 'Scratch Coding Camp Fees'
      } else if (optedCourse.includes('sg-camp-python')) {
        description = 'Python Coding Camp Fees'
      } else if (optedCourse.includes('web-dev-camp')) {
        description = 'Web Development Workshop Fees'
      } else {
        description = courses[optedCourse]
      }

      if (this.currentCustomer.course.type === 'regular') {
        if (this.installment.inFull) {
          description += ` ${
            !['advancedPackage', 'fullPackage', 'scratchPackage'].includes(
              optedCourse
            )
              ? 'Course'
              : ''
          } Fees`
        } else {
          description += ` ${
            !['advancedPackage', 'fullPackage', 'scratchPackage'].includes(
              optedCourse
            )
              ? 'Course'
              : ''
          } Fees ${this.months[this.$route.query.index]} Installment`
        }
      }

      description += ` for ${this.currentCustomer.kidsName}`

      return description
    },
    discount() {
      const discount =
        100 -
        (this.installment.data.amountPaid * 100) /
          this.installment.data.actualPrice
      return discount ? discount.toFixed(2) : discount
    },
    baseAmount() {
      return this.outsideIndia || this.installment.data.noGST
        ? this.installment.data.amountPaid
        : (this.installment.data.amountPaid / 1.18).toFixed(2)
    },
    dividedGST() {
      let gst = '-'
      if (
        !this.installment.data.noGST &&
        !this.outsideIndia &&
        this.sameState
      ) {
        gst = `₹ ${(this.baseAmount * 0.09).toFixed(2)}`
      }

      return gst
    },
    integratedGST() {
      let gst = '-'
      if (
        !this.installment.data.noGST &&
        !this.outsideIndia &&
        !this.sameState
      ) {
        gst = `₹ ${(this.baseAmount * 0.18).toFixed(2)}`
      }

      return gst
    },
    invoiceNumber() {
      console.log('this.installment.data.invoiceNo:: ', this.installment)
      const invoiceNo =
        '0'.repeat(4 - `${this.installment.data.invoiceNo}`.length) +
        this.installment.data.invoiceNo

      return `JIL/${invoiceNo}/22-23`
    },
    phoneNo() {
      return this.currentCustomer.country
        ? `${this.currentCustomer.country.dialCode}-${this.currentCustomer.parentsPhone}`
        : `+91-${this.currentCustomer.parentsPhone}`
    },
    address() {
      const { address, addressLine, city, state, pincode, country } =
        this.currentCustomer.address

      console.log(this.currentCustomer.address)

      let addressString = address || ''

      if (addressLine) {
        addressString = addressLine
      }

      if (city) {
        addressString += addressString.length ? `\n${city}` : city
      }

      if (state) {
        addressString += addressString.length ? `, ${state}` : state
      }

      if (country) {
        addressString += addressString.length ? `, ${country}` : country
      }

      if (pincode) {
        addressString += addressString.length ? `, ${pincode}` : pincode
      }

      return addressString
    },
    invoiceDate() {
      console.log('this.installment', this.installment)

      const invoiceDate =
        this.installment.data.invoiceDate || this.installment.data.paymentDate

      return invoiceDate.toDate()
    },
  },
  mounted() {
    this.fetchCustomer()
  },
  methods: {
    ...mapActions('admin', ['getCustomer']),
    getConvertedDate(date) {
      const dateParts = date.split('/')
      return new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`)
    },
    getWord(num) {
      let word = ''
      const tensPart = Math.floor(num / 10)
      const unitsPart = num % 10

      if (tensPart === 1) {
        word = this.tens[unitsPart]
      } else if (tensPart > 1) {
        word =
          this.tenMultiples[tensPart] +
          (unitsPart ? ` ${this.units[unitsPart]}` : '')
      } else if (unitsPart) {
        word = this.units[unitsPart]
      }

      return word
    },
    totalInWords(amountPaid, currency) {
      let amount = `${amountPaid}`
      let amountInWords = currency || 'INR'
      if (amount.length > 5 && amount.length < 8) {
        const lengthToExtract = amount.length - 5
        const value = this.getWord(
          parseInt(amount.substring(0, lengthToExtract))
        )
        if (value) {
          amountInWords += ` ${value} Lakh`
        }

        amount = amount.substring(lengthToExtract)
      }

      if (amount.length > 3 && amount.length < 6) {
        const lengthToExtract = amount.length - 3
        const value = this.getWord(
          parseInt(amount.substring(0, lengthToExtract))
        )
        if (value) {
          amountInWords += ` ${value} Thousand`
        }

        amount = amount.substring(lengthToExtract)
      }

      if (amount.length === 3) {
        const value = this.getWord(parseInt(amount.substring(0, 1)))
        if (value) {
          amountInWords += ` ${value} Hundred`
        }
        amount = amount.substring(1)
      }

      const value = this.getWord(parseInt(amount))
      if (value) {
        amountInWords += ` ${value}`
      }

      amountInWords += ` Only`

      return amountInWords
    },
    async fetchCustomer() {
      this.loading = true
      try {
        await this.getCustomer({
          id: this.$route.params.id,
          courseId: this.$route.query.course,
        })
      } catch (error) {
        console.log(error)
      }
      this.loading = false
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~/assets/colors.scss';

.dark-band {
  height: 8px;
  display: flex;
  background-color: $primary-dark;
}

.invoice-text {
  font-size: 3rem;
  line-height: 3rem;
  color: $primary-dark;
  font-weight: 600;
}

.invoice-number {
  font-size: 1.125rem;
  line-height: 1.5rem;
  color: #e01b84;
  font-weight: 600;
  padding-top: 8px;
}

.invoice-pricing-header {
  color: $primary-dark;
  font-size: 1.125rem;
  font-weight: 500;
}

.total-amount {
  font-size: 2rem;
  line-height: 2rem;
  color: #e01b84;
  font-weight: 500;
}

.total-words {
  font-weight: 500;
  font-style: italic;
}

.declaration-text {
  font-size: 12px;
  line-height: 14px;
}
</style>
