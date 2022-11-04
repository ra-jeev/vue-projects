<template>
  <v-container fluid fill-height>
    <v-row align="center">
      <v-col sm="6" class="hidden-xs-only primary image-panel">
        <v-row class="fill-height align-center justify-center" no-gutters>
          <v-img
            :src="require(`~/assets/images/${image}`)"
            contain
            max-width="80%"
          />
        </v-row>
      </v-col>
      <v-col cols="12" sm="6" offset-sm="6" class="white">
        <v-row align="center" justify="center" no-gutters>
          <v-col align="center" cols="12" md="10" lg="8">
            <primary-logo class="mb-8" />
            <slot></slot>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: {
    image: {
      type: String,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.image-panel {
  position: fixed;
  height: 100%;
  top: 0;
  left: 0;
}
</style>
