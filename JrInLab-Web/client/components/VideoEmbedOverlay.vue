<template>
  <v-overlay :value="overlay && videoSrc" opacity="0.8">
    <v-btn
      icon
      class="close-btn primary hidden-xs-only"
      @click="$emit('overlay-close')"
    >
      <v-icon> $mdiClose </v-icon>
    </v-btn>
    <div class="video-container">
      <iframe
        :src="`${videoSrc}?rel=0&amp;autoplay=1`"
        frameborder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      />
    </div>
    <v-btn
      fab
      class="primary close-btn-xs hidden-sm-and-up"
      @click="$emit('overlay-close')"
    >
      <v-icon> $mdiClose </v-icon>
    </v-btn>
  </v-overlay>
</template>

<script>
export default {
  props: {
    overlay: {
      type: Boolean,
      default: false,
    },
    videoSrc: {
      type: String,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.video-container {
  overflow: hidden;
  position: relative;
  width: 60vw;
  max-width: 720px;
}

.close-btn {
  position: absolute;
  right: -18px;
  top: -18px;
  z-index: 5;
}

.close-btn-xs {
  position: absolute;
  bottom: -90px;
  left: calc(50% - 28px);
}

.video-container::after {
  padding-top: 56.25%;
  display: block;
  content: '';
}

.video-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

@media only screen and (max-width: 599px) {
  .video-container {
    width: 96vw !important;
  }
}
</style>
