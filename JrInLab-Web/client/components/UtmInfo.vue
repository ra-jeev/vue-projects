<template>
  <v-row align="center" no-gutters>
    <v-icon class="primary pa-1" left size="24"> $mdiFilter </v-icon>
    <span>Source</span>
    <v-chip-group class="ml-2" column>
      <v-chip
        v-for="(sourceInfo, index) in customerSourceInfo"
        v-bind="$attrs"
        :key="`sourceInfo_${index}`"
        class="font-weight-bold grey--text text--lighten-2"
        label
        small
      >
        {{ sourceInfo }}
      </v-chip>
    </v-chip-group>
  </v-row>
</template>

<script>
export default {
  props: {
    page: {
      type: String,
      required: true,
    },
    query: {
      type: Object,
      default: null,
    },
  },
  computed: {
    customerSourceInfo() {
      const sourceInfo = [this.page]
      const query = this.query
      if (query) {
        if (query.utm_campaign) {
          sourceInfo.push(query.utm_campaign)
        }

        if (query.utm_source) {
          sourceInfo.push(query.utm_source)
        }

        if (query.utm_medium) {
          sourceInfo.push(query.utm_medium)
        }

        if (query.utm_content) {
          sourceInfo.push(query.utm_content)
        }

        if (query.utm_term) {
          sourceInfo.push(query.utm_term)
        }
      }

      return sourceInfo
    },
  },
}
</script>
