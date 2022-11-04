<template>
  <div>
    <h2 class="section__header text-center">
      {{ header }}
    </h2>
    <v-row justify="center" class="mt-12">
      <v-col
        v-for="(mediaItem, index) in media"
        :key="`${header}_media_${index}`"
        sm="4"
      >
        <v-hover v-if="mediaItem.vidsrc" v-slot="{ hover }">
          <v-card raised @click.stop="onVideoClick(index)">
            <v-img
              :src="mediaItem.src"
              contain
              gradient="to top right, rgba(100,100,100,.33), rgba(100,100,100,.33)"
            >
              <v-row class="fill-height align-center justify-center" no-gutters>
                <v-btn
                  :class="{ 'play-btn--hovered': hover }"
                  aria-label="Play Video"
                  fab
                  color="primary"
                  class="play-btn"
                >
                  <v-icon x-large v-text="'$mdiPlay'" />
                </v-btn>
              </v-row>
            </v-img>
          </v-card>
        </v-hover>
        <v-hover v-else v-slot="{ hover }">
          <v-card tile @click="onImageClick(index)">
            <v-img :src="mediaItem.src" :alt="mediaItem.alt" contain>
              <v-fade-transition>
                <v-row
                  v-if="hover"
                  align="end"
                  class="fill-height image-caption"
                  no-gutters
                >
                  <v-col class="px-4 py-3">
                    {{ mediaItem.caption }}
                  </v-col>
                </v-row>
              </v-fade-transition>
            </v-img>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
    <VideoEmbedOverlay
      v-if="overlay"
      :overlay="overlay"
      :video-src="media[activeIdx].vidsrc"
      @overlay-close="overlay = false"
    />
  </div>
</template>

<script>
export default {
  props: {
    header: {
      type: String,
      required: true,
    },
    media: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      activeIdx: 0,
      overlay: false,
    }
  },
  methods: {
    onVideoClick(index) {
      this.activeIdx = index
      this.overlay = true
    },
    onImageClick(index) {
      this.$emit('click-image', index)
    },
  },
}
</script>

<style scoped>
.image-caption {
  background-image: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.48),
    rgba(0, 0, 0, 0)
  );
  color: white;
  font-size: 1.125rem;
  line-height: 1.375rem;
}

.play-btn {
  transition: 0.3s all cubic-bezier(0.455, 0.03, 0.515, 0.955);
}

.play-btn--hovered {
  transform: scale(1.2);
}
</style>
