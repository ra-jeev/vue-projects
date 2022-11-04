<template>
  <v-card>
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
      {{ websiteDetails.subdomain }}
      <v-spacer />
      <v-menu bottom left>
        <template #activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon> $mdiDotsVertical </v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item
            v-for="action in menuActions"
            :key="action.value"
            dense
            @click="handleUserActions(action.value)"
          >
            <v-list-item-content>
              <v-list-item-title>
                {{ action.text }}
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-icon>
              <v-icon>{{ action.icon }}</v-icon>
            </v-list-item-icon>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-card-title>
    <v-card-subtitle>
      <a
        :href="websiteDetails.siteUrl"
        class="text-rem-1-125 font-weight-medium"
        target="_blank"
      >
        {{ websiteDetails.siteUrl }}
      </a>
    </v-card-subtitle>
    <v-card-text>
      <!-- <a
        :href="websiteDetails.siteUrl"
        class="text-rem-1-125 font-weight-bold"
        target="_blank"
      >
        {{ websiteDetails.siteUrl }}
      </a> -->
      <div class="text-rem-1">
        <span class="font-weight-medium">Updated on</span>
        {{ websiteDetails.updatedAt | dateFilter }}
      </div>
    </v-card-text>
    <v-divider />
    <v-row no-gutters>
      <template v-for="(action, index) in otherActions">
        <template v-if="!action.condition || action.condition()">
          <v-col :key="action.value">
            <v-btn
              block
              class="font-weight-bold"
              color="primary"
              large
              text
              @click.stop="handleUserActions(action.value)"
            >
              <v-icon left>{{ action.icon }}</v-icon>
              {{ action.text }}
            </v-btn>
          </v-col>
          <v-divider
            v-if="index !== otherActions.length - 1"
            :key="`divider_${action.value}`"
            vertical
          />
        </template>
      </template>
    </v-row>
    <v-dialog v-model="deleteDialog" max-width="500px" persistent>
      <v-card>
        <v-card-title class="headline">
          Permanently delete website?
        </v-card-title>

        <v-card-text class="pt-2">
          <v-alert
            border="left"
            class="font-weight-medium"
            outlined
            type="error"
          >
            Once this website is deleted, you can not recover it by any means.
          </v-alert>

          <span class="text-rem-1">
            Please confirm your website delete request by typing
            <span class="font-weight-medium">
              <em>delete {{ websiteDetails.subdomain }}</em>
            </span>
            in the text field below
          </span>

          <v-text-field
            v-model="deleteText"
            :placeholder="`delete ${websiteDetails.subdomain}`"
            class="mt-4"
            outlined
          />
        </v-card-text>

        <v-card-actions class="pt-0 px-6 pb-5">
          <v-spacer />
          <v-btn color="error" text @click.stop="cancelDelete">Cancel</v-btn>
          <v-btn
            :disabled="deleteText !== `delete ${websiteDetails.subdomain}`"
            color="error"
            @click.stop="confirmDelete"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    websiteDetails: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      deleteText: null,
      deleteDialog: false,
      snackbar: {
        show: false,
        message: null,
        color: 'success',
        icon: '$mdiCheckCircle',
      },
      menuActions: [
        {
          icon: '$mdiPencil',
          text: 'Update Website',
          value: 'edit',
        },
        {
          icon: '$mdiDelete',
          text: 'Delete Website',
          value: 'delete',
        },
      ],
      otherActions: [
        {
          icon: '$mdiShare',
          text: 'Share Url',
          value: 'share',
          condition: this.canShare,
        },
        {
          icon: '$mdiContentCopy',
          text: 'Copy Link',
          value: 'copy',
        },
        {
          icon: '$mdiOpenInNew',
          text: 'View Site',
          value: 'view',
        },
      ],
    }
  },
  methods: {
    ...mapActions(['deleteUserWebsite']),
    canShare() {
      return navigator.share
    },
    async handleUserActions(action) {
      switch (action) {
        case 'share':
          await window.navigator.share({
            title: 'My website link',
            text: `Check out my cool website that I'm hosting free of cost @ www.jrinlab.com`,
            url: this.websiteDetails.siteUrl,
          })
          break
        case 'copy':
          await window.navigator.clipboard.writeText(
            this.websiteDetails.siteUrl
          )
          this.snackbar.message = 'Website link copied to your clipboard.'
          this.snackbar.color = 'success'
          this.snackbar.icon = '$mdiCheckCircle'
          this.snackbar.show = true
          break
        case 'view':
          window.open(this.websiteDetails.siteUrl, '_blank')
          break
        case 'edit':
          this.$router.push({
            path: '/update-site',
            query: { subdomain: this.websiteDetails.subdomain },
          })
          break
        case 'delete':
          this.deleteDialog = true
          break
      }
    },
    cancelDelete() {
      this.deleteText = null
      this.deleteDialog = false
    },
    async confirmDelete() {
      this.deleteDialog = false
      this.loading = true
      await this.deleteUserWebsite(this.websiteDetails.subdomain)
      this.loading = false
    },
  },
}
</script>
