<template>
  <v-form ref="form" lazy-validation @submit.prevent="reviewChanges">
    <v-card outlined>
      <v-card-title>
        <v-btn icon @click="backBtnClicked">
          <v-icon> $mdiArrowLeft </v-icon>
        </v-btn>

        Editing Customer Details

        <v-spacer />
        <v-switch
          v-model="form.directEnroll"
          label="Direct Enrolling Allowed"
        />
      </v-card-title>

      <v-divider />

      <v-card-text v-if="form.parentsName">
        <div class="section">
          <div class="section-title">Customer Details:</div>
          <v-row class="my-3">
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.parentsName"
                :rules="parentNameRules"
                label="Parent's Name *"
                outlined
                required
                validate-on-blur
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.kidsName"
                :rules="kidsNameRules"
                label="Kid's Name *"
                outlined
                required
                validate-on-blur
              />
            </v-col>
            <v-col cols="12" sm="6">
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
            </v-col>
          </v-row>
        </div>

        <div class="section">
          <div class="section-title">
            Contact Numbers

            <v-tooltip bottom>
              <template #activator="{ on, attrs }">
                <v-btn
                  v-show="form.otherContacts.length < 2"
                  v-bind="attrs"
                  fab
                  x-small
                  color="primary"
                  class="ml-2"
                  v-on="on"
                  @click="addContactType('phone')"
                >
                  <v-icon> $mdiPlus </v-icon>
                </v-btn>
              </template>
              <span>Add number (Upto 2)</span>
            </v-tooltip>
          </div>
          <v-row class="my-3">
            <v-col cols="12" sm="6">
              <MobilePhoneField v-model="form.parentsPhone" outlined />
            </v-col>
            <v-col v-if="form.otherContacts.length" cols="12">
              <v-row
                v-for="(contact, index) in form.otherContacts"
                :key="`other_contact_${index}`"
                no-gutters
              >
                <v-col cols="12" sm="6" class="pr-3">
                  <MobilePhoneField
                    v-model="form.otherContacts[index]"
                    label="Mobile No."
                    outlined
                  />
                </v-col>
                <v-col class="px-3">
                  <v-text-field
                    v-model="contact.label"
                    :rules="labelRules"
                    label="Mobile No. Label *"
                    outlined
                    required
                    validate-on-blur
                  />
                </v-col>
                <v-btn
                  icon
                  small
                  style="margin-top: 14px"
                  class="error"
                  @click="removeContactType('phone', index)"
                >
                  <v-icon> $mdiClose </v-icon>
                </v-btn>
              </v-row>
            </v-col>
          </v-row>
        </div>
        <div class="section">
          <div class="section-title">
            Email Addresses

            <v-tooltip bottom>
              <template #activator="{ on, attrs }">
                <v-btn
                  v-show="form.otherEmails.length < 2"
                  v-bind="attrs"
                  fab
                  x-small
                  color="primary"
                  class="ml-2"
                  v-on="on"
                  @click="addContactType('email')"
                >
                  <v-icon> $mdiPlus </v-icon>
                </v-btn>
              </template>
              <span>Add email (Upto 2)</span>
            </v-tooltip>
          </div>
          <v-row class="my-3">
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.parentsEmail"
                :rules="emailRules"
                label="Parent's Email ID *"
                outlined
                type="email"
                required
                validate-on-blur
              />
            </v-col>
            <v-col v-if="form.otherEmails.length" cols="12">
              <v-row
                v-for="(otherEmail, index) in form.otherEmails"
                :key="`other_email_${index}`"
                no-gutters
              >
                <v-col cols="12" sm="6" class="pr-3">
                  <v-text-field
                    v-model="otherEmail.address"
                    :rules="emailRules"
                    label="Email ID *"
                    outlined
                    type="email"
                    required
                    validate-on-blur
                  />
                </v-col>
                <v-col class="px-3">
                  <v-text-field
                    v-model="otherEmail.label"
                    :rules="labelRules"
                    label="Email Label *"
                    outlined
                    required
                    validate-on-blur
                  />
                </v-col>
                <v-btn
                  icon
                  small
                  style="margin-top: 14px"
                  class="error"
                  @click="removeContactType('email', index)"
                >
                  <v-icon> $mdiClose </v-icon>
                </v-btn>
              </v-row>
            </v-col>
          </v-row>
        </div>
        <div class="section">
          <div class="section-title">Customer Address</div>
          <v-row class="my-3">
            <v-col cols="12" sm="6">
              <v-autocomplete
                v-model="form.address.country"
                :items="countries"
                item-text="country"
                label="Country"
                outlined
                required
                return-object
                validate-on-blur
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-autocomplete
                v-if="
                  form.address.country && form.address.country.code === 'IN'
                "
                v-model="form.address.state"
                :items="states"
                label="State"
                outlined
                required
                validate-on-blur
              />
              <v-text-field
                v-else
                v-model="form.address.state"
                :disabled="!form.address.country"
                label="State"
                outlined
                required
                validate-on-blur
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.address.addressLine"
                label="Apartment and Street address"
                outlined
                required
                validate-on-blur
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.address.city"
                label="City"
                outlined
                required
                validate-on-blur
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.address.pinCode"
                label="Pin code"
                outlined
                required
                validate-on-blur
              />
            </v-col>
          </v-row>
        </div>
        <div class="section">
          <div class="section-title">Other Details</div>

          <v-textarea
            v-model="form.metaInfo"
            label="Other relevant info"
            outlined
            required
            rows="2"
            validate-on-blur
            class="mt-4"
          />
        </div>
        <div class="section">
          <div class="section-title">
            Enrolled Courses

            <v-tooltip bottom>
              <template #activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  fab
                  x-small
                  color="primary"
                  class="ml-2"
                  v-on="on"
                  @click="addCourse"
                >
                  <v-icon> $mdiPlus </v-icon>
                </v-btn>
              </template>
              <span>Add course</span>
            </v-tooltip>
          </div>
          <v-row class="my-3">
            <v-col v-if="form.courses.length" cols="12">
              <v-row
                v-for="(course, index) in form.courses"
                :key="`course_${index}`"
              >
                <template v-if="course.isNew">
                  <v-col cols="12">
                    <v-row align="center" no-gutters>
                      <span class="font-weight-medium">
                        {{
                          course.name
                            ? `Course: ${course.name.toUpperCase()}`
                            : 'New Course:'
                        }}
                      </span>
                      <v-btn
                        icon
                        small
                        class="error ml-3"
                        @click="removeCourse(index)"
                      >
                        <v-icon> $mdiClose </v-icon>
                      </v-btn>

                      <v-spacer />
                      <v-switch
                        v-model="course.paidInFull"
                        label="Paying In Full?"
                        @change="onInstallmentChange(index)"
                      />
                    </v-row>
                  </v-col>
                  <v-col cols="12" sm="3">
                    <v-select
                      v-model="course.type"
                      :items="types"
                      :rules="courseRules"
                      label="Course Type *"
                      outlined
                      required
                      validate-on-blur
                      @change="course.name = null"
                    />
                  </v-col>
                  <v-col cols="12" sm="3">
                    <v-autocomplete
                      v-model="course.name"
                      :disabled="!course || !course.type"
                      :items="availableCourses(course.type)"
                      :rules="courseRules"
                      label="Course Name *"
                      outlined
                      required
                      validate-on-blur
                    />
                  </v-col>

                  <v-col cols="12" sm="3">
                    <v-text-field
                      v-model="course.actualPrice"
                      :rules="courseRules"
                      label="Installation Amount *"
                      outlined
                      required
                      validate-on-blur
                    />
                  </v-col>
                  <v-col cols="12" sm="3">
                    <v-select
                      v-model="course.currency"
                      :items="currencies"
                      :rules="courseRules"
                      label="Currency *"
                      outlined
                      required
                      validate-on-blur
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-row
                      v-for="(installment, index_1) in course.installments"
                      :key="`installment_new_${index_1}`"
                    >
                      <v-col cols="12">
                        <v-row align="center" no-gutters>
                          <span class="font-weight-medium">
                            {{
                              course.paidInFull
                                ? 'Full Payment'
                                : `Installment ${index_1 + 1}`
                            }}:
                          </span>
                          <template v-if="!course.paidInFull">
                            <v-btn
                              v-show="
                                index_1 === course.installments.length - 1
                              "
                              icon
                              small
                              class="success ml-3"
                              @click="addInstallment(index)"
                            >
                              <v-icon> $mdiPlus </v-icon>
                            </v-btn>
                            <v-btn
                              v-show="course.installments.length > 1"
                              icon
                              small
                              class="error ml-3"
                              @click="removeInstallment(index, index_1)"
                            >
                              <v-icon> $mdiClose </v-icon>
                            </v-btn>
                          </template>
                        </v-row>
                      </v-col>
                      <v-col cols="12" sm="4">
                        <v-text-field
                          v-model="installment.amountPaid"
                          :rules="courseRules"
                          label="Amount Paid *"
                          outlined
                          required
                          validate-on-blur
                        />
                      </v-col>
                      <v-col cols="12" sm="4">
                        <v-dialog
                          v-model="datePicker"
                          overlay-opacity="0.75"
                          width="290px"
                        >
                          <template #activator="{ on, attrs }">
                            <v-text-field
                              ref="date"
                              v-model="installment.paymentDate"
                              :rules="courseRules"
                              label="Payment date (YYYY-MM-DD)"
                              outlined
                              readonly
                              v-bind="attrs"
                              v-on="on"
                            />
                          </template>
                          <v-date-picker
                            v-model="installment.paymentDate"
                            elevation="12"
                            no-title
                            @input="datePicker = false"
                          />
                        </v-dialog>
                      </v-col>
                      <v-col cols="12" sm="4">
                        <v-text-field
                          v-model="installment.invoiceNo"
                          :rules="courseRules"
                          label="Invoice No *"
                          outlined
                          required
                          validate-on-blur
                        />
                      </v-col>
                    </v-row>
                  </v-col>
                </template>
                <template v-else>
                  <v-col cols="12">
                    <v-card color="grey darken-3">
                      <v-card-title>
                        {{ course.name }}, {{ course.type }}
                        <v-btn
                          :href="`/documents/certificate/${customerData.id}?course=${course.id}&type=customer`"
                          target="_blank"
                          color="secondary"
                          class="ml-4"
                          x-small
                        >
                          Generate Certificate
                          <v-icon right> $mdiOpenInNew </v-icon>
                        </v-btn>
                      </v-card-title>
                      <v-card-subtitle>
                        Paid in Full: {{ course.paidInFull }}
                      </v-card-subtitle>
                      <v-card-text>
                        <v-row
                          v-for="(installment, idx) in course.installments"
                          :key="`installment_${idx}`"
                        >
                          <template v-if="installment.actualPrice">
                            <v-col cols="12">
                              <v-btn
                                v-show="
                                  !course.paidInFull &&
                                  idx === course.installments.length - 1
                                "
                                icon
                                small
                                class="success mr-4"
                                @click="addInstallment(index)"
                              >
                                <v-icon> $mdiPlus </v-icon>
                              </v-btn>
                              <span>
                                Actual:
                                {{
                                  `${installment.currency || '₹'} ${
                                    installment.actualPrice
                                  }`
                                }}
                              </span>
                              <span class="ml-4 mr-2">
                                Paid:
                                {{
                                  `${installment.currency || '₹'} ${
                                    installment.amountPaid
                                  }`
                                }}
                              </span>
                              <span class="ml-2 mr-4">
                                Date:
                                {{ installment.paymentDate | dateFilter }}
                              </span>
                              <span>
                                Invoice No: {{ installment.invoiceNo }}
                              </span>
                              <v-btn
                                :href="`/documents/invoice/${customerData.id}?course=${course.id}&index=${idx}`"
                                target="_blank"
                                class="ml-4"
                                color="primary"
                                x-small
                              >
                                Get Invoice
                                <v-icon right> $mdiOpenInNew </v-icon>
                              </v-btn>
                            </v-col>
                          </template>
                          <template v-else>
                            <v-col cols="12">
                              <v-row no-gutters>
                                <v-btn
                                  v-show="
                                    idx === course.installments.length - 1
                                  "
                                  icon
                                  small
                                  class="success"
                                  @click="addInstallment(index)"
                                >
                                  <v-icon> $mdiPlus </v-icon>
                                </v-btn>
                                <v-btn
                                  v-show="course.installments.length > 1"
                                  icon
                                  small
                                  class="error ml-4"
                                  @click="removeInstallment(index, idx)"
                                >
                                  <v-icon> $mdiClose </v-icon>
                                </v-btn>
                              </v-row>
                            </v-col>
                            <v-col cols="12" sm="4">
                              <v-text-field
                                v-model="installment.amountPaid"
                                :rules="courseRules"
                                label="Amount Paid *"
                                outlined
                                required
                                validate-on-blur
                              />
                            </v-col>
                            <v-col cols="12" sm="4">
                              <v-dialog
                                v-model="datePicker"
                                overlay-opacity="0.75"
                                width="290px"
                              >
                                <template #activator="{ on, attrs }">
                                  <v-text-field
                                    ref="date"
                                    v-model="installment.paymentDate"
                                    :rules="courseRules"
                                    label="Payment date (YYYY-MM-DD)"
                                    outlined
                                    readonly
                                    v-bind="attrs"
                                    v-on="on"
                                  />
                                </template>
                                <v-date-picker
                                  v-model="installment.paymentDate"
                                  elevation="12"
                                  no-title
                                  @input="datePicker = false"
                                />
                              </v-dialog>
                            </v-col>
                            <v-col cols="12" sm="4">
                              <v-text-field
                                v-model="installment.invoiceNo"
                                :rules="courseRules"
                                label="Invoice No *"
                                outlined
                                required
                                validate-on-blur
                              />
                            </v-col>
                          </template>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </template>
              </v-row>
            </v-col>
          </v-row>
        </div>
        <v-alert
          v-model="alert.show"
          :type="alert.type"
          prominent
          dismissible
          class="mt-4"
        >
          {{
            alert.type === 'success'
              ? alert.message.success
              : alert.message.failure
          }}
        </v-alert>
      </v-card-text>
      <v-card-actions class="justify-end pt-0 pb-4 px-4">
        <v-btn large text color="primary" @click="resetChanges">
          Discard changes
        </v-btn>
        <v-btn
          :disabled="loading"
          :loading="loading"
          large
          type="submit"
          color="primary"
        >
          <v-icon left> $mdiCloudUpload </v-icon>
          Submit Changes
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-dialog v-model="dialog" persistent max-width="90%" width="600">
      <v-card>
        <v-card-title class="headline">Please review the changes</v-card-title>
        <v-card-text style="white-space: pre-line">
          {{ changes.text }}
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" text @click="cancelChanges"> Cancel </v-btn>
          <v-btn color="primary" @click="submitChanges"> Confirm </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-form>
