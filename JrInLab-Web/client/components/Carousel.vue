<template>
  <v-row no-gutters justify="center">
    <v-card :width="width" max-width="90vw">
      <v-carousel
        v-model="carouselIndex"
        :height="height"
        :hide-delimiters="hasCaption"
        class="grey lighten-3"
      >
        <v-carousel-item
          v-for="(image, idx) in images"
          :key="`carousel_images_${idx}`"
        >
          <CaptionedImage :image="image" />
        </v-carousel-item>
      </v-carousel>
    </v-card>
  </v-row>
</template>

<script>
export default {
  props: {
    images: {
      type: Array,
      required: true,
    },
    width: {
      type: Number,
      default: 640,
    },
    height: {
      type: Number,
      default: 360,
    },
    activeIndex: {
      type: Number,
      default: 0,
    },
    hasCaption: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      carouselIndex: this.activeIndex,
    }
  },
}
</script>
