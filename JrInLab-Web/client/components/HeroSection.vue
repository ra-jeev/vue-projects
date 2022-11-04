<template>
  <v-row :no-gutters="noGutters" align="center">
    <v-col order-sm="last" cols="12" sm="6">
      <v-img :src="image.src" :alt="image.alt" :height="image.height" contain />
    </v-col>
    <v-col class="bg-shapes" cols="12" sm="6">
      <h1 v-if="title" class="section__header">
        {{ title }}
      </h1>
      <div
        v-if="description"
        class="section__description mt-4"
        v-html="$md.render(description)"
      />
      <CtaBtn
        v-if="cta"
        :btn-text="cta.text"
        :color="cta.color"
        :to="cta.action"
        class="mt-6"
        make-extra-long
        x-large
      />
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    noGutters: {
      type: Boolean,
      default: false,
    },
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
      default: null,
    },
    cta: {
      type: Object,
      default: undefined,
    },
  },
}
</script>

<style scoped>
.bg-shapes {
  background: url('~assets/images/bg_shape.svg');
  background-repeat: no-repeat;
  background-size: contain;
}
</style>
