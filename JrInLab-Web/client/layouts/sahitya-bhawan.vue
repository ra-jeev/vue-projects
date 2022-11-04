<template>
  <v-app>
    <header class="page-header">
      <div class="text-center d-flex align-center">
        <img
          :height="`${logoHeight}px`"
          alt="Sahitya Bhawan Logo"
          src="~/assets/images/sahitya-bhawan-logo.webp"
          class="sahitya-bhawan-logo"
        />
        <div class="headline white--text mx-3">&amp;</div>
        <logo :height="logoHeight" dark />
      </div>
      <div class="text-center white--text title mt-4">present</div>
    </header>

    <v-main>
      <nuxt />
    </v-main>

    <v-footer padless>
      <v-card flat tile dark width="100%" class="bg--dark text-center">
        <v-card-text>
          &copy; {{ new Date().getFullYear() }}, Edulabtech Solutions Pvt. Ltd.,
          All Rights Reserved
        </v-card-text>
      </v-card>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  computed: {
    logoHeight() {
      if (this.$vuetify.breakpoint.xsOnly) {
        return 42
      }

      return 64
    },
  },
}
</script>

<style lang="scss" scoped>
.sahitya-bhawan-logo {
  background-color: whitesmoke;
  padding: 6px 12px;
  border-radius: 8px;
}

.page-header {
  align-self: center;
  padding: 12px;
  position: absolute;
  z-index: 1;
  margin-top: 24px;
}

@media only screen and (max-width: 599px) {
  .page-header {
    margin-top: 12px;
  }
}
</style>
