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
        <TextSection
          v-if="section.type === 'text'"
          :header="section.title"
          :description="section.description"
        />
        <CardsSection
          v-if="section.type === 'cards'"
          :title="section.title"
          :cards="section.cards"
          :pad-card-image="section.padCardImage"
          :avatar-card="section.avatar"
        />
      </v-container>
    </section>
  </div>
</template>

<script>
import About from '@/assets/data/about'
import sectionSanitizer from '@/mixins/sectionSanitizer'

export default {
  mixins: [sectionSanitizer],
  data() {
    return {
      sections: About.sections,
      title: 'Our story',
      description:
        'Information about the company EdulabTech Pvt. Ltd., how we came together to fill the gap in our education system, and what drives us in our mission.',
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
          content: 'https://www.jrinlab.com/about-us',
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
  },
}
</script>
