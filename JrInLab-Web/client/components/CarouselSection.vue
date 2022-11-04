<template>
  <div>
    <h2 v-if="header" class="section__header text-center">
      {{ header }}
    </h2>
    <h3 v-if="subheader" class="section__subheader text-center mt-3">
      {{ subheader }}
    </h3>
    <CardCarousel
      :section-bg-color="sectionBgColor"
      :slides="media"
      :slides-per-screen="2"
      class="mt-10"
      slide-type="media"
    />
    <!-- <v-row v-if="cta" no-gutters justify="center" class="mt-10">
      <CtaBtn
        :btn-text="cta.text"
        :color="cta.color"
        :to="`/${cta.action}`"
        large
      />
    </v-row> -->
  </div>
</template>

<script>
export default {
  props: {
    header: {
      type: String,
      default: null,
    },
    subheader: {
      type: String,
      default: null,
    },
    media: {
      type: Array,
      required: true,
    },
    cta: {
      type: Object,
      default: undefined,
    },
    sectionBgColor: {
      type: String,
      required: true,
    },
  },
}
</script>
