<template>
  <div>
    <h2 class="section__header text-center">
      {{ header }}
    </h2>
    <v-row justify="center">
      <v-col cols="12" sm="10" md="8" class="mt-6">
        <div class="section__description" v-html="$md.render(description)" />
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
    description: {
      type: String,
      required: true,
    },
  },
}
</script>
