<template>
  <v-row align="center" no-gutters>
    <v-icon
      v-if="labelIcon"
      :class="labelIconColor"
      class="pa-1"
      left
      size="24"
    >
      {{ labelIcon }}
    </v-icon>
    <span>{{ label }}</span>
    <v-chip-group class="ml-2" column>
      <v-chip
        v-for="chip in chips"
        v-bind="$attrs"
        :key="chip"
        class="font-weight-medium"
        label
        small
      >
        {{ typeof chip === 'string' ? chip.toUpperCase() : chip }}
      </v-chip>
    </v-chip-group>
  </v-row>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    label: {
      type: String,
      required: true,
    },
    labelIcon: {
      type: String,
      default: undefined,
    },
    labelIconColor: {
      type: String,
      default: 'primary',
    },
    chips: {
      type: Array,
      required: true,
    },
  },
}
</script>
