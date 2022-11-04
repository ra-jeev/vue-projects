<template>
  <v-container>
    <v-progress-linear v-if="loading" indeterminate large />
    <EditCustomer v-else-if="demoReqInEdit" :customer-data="demoReqInEdit" />
    <template v-else> Some problem Exists </template>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data() {
    return {
      loading: false,
    }
  },
  computed: {
    ...mapGetters('admin', ['demoReqInEdit']),
  },
  mounted() {
    this.fetchCustomer()
  },
  methods: {
    ...mapActions('admin', ['getDemoRequestById']),
    async fetchCustomer() {
      this.loading = true

      try {
        await this.getDemoRequestById({ id: this.$route.params.id })
      } catch (error) {
        console.log(error)
      }

      this.loading = false
    },
  },
}
</script>
