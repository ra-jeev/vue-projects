<template>
  <div>
    <h2 class="section__header text-center">
      {{ header }}
    </h2>
    <h3 v-if="subheader" class="section__subheader text-center mt-3">
      {{ subheader }}
    </h3>
    <v-row justify="center" class="mt-8">
      <v-col cols="12" md="10" lg="9">
        <FaqsList :faqs="faqs" :section-bg-color="sectionBgColor" />
      </v-col>
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
      default: undefined,
    },
    faqs: {
      type: Array,
      required: true,
    },
    sectionBgColor: {
      type: String,
      default: 'white',
    },
  },
}
</script>
