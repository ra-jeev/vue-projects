<template>
  <v-row class="policy-section" justify="center">
    <v-col cols="12" md="10">
      <v-card>
        <v-card-text class="pa-8 policy-text" v-html="$md.render(policyText)" />
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    policyText: {
      type: String,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.policy-section {
  margin-top: -3.5rem;

  ::v-deep .policy-text {
    font-size: 1rem;

    h1,
    h2,
    h3 {
      margin-top: 24px;
      margin-bottom: 16px;
    }

    ul {
      margin-bottom: 16px;
    }

    p:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
