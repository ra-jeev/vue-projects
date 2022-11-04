<template>
  <v-app>
    <v-main>
      <nuxt />
    </v-main>
  </v-app>
</template>

<script>
export default {
  created() {
    this.$vuetify.theme.isDark = true
  },
  destroyed() {
    this.$vuetify.theme.isDark = false
  },
}
</script>
