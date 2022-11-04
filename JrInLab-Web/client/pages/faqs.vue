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
        <FaqSection
          v-if="section.type === 'faqs'"
          :header="section.title"
          :section-bg-color="section.background"
          :subheader="section.subtitle"
          :faqs="section.faqs"
        />
        <template v-if="section.type === 'offering'">
          <h2 class="section__header text-center">{{ section.title }}</h2>
          <CoursesOffering class="mt-6" />
        </template>
      </v-container>
    </section>
  </div>
</template>

<script>
import FaqData from '@/assets/data/faqs'
import sectionSanitizer from '@/mixins/sectionSanitizer'

export default {
  mixins: [sectionSanitizer],
  data() {
    return {
      sections: FaqData.sections,
      title: 'Frequently Asked Questions',
      description:
        'Get answers to some of the most frequently asked questions by students, and the parents. You can always contact us for any query which is not listed here.',
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
          content: 'https://www.jrinlab.com/faqs',
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
