<template>
  <MarketingContainer class="transparent-card">
    <template #header-bg>
      <div class="header-bg" />
    </template>
    <template #default>
      <v-row justify="center">
        <v-col cols="12" md="10">
          <v-card class="form-container">
            <v-window id="form" v-model="step">
              <v-window-item :value="1">
                <div class="details-label mt-2">
                  Bring out the creative side of your child
                </div>
                <h1 class="page-headline">Online Summer Camp for Kids</h1>

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
                    :src="socialImage"
                    contain
                  />
                </v-card>

                <div class="form-title mt-6">About the camp</div>
                <div class="grey--text text--darken-3 mt-3">
                  Utilize your child's summer break with our "Block Animation &
                  Web Development" summer camps for kids. These camps are
                  completely project based, and will cover all the concepts
                  necessary to complete the projects.
                </div>
                <div class="grey--text text--darken-3 mt-3">
                  We'll be running separate batches for:
                </div>
                <ul class="grey--text text--darken-3">
                  <li>Scratch animation (7+ years)</li>
                  <li>App development with AppLab (9+ years)</li>
                  <li>Web development basics (10+ years)</li>
                  <li>Python basics (12+ years)</li>
                </ul>
                <div class="grey--text text--darken-3 mt-3">
                  The program will culminate into a final project which the
                  children will be creating by applying the concepts learnt
                  during the camp.
                </div>

                <div class="form-title mt-8">Camp details</div>
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
                      :class="{ 'price-text': campDetail.isPrice }"
                      class="details-text"
                    >
                      {{ campDetail.value }}
                      <span
                        v-if="campDetail.strikeValue"
                        class="ml-1 sub-value-text strike-text"
                      >
                        {{ campDetail.strikeValue }}
                      </span>
                      <span
                        v-if="campDetail.subValue"
                        class="ml-1 sub-value-text hidden-xs-only"
                      >
                        {{ campDetail.subValue }}
                      </span>
                      <div
                        v-if="campDetail.subValue"
                        class="sub-value-text hidden-sm-and-up"
                      >
                        {{ campDetail.subValue }}
                      </div>
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
                  Book your child's spot now
                  <v-icon right> $mdiArrowRight </v-icon>
                </v-btn>

                <div class="text-center my-2">
                  Limited spots. No payment needed for booking!
                </div>
              </v-window-item>
              <v-window-item :value="2">
                <div class="form-title mt-3 text-center">
                  Register for the Summer Camp
                </div>
                <RegisterForm
                  :laptop-mandatory="false"
                  :get-laptop-availability="false"
                  :batches="workshopBatches"
                  :default-country-code="{
                    name: 'United Arab Emirates',
                    dialCode: '+971',
                  }"
                  btn-color="secondary"
                  btn-text="Submit Now"
                  direct-enroll
                  form-page="summer-camp-2022"
                  success-page="/camp-booking-done"
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
          <h2 class="section__header text-center">What your child will get?</h2>
          <v-row class="mt-10" justify="center">
            <v-col
              v-for="(benefit, index) in benefits"
              :key="`benefit_${index}`"
              cols="12"
              sm="6"
            >
              <v-card class="info-card d-sm-flex">
                <v-img :src="benefit.icon" :width="120" contain />

                <div class="info-card-texts">
                  <div class="info-title">{{ benefit.title }}</div>
                  <div class="info-description markdown-text">
                    {{ benefit.description }}
                  </div>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </div>
      <div class="section bg--lighter">
        <v-container>
          <h2 class="section__header text-center">
            Happy stories from previous camps
          </h2>
          <h3 class="section__subheader mt-2 text-center">
            Parents and students love us
          </h3>
          <card-carousel
            :slides="testimonials"
            :slides-per-screen="2"
            class="mt-12"
            section-bg-color="lighter"
            slide-type="testimonial"
          />
        </v-container>
      </div>
      <div class="section bg--light">
        <v-container>
          <h2 class="section__header text-center">
            Want to engage & delight your kid?
          </h2>
          <v-row class="mt-12" justify="center" no-gutters>
            <v-btn
              color="secondary"
              x-large
              rounded
              @click="onRegisterBtnClick"
            >
              Get them started now
              <v-icon right> $mdiArrowRight </v-icon>
            </v-btn>
          </v-row>
        </v-container>
      </div>
      <div class="section bg--lighter">
        <v-container>
          <h2 class="section__header text-center">Camp FAQs</h2>
          <v-row justify="center" class="mt-8">
            <v-col cols="12" md="10" lg="9">
              <FaqsList :faqs="faqs" section-bg-color="lighter" />
            </v-col>
          </v-row>
        </v-container>
      </div>
      <div class="section bg--white">
        <v-container>
          <h2 class="section__header text-center">
            Glimpses of previous camps
          </h2>
          <h3 class="section__subheader mt-2 text-center">
            Some pictures of our students & their projects' presentations
          </h3>
          <card-carousel
            :slides="campMedia"
            :slides-per-screen="2"
            class="mt-12"
            section-bg-color="white"
            slide-type="media"
          />
        </v-container>
      </div>
      <div class="section bg--lighter">
        <v-container>
          <h2 class="section__header text-center">
            Some projects by our students
          </h2>
          <h3 class="section__subheader mt-2 text-center">
            Projects created using scratch and App Lab during regular classes
            and camps
          </h3>
          <card-carousel
            :slides="media"
            :slides-per-screen="2"
            class="mt-12"
            section-bg-color="lighter"
            slide-type="media"
          />
        </v-container>
      </div>
      <div class="section bg--white">
        <v-container>
          <h2 class="section__header text-center">
            Websites created by our students
          </h2>
          <h3 class="section__subheader mt-2 text-center">
            Websites created just after 4-5 days of basic HTML learning during
            various camps
          </h3>
          <card-carousel
            :aspect-ratio="1.91"
            :slides="websites"
            :slides-per-screen="2"
            class="mt-12"
            section-bg-color="white"
            slide-type="media"
          />
        </v-container>
      </div>
      <div class="section bg--light">
        <v-container>
          <h2 class="section__header text-center">Limited spots available</h2>
          <v-row class="mt-12" justify="center" no-gutters>
            <v-btn
              color="secondary"
              x-large
              rounded
              @click.stop="onRegisterBtnClick"
            >
              Reserve one for your kid now
              <v-icon right> $mdiArrowRight </v-icon>
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
      title: 'Online Summer Coding Camp for kids 7-14 years',
      description:
        'Keep your child creatively engaged during the summer break with our Scratch, AppLab, WebDev & Python (Turtle) camps. Small batches. Best instructors.',
      imageAlt: 'Image depicting a girl, smiling and working on her laptop',
      socialImage: `https://firebasestorage.googleapis.com/v0/b/jrinlab.appspot.com/o/website%2Fimages%2Fwinter-camp%2Fwinter-camp-sg.jpg?alt=media&token=c90f7bc6-888f-4bc0-9181-c883af80986d`,
      loading: false,
      expand: false,
      step: 1,
      tags: [
        'Scratch Animation',
        'App Development',
        'Block Coding',
        'Web Development',
        'Python (Turtle)',
      ],
      campDetails: [
        {
          label: 'Each Camp duration',
          value: '12 Sessions',
        },
        {
          label: 'Session duration',
          value: '60 mins each',
        },
        {
          label: 'Designed for',
          value: 'Ages 7+ years',
        },
        {
          label: 'Batches starting from',
          value: 'July 15, 20 & more',
        },
        {
          label: 'Camp fees (for each batch)',
          value: 'INR 3600',
          stretch: true,
          isPrice: true,
        },
      ],
      benefits: [
        {
          icon: require('~/assets/images/web_developer.svg'),
          title: `Project based learning`,
          description: `These camps are project based, giving a clear idea about what the kids will create, and how. This helps them in learning concepts in an easy manner.`,
        },
        {
          icon: require('~/assets/images/good_team.svg'),
          title: `Age appropriate batches`,
          description: `We'll be running separate batches for Scratch, AppLab, WebDev and Python programming. Your child can enrol in more than one batch (if they are eligible).`,
        },
        {
          icon: require('~/assets/images/teacher.svg'),
          title: `Qualified & friendly instructors`,
          description: `The camp will be conducted by experienced instructors led by our founders. Your child will always be in a safe and fun environment.`,
        },
        {
          icon: require('~/assets/images/certificate.svg'),
          title: `Camp participation certificate`,
          description: `On the completion of the camp, all students who successfully complete their final project will receive a camp completion certificate.`,
        },
      ],
      testimonials: [
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
          text: `Due to homeschooling, Alexander was very shy on the first day of the camp, but thanks to your patience and support he is very much comfortable speaking up now. The camp was very nice, and he enjoyed a lot.`,
          author: {
            name: 'Carmel Gevers',
            avatar: require('~/assets/images/testimonial-pics/carmel-gevers.png'),
            gender: 'female',
            info: `Alexander's mother, Singapore`,
          },
        },
        {
          text: `Anthony enjoyed the classes and very much liked the teacher. She is very patient to him and willing to listen. She explains things very well and has good program structure.`,
          author: {
            name: 'Lan Huyen',
            gender: 'female',
            info: `Anthony's mother, Singapore`,
          },
        },
        {
          text: `Harith enjoyed the camp and he shared he learned to code like moving the blocks, making the object move. He says he will try to scratch a new project to see if he still remembers the steps. Overall he is intrigued and willing to learn more.`,
          author: {
            name: 'Anna Hussein',
            gender: 'female',
            info: `Harith's mother, Singapore`,
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
          text: 'Tanish found it absolutely interesting. It is interesting to see how he applies logic. He has completed about 10 projects and everytime he finishes a project he will call everyone and showcase his project feeling a sense of achievement.',
          author: {
            name: 'Ms Priya',
            avatar: require('~/assets/images/testimonial-pics/tanish-with-parents.png'),
            gender: 'female',
            info: `Tanish's mother, Bengaluru`,
          },
        },
      ],
      faqs: [
        {
          question: 'Who is this for?',
          answer:
            '- This camp is ideal for kids of ages 7-14 years.\n- Kids having interest in video games and technology will particularly enjoy it.\n- No prior coding experience of any kind is needed.',
        },
        {
          question:
            'What is Scratch, AppLab, WebDev & Python? Who should go for what?',
          answer:
            '- Scratch is a programming language made specially for teaching programming to kids. Kids combine different blocks, like Lego, to create logic.\n- Using AppLab kids get to create projects (using blocks) which give them a feel of a mobile app.\n- WebDev is for developing websites & webpages using HTML and some styling.\n- Python is a text based programing language where the kids will need to type out the code themselves. Python is used everywhere in the real world.\n- Scratch is suitable for all ages, specially for younger kids, while teens can opt for WebDev or Python.',
        },
        {
          question: 'How is the camp conducted?',
          answer:
            '- The sessions are conducted online over live video conference. You will receive the details to join these sessions ahead of time.\n- To join the sessions you will need a laptop or a desktop, with a functioning camera and mic, and a reliable internet connection.',
        },
        {
          question: 'What is the duration of this camp?',
          answer:
            'The camp will have **12 sessions overall** for each batch. These sessions will be spread over a month so that your child remains engaged for longer duration.',
        },
        {
          question: 'Will there be a trial class?',
          answer:
            "Since this is a group activity we won't be able to provide a trial class for the camp.",
        },
        {
          question: 'What is your typical batch size?',
          answer:
            'Our batch size is small, usually between 3-4 students. We have found this to be the optimal group size for meaningful collaboration and individual attention.',
        },
        {
          question: 'What is the camp pricing?',
          answer:
            'The camp fees is ***INR 3600*** all inclusive (for each batch).',
        },
        {
          question: 'Any details of the camp activities?',
          answer: `- There will be separate batches for Scratch, AppLab, WebDev and Python. Eligible kids can enrol in multiple batches.\n- These camps are completely projects based. Kids will learn to follow a step by step approach to solve a complex problem, by breaking it down into smaller and simpler steps.\n- Kids will also get the exposure to work on different types of problems in different projects.`,
        },
        {
          question: 'What is the outcome of the camp?',
          answer: `- Kids will be able to code cool animations and games using Scratch / Python (Turtle).\n- Kids opting for AppLab will be creating a mobile app at the end of the camp.\n- Web development students will learn the basics of HTML and create a basic website. They'll also learn to host it publicly on our platform.`,
        },
        {
          question: 'My kid is very shy, will they be able to cope up?',
          answer: `Yes, of course.\n- Visual coding gives children a platform to express their thoughts in an attractive and confident manner.\n- Our camps are structured in a manner that even shy kids open up and express themselves, it will boost their creativity and confidence.`,
        },
        {
          question: 'Will my child get a certificate for the camp?',
          answer: `Yes. All students who successfully complete their final project will receive a camp completion certificate, signed by our founders, on the completion of the camp.`,
        },
      ],
      campMedia: [
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
      media: [
        {
          src: require('~/assets/images/thumb-Highway-Surfers.png'),
          alt: 'Highway surfers game by 13 years old Aditi',
          vidsrc: 'https://www.youtube.com/embed/aCZomO8K9wQ',
        },
        {
          src: require('~/assets/images/thumb-Flappy-Bird.png'),
          alt: 'Flappy bird game by 10 years old Arjun',
          vidsrc: 'https://www.youtube.com/embed/-gBtO2rGQtg',
        },
        {
          src: require('~/assets/images/thumb-Platformer-Game.png'),
          alt: 'Platformer game by 10 years old Vedant',
          vidsrc: 'https://www.youtube.com/embed/rsVsCwEEzic',
        },
        {
          src: require('~/assets/images/thumb-Solar-System.png'),
          alt: 'Solar system animation by 6 years old Rafael',
          vidsrc: 'https://www.youtube.com/embed/qRyE_Mj3oJ0',
        },
        {
          src: require('~/assets/images/thumb-Space-Game.png'),
          alt: 'Space game by 11 years old Aniruddh',
          vidsrc: 'https://www.youtube.com/embed/BEMdTcUY0Qo',
        },
        {
          src: require('~/assets/images/thumb-Tunnel-Game.png'),
          alt: 'Multi level maze game by 12 years old Samridh',
          vidsrc: 'https://www.youtube.com/embed/Q67jN8DPEKo',
        },
        {
          src: require('~/assets/images/school-camps/Harry-Potter-App-1.png'),
          alt: 'Harry potter app created by one of our students',
        },
        {
          src: require('~/assets/images/school-camps/Harry-Potter-App-2.png'),
          alt: 'Harry potter app created by one of our students',
        },
      ],
      websites: [
        {
          src: require('~/assets/images/websites/rishabh.png'),
          alt: 'Webpage by Rishabh, from Govt. School, Karnal, stressing on the need to save environment',
        },
        {
          src: require('~/assets/images/websites/allaboutsudhamurthy.png'),
          alt: 'Webpage by Nikhita, from 21K School, about Ms Sudha Murthy',
        },
        {
          src: require('~/assets/images/websites/savemarinelife.png'),
          alt: 'Webpage by Nikhila, from 21K School, on how to save marine life',
        },
        {
          src: require('~/assets/images/websites/anshita-pgl.png'),
          alt: 'Webpage by Ankit, from Govt. School, Karnal, on management basics',
        },
        {
          src: require('~/assets/images/websites/introfalightmotion.png'),
          alt: 'Webpage by Atharv, from MPS School, Agra, on how to Alight Motion for editing',
        },
        {
          src: require('~/assets/images/websites/cellularrespiration.png'),
          alt: 'Webpage by Shivoham, from 21K School, on cellular respiration topic',
        },
      ],
      workshopBatches: [
        {
          label: 'Scratch animation (7+ Years)',
          value: 'scratch',
        },
        {
          label: 'App development with AppLab (9+ Years)',
          value: 'applab',
        },
        {
          label: 'Web Development (10+ Years)',
          value: 'webdev',
        },
        {
          label: 'Python basics (12+ Years)',
          value: 'python',
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
      this.$nextTick(() => {
        this.step = 2
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

  .strike-text {
    text-decoration: line-through;
  }

  .sub-value-text {
    color: grey;
    font-size: 60%;
  }
}

.details-text.price-text {
  font-size: 2rem;
  line-height: 2.5rem;
  color: #e01b84;

  .sub-value-text {
    line-height: 1.375;
  }
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

.info-card {
  padding: 16px;
  border-radius: 12px !important;

  .info-card-texts {
    padding-left: 16px;

    .info-title {
      font-size: 1.25rem;
      font-weight: 500;
    }

    .info-description {
      margin-top: 8px;
      font-size: 1rem;
      line-height: 1.375rem;
    }
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

  .info-card {
    .info-card-texts {
      padding-left: 0;
      padding-top: 12px;
    }
  }
}

.play-btn {
  transition: 0.3s all cubic-bezier(0.455, 0.03, 0.515, 0.955);
}

.play-btn--hovered {
  transform: scale(1.2);
}
</style>
