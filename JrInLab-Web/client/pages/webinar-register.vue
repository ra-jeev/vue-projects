<template>
  <MarketingContainer>
    <template #header-bg>
      <div class="header-bg" />
    </template>

    <template #header>
      <div class="page-headline">
        Live Interactive Online Coding Classes<br />for Kids 6-14 years.
      </div>
    </template>
    <template #default>
      <div class="card-inner-container">
        <div class="form-title text-center py-2 hidden-xs-only">
          One day your kid might start a unicorn
          <span class="display-1">🦄</span>!
        </div>
        <v-row id="form">
          <v-col cols="12" sm="6">
            <v-card class="form-container" flat>
              <div>
                <div class="form-title mt-3 text-center">
                  Register for FREE coding webinar
                </div>
                <RegisterForm
                  btn-text="Register Now"
                  form-page="webinar-register"
                  school-webinar
                  success-page="/thank-you"
                  class="mt-6"
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
                <img :src="benefit.icon" height="96" />
                <div class="assertion-title" v-text="benefit.title" />
                <div
                  class="assertion-text grey--text text--darken-3"
                  v-text="benefit.description"
                />
              </div>
              <div class="form-title text-center mt-10 hidden-sm-and-up">
                One day your kid might start a unicorn
                <span class="display-1">🦄</span>!
              </div>
              <v-btn
                class="mt-6 hidden-sm-and-up"
                large
                rounded
                block
                color="primary"
                @click="$vuetify.goTo('#form')"
              >
                Register Now
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
            What the parents are saying...
          </h2>
          <CardCarousel
            :slides="testimonials"
            :slides-per-screen="2"
            class="mt-12"
            section-bg-color="lighter"
            slide-type="testimonial"
          />
          <v-row justify="center" no-gutters>
            <v-btn
              class="mt-6"
              large
              rounded
              color="primary"
              @click="$vuetify.goTo('#form')"
            >
              Register Now
              <v-icon right> $mdiArrowUp </v-icon>
            </v-btn>
          </v-row>
        </v-container>
      </div>
      <div class="section bg--white">
        <v-container>
          <GallerySection
            :media="media"
            header="Some games created by our students"
          />
          <v-row justify="center" no-gutters>
            <v-btn
              class="mt-6"
              large
              rounded
              color="primary"
              @click="$vuetify.goTo('#form')"
            >
              Register Now
              <v-icon right> $mdiArrowUp </v-icon>
            </v-btn>
          </v-row>
        </v-container>
      </div>
    </template>
  </MarketingContainer>
</template>

<script>
export default {
  layout: 'marketing',
  data() {
    return {
      benefits: [
        {
          icon: require('~/assets/images/doll_play.svg'),
          title: `Coding boosts creativity`,
          description: `Coding expands the canvas of a kid's imagination. It also enables them to create powerful animations, games & mobile apps.`,
        },
        {
          icon: require('~/assets/images/graduation.svg'),
          title: `Academic excellence`,
          description: `Coding is "Theory in Action". It helps your kid understand and apply the Maths & Science concepts taught in schools, in a fun way.`,
        },
        {
          icon: require('~/assets/images/maker_launch.svg'),
          title: `Bright future`,
          description: `Coding not only opens the doors to the top colleges & jobs, but it also helps your child develop an entrepreneurial mindset.`,
        },
        {
          icon: require('~/assets/images/children.svg'),
          title: `We understand & nurture kids`,
          description: `We're a passionate group of coders, educators —- and parents. Our curriculum is age appropriate, and emphasizes on activity based learning.`,
        },
      ],
      testimonials: [
        {
          text: 'We are a very happy set of parents, thanks to JrInLab who encourage our child to utilize his screen time for some good fun and learning at their coding classes.',
          author: {
            name: 'Megha Puri',
            gender: 'female',
            info: `Arjun's mother, Delhi`,
          },
        },
        {
          text: 'I would recommend to any parent, new or old, to enroll in JrinLab for they know how to train the child to be FUTURE READY! Kudos to the JrinLab team and more power.',
          author: {
            name: 'Ms Agnes',
            gender: 'female',
            info: `Izack's mother, UAE`,
          },
        },
        {
          text: 'My daughter is taking App Development classes, she is so excited, especialy when she has created her first application on her phone. Many thanks to JrinLab for your professionalism.',
          author: {
            name: 'Ms Salima',
            gender: 'female',
            info: `Safae's mother, Saudi Arabia`,
          },
        },
        {
          text: 'First class was good. Was pretty impressed with the right pace of learning.',
          author: {
            name: 'Balaji',
            gender: 'male',
            info: `Vishnav's father, Bengaluru`,
          },
        },
      ],
      media: [
        {
          src: require('~/assets/images/thumb-tunnel.jpg'),
          alt: 'Tunnel game created by our student Aditi',
          vidsrc: 'https://www.youtube.com/embed/d1k9qDZs3yk',
        },
        {
          src: require('~/assets/images/thumb-cat-mouse.jpg'),
          alt: 'Cat chasing mouse game by Aniruddh',
          vidsrc: 'https://www.youtube.com/embed/GHfSbWzNcs4',
        },
        {
          src: require('~/assets/images/thumb-ping-pong.jpg'),
          alt: 'Ping pong game created by Abhay',
          vidsrc: 'https://www.youtube.com/embed/_vZYNlh3LzE',
        },
        {
          src: require('~/assets/images/thumb-chatbot.jpg'),
          alt: 'Yogita created a chatbot using Scratch',
          vidsrc: 'https://www.youtube.com/embed/7bABkBj4LLw',
        },
        {
          src: require('~/assets/images/cover_shooting_game.png'),
          alt: 'Cool shooting game created by Arsh',
          vidsrc: 'https://www.youtube.com/embed/HyLk-TiD0o8',
        },
      ],
      socialImage: `https://www.jrinlab.com${require('~/assets/images/hero-image.jpg')}`,
    }
  },
  head() {
    return {
      title: 'Register for coding webinar',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: `Channel your kids screen time, turn them into creators, introduce them to coding. Join our coding webinar to see and experience it.`,
        },
        {
          hid: 'robots',
          name: 'robots',
          content: 'noindex',
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: `Channel your kids screen time, turn them into creators, introduce them to coding. Join our coding webinar to see and experience it.`,
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
          hid: 'twitter:description',
          name: 'twitter:description',
          content: `Channel your kids screen time, turn them into creators, introduce them to coding. Join our coding webinar to see and experience it.`,
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

.page-headline,
.page-subheader {
  font-size: 2rem;
  font-weight: 500;
  line-height: 2.5rem;
  letter-spacing: normal !important;
  padding: 12px;
  color: white;
}

.page-subheader {
  font-size: 1.375rem;
  line-height: 1.625rem;
  font-weight: 400;
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
      margin-top: 16px;
    }

    .assertion-text {
      margin-top: 12px;
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
    line-height: 1.625rem;
  }

  .page-subheader {
    font-size: 1rem;
    line-height: 1.375rem;
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
