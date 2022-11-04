<template>
  <div>
    <h2 class="section__header text-center">
      {{ title }}
    </h2>
    <v-row v-if="subtitle" justify="center" class="mt-2">
      <v-col cols="12" sm="8">
        <h3 class="section__subheader text-center">
          {{ subtitle }}
        </h3>
      </v-col>
    </v-row>
    <v-row justify="center" class="mt-12">
      <v-col
        v-for="(card, index) in cards"
        :key="`${card.title}_${index}`"
        cols="12"
        sm="4"
      >
        <v-card class="section-card">
          <div
            v-if="!avatarCard"
            :class="padCardImage ? 'section-card__img--padded' : ''"
            class="section-card__img"
          >
            <v-img
              :src="card.image.src"
              :alt="card.image.alt"
              :height="card.image.height"
              max-width="100%"
              contain
            />
          </div>
          <div v-else class="d-flex justify-center section-card__img py-12">
            <v-avatar :size="card.image.height">
              <v-img :src="card.image.src" :alt="card.image.alt" />
            </v-avatar>
          </div>
          <v-card-title v-text="card.title" />
          <v-card-subtitle v-if="card.subtitle" v-text="card.subtitle" />
          <v-card-text
            class="markdown-text"
            v-html="$md.render(card.description)"
          />
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      default: null,
    },
    cards: {
      type: Array,
      required: true,
    },
    padCardImage: {
      type: Boolean,
      default: false,
    },
    avatarCard: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
