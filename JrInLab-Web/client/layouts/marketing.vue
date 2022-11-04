<template>
  <v-app>
    <header class="page-header">
      <Logo height="72" dark />
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

<style lang="scss" scoped>
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
