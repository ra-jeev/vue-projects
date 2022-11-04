<template>
  <MarketingContainer>
    <template #header-bg>
      <div class="header-bg" />
    </template>
    <template #default>
      <div class="card-inner-container">
        <v-row>
          <v-col cols="12" sm="6">
            <v-card class="form-container" flat>
              <v-window id="form" v-model="step">
                <v-window-item :value="1">
                  <div class="details-label mt-2">
                    For Curious & Creative Kids
                  </div>
                  <h1 class="page-headline">
                    Coding, Maths & Logic Summer Camp 2021
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
                      :aspect-ratio="1200 / 630"
                      :src="require('~/assets/images/summer-camp-sg-2021.jpg')"
                      contain
                    />
                  </v-card>

                  <div class="form-title mt-6">About the camp</div>
                  <div class="grey--text text--darken-3 mt-3">
                    Our summer camp is the perfect place to engage your child
                    and harness their creativity. The camp has the right mix of
                    logical and math puzzles, with introduction to block coding.
                    The program will culminate with the children applying the
                    learnt concepts, to code an animation using block coding.
                  </div>

                  <div class="form-title mt-10">Camp details</div>
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
                      <div class="details-text">
                        {{ campDetail.value }}
                        <small v-if="campDetail.subvalue" class="ml-1">
                          {{ campDetail.subvalue }}
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
                    Book your child's spot
                    <v-icon right> $mdiArrowRight </v-icon>
                  </v-btn>
                  <div class="text-center mt-2">
                    Limited spots available, get yours now!
                  </div>
                </v-window-item>
                <v-window-item :value="2">
                  <div class="form-title mt-3 text-center">
                    Register for Summer Camp 2021
                  </div>
                  <RegisterForm
                    :default-country-code="{
                      name: 'Singapore',
                      dialCode: '+65',
                    }"
                    btn-color="secondary"
                    btn-text="Register Now"
                    class="mt-6"
                    direct-enroll
                    fb-track-event="Lead"
                    form-page="sg-summer-camp"
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
                Book your child's spot now
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
          <h2 class="section__header text-center">
            Glimpses of 2020 summer camp
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
                  Book your child's spot now
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
            Happy stories from 2020 summer camp
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
                  Book your child's spot now
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
                  Book your child's spot now
                  <v-icon right> $mdiArrowUp </v-icon>
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </div>
      <div class="section bg--lighter">
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
      socialImage: `https://firebasestorage.googleapis.com/v0/b/jrinlab.appspot.com/o/website%2Fimages%2Fsummer-camp%2Fsg%2Fimg-sq.jpg?alt=media&token=0064bb6b-e355-4bae-a52e-c5721d82cd41`,
      socialImageFb: `https://firebasestorage.googleapis.com/v0/b/jrinlab.appspot.com/o/website%2Fimages%2Fsummer-camp%2Fsg%2Fimg.jpg?alt=media&token=83a6712e-b734-4f1b-a90e-8d33b8a2a586`,
      title: `Online Summer Camp 2021 for kids 7-10 years`,
      description: `Keep you kids creatively engaged this summer with loads of fun activities, including maths tricks, logical puzzles and science facts with intro to block coding.`,
      overlay: false,
      benefits: [
        {
          icon: require('~/assets/images/children.svg'),
          title: `Fun learning activities`,
          description: `Children will have fun with our specially designed, collaborative and unplugged learning activities.`,
        },
        {
          icon: require('~/assets/images/mathematics.svg'),
          title: `Maths and logic`,
          description: `The camp is loaded with maths tricks, logical puzzles and interesting science facts. These puzzles will test & boost their logical and thinking abilities.`,
        },
        {
          icon: require('~/assets/images/web_developer.svg'),
          title: `Code animations & games`,
          description: `We will introduce the basics of block coding to the children during the camp. They'll learn to code cool animations & games.`,
        },
        {
          icon: require('~/assets/images/certificate.svg'),
          title: `Camp participation certificate`,
          description: `All students will receive a camp participation certificate on the completion of the summer camp.`,
        },
      ],
      faqs: [
        {
          question: 'Who is this for?',
          answer:
            '- This camp is ideal for kids of ages 7-10 years\n- Kids having interest in video games and technology will particularly enjoy it\n- No prior coding experience of any kind is needed.',
        },
        {
          question: 'How is the camp conducted?',
          answer:
            '- The sessions are conducted online over live video conference. You will receive the details to join these sessions ahead of time.\n- To join the sessions you will need a laptop or a desktop, with a functioning camera and mic, and a reliable internet connection.',
        },
        {
          question: 'What is the duration of this camp?',
          answer:
            'The summer camp is **2 weeks long** with **10 sessions overall**. All sessions will be conducted on weekdays.',
        },
        {
          question: 'What is your typical batch size?',
          answer:
            'Our batch size is small, usually between 5-6 students. We have found this to be the optimal group size for meaningful collaboration and individual attention.',
        },
        {
          question: 'What is the camp pricing?',
          answer: 'The camp fees is ***S$ 150*** all inclusive.',
        },
        {
          question: 'Any details of the summer camp activities?',
          answer: `- Kids will be taught the basics of block coding (Scratch) using which they'll be able to create cool animations and games.\n- Apart from basics of coding, the camp consists of many Maths & Logic puzzles in every session.\n- We've also included a lot of interesting Science / Astronomy facts in the sessions to spark children's curiosity.`,
        },
        {
          question: 'What is the outcome of the camp?',
          answer: `- Kids will be able to code cool animations and games using block coding. Visual coding gives children a platform to express their thoughts in an attracive and confident manner.\n- Our camps are structured in a manner that even shy kids open up and express themselves, it will boost their creativity and confidence.`,
        },
        {
          question: 'Will my child get a certificate for the camp?',
          answer: `Yes. All students will receive a camp completion cum participation certificate, signed by our founders, on the completion of the camp.`,
        },
      ],
      tags: ['Creativity', 'Maths & Logic', 'Block Coding', 'Scratch'],
      step: 1,
      campDetails: [
        {
          label: 'Camp duration',
          value: '2 weeks',
        },
        {
          label: 'Designed for',
          value: 'Ages 7-10 years',
        },
        {
          label: 'Sessions',
          value: '10',
          subvalue: '(5/week)',
        },
        {
          label: 'Session duration',
          value: '60 mins each',
        },
        {
          label: 'Camp fees',
          value: 'S$ 150',
          subvalue: '(S$ 15/session)',
          stretch: true,
        },
        {
          label: 'Batches starting',
          value: 'June 7 onwards',
          stretch: true,
        },
      ],
      testimonials: [
        {
          text: 'It was amazing to create an animation during the summer camp. Even though I had learnt Scratch in school, I just changed backdrop, glide a sprite etc but never made an animated story.',
          author: {
            name: 'Maeha',
            avatar: require('~/assets/images/testimonial-pics/maeha.jpeg'),
            gender: 'female',
            info: `Camp student, Gurgaon`,
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
          text: 'The camp was quite interesting. Aashi learnt a lot of things. Looking forward to the coding courses in the future.',
          author: {
            name: 'Ankita Mittal',
            avatar: require('~/assets/images/testimonial-pics/ankita-mittal.png'),
            gender: 'female',
            info: `Aashi's mother, Gurgaon`,
          },
        },
        {
          text: 'First day of the camp I had to set up the computer and push my daughter Nilanshi to attend the class but later on she used to wait for the class to start. It is great to see the kind of stories kids imagined and created using coding in this camp.',
          author: {
            name: 'Devesh Singh',
            gender: 'male',
            info: `Nilanshi's father, Mumbai`,
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
          content: this.socialImageFb,
        },
        {
          hid: 'og:image:alt',
          property: 'og:image:alt',
          content: 'A girl smiling, and working on her laptop',
        },
        {
          hid: 'twitter:card',
          name: 'twitter:card',
          content: `summary`,
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
