<template>
  <v-img :alt="image.alt" :src="image.src" max-width="95vw">
    <v-row v-if="image.caption" align="end" class="fill-height" no-gutters>
      <v-col class="image-caption px-4 py-3 text-center">
        {{ image.caption }}
      </v-col>
    </v-row>
  </v-img>
</template>

<script>
export default {
  props: {
    image: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style scoped>
.image-caption {
  background-color: rgba(0, 0, 0, 0.3);
  color: white;
  font-size: 1.125rem;
  line-height: 1.375rem;
}
</style>
