<template>
  <v-form ref="form" lazy-validation @submit.prevent="onFormSubmit">
    <v-card outlined>
      <v-card-title> Add Interaction Log </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12"> Interaction Details: </v-col>
          <v-col cols="12" sm="4">
            <v-select
              :items="allowedStatuses"
              :loading="loading"
              :rules="statusRules"
              item-text="name"
              label="Select new status"
              outlined
              required
              @change="onStatusChange"
            />
          </v-col>
          <v-col cols="12" sm="8">
            <v-text-field
              v-model="form.summary"
              :counter="maxSummaryLen"
              :rules="summaryRules"
              label="Log summary *"
              outlined
              required
              validate-on-blur
            />
          </v-col>
        </v-row>
        <v-textarea
          v-model="form.description"
          :rules="descriptionRules"
          label="Log description *"
          rows="3"
          outlined
          required
          validate-on-blur
        />

        <v-divider class="mb-3" />

        <v-row v-if="showDateAndTime">
          <v-col cols="12"> Schedule Details: </v-col>
          <v-col cols="12" sm="6">
            <v-autocomplete
              v-model="form.timeZone"
              :items="timeZones"
              :rules="timeZoneRules"
              label="Time zone"
              outlined
              placeholder="Start typing to Search"
              return-object
            >
              <template #selection="{ item }">
                <v-chip
                  close
                  color="primary"
                  small
                  @click:close="form.timeZone = null"
                >
                  {{ item.title }}
                </v-chip>
              </template>
              <template #item="{ item }">
                <v-list-item-content>
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                  <v-list-item-subtitle>{{
                    item.subtitle
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </template>
            </v-autocomplete>
          </v-col>
          <v-col class="hidden-xs-only" sm="6" />
          <v-col cols="12" sm="6">
            <v-dialog v-model="datePicker" overlay-opacity="0.75" width="290px">
              <template #activator="{ on, attrs }">
                <v-text-field
                  ref="date"
                  v-model="formattedDate"
                  :disabled="!form.timeZone"
                  :hint="
                    !form.timeZone
                      ? 'Pick a timezone before selecting a date'
                      : ''
                  "
                  :persistent-hint="!form.timeZone"
                  :rules="dateRules"
                  append-icon="$mdiCalendar"
                  label="Scheduled date (DD/MM/YYYY)"
                  outlined
                  readonly
                  v-bind="attrs"
                  v-on="on"
                />
              </template>
              <v-date-picker
                v-model="form.date"
                :min="minDate"
                :max="maxDate"
                elevation="12"
                no-title
                @input="datePicker = false"
              />
            </v-dialog>
          </v-col>
          <v-col cols="12" sm="6">
            <v-dialog
              v-model="timePicker"
              overlay-opacity="0.75"
              persistent
              width="290px"
            >
              <template #activator="{ on, attrs }">
                <v-text-field
                  ref="time"
                  v-model="formattedTime.value"
                  :disabled="!form.date"
                  :error-messages="formattedTime.errors"
                  :hint="
                    !form.date ? 'Pick a date before selecting a time' : ''
                  "
                  :persistent-hint="!form.date"
                  :rules="timeRules"
                  append-icon="$mdiClock"
                  label="Scheduled time"
                  outlined
                  readonly
                  v-bind="attrs"
                  v-on="on"
                />
              </template>
              <v-time-picker
                v-model="form.time"
                :allowed-minutes="allowedMinutes"
                class="mt-2"
                color="primary"
                full-width
              >
                <v-spacer />
                <v-btn text color="primary" @click="timePicker = false">
                  Cancel
                </v-btn>
                <v-btn text color="primary" @click="timePicker = false">
                  OK
                </v-btn>
              </v-time-picker>
            </v-dialog>
          </v-col>
        </v-row>
        <v-divider v-if="showDateAndTime" class="mb-3" />

        <v-alert v-model="alert.show" :type="alert.type" prominent dismissible>
          {{
            alert.type === 'success'
              ? alert.message.success
              : alert.message.failure
          }}
        </v-alert>
      </v-card-text>
      <v-card-actions class="justify-end pt-0 pb-4 px-4">
        <v-btn large text color="primary" @click="$emit('close-form')">
          Cancel
        </v-btn>
        <v-btn
          :disabled="loading"
          :loading="loading"
          large
          type="submit"
          color="primary"
        >
          <v-icon left> $mdiCloudUpload </v-icon>
          Log Entry
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-dialog v-model="dialog.show" persistent max-width="90%" width="600">
      <v-card>
        <v-card-title class="headline">Confirm Log Submission</v-card-title>
        <v-card-text style="white-space: pre-line" v-text="dialog.text" />
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" text @click="dialog.show = false">
            Cancel
          </v-btn>
          <v-btn color="primary" @click="logInteraction"> Confirm </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-form>
</template>

<script>
import { getTimeZones } from '@vvo/tzdb'
import { mapGetters, mapActions } from 'vuex'

export default {
  props: {
    request: {
      type: Object,
      required: true,
    },
    states: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      dialog: { show: false, text: null },
      alert: {
        show: false,
        type: 'success',
        message: {
          success: `Log entry successfully saved.`,
          failure: `Oops! Failed to log your entry, please try again later.`,
        },
      },
      form: {
        summary: null,
        description: null,
        status: null,
        date: null,
        time: null,
        timeZone: null,
        tags: null,
      },
      datePicker: false,
      timePicker: false,
      maxSummaryLen: 84,
      validStates: ['scheduled', 'warm', 'future'],
      summaryRules: [
        (v) => !!v || `Please add a short summary`,
        (v) =>
          (!!v && v.length <= this.maxSummaryLen) ||
          `Summary can't be more than ${this.maxSummaryLen} characters long`,
      ],
      descriptionRules: [(v) => !!v || `Please describe the entry in detail`],
      statusRules: [(v) => !!v || `Please select the entry's new status`],
      timeZoneRules: [(v) => !!v || 'Please select a time zone'],
      dateRules: [
        (v) => {
          return this.validStates.includes(this.form.status)
            ? !!v || 'Please enter the scheduled date'
            : true
        },
      ],
      timeRules: [
        (v) => {
          return this.validStates.includes(this.form.status)
            ? !!v || 'Please enter the scheduled time'
            : true
        },
      ],
      timeZones: [],
      dateTimeFormat: null,
    }
  },
  computed: {
    ...mapGetters('admin', ['globalConfig']),
    status() {
      return this.request.status
    },
    showDateAndTime() {
      if (!this.form.status) {
        return null
      }

      return (
        this.validStates.includes(this.form.status) ||
        this.form.status === 'enrolled'
      )
    },
    formattedDate() {
      if (!this.form.date) {
        return null
      }

      const [year, month, day] = this.form.date.split('-')
      return `${day}/${month}/${year}`
    },
    formattedTime() {
      if (!this.form.date || !this.form.time || !this.form.timeZone) {
        return { value: null, errors: [] }
      }

      const [hours, mins] = this.form.time.split(':')
      const nHours = parseInt(hours)
      const nMins = parseInt(mins)

      let formattedTime = `${this.formatTime(nHours, nMins)} ${
        this.form.timeZone.abbreviation
      }`

      const timeErrors = []
      const dateString = `${this.form.date}T${this.form.time}${
        this.form.timeZone.title.split(' ')[0]
      }`
      const dateIST = new Date(dateString)

      console.log(`dateString: ${dateString}, dateIST: `, dateIST)

      if (dateIST.getTime() < Date.now()) {
        timeErrors.push('Invalid time in the past, please recheck the schedule')
      }

      if (this.form.timeZone.abbreviation !== 'IST') {
        formattedTime += ` <-> ${this.dateTimeInIST(dateIST)}`
      }

      return { value: formattedTime, valueIST: dateIST, errors: timeErrors }
    },
    minDate() {
      if (this.form.timeZone) {
        const zoneOffset = this.form.timeZone.currentTimeOffsetInMinutes
        const dateTime = Date.now() + zoneOffset * 60 * 1000
        return new Date(dateTime).toISOString()
      }

      return new Date().toISOString()
    },
    maxDate() {
      const oneWeekInMillis = 7 * 86400 * 1000 // 86400s per day * 7 days * 1000 ms
      let duration = 2 * oneWeekInMillis

      if (this.form.status === 'warm') {
        duration = 4 * oneWeekInMillis
      } else if (['enrolled', 'future'].includes(this.form.status)) {
        duration = 52 * oneWeekInMillis
      }

      return new Date(Date.now() + duration).toISOString()
    },
    allowedStatuses() {
      const statuses = []
      switch (this.status) {
        case 'fresh':
        case 'retry':
        case 'future':
          statuses.push(
            this.states.retry,
            this.states.closed,
            this.states.scheduled,
            this.states.warm,
            this.states.future,
            this.states.cold
          )
          break
        case 'scheduled':
          statuses.push(
            this.states.reschedule,
            this.states.scheduled,
            this.states.feedback,
            this.states.warm,
            this.states.future,
            this.states.cold
          )
          break
        case 'cold':
          statuses.push(
            this.states.retry,
            this.states.warm,
            this.states.future,
            this.states.cold
          )
          break
        case 'closed':
          statuses.push(
            this.states.closed,
            this.states.enrolled,
            this.states.warm,
            this.states.future,
            this.states.cold
          )
          break
        case 'feedback':
          statuses.push(
            this.states.feedback,
            this.states.closed,
            this.states.warm,
            this.states.future,
            this.states.cold
          )
          break
        case 'warm':
          statuses.push(
            this.states.retry,
            this.states.closed,
            this.states.warm,
            this.states.future,
            this.states.cold
          )
          break
        case 'reschedule':
          statuses.push(
            this.states.reschedule,
            this.states.scheduled,
            this.states.warm,
            this.states.future,
            this.states.cold
          )
          break
        case 'enrolled':
          statuses.push(this.states.scheduled, this.states.enrolled)
          break
      }

      return statuses
    },
  },
  watch: {
    'form.timeZone'() {
      this.form.date = null
      this.form.time = null
      if (this.$refs.date) {
        this.$refs.date.resetValidation()
        this.$refs.time.resetValidation()
      }
    },
    'form.status'(value) {
      if (['warm', 'future'].includes(value)) {
        if (!this.form.timeZone || this.form.timeZone.countryName !== 'India') {
          const indiaZone = this.timeZones.find(
            (zone) => zone.countryName === 'India'
          )

          console.log('found India Zone: ', indiaZone)
          this.form.timeZone = indiaZone
        }
      } else if (value === 'scheduled') {
        if (
          !this.form.timeZone ||
          this.form.timeZone.countryName !== this.request.country.name
        ) {
          const localZone = this.timeZones.find(
            (zone) => zone.countryName === this.request.country.name
          )

          console.log('found local Zone: ', localZone)

          this.form.timeZone = localZone
        }
      }
    },
  },
  mounted() {
    const timeZones = getTimeZones()

    timeZones.forEach((timeZone) => {
      const parts = timeZone.currentTimeFormat.split(' - ')
      const formedTimeZone = {
        ...timeZone,
        text: `${timeZone.currentTimeFormat} ${timeZone.abbreviation} ${timeZone.countryName}`,
        title: `${parts[0]} (${timeZone.abbreviation})`,
        subtitle: `[${timeZone.countryName}] ${parts[1]}`,
      }

      this.timeZones.push(formedTimeZone)

      if (timeZone.countryName === this.request.country.name) {
        this.form.timeZone = formedTimeZone
      }
    })

    if (this.request.tags) {
      this.form.tags = [...this.request.tags]
    }
  },
  methods: {
    ...mapActions('admin', ['logSchoolInteraction']),
    formatTime(hours, mins) {
      const ampm = hours >= 12 ? 'PM' : 'AM'
      const finalHour = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours

      return `${finalHour < 10 ? `0${finalHour}` : finalHour}:${
        mins < 10 ? `0${mins}` : mins
      } ${ampm}`
    },
    dateTimeInIST(date) {
      if (!this.dateTimeFormat) {
        this.dateTimeFormat = new Intl.DateTimeFormat('en-IN', {
          month: 'numeric',
          day: 'numeric',
          year: '2-digit',
          hour: 'numeric',
          minute: 'numeric',
          timeZone: 'Asia/Kolkata',
          timeZoneName: 'short',
        })
      }

      return this.dateTimeFormat.format(date)
    },
    allowedMinutes(minutes) {
      return minutes % 15 === 0
    },
    onFormSubmit() {
      this.alert.show = false
      this.dialog.text = null

      if (this.$refs.form.validate() && !this.formattedTime.errors.length) {
        let dialogText = `Status:: ${this.status} -> ${this.form.status}`
        dialogText += `\n\nSummary:: ${this.form.summary}`
        dialogText += `\nDescription:: ${this.form.description}`
        if (this.form.date && this.form.time && this.form.timeZone) {
          dialogText += `\nTime:: ${this.formattedDate}, ${this.formattedTime.value}`
        }

        this.dialog.text = dialogText
        this.dialog.show = true
      }
    },
    async logInteraction() {
      this.dialog.show = false
      this.loading = true

      const log = {
        status: {
          old: this.status,
          new: this.form.status,
        },
        summary: this.form.summary,
        description: this.form.description,
      }

      if (this.form.date && this.form.time) {
        log.schedule = this.formattedTime.valueIST
        log.timeZone = this.form.timeZone.name
      }

      try {
        await this.logSchoolInteraction({ log })
        this.form.status = null
        this.form.summary = null
        this.form.description = null
        this.alert.type = 'success'

        setTimeout(() => {
          this.$emit('close-form')
        }, 1000)
      } catch (error) {
        this.alert.type = 'error'
        console.log(error)
      }

      this.loading = false
      this.alert.show = true
    },
    onStatusChange(value) {
      this.form.status = value
    },
  },
}
</script>
