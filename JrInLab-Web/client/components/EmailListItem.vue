<template>
  <div>
    <v-list-item :href="`mailto:${emailAddress}`">
      <v-list-item-avatar v-if="showAvatar" color="primary" tile>
        <v-icon size="28"> $mdiEmail </v-icon>
      </v-list-item-avatar>
      <v-list-item-action v-else />
      <v-list-item-content>
        <v-list-item-subtitle v-text="emailLabel" />
        <v-list-item-title v-text="emailAddress" />
      </v-list-item-content>
    </v-list-item>
  </div>
</template>

<script>
export default {
  props: {
    emailAddress: {
      type: String,
      required: true,
    },
    emailLabel: {
      type: String,
      required: true,
    },
    showAvatar: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
