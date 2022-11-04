<template>
  <v-app-bar v-bind="$attrs" :dark="dark" extension-height="32" fixed>
    <v-toolbar-title>
      <Logo :dark="dark" class="logo" />
    </v-toolbar-title>
    <v-spacer />
    <div class="hidden-sm-and-down">
      <template v-for="pageLink in pageLinks">
        <v-btn
          v-show="!pageLink.hide"
          :key="`btn_${pageLink.to}`"
          :to="{ path: pageLink.to, query: $route.query }"
          text
        >
          {{ pageLink.title }}
        </v-btn>
      </template>
      <CtaBtn rounded class="ml-2" />
    </div>
    <v-btn
      icon
      class="hidden-md-and-up"
      aria-label="Toggle Navigation"
      @click.stop="$emit('drawer-open')"
    >
      <v-icon large v-text="'$mdiText'" />
    </v-btn>
  </v-app-bar>
</template>

<script>
export default {
  props: {
    dark: {
      type: Boolean,
      default: false,
    },
    pageLinks: {
      type: Array,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.logo {
  position: relative;
  height: 48px;
}

::v-deep .v-toolbar__extension {
  background-color: #ff7043;
}

.banner {
  position: relative;
  color: white;
  font-weight: 500;

  .close-icon {
    position: absolute;
    right: 4px;
  }
}

@media only screen and (max-width: 959px) {
  .logo {
    height: 40px;
  }
}
</style>
