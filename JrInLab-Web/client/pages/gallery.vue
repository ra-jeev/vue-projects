<template>
  <div>
    <section
      v-for="section in sections"
      :key="`section_${section.name}`"
      :class="`bg--${section.background}`"
      class="section"
    >
      <v-container>
        <HeroSection
          v-if="section.type === 'hero'"
          :image="section.image"
          :title="section.title"
          :description="section.description"
        />
        <GallerySection
          v-if="section.type === 'gallery' || section.type === 'videoGallery'"
          :header="section.title"
          :media="section.media"
          @click-image="onShowImage"
        />
      </v-container>
    </section>
    <v-overlay :value="overlay" opacity="0.8">
      <v-btn
        fab
        large
        fixed
        depressed
        color="transparent"
        right
        top
        @click="
          activeIdx = 0
          overlay = false
        "
      >
        <v-icon> $mdiClose </v-icon>
      </v-btn>
      <Carousel
        :images="galleryImages"
        :width="960"
        :height="540"
        :active-index="activeIdx"
        :has-caption="true"
        class="hidden-xs-only"
      />
      <CaptionedImage
        :image="galleryImages[activeIdx]"
        class="hidden-sm-and-up"
      />
    </v-overlay>
  </div>
</template>

<script>
import Gallery from '@/assets/data/gallery'
import sectionSanitizer from '@/mixins/sectionSanitizer'

export default {
  mixins: [sectionSanitizer],
  data() {
    return {
      sections: Gallery.sections,
      overlay: false,
      activeIdx: 0,
      galleryImages: [],
      title: 'Photo & Projects Gallery',
      description:
        'Pictures of our interactions with kids from different age groups. Also listed are the videos of some of the projects created by our students.',
    }
  },
  head() {
    return {
      title: this.title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.description,
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.title,
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.description,
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: 'https://www.jrinlab.com/gallery',
        },
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: this.title,
        },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: this.description,
        },
      ],
    }
  },
  mounted() {
    this.sanitizeSections()
    const gallerySection = this.sections.find(
      (section) => section.type === 'gallery'
    )
    if (gallerySection) {
      this.galleryImages.push(...gallerySection.media)
    }
  },
  methods: {
    onShowImage(index) {
      this.activeIdx = index
      this.overlay = true
    },
  },
}
</script>
