<template>
  <v-card color="grey darken-3">
    <v-card-title class="justify-center">
      Customer Info
      <v-chip
        v-if="request.directEnroll"
        color="primary"
        label
        small
        class="ml-4"
      >
        Direct Enroll
      </v-chip>
      <v-spacer />
      <v-btn icon @click.stop="editCustomerData">
        <v-icon> $mdiPencil </v-icon>
      </v-btn>
    </v-card-title>
    <v-divider />
    <v-card-text class="px-0">
      <v-list-item class="mb-2">
        <v-list-item-avatar size="56">
          <v-img
            :src="require('~/assets/images/profile_pic.svg')"
            alt="Profile pic"
          />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="title">
            {{ request.parentsName }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ request.kidsName }}, {{ request.kidsAge }}
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-btn class="primary" icon @click="dialog = true">
            <v-icon> $mdiSend </v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>

      <utm-info :page="request.page" :query="request.query" class="px-4" />
      <InfoChips
        v-if="request.systemTime"
        :chips="[request.systemTime.zone, request.systemTime.offset]"
        class="px-4"
        color="info"
        label="Timezone & Offset"
        label-icon="$mdiClock"
      />

      <InfoChips
        v-if="request.languages"
        :chips="request.languages"
        class="px-4"
        color="secondary"
        label="Speaks"
        label-icon="$mdiWeb"
      />

      <InfoChips
        v-if="request.discounts"
        :chips="request.discounts"
        class="px-4"
        color="secondary"
        label="Discounts"
        label-icon="$mdiSale"
      />

      <v-divider class="mt-3 mb-2" />

      <v-list-item :href="`tel:${getPhoneNo}`">
        <v-list-item-avatar color="primary" tile>
          <v-icon size="28"> $mdiPhone </v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-subtitle v-text="`Parent's Mobile`" />
          <v-list-item-title>
            {{ getPhoneNo }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <template v-if="request.otherContacts">
        <v-list-item
          v-for="(contact, index) in request.otherContacts"
          :key="`other_contact_${index}`"
          :href="`tel:${contact.country.dialCode}-${contact.phoneNo}`"
        >
          <v-list-item-action />
          <v-list-item-content>
            <v-list-item-subtitle v-text="contact.label" />
            <v-list-item-title>
              {{ contact.country.dialCode + '-' + contact.phoneNo }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>

      <EmailListItem
        :email-address="request.parentsEmail"
        email-label="Parent's Email"
        show-avatar
      />

      <template v-if="request.otherEmails">
        <EmailListItem
          v-for="(contact, index) in request.otherEmails"
          :key="`other_email_${index}`"
          :email-address="contact.address"
          :email-label="contact.label"
        />
      </template>

      <v-list-item v-if="request.address">
        <v-list-item-avatar color="primary" tile>
          <v-icon size="28"> $mdiMapMarker </v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-subtitle v-text="'Address'" />
          <v-list-item-title>
            {{ customerAddress }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <template v-if="request.metaInfo || request.tags">
        <v-divider class="my-2" />

        <v-list-item>
          <v-list-item-content>
            <v-list-item-subtitle v-text="'Other relevant info'" />

            <v-chip-group v-if="request.tags" column>
              <v-chip
                v-for="tag in request.tags"
                :key="tag"
                class="font-weight-bold"
                color="secondary"
                label
                outlined
                small
              >
                {{ tag }}
              </v-chip>
            </v-chip-group>

            <v-list-item-title
              v-if="request.metaInfo"
              style="white-space: normal"
            >
              {{ request.metaInfo }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-card-text>
    <v-dialog v-model="dialog" max-width="600px" persistent>
      <v-card>
        <v-card-title> Contact user </v-card-title>

        <v-form ref="form" lazy-validation @submit.prevent="contactUser">
          <v-card-text class="pt-4">
            <v-row>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="selectedMedium"
                  :items="mediumOptions"
                  :rules="[requiredRules('Reach out medium')]"
                  label="Reach out medium"
                  outlined
                  return-object
                >
                  <template #item="{ item }">
                    <v-icon left>{{ item.icon }}</v-icon> {{ item.text }}
                  </template>
                  <template #selection="{ item }">
                    <v-chip close @click:close="selectedMedium = null">
                      <v-icon left>{{ item.icon }}</v-icon> {{ item.text }}
                    </v-chip>
                  </template>
                </v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="selectedTemplate"
                  :disabled="!selectedMedium"
                  :items="templates"
                  :rules="[requiredRules('Message template')]"
                  label="Message template"
                  outlined
                >
                  <template #selection="{ item }">
                    <v-chip close @click:close="selectedTemplate = null">
                      {{ item.text }}
                    </v-chip>
                  </template>
                </v-select>
              </v-col>
            </v-row>
            <template
              v-if="selectedMedium && selectedMedium.value === 'whatsapp'"
            >
              <template v-if="userContacts.length > 1">
                <v-select
                  v-model="form.number"
                  :items="userContacts"
                  :rules="[requiredRules('Number')]"
                  label="To"
                  item-value="number"
                  outlined
                >
                  <template #item="{ item }">
                    {{ item.label }} &lt;{{ item.number }}&gt;
                  </template>
                  <template #selection="{ item }">
                    {{ item.label }} &lt;{{ item.number }}&gt;
                  </template>
                </v-select>
              </template>
              <template v-else>
                <v-text-field
                  :value="`${userContacts[0].label} <${userContacts[0].number}>`"
                  disabled
                  label="To"
                  outlined
                  readonly
                />
              </template>
            </template>
            <template v-if="selectedMedium && selectedMedium.value === 'email'">
              <template v-if="userEmails.length > 1">
                <v-select
                  v-model="form.emails"
                  :items="userEmails"
                  :rules="[requiredRules('Email')]"
                  label="To"
                  item-value="address"
                  outlined
                >
                  <template #item="{ item }">
                    {{ item.label }} &lt;{{ item.address }}&gt;
                  </template>
                  <template #selection="{ item }">
                    {{ item.label }} &lt;{{ item.address }}&gt;
                  </template>
                </v-select>
              </template>
              <template v-else>
                <v-text-field
                  :value="`${userEmails[0].label} <${userEmails[0].address}>`"
                  disabled
                  label="To"
                  outlined
                  readonly
                />
              </template>
            </template>
            <v-text-field
              v-if="selectedMedium && selectedMedium.value === 'email'"
              v-model="form.subject"
              :rules="[requiredRules('Subject')]"
              label="Subject"
              outlined
              validate-on-blur
            />
            <v-textarea
              v-if="selectedTemplate"
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
            <v-spacer />
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
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  props: {
    request: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      selectedMedium: null,
      mediumOptions: [
        { text: 'Email', value: 'email', icon: '$mdiEmail' },
        { text: 'WhatsApp', value: 'whatsapp', icon: '$mdiWhatsapp' },
      ],
      selectedTemplate: null,
      templates: [
        {
          text: 'Class Schedule',
          value: 'classlink',
          disabled: this.disableClassLinkTemplate(),
        },
        {
          text: 'Empty',
          value: 'empty',
        },
      ],
      dialog: false,
      form: {
        number: null,
        emails: null,
        subject: null,
        message: null,
        alert: {
          show: false,
          error: null,
        },
      },
      loading: false,
      requiredRules: (type) => {
        return (v) => !!v || `${type} can't be empty.`
      },
    }
  },
  computed: {
    ...mapGetters('user', ['user']),
    getPhoneNo() {
      let completePhone = ''
      if (this.request.country) {
        completePhone += this.request.country.dialCode + '-'
      }

      completePhone += this.request.parentsPhone

      return completePhone
    },
    userContacts() {
      const contacts = [{ label: `Parent's Phone`, number: this.getPhoneNo }]
      if (this.request.otherContacts) {
        for (const contact of this.request.otherContacts) {
          contacts.push({
            label: contact.label,
            number: `${contact.country.dialCode}-${contact.phoneNo}`,
          })
        }
      }

      return contacts
    },
    userEmails() {
      const emails = [
        { label: `Parent's Email`, address: this.request.parentsEmail },
      ]

      if (this.request.otherEmails) {
        const allEmails = {
          label: 'All Email Ids',
          address: [this.request.parentsEmail],
        }

        for (const email of this.request.otherEmails) {
          emails.push(email)
          allEmails.address.push(email.address)
        }

        emails.push(allEmails)
      }

      return emails
    },
    customerAddress() {
      let finalAddress = ''
      const address = this.request.address

      if (address) {
        finalAddress += address.addressLine ? `${address.addressLine}, ` : ''
        finalAddress += address.city ? `${address.city}, ` : ''
        finalAddress += address.state ? `${address.state}, ` : ''
        finalAddress += address.pinCode ? `${address.pinCode}, ` : ''
        finalAddress += address.country || ''

        if (
          finalAddress &&
          finalAddress[finalAddress.length - 1] === ' ' &&
          finalAddress[finalAddress.length - 2] === ','
        ) {
          finalAddress = finalAddress.substr(0, finalAddress.length - 2)
        }
      }

      return finalAddress
    },
  },
  watch: {
    selectedMedium(newVal) {
      console.log(`selectedMedium: newVal:: `, newVal)
      if (!newVal) {
        this.$refs.form.reset()
      } else if (
        newVal.value === 'whatsapp' &&
        this.userContacts.length === 1
      ) {
        this.form.number = this.userContacts[0].number
      } else if (newVal.value === 'email' && this.userEmails.length === 1) {
        this.form.emails = this.userEmails[0].address
      }
    },
    selectedTemplate(newVal) {
      if (newVal) {
        const message = this.getMessageText(newVal)
        this.form.message = message.text
        this.form.alert.error = message.error
      } else {
        this.form.message = null
        this.form.alert.error = null
      }
    },
  },
  methods: {
    ...mapActions('admin', ['sendEmailToCustomer']),
    disableClassLinkTemplate() {
      let disabled = false
      const dateTime = this.getDemoDateTime()
      if (
        this.request.status !== 'scheduled' ||
        !dateTime ||
        !this.request.classLink
      ) {
        disabled = true
      }

      return disabled
    },
    async contactUser() {
      if (this.$refs.form.validate()) {
        this.form.alert.show = false
        if (this.form.alert.error) {
          this.form.alert.show = true
          return
        }

        console.log('form data:: ', this.form)

        if (this.selectedMedium.value === 'whatsapp') {
          const msg = this.form.message.replace(/\n/g, '%0D%0A')
          window.open(
            `https://api.whatsapp.com/send?phone=${this.form.number}&text=${msg}`,
            '_blank'
          )
          this.cancelUserContact()
        } else if (this.selectedMedium.value === 'email') {
          this.loading = true
          try {
            const response = await this.sendEmailToCustomer({
              to: this.form.emails,
              subject: this.form.subject,
              message: this.form.message,
            })

            if (response.data && response.data.id) {
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
      }
    },
    cancelUserContact() {
      this.dialog = false
      this.$refs.form.reset()
    },
    getFirstName(name) {
      const nameParts = name.split(' ')
      let firstName = nameParts[0].toLowerCase()
      if (
        firstName.includes('mr') ||
        firstName.includes('dr') ||
        firstName.includes('ms') ||
        firstName.includes('mrs') ||
        firstName.length <= 3
      ) {
        firstName = `${nameParts[0]}${nameParts[1] ? ` ${nameParts[1]}` : ''}`
      } else {
        firstName = nameParts[0]
      }

      return firstName
    },
    getMessageText(type) {
      const message = {
        text: `Dear ${this.getFirstName(this.request.parentsName)},\n\n`,
      }

      if (type === 'classlink') {
        if (this.request.status !== 'scheduled') {
          message.error = `The entry is not in scheduled state`
        }

        const dateTime = this.getDemoDateTime()

        if (!dateTime || !this.request.classLink) {
          message.error = 'Either no scheduled time, or no class link present'
        } else {
          message.text +=
            `JrInLab's coding demo class for ${this.getFirstName(
              this.request.kidsName
            )}` +
            ` is scheduled for ${dateTime.date},  ${dateTime.time}.` +
            ` Please join the below link from a laptop.\n\n`
          message.text += `Class joining link: ${this.request.classLink}\n\n`
          message.text +=
            `We had sent an email also with this joining link (Please check your ` +
            `promotions / spam folders if you don't find it in your primary inbox)\n\n` +
            ` In case of any issue, please do get back to me.\n\n`
        }
      }

      const name = this.user.displayName
        ? this.user.displayName.split(' ')[0]
        : ''
      message.text += `Thanks,\n${name}, Team JrInLab`

      return message
    },
    getDemoDateTime() {
      if (this.request.schedules && this.request.schedules.scheduled) {
        const scheduledDateTime = this.request.schedules.scheduled.toDate()
        const formatter = new Intl.DateTimeFormat('en', {
          month: 'short',
          day: '2-digit',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          timeZone: this.request.schedules.timeZone || 'Asia/Kolkata',
          timeZoneName: 'long',
        })

        const formattedDateParts = formatter
          .format(scheduledDateTime)
          .split(', ')

        const timeParts = formattedDateParts[2].split(' ')
        const timePart = `${timeParts[0]} ${timeParts[1]}`
        const timeZonePart = timeParts.slice(2).join(' ')

        let date
        const today = new Date()
        if (
          today.getDate() === scheduledDateTime.getDate() &&
          today.getMonth() === scheduledDateTime.getMonth() &&
          today.getFullYear() === scheduledDateTime.getFullYear()
        ) {
          date = 'today'
        } else {
          date = `${formattedDateParts[0]}, ${formattedDateParts[1]}`
        }

        return { date, time: `${timePart} (${timeZonePart})` }
      }
    },
    editCustomerData() {
      this.$router.push(`/admin/demo-requests/${this.request.id}/edit`)
    },
  },
}
</script>

<style>
.whatsapp {
  background-color: #46ca5e !important;
}
</style>
