<template>
  <v-row align="center" justify="space-between">
    <v-col :order-sm="alignLeft ? 'first' : 'last'" sm="5" cols="12">
      <v-img :src="image.src" :alt="image.alt" :height="image.height" contain />
    </v-col>
    <v-col sm="6" cols="12">
      <TitleDescription :title="title" :description="description" :cta="cta" />
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    image: {
      type: Object,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    alignLeft: {
      type: Boolean,
      default: true,
    },
    cta: {
      type: Object,
      default: undefined,
    },
  },
}
</script>
