<template>
  <div class="d-flex align-center justify-center">
    <v-btn
      v-if="slides.length > slidesToShow"
      class="mr-2"
      icon
      @click.stop="moveCarousel(false)"
    >
      <v-icon large> $mdiChevronLeft </v-icon>
    </v-btn>
    <div class="card-carousel">
      <v-row
        v-touch="swipe"
        :style="{ transform: `translateX(${offsetX}%)` }"
        class="card-carousel-cards flex-nowrap flex-grow-0"
        @mouseover="stopCarousel"
        @mouseleave="startCarousel"
      >
        <v-col
          v-for="(item, index) in slides"
          :key="`${item.title ? item.title : slideType}_${index}`"
          :cols="12 / slidesToShow"
        >
          <Testimonial
            v-if="slideType === 'testimonial'"
            :card-color="cardColor"
            :testimonial="item"
          />
          <template v-else-if="slideType === 'media'">
            <v-hover v-if="item.vidsrc" v-slot="{ hover }">
              <v-card raised @click.stop="onVideoClick(index)">
                <v-img
                  :aspect-ratio="aspectRatio"
                  :src="item.src"
                  gradient="to top right, rgba(100,100,100,.33), rgba(100,100,100,.33)"
                >
                  <v-row
                    class="fill-height align-center justify-center"
                    no-gutters
                  >
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
            <v-card
              v-else-if="item.href"
              class="bg--lighter"
              raised
              :href="item.href"
              target="_blank"
            >
              <v-img :aspect-ratio="aspectRatio" :src="item.src" contain />
            </v-card>
            <v-card v-else class="bg--lighter" raised>
              <v-img :aspect-ratio="aspectRatio" :src="item.src" contain />
            </v-card>
          </template>
        </v-col>
      </v-row>
    </div>
    <v-btn
      v-if="slides.length > slidesToShow"
      class="ml-2"
      icon
      @click.stop="moveCarousel(true)"
    >
      <v-icon large> $mdiChevronRight </v-icon>
    </v-btn>
    <VideoEmbedOverlay
      v-if="overlay"
      :overlay="overlay"
      :video-src="slides[activeIdx].vidsrc"
      @overlay-close="overlay = false"
    />
  </div>
</template>

<script>
export default {
  props: {
    slides: {
      type: Array,
      required: true,
    },
    sectionBgColor: {
      type: String,
      required: true,
    },
    slideType: {
      type: String,
      required: true,
    },
    slidesPerScreen: {
      type: Number,
      default: 1,
    },
    aspectRatio: {
      type: Number,
      default: 16 / 9,
    },
  },
  data() {
    return {
      cycleTime: 6000,
      currentIndex: 0,
      offsetX: 0,
      intervalTimer: -1,
      swipe: {
        left: () => this.moveCarousel(true),
        right: () => this.moveCarousel(false),
      },
      overlay: false,
      activeIdx: 0,
    }
  },
  computed: {
    cardColor() {
      return this.sectionBgColor === 'lighter' ? 'white' : 'lighter'
    },
    slidesToShow() {
      let numSlides = this.slidesPerScreen
      if (this.$vuetify.breakpoint.xsOnly) {
        numSlides = 1
      }

      return numSlides
    },
  },
  mounted() {
    this.$forceUpdate()
    this.startCarousel()
  },
  beforeDestroy() {
    this.stopCarousel()
  },
  methods: {
    onVideoClick(index) {
      this.activeIdx = index
      this.overlay = true
    },
    stopCarousel() {
      if (this.intervalTimer !== -1) {
        clearInterval(this.intervalTimer)
        this.intervalTimer = -1
      }
    },
    startCarousel() {
      if (this.slides.length > this.slidesToShow) {
        this.intervalTimer = setInterval(() => {
          this.moveCarousel(true, true)
        }, this.cycleTime)
      }
    },
    moveCarousel(forward, auto) {
      if (this.slides.length > this.slidesToShow) {
        if (!auto) {
          this.stopCarousel()
        }

        if (forward) {
          this.currentIndex =
            this.currentIndex < this.slides.length - this.slidesToShow
              ? this.currentIndex + 1
              : 0
        } else {
          this.currentIndex =
            this.currentIndex > 0
              ? this.currentIndex - 1
              : this.slides.length - this.slidesToShow
        }

        this.offsetX = -this.currentIndex * (100 / this.slidesToShow)

        if (!auto) {
          this.startCarousel()
        }
      } else {
        this.stopCarousel()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.card-carousel {
  overflow: hidden;
  width: 100%;
}

.card-carousel-cards {
  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
}

.play-btn {
  transition: 0.3s all cubic-bezier(0.455, 0.03, 0.515, 0.955);
}

.play-btn--hovered {
  transform: scale(1.2);
}
</style>
