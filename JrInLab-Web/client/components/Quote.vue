<template>
  <v-card class="quote-card">
    <v-icon class="quote-icon elevation-2" size="48">
      $mdiFormatQuoteOpen
    </v-icon>
    <v-card-text class="quote-text pb-0"> "{{ quote.text }}" </v-card-text>
    <v-list two-line>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>{{ quote.author.name }}</v-list-item-title>
          <v-list-item-subtitle>
            {{ quote.author.company }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
export default {
  props: {
    quote: {
      type: Object,
      required: true,
    },
  },
}
</script>
