<template>
  <div>
    <h2 class="section__header text-center">
      {{ header }}
    </h2>
    <v-row justify="center" class="mt-8">
      <v-col cols="12">
        <v-slide-group v-model="activeItem" center-active mandatory show-arrows>
          <v-slide-item
            v-for="(image, index) in images"
            :key="`news_${index}`"
            class="ma-2"
          >
            <v-row>
              <v-card
                :img="image.src"
                :alt="image.alt"
                :href="image.url"
                :max-height="image.height"
                width="640"
                max-width="100%"
              />
            </v-row>
          </v-slide-item>
        </v-slide-group>
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
    images: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      activeItem: 0,
    }
  },
}
</script>
