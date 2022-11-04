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
          :cta="section.cta"
          :description="section.description"
          :image="section.image"
          :title="section.title"
        />
        <TextSection
          v-if="section.type === 'text'"
          :header="section.title"
          :description="section.description"
        />
        <template v-if="section.type === 'info-cards'">
          <div>
            <h2 class="section__header text-center">
              {{ section.title }}
            </h2>
            <v-row justify="space-between" class="mt-12">
              <v-col
                v-for="(card, index) in section.cards"
                :key="`${card.title}_${index}`"
                cols="12"
                md="2"
                sm="3"
              >
                <v-card class="section-card" outlined>
                  <div class="pa-4">
                    <v-img
                      :src="card.image.src"
                      :alt="card.image.alt"
                      :height="card.image.height"
                      max-width="100%"
                      contain
                    />
                  </div>
                  <v-card-title
                    class="card-title justify-center mt-4"
                    v-text="card.title"
                  />
                </v-card>
              </v-col>
            </v-row>
          </div>
        </template>
        <InfoSection
          v-if="section.type === 'info'"
          :title="section.title"
          :info-items="section.cards"
          :cta="section.cta"
        />
        <PictorialSection
          v-if="section.type === 'pictorial'"
          :title="section.title"
          :description="section.description"
          :image="section.image"
          :align-left="section.alignLeft"
          :cta="section.cta"
        />
        <template v-if="section.type === 'form'">
          <h2 id="form" class="section__header text-center">
            {{ section.title }}
          </h2>
          <v-row align="center" justify="center" class="mt-12">
            <v-col sm="5" class="hidden-xs-only bg-shapes">
              <v-img
                :src="require('~/assets/images/agreement.svg')"
                alt="agreement"
                height="360"
                contain
              />
            </v-col>
            <v-col sm="5" cols="12">
              <PartnershipForm />
            </v-col>
          </v-row>
        </template>
        <CarouselSection
          v-if="section.type === 'carousel'"
          :cta="section.cta"
          :header="section.title"
          :media="section.media"
          :section-bg-color="section.background"
          :subheader="section.subtitle"
        />
      </v-container>
    </section>
  </div>
</template>

<script>
import SchoolPartnerships from '@/assets/data/schools'
import sectionSanitizer from '@/mixins/sectionSanitizer'

export default {
  mixins: [sectionSanitizer],
  data() {
    return {
      sections: SchoolPartnerships.sections,
      title: 'Tech Clubs for Schools',
      description:
        "JrInLab's one stop solution for schools for their STEM education requirements, providing them with the best curriculum, access to experts & mentorship to students.",
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
          content: 'https://www.jrinlab.com/school-partnerships',
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

<style scoped>
.card-title {
  font-size: 1.125rem;
  line-height: 1.25;
  text-align: center;
}
</style>
