<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="10" md="8" lg="7">
        <SiteForm @done="onSiteCreated" />
      </v-col>
    </v-row>
    <v-dialog v-model="showDialog" max-width="500px" persistent>
      <v-card>
        <v-card-title class="display-1 justify-center pt-7 pb-4">
          BOOM!
        </v-card-title>
        <v-card-text class="text-center">
          <img src="~/assets/images/celebrate.gif" width="200" />
          <br />
          <a :href="finalSiteUrl" class="headline" target="_blank">
            {{ finalSiteUrl }} <v-icon color="primary">$mdiOpenInNew</v-icon>
          </a>
          <div class="text-rem-1-125 ma-4">is live!</div>
          <v-card-actions class="justify-center">
            <v-btn color="primary" outlined @click.stop="closeDialog(false)">
              Close
            </v-btn>
            <v-btn color="primary ml-4" @click.stop="closeDialog(true)">
              View Site
            </v-btn>
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'LaunchSitePage',
  data() {
    return {
      showDialog: false,
      finalSiteUrl: null,
    }
  },
  computed: {
    ...mapGetters(['siteUrl']),
  },
  mounted() {
    this.$store.commit('setPageTitle', 'Launch New Website')
    this.$store.commit('showBack', true)
  },
  beforeDestroy() {
    this.$store.commit('showBack', false)
  },
  methods: {
    ...mapActions(['goBack']),
    onSiteCreated(subdomain) {
      this.finalSiteUrl = this.siteUrl
      this.showDialog = true
    },
    closeDialog(visitSite) {
      this.showDialog = false
      if (visitSite) {
        window.open(this.finalSiteUrl, '_blank')
      }

      this.goBack()
    },
  },
}
</script>
