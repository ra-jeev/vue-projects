<template>
  <v-card class="card-bg">
    <v-card-title>
      <span v-if="index" class="mr-2 primary--text">{{ index }}.</span>
      <div class="primary--text">
        {{ request.name }}
      </div>

      <v-chip
        :color="states[request.status] ? states[request.status].color : ''"
        class="ml-4"
        small
      >
        {{ request.status }}
      </v-chip>
    </v-card-title>
    <v-card-subtitle class="grey--text text--lighten-2 ml-6">
      {{ request.role }}, {{ request.school }}
    </v-card-subtitle>
    <v-card-text>
      <v-row no-gutters>
        <div class="d-flex align-center px-2 py-1 grey--text text--lighten-2">
          <v-icon left color="primary" small> $mdiPhone </v-icon>
          {{ phoneNumber }}
        </div>
      </v-row>
      <v-row align="center" class="mt-6" no-gutters>
        <v-chip
          class="small-chip"
          color="grey font-weight-medium mr-4"
          small
          label
          outlined
        >
          Logs: {{ request.logCount || 0 }}
        </v-chip>
        <span class="grey--text">
          Updated: {{ request.updatedAt | dateFilter }}
        </span>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    request: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    ...mapGetters('admin', ['metaData']),
    states() {
      const states = {}
      if (this.metaData) {
        for (const state of this.metaData.global.states) {
          states[state.value] = { ...state }
        }
      }

      return states
    },
    phoneNumber() {
      let completePhone = ''
      if (this.request.country) {
        completePhone += this.request.country.dialCode + '-'
      }

      completePhone += this.request.phone

      return completePhone
    },
  },
}
</script>

<style lang="scss" scoped>
.card-bg {
  background-color: #2d2d2d;
}

.small-chip {
  padding: 0 6px;
}
</style>
