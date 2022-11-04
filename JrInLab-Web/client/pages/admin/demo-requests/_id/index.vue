<template>
  <v-card class="details-card">
    <v-card-title>
      <v-btn icon @click="backBtnClicked">
        <v-icon> $mdiArrowLeft </v-icon>
      </v-btn>
      <span class="mx-4">Request Details</span>
      <v-chip
        v-if="demoRequest"
        :color="
          states[demoRequest.status] ? states[demoRequest.status].color : 'grey'
        "
      >
        {{ demoRequest.status.toUpperCase() }}
      </v-chip>
      <v-spacer />
      <v-btn
        v-if="demoRequest && isSuperAdmin"
        color="primary"
        small
        @click="siblingDialog = true"
      >
        Add Sibling
      </v-btn>
    </v-card-title>
    <v-divider />
    <v-progress-linear v-if="loading" indeterminate height="3" />
    <template v-else>
      <v-card-text v-if="!demoRequest"> Request details not found </v-card-text>
      <v-card-text v-else>
        <v-row>
          <v-col
            v-show="!($vuetify.breakpoint.name === 'xs' && showForm)"
            cols="12"
            sm="5"
            lg="4"
            order-sm="last"
          >
            <CustomerInfo :request="demoRequest" />
          </v-col>
          <v-col cols="12" sm="7" lg="8">
            <v-scale-transition>
              <div
                v-if="demoRequestLogs && demoRequestLogs.length && !showForm"
              >
                <v-row no-gutters justify="center">
                  <v-btn color="primary" @click="showForm = true">
                    <v-icon left> $mdiPlus </v-icon>
                    Log Interaction
                  </v-btn>
                </v-row>
                <InteractionLogTree
                  :logs="demoRequestLogs"
                  :states="states"
                  class="mt-4"
                />
              </div>
            </v-scale-transition>

            <v-scale-transition>
              <div
                v-if="
                  (!demoRequestLogs || !demoRequestLogs.length) && !showForm
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
              <InteractionLogForm
                v-if="showForm"
                :request="demoRequest"
                :states="states"
                @close-form="showForm = false"
              />
            </v-scale-transition>
          </v-col>
        </v-row>
      </v-card-text>
    </template>
    <v-dialog v-model="siblingDialog" max-width="600px" persistent>
      <v-card>
        <v-card-title> Add Sibling Details </v-card-title>

        <v-form ref="form" lazy-validation @submit.prevent="addSibling">
          <v-card-text class="pt-4">
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.name"
                  :rules="[requiredRules('Name')]"
                  label="Sibling name *"
                  outlined
                  validate-on-blur
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.age"
                  :rules="[requiredRules('Age')]"
                  label="Sibling age *"
                  outlined
                  validate-on-blur
                />
              </v-col>
            </v-row>
            <v-alert
              v-model="form.alert.show"
              :type="form.alert.error === 'success' ? 'success' : 'error'"
              prominent
              dismissible
            >
              {{
                form.alert.error === 'success'
                  ? 'Sibling added successfully.'
                  : form.alert.error
              }}
            </v-alert>
          </v-card-text>

          <v-card-actions class="pt-0 px-6 pb-5">
            <v-spacer />
            <v-btn color="primary" text @click="cancelSiblingAdd">
              Cancel
            </v-btn>
            <v-btn
              :disabled="loading"
              :loading="loading"
              color="primary"
              type="submit"
            >
              Add
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
  data() {
    return {
      loading: false,
      showForm: false,
      siblingDialog: false,
      requiredRules: (type) => {
        return (v) => !!v || `${type} can't be empty.`
      },
      form: {
        name: null,
        age: null,
        alert: {
          show: false,
          error: null,
        },
      },
    }
  },
  computed: {
    ...mapGetters('admin', {
      demoRequest: 'currDemoReqData',
      demoRequestLogs: 'currDemoReqLogs',
      globalConfig: 'globalConfig',
    }),
    ...mapGetters('user', ['isSuperAdmin']),
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
    this.unobserveDemoRequest()
  },
  methods: {
    ...mapActions('admin', [
      'observeDemoRequest',
      'unobserveDemoRequest',
      'addSiblingToDemos',
    ]),
    async getRequestDetails() {
      this.loading = true
      await this.observeDemoRequest({ id: this.$route.params.id })
      this.loading = false
    },
    async addSibling() {
      if (this.$refs.form.validate()) {
        this.form.alert.show = false

        const data = {
          parentsName: this.demoRequest.parentsName,
          country: this.demoRequest.country,
          parentsPhone: this.demoRequest.parentsPhone,
          parentsEmail: this.demoRequest.parentsEmail,
          kidsName: this.form.name,
          kidsAge: this.form.age,
          status: this.demoRequest.status,
          createdAt: this.demoRequest.createdAt,
          page: this.demoRequest.page,
          query: this.demoRequest.query,
          logCount: 0,
        }

        if (this.demoRequest.address) {
          data.address = this.demoRequest.address
        }

        if (this.demoRequest.otherContacts) {
          data.otherContacts = this.demoRequest.otherContacts
        }

        if (this.demoRequest.otherEmails) {
          data.otherEmails = this.demoRequest.otherEmails
        }

        this.loading = true
        try {
          await this.addSiblingToDemos(data)
          this.form.alert.error = 'success'
          this.form.alert.show = true
          setTimeout(() => {
            this.cancelSiblingAdd()
          }, 1000)
        } catch (error) {
          console.log('error in adding sibling: ', error)
          this.form.alert.error = error.message
          this.form.alert.show = true
        }

        this.loading = false
      }
    },
    backBtnClicked() {
      if (this.showForm) {
        this.showForm = false
        return
      }

      if (window.history.length > 1) {
        this.$router.go(-1)
      } else {
        this.$router.push('/admin/demo-requests')
      }
    },
    cancelSiblingAdd() {
      this.siblingDialog = false
      this.form.alert.error = null
      this.form.alert.show = false
      this.$refs.form.reset()
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
