<template>
  <v-card class="details-card">
    <v-card-title>
      <v-btn icon @click="backBtnClicked">
        <v-icon> $mdiArrowLeft </v-icon>
      </v-btn>
      <span class="mx-4">Request Details</span>
      <v-chip
        v-if="schoolRequest"
        :color="
          states[schoolRequest.status]
            ? states[schoolRequest.status].color
            : 'grey'
        "
      >
        {{ schoolRequest.status.toUpperCase() }}
      </v-chip>
    </v-card-title>
    <v-divider />
    <v-progress-linear v-if="loading" indeterminate height="3" />
    <template v-else>
      <v-card-text v-if="!schoolRequest">
        Request details not found
      </v-card-text>
      <v-card-text v-else>
        <v-row>
          <v-col
            v-show="!($vuetify.breakpoint.name === 'xs' && showForm)"
            cols="12"
            sm="5"
            lg="4"
            order-sm="last"
          >
            <school-request-info :request="schoolRequest" />
          </v-col>
          <v-col cols="12" sm="7" lg="8">
            <v-scale-transition>
              <div
                v-if="
                  schoolRequestLogs && schoolRequestLogs.length && !showForm
                "
              >
                <v-row no-gutters justify="center">
                  <v-btn color="primary" @click="showForm = true">
                    <v-icon left> $mdiPlus </v-icon>
                    Log Interaction
                  </v-btn>
                </v-row>
                <school-interaction-log-tree
                  :logs="schoolRequestLogs"
                  :states="states"
                  class="mt-4"
                />
              </div>
            </v-scale-transition>

            <v-scale-transition>
              <div
                v-if="
                  (!schoolRequestLogs || !schoolRequestLogs.length) && !showForm
                "
                class="text-center"
              >
                <h3 class="title">No interaction activity</h3>
                <v-btn color="primary" class="mt-4" @click="showForm = true">
                  <v-icon left> $mdiPlus </v-icon>
                  Log Interaction
                </v-btn>
              </div>
            </v-scale-transition>

            <v-scale-transition>
              <school-interaction-form
                v-if="showForm"
                :request="schoolRequest"
                :states="states"
                @close-form="showForm = false"
              />
            </v-scale-transition>
          </v-col>
        </v-row>
      </v-card-text>
    </template>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data() {
    return {
      loading: false,
      showForm: false,
    }
  },
  computed: {
    ...mapGetters('admin', {
      schoolRequest: 'currSchoolReqData',
      schoolRequestLogs: 'currSchoolReqLogs',
      globalConfig: 'globalConfig',
    }),
    states() {
      const states = {}
      if (this.globalConfig) {
        for (const state of this.globalConfig.states) {
          states[state.value] = { ...state }
        }
      }

      return states
    },
  },
  mounted() {
    this.getRequestDetails()
  },
  destroyed() {
    this.unobserveSchoolRequest()
  },
  methods: {
    ...mapActions('admin', ['observeSchoolRequest', 'unobserveSchoolRequest']),
    async getRequestDetails() {
      this.loading = true
      await this.observeSchoolRequest({ id: this.$route.params.id })
      this.loading = false
    },
    backBtnClicked() {
      if (this.showForm) {
        this.showForm = false
        return
      }

      if (window.history.length > 1) {
        this.$router.go(-1)
      } else {
        this.$router.push('/admin/school-requests')
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.details-card {
  margin: 24px;
}

@media only screen and (max-width: 599px) {
  .details-card {
    margin: 0;
  }
}
</style>
