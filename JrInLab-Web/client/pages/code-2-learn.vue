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
                  <h1 class="page-headline">#Code2Learn Workshop</h1>

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
                      :aspect-ratio="2"
                      :src="require('~/assets/images/code2learn.jpg')"
                      contain
                    />
                  </v-card>

                  <div class="form-title mt-6">About the workshop</div>
                  <div class="grey--text text--darken-3 mt-3">
                    Utilize your child's mid session break with our 4 days
                    coding workshops in
                    <span class="font-weight-medium">
                      Scratch, App Inventor and Python.
                    </span>
                    These are project based workshops, and will cover all the
                    concepts necessary to complete the projects.
                    <br /><br />
                    Eligible children can take part in
                    <span class="font-weight-medium">
                      Google's Code To Learn Contest 2021
                    </span>
                    after completion of the workshop.
                  </div>

                  <div class="form-title mt-10">Workshop details</div>
                  <v-row class="mt-1">
                    <v-col
                      v-for="(workshopDetail, index) in workshopDetails"
                      :key="`workshop_detail_${index}`"
                      :cols="workshopDetail.stretch ? 12 : 6"
                    >
                      <div class="details-label">
                        {{ workshopDetail.label }}
                      </div>
                      <div
                        :class="{ 'price-text': workshopDetail.isPrice }"
                        class="details-text"
                      >
                        {{ workshopDetail.value }}
                        <small v-if="workshopDetail.subvalue" class="ml-1">
                          {{ workshopDetail.subvalue }}
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
                    Limited spots available, book yours now!
                  </div>
                </v-window-item>
                <v-window-item :value="2">
                  <div class="form-title mt-3 text-center">
                    Register for #Code2Learn Workshop
                  </div>
                  <RegisterForm
                    :batches="workshopBatches"
                    btn-color="secondary"
                    btn-text="Register Now"
                    direct-enroll
                    form-page="code-2-learn"
                    success-page="/camp-booking-done"
                    fb-track-event="Lead"
                    google-track-event="generate_lead"
                    class="mt-6"
                    workshop-name="code-2-learn"
                    workshop-fee="499"
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
                <div class="assertion-title d-flex align-center">
                  <v-icon left class="assertion-check"> $mdiCheck </v-icon>
                  {{ benefit.title }}
                </div>
                <div
                  class="assertion-text grey--text text--darken-3"
                  v-html="$md.render(benefit.description)"
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
            Glimpses of previous workshops
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
            Happy stories from previous workshops
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
          <h2 class="section__header text-center">Workshop FAQs</h2>
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
      socialImage: `https://firebasestorage.googleapis.com/v0/b/jrinlab.appspot.com/o/website%2Fimages%2Fcode2learn%2Fsquare.jpg?alt=media&token=d3ea86f2-65d3-4b54-a82a-07137e297f33`,
      socialImageFb: `https://firebasestorage.googleapis.com/v0/b/jrinlab.appspot.com/o/website%2Fimages%2Fcode2learn%2Fbig.jpg?alt=media&token=d5b92275-678e-42ea-9dc1-1d7c92095af8`,
      title: `JrInLab's #code2learn workshop for kids 6+ years`,
      description: `Prepare your child for Google's #Code2Learn competition, join JrInLab's online workshop during the mid sem break Oct 11-14, 2021. Your child will learn the basics of coding, and create a game during the workshop.`,
      imageAlt: `An elated girl sitting on a bean bag with laptop`,
      overlay: false,
      workshopBatches: [
        {
          label: 'Scratch (6+ Years, 3:00-4:00 PM IST)',
          value: 'scratch',
        },
        {
          label: 'Android App Inventor (8+ Years, 4:30-5:30 PM IST)',
          value: 'appInventor',
        },
        {
          label: 'Python (10+ Years, 3:00-4:00 PM IST)',
          value: 'python',
        },
      ],
      benefits: [
        {
          title: `Beginner friendly`,
          description: `The workshops will cover all the basic concepts necessary to build a strong foundation for your child. No prior coding experience is needed to attend the workshops.`,
        },
        {
          title: `Project based learning`,
          description: `Children will learn to create a complete game / animation, or an Android App depending on which workshop they attend.`,
        },
        {
          title: `Batches for Scratch, AppInventor & Python`,
          description: `Separate batches for Scratch, AppInventor (Android App Development) and Python. Your child can enrol to more than one workshop at the same time.`,
        },
        {
          title: `Learn from the best`,
          description: `The workshop will be conducted by an experienced team led by our founders. Grab this wonderful opportunity now.`,
        },
        {
          title: `Workshop participation certificate`,
          description: `All students will receive a participation certificate on the completion of the workshop.`,
        },
        {
          title: `Participate in Google's #Code2Learn Contest`,
          description: `Eligible children can take part in the contest here https://g.co/code2learn. The last date of project submission is October 25, 2021`,
        },
      ],
      faqs: [
        {
          question: 'Who is this for?',
          answer: `- This workshop is ideal for children of ages 6+ years. To ensure age appropriate learning, we'll run separate batches for different age groups.\n- Kids having interest in video games and technology will particularly enjoy it\n- No prior coding experience of any kind is needed.`,
        },
        {
          question: 'How is the workshop conducted?',
          answer:
            '- The sessions are conducted online over live video conference. You will receive the details to join these sessions ahead of time.\n- To join the sessions you will need a laptop or a desktop, with a functioning camera and mic, and a reliable internet connection.',
        },
        {
          question: 'What is the duration of this workshop?',
          answer:
            'The summer workshop is **4 days long (4 sessions)**. Each session duration is **60 mins**.',
        },
        {
          question: 'What is your typical batch size?',
          answer:
            'Our batch size is small, usually between **8-10 students**. We have found this to be the optimal group size for meaningful collaboration and individual attention.',
        },
        {
          question: 'What is the workshop pricing?',
          answer: 'The workshop fees is ***Rs. 499*** all inclusive.',
        },
        {
          question: 'What is the outcome of the workshop?',
          answer: `Children will be taught the basics of coding. Depending on the workshops chosen, they'll be able to create cool animations and games and/or Android Apps.`,
        },
        {
          question: 'Will my child get a certificate for the workshop?',
          answer:
            'Yes. All students will receive a workshop completion cum participation certificate, signed by our founders, on the completion of the workshop.',
        },
      ],
      tags: ['#Creativity', '#Maths', '#Scratch', '#AppInventor', '#Python'],
      step: 1,
      workshopDetails: [
        {
          label: 'Workshop duration',
          value: '4 Days',
          subvalue: '(4 Sessions)',
        },
        {
          label: 'Session duration',
          value: '60 mins each',
        },
        {
          label: 'Designed for',
          value: 'Ages 6+ years',
        },
        {
          label: 'Batches starting',
          value: 'October 11, 2021',
        },
        {
          label: 'Each Workshop fees',
          value: '₹ 499',
          subvalue: '(Only ₹ 125/Session)',
          stretch: true,
          isPrice: true,
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
          content: this.imageAlt,
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

    .assertion-check {
      background-color: rgba(0, 0, 0, 0.18);
      font-size: 18px;
      padding: 4px;
      border-radius: 50%;
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
