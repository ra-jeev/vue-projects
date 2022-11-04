<template>
  <div>
    <h2 class="section__header text-center">
      {{ header }}
    </h2>
    <h3 v-if="subheader" class="section__subheader text-center mt-3">
      {{ subheader }}
    </h3>
    <v-row justify="center" class="mt-8">
      <v-btn :color="cta.color" x-large width="240" @click.stop="onCtaClick">
        {{ cta.text }}
      </v-btn>
    </v-row>
  </div>
</template>

<script>
export default {
  props: {
    header: {
      type: String,
      required: true,
    },
    subheader: {
      type: String,
      default: null,
    },
    cta: {
      type: Object,
      required: true,
    },
  },
  methods: {
    onCtaClick() {
      this.$router.push({
        name: 'contact-us',
        params: { scrollTarget: '#section_form' },
      })
    },
  },
}
</script>