</template>

<script>
import { mapActions } from 'vuex'
import countriesData from '~/assets/data/countries.json'

export default {
  props: {
    customerData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      dialog: false,
      alert: {
        show: false,
        type: 'success',
        message: {
          success: `Changes successfully submitted.`,
          failure: `Oops! Failed to submit the changes, please try again later.`,
        },
      },
      changes: {
        text: '',
        data: {},
      },
      form: {
        parentsName: null,
        parentsEmail: null,
        parentsPhone: {},
        kidsName: null,
        kidsAge: null,
        address: {},
        metaInfo: null,
        otherContacts: [],
        otherEmails: [],
        directEnroll: null,
        courses: [],
      },
      datePicker: false,
      parentNameRules: [(v) => !!v || `Parent's name is required`],
      kidsNameRules: [(v) => !!v || `Kid's name is required`],
      labelRules: [(v) => !!v || `Label is required`],
      kidsAgeRules: [(v) => !!v || `Kid's age is required`],
      emailRules: [
        (v) => !!v || `Parent's email ID is required`,
        (v) =>
          /^[\w.+-]+@([\w-]+\.)+[\w-]+\S$/.test(v) ||
          `Please enter a valid email ID`,
      ],
      courseRules: [(v) => !!v || `This field is required`],
      ageErrors: [],
      countries: Object.freeze(countriesData),
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
      types: ['regular', 'camp'],
      currencies: ['₹', 'A$', 'S$', '$', '£'],
    }
  },
  watch: {
    'form.address.country'(newVal) {
      if (newVal && newVal.code !== 'IN') {
        this.form.address.state = null
      }
    },
  },
  mounted() {
    this.resetChanges()
  },
  methods: {
    ...mapActions('admin', ['editCustomerDetails', 'addCourseAndPayments']),
    availableCourses(courseType) {
      const courses = []
      const regularCourses = [
        'beginner',
        'advanced',
        'scratchPackage',
        'advancedPackage',
        'fullPackage',
        'appDev',
        'scratchGameDev',
        'pythonBasics',
        'pythonIntermediate',
        'pythonGameDev',
      ]

      const campCourses = [
        'summer-20-ind',
        'summer-21-ind-apr-1',
        'summer-21-ind-may-1',
        'summer-21-ind-may-2',
        'summer-21-ind-jun-1',
        'summer-21-sg-jun-1',
        'vedic-maths-21-jun-1',
        'vedic-maths-21-jun-2',
        'learn-2-code-oct-21',
        'sg-camp-scratch-dec-21',
        'sg-camp-python-dec-21',
        'summer-22-ind-apr-1',
        'summer-22-ind-apr-2',
        'summer-22-ind-may-1',
        'summer-22-ind-may-2',
        'summer-22-sg-jun',
        'web-dev-camp-jun-22',
        'summer-22-me-jul',
      ]

      console.log(`changing the available courses: ${courseType}`)
      if (courseType === 'regular') {
        courses.push(...regularCourses)
      } else if (courseType === 'camp') {
        courses.push(...campCourses)
      }

      return courses
    },
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
    addContactType(type) {
      switch (type) {
        case 'phone':
          if (this.form.otherContacts.length < 2) {
            this.form.otherContacts.push({ country: null, number: null })
          }
          break
        case 'email':
          if (this.form.otherEmails.length < 2) {
            this.form.otherEmails.push({ address: null })
          }
          break
      }
    },
    addCourse() {
      this.form.courses.push({
        type: null,
        name: null,
        installments: [
          {
            amountPaid: null,
            paymentDate: null,
            invoiceNo: null,
          },
        ],
        actualPrice: null,
        currency: '₹',
        isNew: true,
        paidInFull: false,
      })
    },
    onInstallmentChange(index) {
      if (index > -1 && index < this.form.courses.length) {
        const course = this.form.courses[index]
        if (course.paidInFull && course.installments.length > 1) {
          course.installments.splice(1, course.installments.length - 1)
        }
      }
    },
    addInstallment(index) {
      if (index > -1 && index < this.form.courses.length) {
        this.form.courses[index].installments.push({
          amountPaid: null,
          paymentDate: null,
          invoiceNo: null,
        })
      }
    },
    removeCourse(index) {
      if (index > -1 && index < this.form.courses.length) {
        this.form.courses.splice(index, 1)
      }
    },
    removeInstallment(index, installIndex) {
      if (index > -1 && index < this.form.courses.length) {
        const course = this.form.courses[index]
        if (installIndex > -1 && installIndex < course.installments.length) {
          course.installments.splice(installIndex, 1)
        }
      }
    },
    removeContactType(type, index) {
      switch (type) {
        case 'phone':
          if (index > -1 && index < this.form.otherContacts.length) {
            this.form.otherContacts.splice(index, 1)
          }
          break
        case 'email':
          if (index > -1 && index < this.form.otherEmails.length) {
            this.form.otherEmails.splice(index, 1)
          }
          break
      }
    },
    resetChanges() {
      this.form.parentsName = this.customerData.parentsName
      this.form.parentsEmail = this.customerData.parentsEmail
      this.form.parentsPhone = {
        country: { ...this.customerData.country },
        number: this.customerData.parentsPhone,
      }

      this.form.kidsName = this.customerData.kidsName
      this.form.kidsAge = this.customerData.kidsAge
      this.form.directEnroll = this.customerData.directEnroll

      if (this.customerData.address) {
        this.form.address = { ...this.customerData.address }
        this.form.address.country = this.countries.find(
          (countryObj) =>
            countryObj.country === this.customerData.address.country
        )
      } else {
        this.form.address = {}
      }

      this.form.otherContacts = []
      if (this.customerData.otherContacts) {
        for (const contact of this.customerData.otherContacts) {
          this.form.otherContacts.push({
            country: { ...contact.country },
            number: contact.phoneNo,
            label: contact.label,
          })
        }
      }

      this.form.otherEmails = []
      if (this.customerData.otherEmails) {
        for (const contact of this.customerData.otherEmails) {
          this.form.otherEmails.push({
            address: contact.address,
            label: contact.label,
          })
        }
      }

      this.form.courses = []
      if (this.customerData.courses) {
        for (const course of this.customerData.courses) {
          const courseObj = {
            id: course.id,
            type: course.type,
            name: course.course,
            installments: [],
            isNew: false,
          }

          if (Array.isArray(course.installments)) {
            courseObj.paidInFull = false
            courseObj.installments.push(...course.installments)
            courseObj.actualPrice = course.installments[0].actualPrice
            courseObj.currency = course.installments[0].currency || '₹'
          } else {
            courseObj.paidInFull = true
            courseObj.installments.push(course.installments)
          }

          this.form.courses.push(courseObj)
        }
      }

      this.form.metaInfo = this.customerData.metaInfo

      this.$refs.form.resetValidation()
      this.$vuetify.goTo(this.$refs.form)
    },
    findAddressChanges(change) {
      for (const [key, value] of Object.entries(this.form.address)) {
        const originalVal = this.customerData.address
          ? this.customerData.address[key]
          : null
        let hasUpdate = false

        const valueToUse = key === 'country' ? value.country : value

        if (valueToUse && originalVal && valueToUse !== originalVal) {
          change.text += `address: ${key}: ${originalVal} -> ${valueToUse}\n`
          hasUpdate = true
        } else if (valueToUse && !originalVal) {
          change.text += `address: ${key}: none -> ${valueToUse}\n`
          hasUpdate = true
        } else if (!valueToUse && originalVal) {
          change.text += `address: ${key}: ${originalVal} -> none\n`
          hasUpdate = true
        }

        if (hasUpdate) {
          // Without using the dot notation whole of address object will be overwritten
          change.data[`address.${key}`] = valueToUse
        }
      }
    },
    findEmailChanges() {
      const modifiedContacts = this.form.otherEmails
      const existingContacts = this.customerData.otherEmails

      const proceed =
        (existingContacts && existingContacts.length) ||
        (modifiedContacts && modifiedContacts.length)

      if (proceed) {
        this.changes.data.otherEmails = null
        const maxContacts = existingContacts
          ? modifiedContacts
            ? existingContacts.length > modifiedContacts.length
              ? existingContacts.length
              : modifiedContacts.length
            : existingContacts.length
          : modifiedContacts.length

        for (let index = 0; index < maxContacts; index++) {
          const existingContact =
            existingContacts && index < existingContacts.length
              ? existingContacts[index]
              : null
          const modifiedContact =
            modifiedContacts && index < modifiedContacts.length
              ? modifiedContacts[index]
              : null
          let text

          if (!existingContact) {
            text = `label: ${modifiedContact.label}: none -> ${modifiedContact.address}\n`
          } else if (!modifiedContact) {
            text = `label: ${existingContact.label}: ${existingContact.address} -> none\n`
          } else if (
            existingContact.label !== modifiedContact.label ||
            existingContact.address !== modifiedContact.address
          ) {
            text = `label: ${existingContact.label}: ${existingContact.address} -> label: ${modifiedContact.label}: ${modifiedContact.address}\n`
          }

          if (text) {
            this.changes.text += text
          }

          if (modifiedContact) {
            if (!Array.isArray(this.changes.data.otherEmails)) {
              this.changes.data.otherEmails = []
            }

            this.changes.data.otherEmails.push({
              address: modifiedContact.address,
              label: modifiedContact.label,
            })
          }
        }
      }
    },
    findCourseChanges() {
      const existingCourses = this.customerData.courses

      let newCourse = 1
      for (let index = 0; index < this.form.courses.length; index++) {
        const course = this.form.courses[index]

        if (course.isNew) {
          const courseObj = {
            course: course.name,
            type: course.type,
          }

          let text = `New Course ${newCourse++}: name -> ${
            course.name
          }, type -> ${course.type}, price -> ${
            course.actualPrice
          }, currency -> ${course.currency}\n`

          if (course.paidInFull) {
            const installment = course.installments[0]
            const paymentDate = new Date(installment.paymentDate)

            text += `Full Payment: paid -> ${
              installment.amountPaid
            }, date -> ${paymentDate.toDateString()}, invoice no. -> ${
              installment.invoiceNo
            }\n`

            courseObj.installments = {
              actualPrice: course.actualPrice,
              amountPaid: installment.amountPaid,
              invoiceNo: installment.invoiceNo,
              currency: course.currency,
              paymentDate,
            }
          } else {
            courseObj.installments = []
            for (const [index, installment] of course.installments.entries()) {
              const paymentDate = new Date(installment.paymentDate)
              text += `Installment ${index + 1}: paid -> ${
                installment.amountPaid
              }, date -> ${paymentDate.toDateString()}, invoice no. -> ${
                installment.invoiceNo
              }\n`

              courseObj.installments.push({
                actualPrice: course.actualPrice,
                amountPaid: installment.amountPaid,
                invoiceNo: installment.invoiceNo,
                currency: course.currency,
                paymentDate,
              })
            }
          }

          this.changes.text += text

          if (!Array.isArray(this.changes.data.courses)) {
            this.changes.data.courses = []
          }

          this.changes.data.courses.push(courseObj)
        } else {
          const existingCourse = existingCourses.find(
            (existingCourse) => existingCourse.id === course.id
          )

          if (
            existingCourse &&
            course.installments.length > existingCourse.installments.length
          ) {
            const courseObj = {
              id: course.id,
              installments: [],
            }

            let text = `Existing Course: name -> ${course.name}, type -> ${course.type}, price -> ${course.actualPrice}, currency: ${course.currency}\n`
            for (
              let index = existingCourse.installments.length;
              index < course.installments.length;
              index++
            ) {
              const installment = course.installments[index]
              const paymentDate = new Date(installment.paymentDate)
              text += `Installment ${index + 1}: paid -> ${
                installment.amountPaid
              }, date -> ${paymentDate.toDateString()}, invoice no. -> ${
                installment.invoiceNo
              }\n`

              courseObj.installments.push({
                actualPrice: course.actualPrice,
                amountPaid: installment.amountPaid,
                invoiceNo: installment.invoiceNo,
                currency: course.currency,
                paymentDate,
              })
            }

            this.changes.text += text

            if (!Array.isArray(this.changes.data.courses)) {
              this.changes.data.courses = []
            }

            this.changes.data.courses.push(courseObj)
          }
        }
      }
    },
    findContactChanges() {
      const modifiedContacts = this.form.otherContacts
      const existingContacts = this.customerData.otherContacts

      const proceed =
        (existingContacts && existingContacts.length) ||
        (modifiedContacts && modifiedContacts.length)

      if (proceed) {
        this.changes.data.otherContacts = null
        const maxContacts = existingContacts
          ? modifiedContacts
            ? existingContacts.length > modifiedContacts.length
              ? existingContacts.length
              : modifiedContacts.length
            : existingContacts.length
          : modifiedContacts.length

        for (let index = 0; index < maxContacts; index++) {
          const existingContact =
            existingContacts && index < existingContacts.length
              ? existingContacts[index]
              : null
          const modifiedContact =
            modifiedContacts && index < modifiedContacts.length
              ? modifiedContacts[index]
              : null
          let text

          if (!existingContact) {
            text = `label: ${modifiedContact.label}: none -> ${modifiedContact.country.calling_code}-${modifiedContact.number}\n`
          } else if (!modifiedContact) {
            text = `label: ${existingContact.label}: ${existingContact.country.dialCode}-${existingContact.phoneNo} -> none\n`
          } else if (
            existingContact.country.dialCode !==
              modifiedContact.country.calling_code ||
            existingContact.phoneNo !== modifiedContact.number ||
            existingContact.label !== modifiedContact.label
          ) {
            text = `label: ${existingContact.label}: ${existingContact.country.dialCode}-${existingContact.phoneNo} -> label: ${modifiedContact.label}: ${modifiedContact.country.calling_code}-${modifiedContact.number}\n`
          }

          if (text) {
            this.changes.text += text
          }

          if (modifiedContact) {
            if (!Array.isArray(this.changes.data.otherContacts)) {
              this.changes.data.otherContacts = []
            }

            this.changes.data.otherContacts.push({
              country: {
                dialCode: modifiedContact.country.calling_code,
                name: modifiedContact.country.name,
              },
              phoneNo: modifiedContact.number,
              label: modifiedContact.label,
            })
          }
        }
      }
    },
    findChanges() {
      const changes = this.changes
      for (const [key, value] of Object.entries(this.form)) {
        const originalVal = this.customerData[key] || 'none'
        if (typeof value !== 'object' && value && value !== originalVal) {
          changes.text += `${key}: ${originalVal} -> ${value}\n`
          changes.data[key] = value
        } else if (
          typeof value === 'boolean' &&
          value !== this.customerData[key]
        ) {
          changes.text += `${key}: ${this.customerData[key]} -> ${value}\n`
          changes.data[key] = value
        } else if (typeof value === 'object') {
          switch (key) {
            case 'parentsPhone':
              if (
                !this.customerData.country ||
                this.customerData.country.dialCode !==
                  value.country.calling_code ||
                this.customerData.parentsPhone !== value.number
              ) {
                changes.text += `parentsPhone: ${
                  this.customerData.country
                    ? this.customerData.country.dialCode + '-'
                    : ''
                }${this.customerData.parentsPhone} -> ${
                  value.country.calling_code
                }-${value.number}\n`
                changes.data.country = {
                  name: value.country.name,
                  dialCode: value.country.calling_code,
                }
                changes.data.parentsPhone = value.number
              }
              break
            case 'address':
              this.findAddressChanges(changes)
              break
            case 'otherContacts':
              this.findContactChanges()
              break
            case 'otherEmails':
              this.findEmailChanges()
              break
            case 'courses':
              this.findCourseChanges()
              break
          }
        }
      }
    },
    reviewChanges() {
      this.alert.show = false
      if (this.$refs.form.validate()) {
        this.findChanges()
        if (this.changes.text) {
          this.dialog = true
        } else {
          alert('No changes found in data')
        }
      }
    },
    cancelChanges() {
      this.changes = { text: '', data: {} }
      this.dialog = false
    },
    async submitChanges() {
      this.dialog = false
      this.loading = true

      try {
        if (this.changes.data.courses && this.changes.data.courses.length) {
          await this.addCourseAndPayments({
            id: this.customerData.id,
            courses: this.changes.data.courses,
          })
        } else {
          await this.editCustomerDetails({
            id: this.customerData.id,
            data: this.changes.data,
            changes: {
              summary: 'Customer details changed',
              description: this.changes.text,
            },
          })
        }

        this.alert.type = 'success'

        setTimeout(() => {
          this.$router.replace(`/admin/demo-requests/${this.customerData.id}`)
        }, 1000)
      } catch (error) {
        this.alert.type = 'error'
        console.log(error)
      }

      this.loading = false
      this.alert.show = true
    },
    backBtnClicked() {
      if (window.history.length > 1) {
        this.$router.go(-1)
      } else {
        this.$router.push(`/admin/demo-requests/${this.$route.params.id}`)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~/assets/colors.scss';

.section {
  border-left: 5px solid $primary;
  border-radius: 4px;
  padding: 12px 0 0 12px;
}

.section + .section {
  margin-top: 16px;
}

.section-title {
  font-size: 1rem;
}
</style>
