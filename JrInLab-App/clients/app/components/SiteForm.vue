<template>
  <v-card class="mt-6">
    <v-card-title class="headline justify-center">
      {{
        domainToEdit ? 'Update your website file' : 'Add your website details'
      }}
    </v-card-title>
    <v-card-text class="mt-2">
      <div class="d-flex align-start text-rem-1 ml-3 mb-4">
        <v-icon color="primary">$mdiInformation</v-icon>
        <div class="ml-2">
          Type in the name you want for your website (Only letters, numbers and
          hyphens "-" are allowed in the name)
        </div>
      </div>
      <v-form ref="form" lazy-validation @submit.prevent="uploadFile">
        <v-text-field
          ref="subdomain"
          v-model="subdomain"
          :disabled="!!domainToEdit"
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
        <div class="text-rem-1 d-flex align-start ml-3 mb-1">
          <v-icon color="primary">$mdiInformation</v-icon>
          <div class="ml-2">
            Select the html file that you created for your website.
          </div>
        </div>
        <div class="text-rem-1 d-flex align-start ml-3 mb-4">
          <v-icon color="primary">$mdiInformation</v-icon>
          <div class="ml-2">
            If you've separate images and/or other html files as well, you
            should:
            <ol>
              <li>
                Create a folder and put all of your website files inside that
                folder
              </li>
              <li>
                Create a <strong>zip file</strong> of the folder (<a
                  href="https://www.wikihow.com/Make-a-Zip-File"
                  target="_blank"
                >
                  How to create a zip file? </a
                >)
              </li>
              <li>
                Make sure that the html file of your website's
                <strong>homepage</strong>, is called
                <strong>index.html</strong>
              </li>
            </ol>
          </div>
        </div>
        <v-file-input
          v-model="file"
          :rules="fileRules"
          accept="text/html,application/zip"
          color="primary"
          counter
          label="Select your html / zip file (max 5 MB) *"
          outlined
          prepend-icon=""
          prepend-inner-icon="$mdiPaperclip"
          show-size
          small-chips
          @change="onFileSelection"
        />
        <v-alert v-model="alert.show" :type="alert.type" dismissible prominent>
          {{ alert.message }}
        </v-alert>
        <v-row class="mt-2" no-gutters>
          <v-btn
            class="font-weight-bold"
            color="primary"
            large
            outlined
            @click.stop="goBack"
          >
            {{ cancelBtnText }}
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
            {{ btnText }}
          </v-btn>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    domainToEdit: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      file: null,
      fileToUpload: null,
      loading: false,
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
      allowedFileMimeTypes: [
        'text/html',
        'application/zip',
        'application/x-zip',
        'application/x-zip-compressed',
      ],
      fileRules: [
        (v) => !!v || `File is required`,
        (v) => {
          if (v) {
            if (!this.allowedFileMimeTypes.includes(v.type)) {
              return 'Wrong file type selected. Only HTML / ZIP files allowed.'
            } else if (v.size > this.MAX_IMAGE_SIZE) {
              return 'This file is loo large. Maximum 5 MB allowed.'
            } else if (!v.size) {
              return 'The file seems to be empty, please select another file.'
            }

            return true
          }

          return 'No file selected for uploading.'
        },
      ],
      MAX_IMAGE_SIZE: 5 * 1024 * 1000,
      alert: {
        show: false,
        type: 'error',
        message: null,
      },
      cancelBtnText: 'Cancel',
    }
  },
  computed: {
    btnText() {
      return this.domainToEdit ? 'Unleash Your Update' : 'Let the magic begin!'
    },
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
    ...mapActions([
      'checkSubdomainAvailability',
      'getSignedUploadUrl',
      'uploadDataToUrl',
      'processUpload',
      'goBack',
    ]),
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
    onFileSelection(file) {
      if (file) {
        this.alert.show = false
        this.getDataUrl(file)
      } else {
        this.fileToUpload = null
      }
    },
    getDataUrl(file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const fileTypePart = e.target.result.substring(
          0,
          e.target.result.indexOf(';')
        )

        const mimeType = fileTypePart?.split(':')[1]
        console.log('selected file: ', file)
        console.log(`selected file's calculated mimeType: ${mimeType}`)
        if (!mimeType) {
          this.alert.message =
            'The file is empty or corrupted. Please select another file.'
          this.alert.show = true
          return
        } else if (
          ![
            'text/html',
            'application/zip',
            'application/x-zip',
            'application/x-zip-compressed',
          ].includes(mimeType)
        ) {
          this.alert.message =
            'Wrong file type selected. Only HTML / ZIP files are allowed.'
          this.alert.show = true
          return
        }

        if (e.target.result.length > this.MAX_IMAGE_SIZE) {
          this.alert.message =
            'This file is loo large - 5 MB maximum file size allowed.'
          this.alert.show = true
          return
        }

        this.fileToUpload = {
          dataUrl: e.target.result,
          mimeType,
        }
      }

      reader.readAsDataURL(file)
    },
    async uploadFile() {
      if (this.$refs.form.validate()) {
        if (this.subdomainError.length) {
          this.alert.message = 'Please choose another website name.'
          this.alert.show = true
          return
        }

        if (!this.fileToUpload) {
          this.alert.message =
            'Please fix the issues with your file before proceeding.'
          this.alert.show = true
          return
        }

        this.alert.message = null
        this.alert.show = false
        this.alert.type = 'error'
        this.loading = true

        try {
          await this.getSignedUploadUrl({
            subdomain: this.subdomain,
            isEdit: !!this.domainToEdit,
            fileName: this.file.name,
            fileMimeType: this.fileToUpload.mimeType,
          })

          await this.uploadDataToUrl({
            subdomain: this.subdomain,
            ...this.fileToUpload,
          })

          await this.processUpload({
            subdomain: this.subdomain,
            isEdit: !!this.domainToEdit,
          })

          this.$emit('done', this.subdomain)
          this.$refs.form.reset()
          if (this.domainToEdit) {
            this.$nextTick(() => {
              this.subdomain = this.domainToEdit
            })

            this.cancelBtnText = 'Back'
          }
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
