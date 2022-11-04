<template>
  <div class="pa-2">
    <h2 class="section__header" v-html="title" />
    <div class="section__description mt-8" v-html="$md.render(description)" />
    <CtaBtn
      v-if="cta"
      :btn-text="cta.text"
      :color="cta.color"
      :to="cta.action"
      class="mt-10"
      make-extra-long
      x-large
    />
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    cta: {
      type: Object,
      default: undefined,
    },
  },
}
</script>
