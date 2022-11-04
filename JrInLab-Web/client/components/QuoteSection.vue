<template>
  <v-row :justify="title ? 'space-between' : 'center'" align="center">
    <v-col
      :order-sm="alignLeft ? 'first' : 'last'"
      :sm="!title ? '8' : '5'"
      cols="12"
    >
      <div class="pa-2">
        <Quote :quote="quote" />
      </div>
    </v-col>
    <v-col v-if="title" sm="6" cols="12">
      <TitleDescription :title="title" :description="description" :cta="cta" />
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: null,
    },
    quote: {
      type: Object,
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
