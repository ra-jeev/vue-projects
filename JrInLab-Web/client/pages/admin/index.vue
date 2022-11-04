<template>
  <v-card class="ma-4">
    <v-card-title> Dashboard </v-card-title>
    <v-divider />
    <v-progress-linear v-if="loading" indeterminate height="3" />
    <v-card-text v-else-if="requests" class="card-text">
      <div class="title">"{{ activeWorkshop.title }}" Registrations</div>
      <v-row class="mt-4">
        <v-col v-for="(slot, key) in requests" :key="key" cols="12" sm="4">
          <v-card class="pa-4" color="primary lighten-3">
            <v-card-title class="justify-center">
              <v-chip>
                {{ slot.schedule }}: {{ slot.registrations.length }} Requests
              </v-chip>
            </v-card-title>

            <request-item
              v-for="(request, index) in slot.registrations"
              :key="request.id"
              :request="request"
              :class="{ 'mt-2': index }"
              type="camp"
            />

            <!-- <template v-for="request in camp1Requests">
              <div :key="request.id">
                {{
                  `{ "name": "${request.parentsName}", "email": "${request.parentsEmail}", "kid": "${request.kidsName}" },`
                }}
              </div>
            </template> -->
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-text v-else>
      No active workshop found. Please check the database.
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data() {
    return {
      loading: false,
      requests: null,
    }
  },
  computed: {
    ...mapGetters('admin', ['activeWorkshop', 'campRequests']),
  },
  async created() {
    await this.getActiveWorkshop()
    if (this.activeWorkshop) {
      this.fetchRequests()
    }
  },
  methods: {
    ...mapActions('admin', ['getActiveWorkshop', 'getCampRequests']),
    async fetchRequests() {
      this.loading = true
      await this.getCampRequests(this.activeWorkshop.title)
      console.log('camp requests:: ', this.campRequests)
      if (this.campRequests) {
        const requests = {}
        for (const date of this.activeWorkshop.schedules.dates) {
          for (const slot of date.slots) {
            requests[slot.name] = {
              schedule: `${date.date}, ${slot.time}`,
              registrations: [],
            }
          }
        }

        for (const campRequest of this.campRequests) {
          if (requests[campRequest.timeSlot]) {
            requests[campRequest.timeSlot].registrations.push(campRequest)
          }
        }

        this.requests = requests

        console.log('sorted requests: ', this.requests)
      }

      this.loading = false
    },
  },
}
</script>

<style>
.card-text {
  font-size: 1rem;
}
</style>
