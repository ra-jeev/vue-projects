<template>
  <v-card class="ma-6">
    <v-card-title>
      <span>Super Admin Area</span>
      <!-- <v-spacer />
      <v-btn color="primary" @click="getCollectionGroupData">
        Get query data
      </v-btn> -->
    </v-card-title>
    <v-divider />
    <v-progress-linear v-if="loading" indeterminate />
    <v-card-text>
      <template v-if="loading"> Loading... </template>
      <template v-else-if="queryData">
        <div v-for="(docs, key, index) in queryData" :key="`key_${index}`">
          <div class="title">
            {{ key }}
          </div>
          <div v-for="doc in docs" :key="doc.id">
            {{ doc }}
            <v-divider class="my-3" />
          </div>
        </div>
      </template>
      <template v-else>
        <v-row class="headline" justify="center"> <v-col>No data</v-col></v-row>
      </template>

      <v-row class="mt-4" justify="space-between">
        <v-col>
          <v-btn color="primary" @click="createUserDialog = true">
            Create User from Backend
          </v-btn>
        </v-col>
        <v-col>
          <v-btn color="primary" @click="showMessageDialog">
            Send Bulk Emails
          </v-btn>
        </v-col>
        <v-col>
          <v-btn color="primary" @click="showEmailFilterDialog">
            <!-- <v-btn color="primary" @click="fetchEmailUsers"> -->
            Send Emails with Filter
          </v-btn>
        </v-col>
        <v-col>
          <v-btn color="primary" @click="addLead"> Add Lead </v-btn>
        </v-col>
        <v-col>
          <v-btn color="primary" @click="setMetaConfig"> Set Config </v-btn>
        </v-col>
        <v-col>
          <v-btn color="primary" @click="saveWorkshop">
            Save Active Workshop
          </v-btn>
        </v-col>
        <v-col>
          <v-btn color="primary" @click="archiveWorkshop">
            Archive Active Workshop
          </v-btn>
        </v-col>
        <v-col>
          <v-btn color="primary" @click="createEnrolledCustomers">
            Move customer to enrolled
          </v-btn>
        </v-col>
        <v-col>
          <v-btn color="primary" @click="updateDataFields">
            Update Fields
          </v-btn>
        </v-col>
        <v-col>
          <v-btn
            :disabled="loading"
            :loading="loading"
            color="primary"
            @click="getAllUsers"
          >
            Get Users
          </v-btn>
        </v-col>
        <v-col>
          <v-btn color="secondary" @click="testMyData"> Test Data </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
    <v-dialog v-model="dialog" max-width="600px" persistent>
      <v-card>
        <v-card-title>
          Email Message
          <v-spacer />
          <v-switch v-model="form.send" label="Send Emails" />
        </v-card-title>

        <v-form ref="form" lazy-validation @submit.prevent="contactUser">
          <v-card-text class="pt-4">
            <v-select
              v-model="selectedSlot"
              :items="slotKeys"
              item-color="secondary"
              label="Select the slot"
              outlined
            />
            <v-text-field
              v-model="form.subject"
              :rules="[requiredRules('Subject')]"
              label="Subject"
              outlined
              validate-on-blur
            />
            <v-textarea
              v-model="form.message"
              :rules="[requiredRules('Message')]"
              label="Say something"
              outlined
              validate-on-blur
            />
            <v-alert
              v-model="form.alert.show"
              :type="form.alert.error === 'success' ? 'success' : 'error'"
              prominent
              dismissible
            >
              {{
                form.alert.error === 'success'
                  ? 'Email queued successfully.'
                  : form.alert.error
              }}
            </v-alert>
          </v-card-text>

          <v-card-actions class="pt-0 px-6 pb-5">
            <v-btn color="primary" text @click="cancelUserContact">
              Cancel
            </v-btn>
            <v-btn
              :disabled="loading"
              :loading="loading"
              color="primary"
              type="submit"
            >
              Send
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
    <v-dialog v-model="filterDialog" max-width="600px" persistent>
      <v-card>
        <v-card-title>
          Email Message
          <v-spacer />
          <v-switch v-model="form.send" label="Send Bulk Emails" />
        </v-card-title>

        <v-form ref="form" lazy-validation @submit.prevent="sendBulkEmails">
          <v-card-text class="pt-4">
            <v-text-field
              v-model="form.subject"
              :rules="[requiredRules('Subject')]"
              label="Subject"
              outlined
              validate-on-blur
            />
            <v-textarea
              v-model="form.message"
              :rules="[requiredRules('Message')]"
              label="Say something"
              outlined
              validate-on-blur
            />
            <v-alert
              v-model="form.alert.show"
              :type="form.alert.error === 'success' ? 'success' : 'error'"
              prominent
              dismissible
            >
              {{
                form.alert.error === 'success'
                  ? 'Email queued successfully.'
                  : form.alert.error
              }}
            </v-alert>
          </v-card-text>

          <v-card-actions class="pt-0 px-6 pb-5">
            <v-btn color="primary" text @click="filterDialog = false">
              Cancel
            </v-btn>
            <v-btn
              :disabled="loading"
              :loading="loading"
              color="primary"
              type="submit"
            >
              Send
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
    <v-dialog v-model="createUserDialog" max-width="600px" persistent>
      <v-card color="grey darken-3">
        <v-card-title>
          <span class="headline">Enter user Details</span>
          <v-spacer />
          <v-switch v-model="userForm.hasId" label="Use existing id" />
        </v-card-title>

        <v-form ref="userForm" lazy-validation @submit.prevent="createUser">
          <v-card-text>
            <v-text-field
              v-if="userForm.hasId"
              v-model="userForm.id"
              :rules="idRules"
              label="User's Id *"
              outlined
              required
              validate-on-blur
            />
            <v-text-field
              v-model="userForm.name"
              :rules="[requiredRules('User Name')]"
              label="User's Name *"
              outlined
              required
              validate-on-blur
            />
            <v-text-field
              v-model="userForm.email"
              :rules="[requiredRules('User\'s Email Id')]"
              label="User's Email ID *"
              outlined
              type="email"
              required
              validate-on-blur
            />
            <v-select
              v-model="userForm.type"
              :items="['admin', 'partner', 'affiliate']"
              :rules="[requiredRules('User\'s type')]"
              label="User's Type *"
              outlined
              required
              validate-on-blur
            />
            <v-select
              v-model="userForm.accessLevel"
              :items="[1, 3, 7, 15]"
              :rules="[requiredRules('User\'s access level')]"
              label="User's Access Level *"
              outlined
              required
              validate-on-blur
            />
          </v-card-text>
          <v-alert
            v-model="userForm.alert.show"
            :type="userForm.alert.type"
            prominent
            dismissible
          >
            {{
              userForm.alert.type === 'success'
                ? userForm.alert.message.success
                : userForm.alert.message.failure
            }}
          </v-alert>

          <v-card-actions class="pt-0 px-6 pb-5">
            <v-spacer />
            <v-btn color="secondary" text @click="cancelUserCreate">
              Cancel
            </v-btn>
            <v-btn
              :disabled="userForm.loading"
              :loading="userForm.loading"
              color="secondary"
              type="submit"
            >
              Submit
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
// import slotsData from '~/assets/free2code.json'
// import { message } from '~/assets/free2code-message.js'

