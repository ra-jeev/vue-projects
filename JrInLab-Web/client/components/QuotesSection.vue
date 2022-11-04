<template>
  <div>
    <h2 class="section__header text-center">
      {{ header }}
    </h2>
    <h3 v-if="subheader" class="section__subheader text-center mt-3">
      {{ subheader }}
    </h3>
    <v-row justify="center" class="mt-12 pt-4">
      <v-col
        v-for="(quote, index) in quotes"
        :key="`quote_${index}`"
        cols="12"
        sm="4"
      >
        <Quote :quote="quote" />
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
      default: null,
    },
    quotes: {
      type: Array,
      required: true,
    },
  },
}
</script>
