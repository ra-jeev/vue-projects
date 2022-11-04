<template>
  <v-card :to="`/projects/${project.id}`">
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      timeout="2000"
      top
    >
      <div class="d-flex align-center text-rem-1">
        <v-icon left>{{ snackbar.icon }}</v-icon>
        <span>{{ snackbar.message }}</span>
      </div>
    </v-snackbar>
    <v-progress-linear v-show="loading" color="primary" indeterminate />
    <v-card-title class="title">
      {{ project.title }}
      <v-spacer />
      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <v-icon
            :color="project.siteUrl ? 'primary' : ''"
            v-bind="attrs"
            v-on="on"
          >
            {{
              project.siteUrl
                ? project.siteUpdated !== project.updatedAt
                  ? '$mdiUpdate'
                  : '$mdiWeb'
                : '$mdiWebOff'
            }}
          </v-icon>
        </template>

        <span>
          {{
            project.siteUrl
              ? project.siteUpdated !== project.updatedAt
                ? 'Website update pending'
                : 'Website live'
              : 'Private project'
          }}
        </span>
      </v-tooltip>
    </v-card-title>
    <v-card-subtitle>
      {{
        project.files.length + (project.files.length == 1 ? ' File' : ' Files')
      }}
      <span class="mx-1">|</span>
      {{ project.size | sizeFilter }}
    </v-card-subtitle>
    <v-card-text>
      <div class="d-flex align-center">
        <v-chip
          v-for="(file, index) in project.files"
          :key="file.name"
          :class="{ 'ml-2': index }"
          small
        >
          {{ getLanguage(file.type) }}
        </v-chip>
      </div>
      <div class="mt-4">Updated on {{ project.updatedAt | dateFilter }}</div>
    </v-card-text>
    <v-divider />
    <v-row no-gutters>
      <v-col v-if="!project.siteUrl">
        <v-btn
          block
          class="font-weight-bold"
          color="primary"
          large
          text
          @click.prevent="onGoLiveClick"
        >
          <v-icon left>$mdiWeb</v-icon>
          Launch as website
        </v-btn>
      </v-col>
      <template v-else>
        <template v-if="project.siteUpdated !== project.updatedAt">
          <v-col>
            <v-btn
              block
              class="font-weight-bold"
              color="primary"
              large
              text
              @click.prevent="updateSite"
            >
              <v-icon left>$mdiUpdate</v-icon>
              Update Website
            </v-btn>
          </v-col>
          <v-divider vertical />
        </template>
        <v-col>
          <v-btn
            block
            class="font-weight-bold"
            color="primary"
            large
            text
            @click.prevent="visitSite"
          >
            <v-icon left>$mdiOpenInNew</v-icon>
            View Site
          </v-btn>
        </v-col>
      </template>
    </v-row>
    <v-dialog v-model="siteDialog" max-width="500px" persistent>
      <v-card v-if="!websiteCreated">
        <v-card-title class="headline justify-center">
          Add your website details
        </v-card-title>
        <v-card-text class="mt-2">
          <div class="d-flex align-start text-rem-1 ml-3 mb-4">
            <v-icon color="primary">$mdiInformation</v-icon>
            <div class="ml-2">
              Type in the name you want for your website (Only letters, numbers
              and hyphens "-" are allowed in the name)
            </div>
          </div>
          <v-form ref="form" lazy-validation @submit.prevent="goLive">
            <v-text-field
              ref="subdomain"
              v-model="subdomain"
              :error-messages="subdomainError"
              :loading="checkingSubdomain"
              :prepend-inner-icon="subdomainFieldIcon"
              :rules="subdomainRules"
              :success-messages="subdomainSuccess"
              class="custom-append"
              label="Website name (e.g. my-site) *"
              outlined
              required
              validate-on-blur
              @change="onSubdomainChange"
              @input="onSubdomainInput"
            >
              <template #append>
                {{ $config.DOMAIN_SUFFIX.slice(1) }}
              </template>
            </v-text-field>
            <v-alert
              v-model="alert.show"
              :type="alert.type"
              dismissible
              prominent
            >
              {{ alert.message }}
            </v-alert>
            <v-row class="mt-2" no-gutters>
              <v-btn
                class="font-weight-bold"
                color="primary"
                large
                outlined
                @click.stop="onCancelingLive"
              >
                Cancel
              </v-btn>

              <v-btn
                :disabled="loading"
                :loading="loading"
                class="flex-grow-1 ml-4 font-weight-bold"
                color="primary"
                light
                large
                type="submit"
              >
                <v-icon left> $mdiCloudUpload </v-icon>
                Let's go
              </v-btn>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
      <v-card v-else>
        <v-card-title class="display-1 justify-center pt-7 pb-4">
          BOOM!
        </v-card-title>
        <v-card-text class="text-center">
          <img src="~/assets/images/celebrate.gif" width="200" />
          <br />
          <a :href="siteUrl" class="headline" target="_blank">
            {{ siteUrl }} <v-icon color="primary">$mdiOpenInNew</v-icon>
          </a>
          <div class="text-rem-1-125 ma-4">is live!</div>
          <v-card-actions class="justify-center">
            <v-btn
              color="primary"
              outlined
              @click.stop="closeWebsiteDialog(false)"
            >
              Close
            </v-btn>
            <v-btn color="primary ml-4" @click.stop="closeWebsiteDialog(true)">
              View Site
            </v-btn>
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  props: {
    project: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      siteDialog: false,
      loading: false,
      websiteCreated: false,
      checkingSubdomain: false,
      subdomainError: [],
      subdomainSuccess: [],
      subdomain: this.domainToEdit,
      subdomainRules: [
        (v) => !!v || `Website name is required`,
        (v) =>
          /^[a-zA-Z0-9-]+$/.test(v) ||
          'Only letters, numbers and hyphens allowed.',
      ],
      alert: {
        show: false,
        type: 'error',
        message: null,
      },
      snackbar: {
        show: false,
        message: null,
        color: 'success',
        icon: '$mdiCheckCircle',
      },
    }
  },
  computed: {
    ...mapGetters(['siteUrl']),
    subdomainFieldIcon() {
      let icon = '$mdiWeb'
      if (this.subdomainError.length) {
        icon = '$mdiCloseCircle'
      } else if (this.subdomainSuccess.length) {
        icon = '$mdiCheckCircle'
      }

      return icon
    },
  },
  methods: {
    ...mapActions(['checkSubdomainAvailability', 'processUpload']),
    getLanguage(language) {
      switch (language) {
        case 'text/html':
          return 'HTML'
      }
    },
    visitSite() {
      window.open(this.project.siteUrl, '_blank')
    },
    onSubdomainInput(value) {
      if (value) {
        const sanitizedValue = value.toLowerCase().replace(/[\s]/g, '')
        this.$nextTick(() => {
          this.subdomain = sanitizedValue
        })
      }
    },
    async onSubdomainChange(value) {
      console.log(`${Date.now()} subdomain change: `, value)
      this.subdomainError = []
      this.subdomainSuccess = []

      if (value && this.$refs.subdomain.validate()) {
        try {
          this.checkingSubdomain = true
          await this.checkSubdomainAvailability(this.subdomain)
          this.subdomainSuccess.push(
            'Yay! Subdomain is available and waiting for you :-)'
          )
          this.alert.message = null
          this.alert.show = false
        } catch (error) {
          console.log('Check subdomain error: ', error)
          this.subdomainError.push('Uh Oh! This subdomain is not available.')
        }

        this.checkingSubdomain = false
      }
    },
    async updateSite() {
      this.loading = true

      await this.processUpload({
        subdomain: this.project.subdomain,
        isEdit: true,
        project: { id: this.project.id, siteUrl: this.project.siteUrl },
      })

      this.loading = false
      this.snackbar.message = 'Website updated successfully.'
      this.snackbar.color = 'success'
      this.snackbar.icon = '$mdiCheckCircle'
      this.snackbar.show = true
    },
    closeWebsiteDialog(visitSite) {
      if (visitSite) {
        window.open(this.siteUrl, '_blank')
      }

      this.onCancelingLive()
    },
    onGoLiveClick() {
      this.websiteCreated = false
      this.siteDialog = true
      this.alert.show = false
    },
    onCancelingLive() {
      this.siteDialog = false
    },
    async goLive() {
      if (this.$refs.form.validate()) {
        if (this.subdomainError.length) {
          this.alert.message = 'Please choose another website name.'
          this.alert.show = true
          return
        }

        this.alert.message = null
        this.alert.show = false
        this.alert.type = 'error'
        this.loading = true

        try {
          await this.processUpload({
            subdomain: this.subdomain,
            project: { id: this.project.id },
          })

          this.$refs.form.reset()
          this.alert.type = 'success'
          this.alert.message = 'Website successfully created...'
          this.alert.show = true
          this.subdomainSuccess = []
          this.websiteCreated = true
        } catch (error) {
          const message =
            error.response?.data?.message ||
            error.message ||
            'Some error occurred. Please try again later!'
          this.alert.message = message
          this.alert.show = true
        }

        this.loading = false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.custom-append ::v-deep .v-input__slot {
  padding-right: 0 !important;

  .v-input__append-inner {
    margin-top: 0;
    background-color: $primary-light;
    letter-spacing: 0.025em;
    color: #333333;
    font-size: 1.125rem;
    padding: 0 16px;
    height: 56px;
    display: flex;
    align-items: center;
  }
}
</style>
