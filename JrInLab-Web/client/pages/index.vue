<template>
  <div>
    <section>
      <v-img
        :src="heroImage.src"
        :lazy-src="heroImage.lazy_src"
        :alt="heroImage.alt"
        :gradient="heroImage.gradient"
        :height="heroImage.height"
      >
        <v-container fill-height class="hero">
          <v-row align="center">
            <v-col cols="12" sm="8" lg="6">
              <div class="hero__title" v-text="mainCopy.punchline" />
              <h1 class="hero__subtitle mt-2" v-text="mainCopy.subtext" />
              <div class="hero__description mt-12" v-text="mainCopy.text" />
              <CtaBtn
                :btn-text="mainCopy.cta_text"
                make-extra-long
                color="secondary"
                x-large
                class="mt-12"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-img>
    </section>
    <section
      v-for="section in sections"
      :key="`section_${section.name}`"
      :class="`bg--${section.background}`"
      class="section"
    >
      <v-container>
        <CardsSection
          v-if="section.type === 'cards'"
          :avatar-card="section.avatar"
          :cards="section.cards"
          :pad-card-image="section.padCardImage"
          :subtitle="section.subtitle"
          :title="section.title"
        />
        <PictorialSection
          v-if="section.type === 'pictorial'"
          :title="section.title"
          :description="section.description"
          :image="section.image"
          :align-left="section.alignLeft"
          :cta="section.cta"
        />
        <InfoSection
          v-if="section.type === 'info'"
          :title="section.title"
          :info-items="section.cards"
          :cta="section.cta"
        />
        <CarouselSection
          v-if="section.type === 'carousel'"
          :cta="section.cta"
          :header="section.title"
          :media="section.media"
          :section-bg-color="section.background"
          :subheader="section.subtitle"
        />
        <QuotesSection
          v-if="section.type === 'quotes'"
          :header="section.title"
          :subheader="section.subtitle"
          :quotes="section.quotes"
        />
        <template v-if="section.type === 'testimonials'">
          <h2 class="section__header text-center">
            {{ section.title }}
          </h2>
          <h3
            v-if="section.subtitle"
            class="section__subheader text-center mt-3"
          >
            {{ section.subtitle }}
          </h3>
          <CardCarousel
            :section-bg-color="section.background"
            :slides="section.testimonials"
            :slides-per-screen="2"
            class="mt-12"
            slide-type="testimonial"
          />
        </template>
      </v-container>
    </section>
  </div>
</template>

<script>
import homeJson from '@/assets/data/home'
import sectionSanitizer from '@/mixins/sectionSanitizer'

export default {
  mixins: [sectionSanitizer],
  layout: 'home',
  data() {
    return {
      mainCopy: homeJson.main.copy,
      heroImage: homeJson.main.hero_image,
      sections: homeJson.sections,
    }
  },
  head() {
    return {
      script: [
        {
          hid: 'netlify-identity',
          src: 'https://identity.netlify.com/v1/netlify-identity-widget.js',
          async: true,
          defer: true,
          callback: () => {
            if (window.netlifyIdentity) {
              window.netlifyIdentity.on('init', (user) => {
                if (!user) {
                  window.netlifyIdentity.on('login', () => {
                    document.location.href = '/admin/cms'
                  })
                }
              })
            }
          },
        },
      ],
      meta: [
        {
          hid: 'og:image',
          property: 'og:image',
          content: `https://www.jrinlab.com${this.heroImage.src}`,
        },
        {
          hid: 'og:image:alt',
          property: 'og:image:alt',
          content: this.heroImage.alt,
        },
        {
          hid: 'twitter:image',
          name: 'twitter:image',
          content: `https://www.jrinlab.com${this.heroImage.src}`,
        },
        {
          hid: 'twitter:image:alt',
          name: 'twitter:image:alt',
          content: this.heroImage.alt,
        },
      ],
    }
  },
  created() {
    this.sanitizeSections()
    if (this.heroImage.src.indexOf('/assets') === 0) {
      this.heroImage.src = require(`~/assets/images/${
        this.heroImage.src.split('/assets/images/')[1]
      }`)
    }
  },
  beforeMount() {
    if (this.$route.query.ref === 'sg-summer-camp') {
      localStorage.summer_camp = 'sg'
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~/assets/colors.scss';

.hero {
  color: white;

  .hero__title {
    font-size: 4rem;
    font-weight: 700;
    line-height: 4rem;
    letter-spacing: -0.0083333333em !important;
  }

  .hero__subtitle {
    font-size: 1.325rem !important;
    line-height: 1.5rem;
    font-weight: 500;
  }

  .hero__description {
    font-size: 1.125rem !important;
    line-height: 1.5rem;
  }
}

@media only screen and (max-width: 599px) {
  .hero {
    text-align: center;

    .hero__title {
      font-size: 2.75rem;
      line-height: 3rem;
    }

    .hero__subtitle {
      font-size: 1.125rem;
      line-height: 1.375rem;
    }

    .hero__description {
      font-size: 1rem;
      line-height: 1.375rem;
    }
  }
}
</style>
