<template>
  <v-card class="ma-4">
    <v-tabs v-model="currTab" color="primary">
      <v-tab>Individual Requests</v-tab>
      <v-tab>School Requests</v-tab>

      <v-tab-item>
        <v-progress-linear v-if="loading" indeterminate height="3" />
        <v-card-text
          v-else-if="partnerRequests && partnerRequests.length"
          class="card-text"
        >
          <v-row>
            <v-col
              v-for="(request, index) in partnerRequests"
              :key="request.id"
              cols="12"
              sm="6"
            >
              <partner-request-item :request="request" :index="index + 1" />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-text v-else class="text-center">
          <img class="mt-12" src="~/assets/images/not_found.svg" width="320" />
          <div class="mt-8 mb-12 headline">
            No requests found. Please check back later.
          </div>
        </v-card-text>
      </v-tab-item>
      <v-tab-item>
        <v-progress-linear v-if="schoolReqsLoading" indeterminate height="3" />
        <v-card-text
          v-else-if="partnerSchoolRequests && partnerSchoolRequests.length"
          class="card-text"
        >
          <v-row>
            <v-col
              v-for="(request, index) in partnerSchoolRequests"
              :key="request.id"
              cols="12"
              sm="6"
            >
              <partner-school-request-item
                :request="request"
                :index="index + 1"
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-text v-else class="text-center">
          <img class="mt-12" src="~/assets/images/not_found.svg" width="320" />
          <div class="mt-8 mb-12 headline">
            No requests found. Please check back later.
          </div>
        </v-card-text>
      </v-tab-item>
    </v-tabs>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data() {
    return {
      currTab: null,
      loading: false,
      schoolReqsLoading: false,
    }
  },
  computed: {
    ...mapGetters('user', ['isPartner']),
    ...mapGetters('admin', ['partnerRequests', 'partnerSchoolRequests']),
  },
  watch: {
    currTab(newVal) {
      console.log(`currTab newVal: ${newVal}`)
      if (newVal === 0) {
        this.fetchRequests()
      } else {
        this.fetchSchoolRequests()
      }
    },
  },
  // async beforeMount() {
  //   if (this.isPartner) {
  //     await this.fetchRequests()
  //   }
  // },
  methods: {
    ...mapActions('admin', ['getPartnerRequests', 'getPartnerSchoolRequests']),
    async fetchRequests() {
      this.loading = true
      await this.getPartnerRequests()
      console.log('partner requests:: ', this.partnerRequests)

      this.loading = false
    },
    async fetchSchoolRequests() {
      this.schoolReqsLoading = true
      await this.getPartnerSchoolRequests()
      console.log('partner requests:: ', this.schoolRequests)

      this.schoolReqsLoading = false
    },
  },
}
</script>

<style>
.card-text {
  font-size: 1rem;
}
</style>
