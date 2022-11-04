<template>
  <div>
    <template v-if="(isAdmin || isPartner) && globalConfig">
      <nuxt-child />
    </template>
    <v-progress-linear v-else-if="loading" indeterminate />
    <v-container v-else>
      <v-row justify="center">
        <v-card class="mt-4">
          <v-card-title class="pa-4 title"> No admin rights </v-card-title>
          <v-divider color="grey" />
          <v-card-text class="subheading pa-4">
            <p>You don't seem to have the admin dashboard access.</p>
            <p>
              If this is your first login, try logging out and logging in
              again.<br />If a fresh login doesn't work then please talk to your
              administrator.
            </p>
          </v-card-text>
        </v-card>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  layout: 'admin',
  data() {
    return {
      loading: false,
    }
  },
  computed: {
    ...mapGetters('user', ['isAdmin', 'isPartner']),
    ...mapGetters('admin', ['globalConfig']),
  },
  beforeDestroy() {
    this.detachMetaDataListener()
  },
  async mounted() {
    console.log(
      `this.isAdmin: ${this.isAdmin}, this.isPartner: ${this.isPartner}`
    )
    if (this.isAdmin || this.isPartner) {
      this.loading = true
      try {
        await this.getMetaData()
        console.log('globalConfig: ', this.globalConfig, ', time', Date.now())
      } catch (error) {
        console.log('inside mounted: getMetaData failed', error)
        await new Promise((resolve) => {
          setTimeout(async () => {
            await this.getMetaData()
            console.log(
              'globalConfig 2: ',
              this.globalConfig,
              ', time',
              Date.now()
            )
            resolve()
          }, 1500)
        })
      }

      if (this.globalConfig && this.isPartner) {
        this.$router.push('/admin/your-dashboard')
      }

      this.loading = false
    }
  },
  methods: {
    ...mapActions('admin', ['getMetaData', 'detachMetaDataListener']),
  },
}
</script>
