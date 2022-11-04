<template>
  <a href="https://www.jrinlab.com" class="jrinlab-logo">
    <img
      :src="
        dark
          ? 'https://firebasestorage.googleapis.com/v0/b/jrinlab.appspot.com/o/logos%2Fsmall%2Fjrinlab-yellow.png?alt=media&token=9a0d4548-4480-4cdc-bc27-c7429739ea67'
          : 'https://firebasestorage.googleapis.com/v0/b/jrinlab.appspot.com/o/logos%2Fsmall%2Fjrinlab-voilet.png?alt=media&token=154e69f4-40f0-4242-8dc9-d1645c1f4861'
      "
      :style="{ height: `${height}px` }"
      alt="JrinLab Logo"
    />
  </a>
</template>

<script>
export default {
  props: {
    dark: {
      type: Boolean,
      default: false,
    },
    height: {
      type: [Number, String],
      default: 48,
    },
  },
}
</script>

<style lang="scss" scoped>
.jrinlab-logo {
  display: inline-block;

  img {
    vertical-align: middle;
    max-height: 100%;
  }
}
</style>
