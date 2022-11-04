<template>
  <marketing-container>
    <template #header-bg>
      <div class="header-bg" />
    </template>

    <template #default>
      <div class="card-inner-container">
        <h1 class="page-headline">
          5 Days #webdev Workshop for kids <small>(10+ years)</small>
        </h1>
        <v-row id="form">
          <v-col cols="12" sm="6">
            <v-card class="form-container" flat>
              <div>
                <register-form
                  :laptop-mandatory="false"
                  :workshop-fee="0"
                  btn-text="Submit Now"
                  btn-color="secondary"
                  form-page="web-dev-workshop"
                  success-page="/camp-booking-done"
                  class="mt-4"
                  workshop-name="#webdev"
                  direct-enroll
                />
              </div>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6" order-sm="first">
            <v-card flat class="assertions-container transparent">
              <div
                v-for="(benefit, index) in benefits"
                :key="`benefit_${index}`"
                class="assertion"
              >
                <img :src="benefit.icon" height="84" />
                <div class="assertion-title" v-text="benefit.title" />
                <div
                  class="assertion-text grey--text text--darken-3"
                  v-text="benefit.description"
                />
              </div>
              <v-btn
                class="mt-6 uncased-btn hidden-sm-and-up"
                large
                rounded
                block
                color="secondary"
                @click="$vuetify.goTo('#form')"
              >
                Get your spot now
              </v-btn>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </template>
    <template #details>
      <div class="section bg--lighter">
        <v-container>
          <h2 class="section__header text-center">
            Some of our students' websites
          </h2>
          <h3 class="section__subheader mt-2 text-center">
            Websites created just after 4-5 days of basic HTML learning during
            various camps (click/tap to visit the websites)
          </h3>
          <card-carousel
            :aspect-ratio="1.91"
            :slides="websites"
            :slides-per-screen="2"
            class="mt-12"
            section-bg-color="white"
            slide-type="media"
          />
          <v-row class="mt-10" justify="center" no-gutters>
            <v-btn
              large
              rounded
              color="secondary"
              @click="$vuetify.goTo('#form')"
            >
              Get your free website now
              <v-icon right> $mdiCreation </v-icon>
            </v-btn>
          </v-row>
        </v-container>
      </div>
    </template>
  </marketing-container>
</template>

<script>
export default {
  layout: 'marketing',
  data() {
    return {
      benefits: [
        {
          icon: require('~/assets/images/web_developer.svg'),
          title: `Learn the basics of web development`,
          description: `You'll learn what webpages & websites are, and how you can create a basic one for yourself.`,
        },
        {
          icon: require('~/assets/images/static_website.svg'),
          title: `Code & get your own live website`,
          description: `At the end of the camp you'll also learn how to host your website online, absolutely free of cost.`,
        },
        {
          icon: require('~/assets/images/certificate.svg'),
          title: `Camp participation certificate`,
          description: `All students who complete the workshop will receive a participation certificate.`,
        },
      ],
      websites: [
        {
          src: require('~/assets/images/websites/rishabh.png'),
          alt: 'Webpage by Rishabh, from Govt. School, Karnal, stressing on the need to save environment',
          href: 'https://rishabh.jrinlab.com',
        },
        {
          src: require('~/assets/images/websites/allaboutsudhamurthy.png'),
          alt: 'Webpage by Nikhita, from 21K School, about Ms Sudha Murthy',
          href: 'https://allaboutsudhamurthy.jrinlab.com',
        },
        {
          src: require('~/assets/images/websites/savemarinelife.png'),
          alt: 'Webpage by Nikhila, from 21K School, on how to save marine life',
          href: 'https://savethemarinelife.jrinlab.com',
        },
        {
          src: require('~/assets/images/websites/anshita-pgl.png'),
          alt: 'Webpage by Ankit, from Govt. School, Karnal, on management basics',
          href: 'https://anshita-pgl.jrinlab.com',
        },
        {
          src: require('~/assets/images/websites/introfalightmotion.png'),
          alt: 'Webpage by Atharv, from MPS School, Agra, on how to Alight Motion for editing',
          href: 'https://introfalightmotion.jrinlab.com',
        },
        {
          src: require('~/assets/images/websites/cellularrespiration.png'),
          alt: 'Webpage by Shivoham, from 21K School, on cellular respiration topic',
          href: 'https://cellularrespiration.jrinlab.com',
        },
      ],
      socialImage: `https://www.jrinlab.com${require('~/assets/images/hero-image.jpg')}`,
      title:
        '5 Days web development workshop for kids (10+ years) conducted online by JrInLab',
      description: `Learn the basics of web development, what is HTML and styling etc. Host your own live website free of cost with JrInLab's web dev workshop`,
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
          hid: 'robots',
          name: 'robots',
          content: 'noindex',
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
          hid: 'og:image',
          property: 'og:image',
          content: this.socialImage,
        },
        {
          hid: 'og:image:alt',
          property: 'og:image:alt',
          content: 'A boy doing block coding on his tablet computer',
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
        {
          hid: 'twitter:image',
          name: 'twitter:image',
          content: this.socialImage,
        },
        {
          hid: 'twitter:image:alt',
          name: 'twitter:image:alt',
          content: 'A boy doing block coding on his tablet computer',
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
.uncased-btn {
  text-transform: none;
}

.card-inner-container {
  padding: 16px;
}

.header-bg {
  background: url('~assets/images/rocket-pattern.svg'),
    linear-gradient(
      to bottom left,
      rgba(107, 99, 255, 0.3),
      rgba(40, 56, 203, 0.6)
    ),
    #6c63ff;
  height: 500px;
}

.page-headline {
  font-size: 2rem;
  font-weight: 500;
  padding: 8px 0 24px;
  text-align: center;
}

.form-container,
.assertions-container {
  padding: 12px 24px;
}

.form-title {
  font-size: 1.25rem !important;
  font-weight: 500;
  line-height: 1.625rem;
  letter-spacing: 0.0125em !important;
}

.assertions-container {
  .assertion {
    .assertion-title {
      font-size: 1.25rem;
      font-weight: 500;
      margin-top: 8px;
    }

    .assertion-text {
      margin-top: 4px;
      font-size: 1rem;
    }
  }

  .assertion + .assertion {
    margin-top: 32px;
  }
}

@media only screen and (max-width: 599px) {
  .card-inner-container {
    padding: 0 12px;
  }

  .page-headline {
    font-size: 1.375rem;
    padding: 16px 0;
  }

  .form-container,
  .assertions-container {
    padding: 12px;
  }

  .form-title {
    font-size: 1.125rem !important;
    line-height: 1.5rem;
  }
}
</style>
