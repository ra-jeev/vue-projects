<template>
  <v-navigation-drawer
    :value="drawer"
    fixed
    right
    dark
    class="app-drawer hidden-md-and-up"
    @input="onDrawerEvent"
  >
    <v-row no-gutters>
      <v-spacer />
      <v-btn icon large class="mr-3 mt-3" @click.stop="$emit('drawer-close')">
        <v-icon large> $mdiClose </v-icon>
      </v-btn>
    </v-row>
    <v-list>
      <v-list-item
        v-for="pageLink in pageLinks"
        :key="pageLink.to"
        :to="{ path: pageLink.to, query: $route.query }"
        router
        exact
      >
        <v-list-item-title v-text="pageLink.title" />
      </v-list-item>
      <v-list-item>
        <CtaBtn block btn-text="get a free class" rounded class="mt-6" />
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  props: {
    drawer: {
      type: Boolean,
      default: false,
    },
    pageLinks: {
      type: Array,
      required: true,
    },
  },
  methods: {
    onDrawerEvent(val) {
      if (!val) {
        this.$emit('drawer-close')
      }
    },
  },
}
</script>
