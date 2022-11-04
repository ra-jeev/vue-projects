<template>
  <v-btn
    v-bind="$attrs"
    :class="{ 'long-btn': makeExtraLong }"
    :color="color"
    :to="to.startsWith('#') ? '' : { path: `/${to}`, query: $route.query }"
    @click.stop="onCtaClick"
  >
    {{ btnText }}
  </v-btn>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: 'secondary',
    },
    btnText: {
      type: String,
      default: 'Get a free class',
    },
    makeExtraLong: {
      type: Boolean,
      default: false,
    },
    to: {
      type: String,
      default: 'register',
    },
  },
  methods: {
    onCtaClick() {
      if (this.to.startsWith('#') && document.querySelector(this.to)) {
        this.$nextTick(() => {
          this.$vuetify.goTo(this.to)
        })
      }
    },
  },
}
</script>

<style scoped>
.v-btn.long-btn {
  min-width: 276px;
}

@media only screen and (max-width: 599px) {
  .v-btn.long-btn {
    width: 100%;
  }
}
</style>
