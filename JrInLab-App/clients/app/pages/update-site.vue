<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="10" md="8" lg="7">
        <SiteForm
          :domain-to-edit="$route.query.subdomain"
          @done="onSiteUpdated"
        />
      </v-col>
    </v-row>
    <v-dialog v-model="showDialog" max-width="500px" persistent>
      <v-card>
        <v-card-title class="display-1 justify-center pt-7 pb-4">
          AND DONE!
        </v-card-title>
        <v-card-text class="text-center">
          <img src="~/assets/images/done.gif" width="200" />
          <p class="text-rem-1">
            Don't forget to refresh your website's browser tab to see your
            changes. It may take upto 10 minutes for your changes to take effect
            for everyone.
          </p>
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
  name: 'UpdateSitePage',
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
    this.$store.commit('setPageTitle', 'Update Your Website')
    this.$store.commit('showBack', true)
  },
  beforeDestroy() {
    this.$store.commit('showBack', false)
  },
  methods: {
    ...mapActions(['goBack']),
    onSiteUpdated(subdomain) {
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

<style></style>
