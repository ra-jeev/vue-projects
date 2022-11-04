<template>
  <div>
    <h2 class="section__header text-center">
      {{ header }}
    </h2>
    <v-row class="mt-12" justify="center">
      <v-col
        v-for="(contact, index) in contacts"
        :key="`contact_${contact.type}_${index}`"
        cols="12"
        sm="5"
        md="3"
      >
        <v-hover v-slot="{ hover }">
          <v-card
            :href="`${contact.type === 'email' ? 'mailto' : 'tel'}:${
              contact.value
            }`"
            :raised="hover"
          >
            <v-list-item>
              <v-list-item-avatar size="56" color="primary">
                <v-icon color="white" large>
                  {{ contact.type === 'phone' ? '$mdiPhone' : '$mdiEmail' }}
                </v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-subtitle v-text="contact.title" />
                <v-list-item-title class="contact" v-text="contact.value" />
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-hover>
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
    contacts: {
      type: Array,
      required: true,
    },
  },
}
</script>

<style scoped>
.contact {
  font-size: 1.125rem !important;
  font-weight: 500;
  line-height: 1.625rem;
  text-decoration: underline;
}
</style>
