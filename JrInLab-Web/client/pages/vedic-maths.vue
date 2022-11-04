<template>
  <MarketingContainer class="transparent-card">
    <template #header-bg>
      <div class="header-bg" />
    </template>
    <template #default>
      <v-row justify="center">
        <v-col cols="12" md="10" lg="9">
          <v-card class="form-container">
            <v-window id="form" v-model="step">
              <v-window-item :value="1">
                <div class="details-label mt-2">
                  Bring out the "Mathematician" in your child
                </div>
                <h1 class="page-headline">
                  Vedic Maths: Faster than Abacus and Kumon Maths
                </h1>

                <v-chip-group class="mt-2 mb-4" column>
                  <v-chip
                    v-for="tag in tags"
                    :key="tag"
                    class="font-weight-bold"
                    color="primary"
                    label
                    small
                  >
                    {{ tag }}
                  </v-chip>
                </v-chip-group>

                <v-card flat rounded>
                  <v-img
                    :aspect-ratio="1200 / 628"
                    :src="require('~/assets/images/vedic/vedic_maths.jpg')"
                    contain
                  />
                </v-card>

                <div class="form-title mt-6">About the workshop</div>
                <div class="grey--text text--darken-3 mt-3">
                  JrInLab is proud to present
                  <span class="font-weight-medium">
                    Mr. Manu Tripathi, an internationally acclaimed Vedic Maths
                    trainer,
                  </span>
                  for conducting this workshop. It is the perfect place to learn
                  from the best, and turn your child into a master of Maths
                  calculations. By learning the techniques of Vedic Maths, your
                  child will be able to do complex mathematical calculations in
                  a faster and much simpler manner. This will boost their
                  concentration, brain power and confidence.
                </div>
                <div class="grey--text text--darken-3 mt-3">
                  <div class="font-weight-medium">
                    Topics & Techniques to be covered during the workshop:
                  </div>
                  <ul>
                    <li>Multiplication of 2 digit numbers</li>
                    <li>Squares of 2 digit numbers</li>
                    <li>Division of any number by any 2 digit number</li>
                    <li>
                      All from 9 and last from 10 technique of subtraction
                    </li>
                    <li>Vertical & Crosswise methods of multiplication</li>
                    <li>Flag Method of division etc.</li>
                  </ul>
                </div>

                <div class="form-title mt-8">Workshop details</div>
                <v-row class="mt-1">
                  <v-col
                    v-for="(campDetail, index) in campDetails"
                    :key="`camp_detail_${index}`"
                    :cols="campDetail.stretch ? 12 : 6"
                    md="6"
                  >
                    <div class="details-label">
                      {{ campDetail.label }}
                    </div>
                    <div
                      :class="{ 'price-text': campDetail.isPrice }"
                      class="details-text"
                    >
                      {{ campDetail.value }}
                      <small v-if="campDetail.subvalue" class="ml-1">
                        {{ campDetail.subvalue }}
                      </small>
                    </div>
                  </v-col>
                </v-row>

                <v-btn
                  class="mt-8"
                  color="secondary"
                  block
                  large
                  rounded
                  @click="onRegisterBtnClick"
                >
                  Book your child's spot
                  <v-icon right> $mdiArrowRight </v-icon>
                </v-btn>

                <div class="text-center my-2">
                  Limited spots available, book yours now!
                </div>
              </v-window-item>
              <v-window-item :value="2">
                <div class="form-title mt-3 text-center">
                  Register for the Workshop
                </div>
                <RegisterForm
                  :get-laptop-availability="false"
                  :time-slots="timeSlots"
                  btn-color="secondary"
                  btn-text="Submit Now"
                  direct-enroll
                  form-page="vedic-maths"
                  success-page="/thank-you"
                  time-slot-mandatory
                  fb-track-event="Lead"
                  google-track-event="generate_lead"
                  class="mt-8"
                />
              </v-window-item>
            </v-window>
          </v-card>
        </v-col>
      </v-row>
    </template>
    <template #details>
      <div class="section bg--white">
        <v-container>
          <h2 class="section__header text-center">Meet the instructor</h2>
          <v-row class="mt-10" justify="center">
            <v-col cols="12" sm="10" lg="8">
              <v-card class="bg--lighter">
                <v-card-text>
                  <v-row align="center" justify="center">
                    <div class="pa-8">
                      <v-avatar size="164">
                        <v-img
                          :src="require('~/assets/images/vedic/profile-2.jpeg')"
                          alt="Manu Tripathi"
                        />
                      </v-avatar>
                    </div>
                    <v-col>
                      <v-list-item-content>
                        <v-list-item-title class="trainer-title">
                          Manu Tripathi
                        </v-list-item-title>
                        <v-list-item-subtitle>
                          NFNLP, USA (Certified NLP & Vedic Maths Trainer)
                        </v-list-item-subtitle>
                        <div class="mt-4 trainer-description">
                          <span class="font-weight-medium">
                            Mr. Manu Tripathi is an internationally acclaimed
                            Vedic Maths & N.L.P. (Neuro Linguistic Programming)
                            trainer.
                          </span>
                          He works on the human mind's input devices & has
                          developed his techniques so systematically that study
                          becomes fun for students.
                          <br /><br />
                          Mr. Tripathi has conducted sessions in many countries
                          around the globe, including Mexico, Thailand, UAE,
                          Ecuador, El Salvador, Guatemala, and many cities in
                          India, including Mumbai, Chandigarh, Ludhiana,
                          Ahmedabad, Nasik, Dehradun etc.
                        </div>
                      </v-list-item-content>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
          <CardCarousel
            :aspect-ratio="4 / 3"
            :slides="media"
            :slides-per-screen="2"
            class="mt-16"
            section-bg-color="white"
            slide-type="media"
          />
          <v-row class="mt-10" justify="center">
            <v-col cols="12" md="6">
              <v-btn
                block
                color="secondary"
                large
                rounded
                @click="onRegisterBtnClick"
              >
                Register your child now
                <v-icon right> $mdiArrowUp </v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </div>
      <div class="section bg--lighter">
        <v-container>
          <h2 class="section__header text-center">Workshop FAQs</h2>
          <v-row justify="center" class="mt-8">
            <v-col cols="12" md="10" lg="9">
              <FaqsList :faqs="faqs" section-bg-color="lighter" />
            </v-col>
          </v-row>
          <v-row class="mt-6" justify="center">
            <v-col cols="12" md="6">
              <v-btn
                block
                color="secondary"
                large
                rounded
                @click="onRegisterBtnClick"
              >
                Register your child now
                <v-icon right> $mdiArrowUp </v-icon>
              </v-btn>
            </v-col>
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
      title:
        'Vedic Maths workshop for 8+ yrs kids by internationally acclaimed trainer Mr. Manu Tripathi',
      description:
        'Join our 5 days Vedic Maths workshop, and become a calculations ninja. Learn to do calculations faster than Abacus & Kumon Maths.',
      imageAlt: 'Image depicting numbers and calculations',
      socialImage: require('~/assets/images/vedic/vedic_maths.jpg'),
      loading: false,
      expand: false,
      step: 1,
      tags: [
        'Magic Maths',
        'Brain Power',
        'Calculations Ninja',
        'Zero Error Maths',
      ],
      campDetails: [
        {
          label: 'Workshop duration',
          value: '5 Days',
          subvalue: '(5 Sessions)',
        },
        {
          label: 'Session duration',
          value: '60 mins each',
        },
        {
          label: 'Designed for',
          value: 'Ages 8+ years',
        },
        {
          label: 'Workshop starting',
          value: 'July 20, 2021, 5:00 PM IST',
        },
        {
          label: 'Workshop fees',
          value: '₹ 1,599',
          stretch: true,
          isPrice: true,
        },
      ],
      media: [
        {
          src: require('~/assets/images/vedic/workshop-1.jpeg'),
          alt: `Mr. Manu Tripathi taking a Vedic Maths session for school students`,
        },
        {
          src: require('~/assets/images/vedic/news-clipping-1.jpeg'),
          alt: `News clipping from Cancun, Mexico mentioning Mr. Manu Tripathi's sessions`,
        },
        {
          src: require('~/assets/images/vedic/news-clipping-2.jpeg'),
          alt: `News clipping from Mexico mentioning Mr. Manu Tripathi's Vedic Maths sessions`,
        },
        {
          src: require('~/assets/images/vedic/certificate.jpeg'),
          alt: `Mr. Manu Tripathi receiving recognition from the University of South, Cancun, Mexico`,
        },
        {
          src: require('~/assets/images/vedic/certificate-1.jpeg'),
          alt: `Recognition for Mr. Manu Tripathi from Cancun Technology Institute, Mexico for his Vedic Maths sessions`,
        },
        {
          src: require('~/assets/images/vedic/certificate-2.jpeg'),
          alt: `Recognition for Mr. Manu Tripathi from Secondary Education Board, Mexico for his Vedic Maths sessions`,
        },
        {
          src: require('~/assets/images/vedic/news-clipping-3.jpeg'),
          alt: `News clippings from Bareilly mentioning Mr. Manu Tripathi's Vedic Maths sessions`,
        },
        {
          src: require('~/assets/images/vedic/news-clipping-4.jpeg'),
          alt: `News clippings from Bareilly mentioning Mr. Manu Tripathi's Memory sessions`,
        },
      ],
      faqs: [
        {
          question: 'Who is this for?',
          answer:
            '- This workshop is ideal for children of ages 8+ years\n- The workshop will be beneficial for any child who wants to become better at Maths and do calculations faster.',
        },
        {
          question: 'What are the prerequisites for the workshop?',
          answer:
            '- The sessions will be conducted online over live video conference. You will receive the details to join these sessions ahead of time.\n- To join the sessions you will need a laptop / desktop or a mobile, and a reliable internet connection.\n- Unlike Abacus, no other tools are needed to attend this workshop.',
        },
        {
          question: 'What is the duration of this workshop?',
          answer:
            '- The total workshop duration is **5 days**.\n- There will be a **1 hour session** everyday at **5:00 PM IST**, starting **July 20, 2021**',
        },
        {
          question: 'Will there be a demo class for the workshop?',
          answer: `No, there is no demo class for the workshop.`,
        },
        {
          question: 'What is your typical batch size?',
          answer:
            'Our batch size is small, usually between 8-12 students. We have found this to be the optimal group size for meaningful interaction as well as individual attention for Vedic Maths Camp.',
        },
        {
          question: 'What is the workshop pricing?',
          answer: 'The workshop fees is ***₹ 1,599*** all inclusive.',
        },
        {
          question: 'What is your refund policy?',
          answer: `- We've a **no question asked refund policy**.\n- If you're not satisfied after the first class, you can ask for a full refund by getting in touch with us.\n- No refund is possible after attending 2 or more sessions.`,
        },
        {
          question: 'What is the outcome of the workshop?',
          answer: `Children will be taught some tricks and techniques of Vedic Maths using which they wil be able to faster calculations. This will boost their concentration, confidence and mental ability.\n- Multiplication of 2 digit numbers.\n- Squares of 2 digit numbers.\n- Division of any number by any 2 digit number`,
        },
        {
          question: 'Will my child get a certificate for the workshop?',
          answer:
            'Yes. All students will receive a workshop completion cum participation certificate, signed by the instructor, on the completion of the workshop.',
        },
      ],
      timeSlots: [
        {
          label: '5:00 PM IST',
          value: '200721-1700',
        },
      ],
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
          content: this.imageAlt,
        },
        {
          hid: 'twitter:card',
          name: 'twitter:card',
          content: `summary_large_image`,
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
          content: this.imageAlt,
        },
      ],
    }
  },
  methods: {
    onRegisterBtnClick() {
      this.step = 2
      this.$nextTick(() => {
        this.$vuetify.goTo('#form')
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~/assets/colors.scss';

.slot-full {
  text-decoration: line-through;
}

.card-inner-container {
  padding: 16px;
}

.read-more {
  cursor: pointer;
  color: $primary;
  text-decoration: underline;
  user-select: none;
}

.details-label {
  font-size: 0.9rem;
  line-height: 1.25;
  color: rgba(0, 0, 0, 0.6);
  margin-bottom: 2px;
}

.details-text {
  font-size: 1.125rem;
  line-height: 1.375;
  font-weight: 500;
}

.details-text.price-text {
  font-size: 2rem;
  line-height: 2.5rem;
  color: $primary-dark;
}

.tag {
  font-weight: 500;
}

.tag--small {
  padding: 0 8px;
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

.assertion-check {
  background-color: rgba(21, 172, 46, 0.18);
  font-size: 18px;
  padding: 4px;
  border-radius: 50%;
}

.page-headline {
  font-size: 2rem;
  font-weight: 500;
  line-height: 2.5rem;
  letter-spacing: normal !important;
}

.page-subheader {
  font-size: 2rem;
  font-weight: 500;
  line-height: 2.5rem;
  letter-spacing: normal !important;
  padding: 12px;
}

.no-workshop {
  letter-spacing: normal !important;
  text-align: center;

  &--title {
    font-size: 1.5rem;
    line-height: 1.5rem;
    font-weight: 500;
  }

  &--description {
    font-size: 1.125rem;
    line-height: 1.625rem;
  }
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
  font-size: 1.5rem !important;
  font-weight: 500;
  line-height: 1.75rem;
  letter-spacing: 0.0125em !important;
}

.trainer-title {
  font-size: 1.5rem !important;
  font-weight: 500;
  line-height: 2rem;
  letter-spacing: 0.0125em !important;
  color: rgba(0, 0, 0, 0.87);
}

.trainer-description {
  font-size: 1rem;
  line-height: 1.4;
  color: rgba(0, 0, 0, 0.64);
}

.assertions-container {
  .assertion {
    .assertion-title {
      font-size: 1.25rem;
      font-weight: 500;
    }

    .assertion-text {
      margin-top: 8px;
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

    .assertion {
      .assertion-title {
        font-size: 1rem;
      }
    }
  }

  .form-title {
    font-size: 1.125rem !important;
    line-height: 1.5rem;
  }

  .trainer-title {
    font-size: 1.25rem !important;
    line-height: 1.75rem;
  }
}

.play-btn {
  transition: 0.3s all cubic-bezier(0.455, 0.03, 0.515, 0.955);
}

.play-btn--hovered {
  transform: scale(1.2);
}
</style>
