<template>
  <MarketingContainer>
    <template #header-bg>
      <div class="header-bg" />
    </template>
    <template #default>
      <div class="card-inner-container">
        <v-snackbar v-model="bannerVisible" :timeout="-1" color="warning" top>
          <v-icon dark left> $mdiAlertDecagram </v-icon>
          <span class="font-weight-medium">
            Early bird discount of 20% till 18<sup>th</sup> Dec. Hurry!
          </span>

          <template #action="{ attrs }">
            <v-icon v-bind="attrs" dark @click="bannerVisible = false">
              $mdiClose
            </v-icon>
          </template>
        </v-snackbar>

        <v-row>
          <v-col cols="12" sm="6">
            <v-card class="form-container" flat>
              <v-window id="form" v-model="step">
                <v-window-item :value="1">
                  <div class="details-label mt-2">
                    For Curious & Creative Kids
                  </div>
                  <h1 class="page-headline">
                    Logic & Coding Camp for kids 2021
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
                      :src="socialImage"
                      contain
                    />
                  </v-card>

                  <div class="form-title mt-6">About the camp</div>
                  <div class="grey--text text--darken-3 mt-3">
                    Utilize your kid's winter break with our 2 weeks coding camp
                    for kids. During the camp they'll learn the basics of
                    coding. This camp is completely project based, and will
                    cover all the concepts necessary to complete the projects.
                    We'll be running separate batches for
                    <span class="font-weight-medium">
                      Scratch and Python languages.
                    </span>
                    <br />
                    <br />
                    The program will culminate into a final project which the
                    kids will be creating by applying the concepts learnt during
                    the camp.
                  </div>

                  <div class="form-title mt-10">Camp details</div>
                  <v-row class="mt-1">
                    <v-col
                      v-for="(campDetail, index) in campDetails"
                      :key="`camp_detail_${index}`"
                      :cols="campDetail.stretch ? 12 : 6"
                    >
                      <div class="details-label">
                        {{ campDetail.label }}
                      </div>
                      <div
                        class="details-text"
                        :class="{ 'price-text': campDetail.isPrice }"
                      >
                        {{ campDetail.value }}
                        <small
                          v-if="campDetail.strikeValue"
                          class="ml-1 strike-text"
                        >
                          {{ campDetail.strikeValue }}
                        </small>
                        <small
                          v-if="campDetail.subValue"
                          class="ml-1 sub-value-text"
                        >
                          {{ campDetail.subValue }}
                        </small>
                      </div>
                    </v-col>
                  </v-row>

                  <v-btn
                    color="secondary"
                    class="mt-8"
                    block
                    large
                    rounded
                    @click="onRegisterBtnClick"
                  >
                    Book your kid's spot
                    <v-icon right> $mdiArrowRight </v-icon>
                  </v-btn>
                  <div class="text-center mt-2">
                    Limited spots available, book yours now!
                  </div>
                </v-window-item>
                <v-window-item :value="2">
                  <div class="form-title mt-3 text-center">
                    Register for the camp
                  </div>
                  <RegisterForm
                    :batches="workshopBatches"
                    :default-country-code="{
                      name: 'United States',
                      dialCode: '+1',
                    }"
                    :is-type-workshop="false"
                    btn-color="secondary"
                    btn-text="Register Now"
                    class="mt-6"
                    direct-enroll
                    fb-track-event="Lead"
                    form-page="kids-winter-camp-2021"
                    google-track-event="generate_lead"
                    success-page="/camp-booking-done"
                  />
                </v-window-item>
              </v-window>
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
                class="mt-6 hidden-sm-and-up"
                large
                rounded
                block
                color="secondary"
                @click="onRegisterBtnClick"
              >
                Book your kid's spot now
                <v-icon right> $mdiArrowUp </v-icon>
              </v-btn>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </template>
    <template #details>
      <div class="section bg--white">
        <v-container>
          <h2 class="section__header text-center">Who we are</h2>
          <v-row align="center" class="mt-6" justify="center">
            <v-col cols="12" lg="3" class="text-center">
              <img
                src="~/assets/images/building_blocks.svg"
                contain
                height="172"
              />
            </v-col>
            <v-col cols="12" lg="5">
              We're a passionate group of coders, educators &mdash; and parents.
              We believe that teaching & handling kids is not a part time job,
              and that is why all of us are fulltime educators here. Our
              founders are alums of <strong>NTU Singapore</strong> &
              <strong>IITs</strong> (India's premier technical institutes).
              <br />
              <br />
              We've spent a lot of time designing a curriculum which is age
              appropriate. It follows an activity based approach, and emphasizes
              on experiential learning.
              <br />
              <br />
              <strong> We understand & nurture kids </strong>
            </v-col>
          </v-row>
        </v-container>
      </div>
      <div class="section bg--lighter">
        <v-container>
          <h2 class="section__header text-center">
            Glimpses of previous camps
          </h2>
          <CardCarousel
            :slides="media"
            :slides-per-screen="2"
            class="mt-12"
            section-bg-color="white"
            slide-type="media"
          />
          <v-row class="mt-6" justify="center">
            <v-col cols="12" md="4">
              <div class="px-4">
                <v-btn
                  block
                  color="secondary"
                  large
                  rounded
                  @click="onRegisterBtnClick"
                >
                  Book your kid's spot now
                  <v-icon right> $mdiArrowUp </v-icon>
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </div>
      <div class="section bg--white">
        <v-container>
          <h2 class="section__header text-center">Camp FAQs</h2>
          <v-row justify="center" class="mt-8">
            <v-col cols="12" md="10" lg="9">
              <FaqsList :faqs="faqs" class="px-4" />
            </v-col>
          </v-row>
          <v-row class="mt-6" justify="center">
            <v-col cols="12" md="4">
              <div class="px-4">
                <v-btn
                  block
                  color="secondary"
                  large
                  rounded
                  @click="onRegisterBtnClick"
                >
                  Book your kid's spot now
                  <v-icon right> $mdiArrowUp </v-icon>
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </div>
      <div class="section bg--lighter">
        <v-container>
          <h2 class="section__header text-center">
            Happy stories from previous camps
          </h2>
          <CardCarousel
            :slides="testimonials"
            :slides-per-screen="2"
            class="mt-12"
            section-bg-color="lighter"
            slide-type="testimonial"
          />
          <v-row class="mt-6" justify="center">
            <v-col cols="12" md="4">
              <div class="px-4">
                <v-btn
                  block
                  color="secondary"
                  large
                  rounded
                  @click="onRegisterBtnClick"
                >
                  Book your kid's spot now
                  <v-icon right> $mdiArrowUp </v-icon>
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </div>
      <div class="section bg--white">
        <v-container>
          <h2 class="section__header text-center">Our other offerings</h2>
          <CoursesOffering class="mt-8" />
          <v-row class="mt-6" justify="center">
            <v-col cols="12" md="4">
              <div class="px-4">
                <v-btn
                  block
                  color="secondary"
                  large
                  rounded
                  @click="onRegisterBtnClick"
                >
                  Get started now
                  <v-icon right> $mdiArrowUp </v-icon>
                </v-btn>
              </div>
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
      socialImage: `https://firebasestorage.googleapis.com/v0/b/jrinlab.appspot.com/o/website%2Fimages%2Fwinter-camp%2Fwinter-camp-sg.jpg?alt=media&token=c90f7bc6-888f-4bc0-9181-c883af80986d`,
      title: `Online Logic and Coding Camp for kids 7-14 years`,
      description: `Keep your kid creatively engaged during the winter break with our Scratch & Python coding camps. Small batches. Project based learning.`,
      overlay: false,
      bannerVisible: true,
      workshopBatches: [
        {
          label: 'Scratch (7+ Years)',
          value: 'scratch',
        },
        {
          label: 'Python (10+ Years)',
          value: 'python',
        },
      ],
      benefits: [
        {
          icon: require('~/assets/images/children.svg'),
          title: `Beginner friendly`,
          description: `The camp will cover all the basic concepts necessary to build a strong foundation for your kid. No prior coding experience is needed to attend the camp.`,
        },
        {
          icon: require('~/assets/images/web_developer.svg'),
          title: `Project based learning`,
          description: `These camps are project based, giving a clear idea about what the kids are going to build, and how. They'll create games & animations utilizing different concepts.`,
        },
        {
          icon: require('~/assets/images/good_team.svg'),
          title: `Batches for Scratch & Python`,
          description: `Separate batches for Scratch and Python programming. Your kid can enroll to more than one batch at the same time (if they are eligible).`,
        },
        {
          icon: require('~/assets/images/teacher.svg'),
          title: `Learn from the best`,
          description: `The camp will be conducted by experienced teachers led by our founders. Your kid will always be in a safe and fun environment.`,
        },
        {
          icon: require('~/assets/images/certificate.svg'),
          title: `Camp participation certificate`,
          description: `All students will receive a participation certificate on the completion of the camp.`,
        },
      ],
      faqs: [
        {
          question: 'Who is this for?',
          answer:
            '- This camp is ideal for kids of ages 7-14 years\n- Kids having interest in video games and technology will particularly enjoy it\n- No prior coding experience of any kind is needed.',
        },
        {
          question: 'What is Scratch & Python? Who should go for what?',
          answer:
            '- Scratch is a programming language made specially for teaching programming to kids. Kids combine different blocks, like Lego, to create logic.\n- On the other hand, Python is a text based programing language where the kids will need to type out the whole code themselves. Python is used everywhere in the real world.\n- Scratch is suitable for all ages, specially for younger kids, while teens can opt for Python.',
        },
        {
          question: 'How is the camp conducted?',
          answer:
            '- The sessions are conducted online over live video conference. You will receive the details to join these sessions ahead of time.\n- To join the sessions you will need a laptop or a desktop, with a functioning camera and mic, and a reliable internet connection.',
        },
        {
          question: 'What is the schedule of this camp?',
          answer: `The camp is **2 weeks long** with **8 sessions overall**.\n- **Camp Start Date:** Dec 20, 2021.\n- **Tentative Schedule:** 10:00 AM EST, Mondays-Thursdays.\n- For other possible schedules, please register and we'll reach out to you.`,
        },
        {
          question: 'What is your typical batch size?',
          answer:
            'Our batch size is small, usually between 3-5 students. We have found this to be the optimal group size for meaningful collaboration and individual attention.',
        },
        {
          question: 'What is the camp pricing?',
          answer:
            'The camp fees is ~~$ 249~~ ***$ 199*** all inclusive if you register before Dec 18 and avail the early bird discount.',
        },
        {
          question: 'Any details of the camp activities?',
          answer: `- There will be separate batches for Scratch and Python (Turtle) programming languages. Eligible kids can enroll to both the batches.\n- These camps are completely projects based. Kids will learn to follow a step by step approach to solve a complex problem, by breaking it down into smaller and simpler steps.\n- Kids will also get the exposure to work on different types of problems in different projects.`,
        },
        {
          question: 'What is the outcome of the camp?',
          answer: `- Kids will be able to code cool animations and games using Scratch / Python (Turtle). Visual coding gives kids a platform to express their thoughts in an attractive and confident manner.\n- Our camps are structured in a manner that even shy kids open up and express themselves, it will boost their creativity and confidence.`,
        },
        {
          question: 'Will my kid get a certificate for the camp?',
          answer: `Yes. All students will receive a camp completion cum participation certificate, signed by our founders, on the completion of the camp.`,
        },
      ],
      tags: ['Creativity', 'Logic', 'Scratch', 'Python'],
      step: 1,
      campDetails: [
        {
          label: 'Camp duration',
          value: '2 weeks',
        },
        {
          label: 'Designed for',
          value: 'Ages 7-14 years',
        },
        {
          label: 'Sessions',
          value: '8',
          subValue: '(4/week)',
        },
        {
          label: 'Session duration',
          value: '75 mins each',
        },
        {
          label: 'Batches starting',
          value: 'Dec 20, 2021',
          stretch: true,
        },
        {
          label: 'Each camp fees',
          value: '$ 199',
          strikeValue: '$ 249',
          subValue: '(20% off)',
          stretch: true,
          isPrice: true,
        },
      ],
      testimonials: [
        {
          text: `Due to homeschooling, Alexander was very shy on the first day of the camp, but thanks to your patience and support he is very much comfortable speaking up now. The camp was very nice, and he enjoyed a lot.`,
          author: {
            name: 'Carmel Gevers',
            avatar: require('~/assets/images/testimonial-pics/carmel-gevers.png'),
            gender: 'female',
            info: `Alexander's mother, Singapore`,
          },
        },
        {
          text: `He had a lot of fun during the camp. I see many changes in him in this duration. On day one he said he doesn't want to code, and now he actually likes to code on his own without any prompt.`,
          author: {
            name: 'Amit Kr. Singh',
            avatar: require('~/assets/images/testimonial-pics/amit-kr-singh.png'),
            gender: 'male',
            info: `Anahat's father, Singapore`,
          },
        },
        {
          text: 'I liked the platform very much where Vidhi learnt a lot. I am looking forward to Vidhi explore more and do creative things to make a lot of animations / cartoon videos.',
          author: {
            name: 'Mrs. Nitesh Mishra',
            avatar: require('~/assets/images/testimonial-pics/vidhi-with-mom.jpeg'),
            gender: 'female',
            info: `Vidhi's mother, Singapore`,
          },
        },
        {
          text: 'I found it hard to get Vedant to learn coding, but you guys and Scratch did the trick.',
          author: {
            name: 'Vivek Pandey',
            avatar: require('~/assets/images/testimonial-pics/vivek-pandey.jpeg'),
            gender: 'male',
            info: `Vedant's father, USA`,
          },
        },
        {
          text: 'Tanish found it absolutely interesting. It is interesting to see how he applies logic. He has completed about 10 projects and everytime he finishes a project he will call everyone and showcase his project feeling a sense of achievement.',
          author: {
            name: 'Ms Priya',
            avatar: require('~/assets/images/testimonial-pics/tanish-with-parents.png'),
            gender: 'female',
            info: `Tanish's mother, Bengaluru`,
          },
        },
      ],
      media: [
        {
          src: require('~/assets/images/summer-camp/pic_1.png'),
          alt: 'Our student Vedant presenting his shooter game to the parents',
        },
        {
          src: require('~/assets/images/summer-camp/pic_2.jpg'),
          alt: 'Students having a light moment with the teachers',
        },
        {
          src: require('~/assets/images/summer-camp/pic_3.png'),
          alt: 'Aaryan explaining the logic behind his space animation',
        },
        {
          src: require('~/assets/images/summer-camp/pic_4.png'),
          alt: 'Parents and students participating on the demo day',
        },
        {
          src: require('~/assets/images/summer-camp/pic_5.png'),
          alt: 'Vidhi explaining her animation project',
        },
        {
          src: require('~/assets/images/summer-camp/pic_6.png'),
          alt: 'One of the students giving demo of their space animation',
        },
        {
          src: require('~/assets/images/summer-camp/pic_7.png'),
          alt: 'Story of princess and witches by one of our students',
        },
        {
          src: require('~/assets/images/summer-camp/pic_8.png'),
          alt: 'A casual chat project between two friends created by Aashi',
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
          content: 'A girl smiling, and working on her laptop',
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
          content: 'A girl smiling, and working on her laptop',
        },
      ],
    }
  },
  mounted() {
    localStorage.summer_camp = 'sg'
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

.card-inner-container {
  padding: 16px;
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

.details-text .strike-text {
  color: grey;
  font-size: 60%;
  text-decoration: line-through;
}

.details-text .sub-value-text {
  color: grey;
  font-size: 70%;
}

.course-details {
  font-size: 1rem;
  color: rgba(0, 0, 0, 0.72);
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
  line-height: 2.5rem;
  letter-spacing: normal !important;
}

.form-container,
.assertions-container {
  padding: 16px 24px;
}

.form-title {
  font-size: 1.375rem !important;
  font-weight: 500;
  line-height: 1.75rem;
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
    font-size: 1.5rem;
    line-height: 1.375;
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
    font-size: 1.25rem !important;
    line-height: 1.5rem;
  }
}

.play-btn {
  transition: 0.3s all cubic-bezier(0.455, 0.03, 0.515, 0.955);
}

.play-btn--hovered {
  transform: scale(1.2);
}
</style>