export default {
  data() {
    return {
      loading: false,
      call: false,
      dialog: false,
      filterDialog: false,
      // subject: `🎉 JrInLab's #free2code workshop joining link for %recipient.kidsName%`,
      subject: `JrInLab's #free2code workshop for %recipient.kidsName% starts at 2:30 PM`,
      form: {
        to: null,
        data: null,
        subject: null,
        message: null,
        send: false,
        alert: {
          show: false,
          error: null,
        },
      },
      requiredRules: (type) => {
        return (v) => !!v || `${type} can't be empty.`
      },
      idRules: [
        (v) => {
          if (!this.userForm.hasId) {
            return true
          } else {
            return !!v || `User id can't be empty.`
          }
        },
      ],
      createUserDialog: false,
      userForm: {
        loading: false,
        name: null,
        email: null,
        type: null,
        accessLevel: null,
        alert: {
          show: false,
          type: 'success',
          message: {
            success: `Request was submitted successfully.`,
            failure: `Oops! Failed to submit the request.`,
          },
        },
      },
      sendBatch: true,
      users: null,
      slots: {
        '0-9': {
          classLink: 'https://meet.google.com/jpz-fhot-iwf',
          timeSlot: 'Jan 29, 2:30 PM IST',
          emailList: [],
          recipientVariables: {},
        },
        '10-12': {
          classLink: 'https://meet.google.com/bes-mevr-kou',
          timeSlot: 'Jan 29, 2:30 PM IST',
          emailList: [],
          recipientVariables: {},
        },
      },
      selectedSlot: null,
    }
  },
  computed: {
    ...mapGetters('admin', ['queryData']),
    slotKeys() {
      return Object.keys(this.slots)
    },
  },
  methods: {
    ...mapActions('admin', [
      'getEntries',
      'updateEntries',
      'createEnrolledCustomers',
      'archiveActiveWorkshop',
      'saveActiveWorkshop',
      'sendBulkTextEmails',
      'sendBatchEmails',
      'setConfigs',
      'fetchCustomers',
      'addSiblingToDemos',
      'getUsersForFilter',
      'adminCreateUser',
    ]),
    cancelUserCreate() {
      console.info('Cancel user create method called')
      this.createUserDialog = false
      this.userForm.alert.show = false
      this.$refs.userForm.reset()
    },
    async createUser() {
      console.log('Create user method called')
      this.userForm.alert.show = false

      if (this.$refs.userForm.validate()) {
        try {
          this.userForm.loading = true
          const data = {
            email: this.userForm.email,
            name: this.userForm.name,
            type: this.userForm.type,
            accessLevel: this.userForm.accessLevel,
          }

          if (this.userForm.hasId) {
            data.id = this.userForm.id
          }

          await this.adminCreateUser(data)
          this.$refs.userForm.reset()
          this.userForm.alert.type = 'success'
          this.userForm.alert.show = true
        } catch (error) {
          console.log('failed to create user: ', error)
          this.userForm.alert.type = 'error'
          this.userForm.alert.show = true
        }

        this.userForm.loading = false
      }
    },
    // async contactUser() {
    //   // const { default: coldLeads } = await import('~/assets/cold.json')
    //   const coldLeads = []
    //   const MAX_LEADS = 300
    //   const newObjects = []
    //   let to = []
    //   let recipientData = {}

    //   for (let index = 0; index < coldLeads.length; index++) {
    //     const leadsArray = coldLeads[index]
    //     to.push(...leadsArray.to)
    //     recipientData = { ...recipientData, ...leadsArray.data }
    //     console.log('to array length: ', to.length)
    //     if (to.length >= MAX_LEADS || index === coldLeads.length - 1) {
    //       newObjects.push({ to, recipientData })
    //       to = []
    //       recipientData = {}
    //     }
    //   }

    //   if (this.$refs.form.validate()) {
    //     this.form.alert.show = false
    //     // if (this.form.alert.error) {
    //     //   this.form.alert.show = true
    //     //   return
    //     // }

    //     console.log('form data:: ', this.form)

    //     this.loading = true
    //     try {
    //       let response
    //       if (this.sendBatch) {
    //         response = await this.sendBatchEmails({
    //           subject: this.form.subject,
    //           message: this.form.message,
    //           send: this.form.send,
    //           to: newObjects[0].to,
    //           recipientData: newObjects[0].recipientData,
    //         })

    //         if (response.data && (response.data.id || response.data.data)) {
    //           this.form.alert.error = 'success'
    //           this.form.alert.show = true
    //           alert('Send another batch??')

    //           response = await this.sendBatchEmails({
    //             subject: this.form.subject,
    //             message: this.form.message,
    //             send: this.form.send,
    //             to: newObjects[1].to,
    //             recipientData: newObjects[1].recipientData,
    //           })
    //         } else {
    //           this.form.alert.error =
    //             'Some error occurred. Please try again later.'
    //           this.form.alert.show = true
    //         }
    //       } else {
    //         response = await this.sendBulkTextEmails({
    //           subject: this.form.subject,
    //           message: this.form.message,
    //           send: this.form.send,
    //           filters: [
    //             {
    //               field: 'status',
    //               clause: 'in',
    //               value: ['cold'],
    //             },
    //           ],
    //         })
    //       }

    //       if (response.data && (response.data.id || response.data.data)) {
    //         this.form.alert.error = 'success'
    //         this.form.alert.show = true
    //         setTimeout(() => {
    //           this.cancelUserContact()
    //         }, 1000)
    //       } else {
    //         this.form.alert.error =
    //           'Some error occurred. Please try again later.'
    //         this.form.alert.show = true
    //       }

    //       console.log(response)
    //     } catch (error) {
    //       console.log('error in sending email: ', error)
    //       this.form.alert.error = error.message
    //       this.form.alert.show = true
    //     }

    //     this.loading = false
    //   }
    // },
    async contactUserForVedicMaths() {
      const isPaymentLink = false
      const to = new Set()
      const recipientData = {}

      // 'Vinod Negi': 'https://rzp.io/i/UFCliiZ',
      const links = {
        'Chandan Dhingra': 'https://rzp.io/i/FxQ1zrk',
        'Sunil Choudhary': 'https://rzp.io/i/eFNRqliRkm',
        'Amaresh Kr Pandey': 'https://rzp.io/i/4lGsXrjkJ',
        'Shivi Mittal': 'https://rzp.io/i/cr48QzEHt',
        'Meenu Sharma': 'https://rzp.io/i/s135tRthng',
        'Puneet Nath': 'https://rzp.io/i/x8rV6oh',
        'I.R.Harinee': 'https://rzp.io/i/m1hN2fP',
        'Babrik Pathania': 'https://rzp.io/i/21BIVntGQ4',
        'Chhavi Bhatnagar': 'https://rzp.io/i/hRLx0b8ldF',
        'Shobhan Kumar Dey': 'https://rzp.io/i/nzLP2rRB',
        'Sujatha Amin': 'https://rzp.io/i/UCofBcIh5',
        'Roopa Shenoy': 'https://rzp.io/i/cinifULb',
        'Suma Nitin Anchan': 'https://rzp.io/i/naUwqTJ',
        'Manik Batish': 'https://rzp.io/i/UlpUCYGi',
        'Princy Anand': 'https://rzp.io/i/H61wBhi',
        Rajeev: 'https://rzp.io/i/H61wBhi',
        'Raj Outlook': 'https://rzp.io/i/H61wBhi123',
        'Rajeev Jr': 'https://rzp.io/i/H61wBhi456',
      }

      const users = this.users
      // const users = [
      //   {
      //     parentsName: 'Rajeev',
      //     parentsEmail: 'i.rarsh@gmail.com',
      //     kidsName: ' Adhrit',
      //   },
      //   {
      //     parentsName: 'Raj Outlook',
      //     parentsEmail: 'rajeev.s@outlook.com',
      //     kidsName: ' Adh',
      //   },
      //   {
      //     parentsName: 'Rajeev Jr',
      //     parentsEmail: 'rajeev@jrinlab.com',
      //     kidsName: ' Adhrit',
      //   },
      // ]

      for (const user of users) {
        if (user.status !== 'cold' && !to.has(user.parentsEmail)) {
          to.add(user.parentsEmail)
          if (!isPaymentLink) {
            recipientData[user.parentsEmail] = {
              name: user.parentsName,
              kidsName: user.kidsName,
              classLink: 'https://meet.google.com/mid-gxit-owx',
              timeSlot: '4:00 PM IST',
            }
          } else if (links[user.parentsName]) {
            recipientData[user.parentsEmail] = {
              name: user.parentsName,
              kidsName: user.kidsName,
              paymentLink: links[user.parentsName],
              timeSlot: '11:00 AM IST',
            }
          } else {
            to.delete(user.parentsEmail)
          }
        }
      }

      if (to) {
        console.log('to: ', to)
        console.log('data: ', recipientData)
        // return
      }

      if (this.$refs.form.validate()) {
        this.form.alert.show = false
        // if (this.form.alert.error) {
        //   this.form.alert.show = true
        //   return
        // }

        // console.log('form data:: ', this.form)

        this.loading = true
        try {
          let response
          if (this.sendBatch) {
            response = await this.sendBatchEmails({
              subject: this.form.subject,
              message: this.form.message,
              send: this.form.send,
              to: Array.from(to),
              recipientData,
            })
          }

          if (response.data && (response.data.id || response.data.data)) {
            this.form.alert.error = 'success'
            this.form.alert.show = true
            setTimeout(() => {
              this.cancelUserContact()
            }, 1000)
          } else {
            this.form.alert.error =
              'Some error occurred. Please try again later.'
            this.form.alert.show = true
          }

          console.log(response)
        } catch (error) {
          console.log('error in sending email: ', error)
          this.form.alert.error = error.message
          this.form.alert.show = true
        }

        this.loading = false
      }
    },
    async contactUser() {
      const testOnly = false

      const users = this.slots[this.selectedSlot]
      const selfEmail = 'i.rarsh@gmail.com'

      if (testOnly) {
        users.emailList = []
        users.recipientVariables = {}
      }

      users.emailList.push(selfEmail)
      users.recipientVariables[selfEmail] = {
        name: 'Rajeev',
        kidsName: 'Adhrit',
      }

      // const users = {
      //   emailList: [
      //     'i.rarsh@gmail.com',
      //     'rajeev@jrinlab.com',
      //     'rajeev.s@outlook.com',
      //   ],
      //   recipientVariables: {
      //     'i.rarsh@gmail.com': {
      //       name: 'Rajeev',
      //       kidsName: 'Adhrit',
      //       classLink: 'https://meet.google.com/mid-gxit-owx',
      //       timeSlot: '11:00 AM IST',
      //     },
      //     'rajeev@jrinlab.com': {
      //       name: 'Rajeev Jr',
      //       kidsName: 'Adhrit Jr',
      //       classLink: 'https://meet.google.com/mid-gxit-owx',
      //       timeSlot: '11:00 AM IST',
      //     },
      //     'rajeev.s@outlook.com': {
      //       name: 'Rajeev Outlook',
      //       kidsName: 'Adhrit Outlook',
      //       classLink: 'https://meet.google.com/mid-gxit-owx',
      //       timeSlot: '11:00 AM IST',
      //     },
      //   },
      // }

      for (const recipientVariable of Object.values(users.recipientVariables)) {
        recipientVariable.classLink = users.classLink
        recipientVariable.timeSlot = users.timeSlot
      }

      if (users) {
        console.log('to: ', users.emailList)
        console.log('data: ', users.recipientVariables)
        // return
      }

      if (this.$refs.form.validate()) {
        this.form.alert.show = false
        // if (this.form.alert.error) {
        //   this.form.alert.show = true
        //   return
        // }

        // console.log('form data:: ', this.form)

        this.loading = true
        try {
          let response
          if (this.sendBatch) {
            response = await this.sendBatchEmails({
              subject: this.form.subject,
              message: this.form.message,
              send: this.form.send,
              to: users.emailList,
              recipientData: users.recipientVariables,
            })
          }

          if (response.data && (response.data.id || response.data.data)) {
            this.form.alert.error = 'success'
            this.form.alert.show = true
            setTimeout(() => {
              this.cancelUserContact()
            }, 1000)
          } else {
            this.form.alert.error =
              'Some error occurred. Please try again later.'
            this.form.alert.show = true
          }

          console.log(response)
        } catch (error) {
          console.log('error in sending email: ', error)
          this.form.alert.error = error.message
          this.form.alert.show = true
        }

        this.loading = false
      }
    },
    async sendBulkEmails() {
      const filters = [
        {
          field: 'query.utm_campaign',
          value: ['smr-cmp-apr-22', 'smr-cmp-may-22'],
          clause: 'not-in',
        },
        {
          field: 'country.name',
          value: 'India',
          clause: '==',
        },
      ]

      if (this.$refs.form.validate()) {
        this.form.alert.show = false

        this.loading = true
        try {
          const response = await this.sendBulkTextEmails({
            subject: this.form.subject,
            message: this.form.message,
            send: this.form.send,
            filters,
          })

          if (response.data && (response.data.id || response.data.data)) {
            this.form.alert.error = 'success'
            this.form.alert.show = true
            setTimeout(() => {
              this.cancelUserContact()
            }, 1000)
          } else {
            this.form.alert.error =
              'Some error occurred. Please try again later.'
            this.form.alert.show = true
          }

          console.log(response)
        } catch (error) {
          console.log('error in sending email: ', error)
          this.form.alert.error = error.message
          this.form.alert.show = true
        }

        this.loading = false
      }
    },
    async fetchEmailUsers() {
      const filters = [
        {
          field: 'query.utm_campaign',
          value: ['smr-cmp-apr-22', 'smr-cmp-may-22'],
          clause: 'not-in',
        },
        {
          field: 'country.name',
          value: 'India',
          clause: '==',
        },
      ]

      const emailList = []
      const recipientVariables = {}

      this.loading = true
      try {
        const entries = await this.getUsersForFilter(filters)

        const getName = (name) => {
          const nameParts = name.split(' ')
          let firstName = nameParts[0].toLowerCase()
          // let secondName
          if (
            firstName.includes('mr') ||
            firstName.includes('dr') ||
            firstName.includes('ms') ||
            firstName.includes('mrs') ||
            firstName.length <= 3
          ) {
            firstName = `${nameParts[0]}${
              nameParts[1] ? ` ${nameParts[1]}` : ''
            }`
            // secondName = nameParts[2] || ''
          } else {
            firstName = nameParts[0]
            // secondName = nameParts[1] || ''
          }

          // console.log('secondName: ', secondName)

          return firstName
        }

        const masterEmailList = []

        for (const entry of entries) {
          if (!emailList.includes(entry.parentsEmail)) {
            if (entry.country.name !== 'India') {
              console.log(
                `found some outside entry: ${entry.parentsName}, country: ${entry.country.name}`
              )
            }

            if (
              ['smr-cmp-apr-22', 'smr-cmp-may-22'].includes(
                entry.query?.utm_campaign
              )
            ) {
              console.log(`found some fresh entry: ${entry.parentsName}`)
            }

            emailList.push(entry.parentsEmail)
            recipientVariables[entry.parentsEmail] = {
              name: getName(entry.parentsName),
              kidsName: getName(entry.kidsName),
            }
          } else {
            console.log(
              `Duplicate entry for ${entry.parentsName} : ${entry.parentsEmail}`
            )
          }

          if (masterEmailList.includes(entry.parentsEmail)) {
            console.log(
              `${entry.parentsEmail} already present in the master list`
            )
          } else {
            masterEmailList.push(entry.parentsEmail)
          }
        }

        console.log(
          `fetchEmailUsers: final data size: ${masterEmailList.length}, `,
          JSON.stringify(recipientVariables, null, 2)
        )
      } catch (error) {
        console.log('error: ', error)
      }

      this.loading = false
    },
    async getAllUsers() {
      const filters = [
        {
          field: 'page',
          value: 'free-2-code',
          clause: '==',
        },
        {
          field: 'createdAt',
          value: new Date(2022, 0, 1),
          clause: '>',
        },
      ]
      this.slots['0-9'].emailList = []
      this.slots['0-9'].recipientVariables = {}
      this.slots['10-12'].emailList = []
      this.slots['10-12'].recipientVariables = {}

      this.loading = true
      try {
        const entries = await this.getUsersForFilter(filters)

        const getName = (name) => {
          const nameParts = name.split(' ')
          let firstName = nameParts[0].toLowerCase()
          let secondName
          if (
            firstName.includes('mr') ||
            firstName.includes('dr') ||
            firstName.includes('ms') ||
            firstName.includes('mrs') ||
            firstName.length <= 3
          ) {
            firstName = `${nameParts[0]}${
              nameParts[1] ? ` ${nameParts[1]}` : ''
            }`
            secondName = nameParts[2] || ''
          } else {
            firstName = nameParts[0]
            secondName = nameParts[1] || ''
          }

          console.log('secondName: ', secondName)

          return firstName
        }

        const masterEmailList = []
        const csvData = {
          '0-9': 'mobile no.,parents name,kids name,date,time slot,class link',
          '10-12':
            'mobile no.,parents name,kids name,date,time slot,class link',
        }

        for (const entry of entries) {
          if (entry.status !== 'cold') {
            const isYounger = parseInt(entry.kidsAge) <= 9
            const opObj = isYounger ? this.slots['0-9'] : this.slots['10-12']

            if (!opObj.emailList.includes(entry.parentsEmail)) {
              opObj.emailList.push(entry.parentsEmail)
              opObj.recipientVariables[entry.parentsEmail] = {
                name: getName(entry.parentsName),
                kidsName: getName(entry.kidsName),
              }

              if (isYounger) {
                csvData[
                  '0-9'
                ] += `\n${entry.country.dialCode}-${entry.parentsPhone},${entry.parentsName},${entry.kidsName},${opObj.timeSlot},${opObj.classLink}`
              } else {
                csvData[
                  '10-12'
                ] += `\n${entry.country.dialCode}-${entry.parentsPhone},${entry.parentsName},${entry.kidsName},${opObj.timeSlot},${opObj.classLink}`
              }
            } else {
              console.log(
                `Duplicate entry for ${entry.parentsName} : ${entry.parentsEmail}`
              )
            }

            if (masterEmailList.includes(entry.parentsEmail)) {
              console.log(
                `${entry.parentsEmail} already present in the master list`
              )
            } else {
              masterEmailList.push(entry.parentsEmail)
            }
          }
        }

        console.log('getAllUsers: final data:', this.slots)
        console.log('getAllUsers: final CSV data: ', csvData)
      } catch (error) {
        console.log('error: ', error)
      }

      this.loading = false
    },
    cancelUserContact() {
      this.dialog = false
      this.form.alert.error = null
      this.form.alert.show = false
      this.form.send = false
      this.$refs.form.reset()
    },
    async getCollectionGroupData() {
      this.loading = true
      try {
        await this.getEntries({
          collectionGroup: {
            name: 'logs',
            fields: [
              {
                name: 'status.new',
                filter: '==',
                value: 'closed',
              },
              {
                name: 'status.old',
                filter: '==',
                value: 'closed',
              },
            ],
          },
          collection: {
            name: 'demos',
            fields: [
              {
                name: 'status',
                filter: '==',
                value: 'closed',
              },
            ],
          },
        })
      } catch (error) {
        console.log(error)
      }

      this.loading = false
    },
    async updateDataFields() {
      if (this.queryData) {
        const reqEntries = {}
        const demosData = this.queryData.demos
        const logsData = this.queryData.logs
        if (demosData) {
          for (const demoId in demosData) {
            const demoData = demosData[demoId]
            reqEntries[demoId] = {
              path: demoData.path,
              data: {},
            }

            reqEntries[demoId].data[demoData.field] = 'cold'
          }
        }

        if (logsData) {
          for (const logId in logsData) {
            const logData = logsData[logId]
            reqEntries[logId] = {
              path: logData.path,
              data: {},
            }

            reqEntries[logId].data[logData.field] = 'cold'
            const paths = logData.path.split('/')
            const demoId = paths[1]
            const demoPath = `${paths[0]}/${paths[1]}`
            if (!reqEntries[demoId]) {
              reqEntries[demoId] = {
                path: demoPath,
                data: {},
              }
            }

            reqEntries[demoId].data[`logs.${logId}.${logData.field}`] = 'cold'
          }
        }

        try {
          await this.updateEntries(reqEntries)
        } catch (error) {
          console.log(error)
        }
      }
    },
    async archiveWorkshop() {
      this.loading = true
      try {
        await this.archiveActiveWorkshop()
      } catch (error) {
        console.log(error)
      }

      this.loading = false
    },
    async saveWorkshop() {
      this.loading = true
      try {
        await this.saveActiveWorkshop()
      } catch (error) {
        console.log(error)
      }

      this.loading = false
    },
    async setMetaConfig() {
      const { messageJune, messageJuly } = await import('~/assets/message.js')
      // const message = 'Test Message'
      const configs = {
        emails: {
          service: 'mailgun',
          mailgun: {
            default: {
              templateName: 'welcome',
              subject: `%recipient.name%, welcome to JrInLab`,
            },
            'class-link': {
              templateName: 'class-link',
              subject: `%recipient.kidsName%'s coding class %recipient.type% successfully`,
            },
            workshop: {
              templateName: 'workshop',
            },
            webinar: {
              templateName: 'webinar',
            },
            payment: {
              templateName: 'payment',
              subject: `Payment receipt for your successful #codeagame workshop registration with JrinLab`,
            },
            'camp-link': {
              templateName: 'camp-link',
              subject: `%recipient.kidsName%'s %recipient.campName% joining details`,
            },
            'summer-camp': {
              templateName: 'summer',
            },
            'sg-summer-camp': {
              templateName: 'summer-sg',
            },
            'vedic-maths': {
              subject: `%recipient.name%, welcome to Manu Tripathi's Vedic Maths workshop with JrInLab`,
              '120621-1100': {
                classLink: 'https://meet.google.com/tkz-mqqn-uet',
                message: messageJune,
              },
              '120621-1600': {
                classLink: 'https://meet.google.com/fhc-ibra-hig',
                message: messageJune,
              },
              '200721-1700': {
                classLink: 'https://meet.google.com/bfr-berb-cfa',
                message: messageJuly,
              },
            },
          },
          sendgrid: {
            default: {
              templateName: 'welcome',
              subject: `{{ name }}, welcome to JrInLab`,
            },
            'class-link': {
              templateName: 'class-link',
              subject: `{{ kidsName }}'s coding class {{ type }} successfully`,
            },
            workshop: {
              templateName: 'workshop',
            },
            webinar: {
              templateName: 'webinar',
            },
            payment: {
              templateName: 'payment',
              subject: `Payment receipt for your successful #codeagame workshop registration with JrinLab`,
            },
            'camp-link': {
              templateName: 'camp-link',
              subject: `JrinLab's {{campName}} joining details for {{kidsName}}`,
            },
            'summer-camp': {
              templateName: 'summer',
            },
            'sg-summer-camp': {
              templateName: 'summer-sg',
            },
            'vedic-maths': {
              subject: `{{ name }}, welcome to Manu Tripathi's Vedic Maths camp with JrInLab`,
              message: messageJuly,
            },
          },
        },
      }

      if (configs) {
        console.log('text:: ', messageJuly)
        console.log('configs:: ', configs)
        // return
      }

      this.loading = true
      try {
        await this.setConfigs(configs)
      } catch (error) {
        console.log(error)
      }

      this.loading = false
    },
    async addLead() {
      // utm_source: 'mn_tri',
      // utm_medium: 'social',
      // utm_campaign: 'vedic-maths',
      const data = {
        query: {},
        directEnroll: false,
        country: {
          name: 'India',
          dialCode: '+91',
        },
        createdAt: new Date(),
        parentsEmail: 'mukulgupta25@yahoo.co.in',
        kidsAge: '13',
        parentsPhone: '9412607663',
        otherContacts: [
          {
            label: "Amishi's Phone",
            phoneNo: '8958574161',
            country: {
              name: 'India',
              dialCode: '+91',
            },
          },
        ],
        logCount: 0,
        parentsName: 'Mukul Gupta',
        kidsName: 'Amishi Gupta',
        status: 'fresh',
        page: 'register',
      }

      if (data) {
        console.log(data)
        // return
      }

      await this.addSiblingToDemos(data)
    },
    async showMessageDialog() {
      const { reminderMessage: message } = await import(
        '~/assets/free2code-message.js'
      )
      this.form.message = message
      this.form.subject = this.subject
      this.dialog = true

      await this.getAllUsers()
    },
    async showEmailFilterDialog() {
      const { summerCamp } = await import('~/assets/message.js')
      this.form.message = summerCamp
      this.form.subject = `Summer camp for curious kids by JrInLab`
      this.filterDialog = true
    },
    async testMyData() {
      const { data: snapshot } = await import('~/assets/message.js') // import('~/assets/demos-response.json')

      const dbData = []
      snapshot.forEach((doc) => {
        const data = { ...doc }
        data.createdAt = 'modify_date' // data.createdAt.toDate()
        data.updatedAt = 'modify_date' // data.updatedAt.toDate()
        if (data.schedules) {
          for (const schedule in data.schedules) {
            data.schedules[schedule] = 'modify_date' // data.schedules[schedule].toDate()
          }
        }

        if (data.logs) {
          for (const logId in data.logs) {
            // console.log(`logId: ${logId}`)
            const log = data.logs[logId]
            if (log.createdAt) {
              log.createdAt = 'modify_date' // log.createdAt.toDate()
            }

            if (log.updatedAt) {
              log.updatedAt = 'modify_date' // log.updatedAt.toDate()
            }
          }
        }

        delete data.searchable

        dbData.push(data)
      })

      console.log('dbData: ', dbData)
    },
  },
}
</script>
