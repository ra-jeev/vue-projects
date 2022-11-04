<template>
  <v-card color="grey darken-3">
    <v-card-title class="justify-center"> School Request Info </v-card-title>
    <v-divider />
    <v-card-text class="px-0">
      <v-list-item class="mb-2">
        <v-list-item-avatar size="56">
          <v-img
            :src="require('~/assets/images/profile_pic.svg')"
            alt="Profile pic"
          />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="title">
            {{ request.name }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ request.role }}, {{ request.school }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider class="mt-3 mb-2" />

      <v-list-item :href="`tel:${getPhoneNo}`">
        <v-list-item-avatar color="primary" tile>
          <v-icon size="28"> $mdiPhone </v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-subtitle v-text="`Mobile No.`" />
          <v-list-item-title>
            {{ getPhoneNo }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <template v-if="request.message">
        <v-divider class="my-2" />

        <v-list-item>
          <v-list-item-content>
            <v-list-item-subtitle v-text="'Message'" />

            <v-list-item-title style="white-space: normal">
              {{ request.message }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    request: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {}
  },
  computed: {
    getPhoneNo() {
      let completePhone = ''
      if (this.request.country) {
        completePhone += this.request.country.dialCode + '-'
      }

      completePhone += this.request.phone

      return completePhone
    },
  },
}
</script>

<style>
.whatsapp {
  background-color: #46ca5e !important;
}
</style>
