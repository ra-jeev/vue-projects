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
        <PolicySection
          v-if="section.type === 'policy'"
          :policy-text="section.description"
        />
      </v-container>
    </section>
  </div>
</template>

<script>
import Privacy from '@/assets/data/privacy'
import sectionSanitizer from '@/mixins/sectionSanitizer'

export default {
  mixins: [sectionSanitizer],
  data() {
    return {
      sections: Privacy.sections,
      title: 'Our Privacy Policy',
      description: `We care about your privacy. Our privacy policy will help you understand what information is collected, how it is used, and what choices you have.`,
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
          content: 'https://www.jrinlab.com/privacy',
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
