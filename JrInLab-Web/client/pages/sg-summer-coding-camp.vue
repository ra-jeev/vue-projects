<template>
  <marketing-container>
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
                    Coding & Logic Summer Camp for kids 2022
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
                    Utilize your child's summer break with our 2 weeks coding
                    camp for kids. Kids will learn the basics of coding & create
                    cool animations and games. The camp is completely project
                    based, and will cover all the concepts necessary to complete
                    the projects. We'll be running separate batches for:
                  </div>
                  <ul>
                    <li>Scratch summer camp (7+ years)</li>
                    <li>AppLab + WebDev summer camp (10+ years)</li>
                    <li>Python summer camp (12+ years)</li>
                  </ul>
                  <div>
                    The program will culminate into a final project which the
                    children will be creating by applying the concepts learnt
                    during the camp.
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
                    color="secondary"
                    class="mt-8"
                    block
                    large
                    rounded
                    @click="onRegisterBtnClick"
                  >
                    Reserve your child's spot
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
                  <register-form
                    :batches="workshopBatches"
                    :default-country-code="{
                      name: 'Singapore',
                      dialCode: '+65',
                    }"
                    :is-type-workshop="false"
                    btn-color="secondary"
                    btn-text="Register Now"
                    class="mt-6"
                    direct-enroll
                    fb-track-event="Lead"
                    form-page="sg-summer-coding-camp"
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
                <h2 class="assertion-title" v-text="benefit.title" />
                <div
                  class="assertion-text grey--text text--darken-3"
                  v-text="benefit.description"
                />
              </div>
              <v-btn
                class="mt-6 hidden-sm-and-up"
                large
                rounded
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
              founders are alums of <strong>NTU</strong>, Singapore &
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
          <v-row class="mt-6" justify="center" no-gutters>
            <v-btn color="secondary" large rounded @click="onRegisterBtnClick">
              Get your child started now
              <v-icon right> $mdiArrowUp </v-icon>
            </v-btn>
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
          <v-row class="mt-6" justify="center" no-gutters>
            <v-btn color="secondary" large rounded @click="onRegisterBtnClick">
              Book your child's spot now
              <v-icon right> $mdiArrowUp </v-icon>
            </v-btn>
          </v-row>
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
          <v-row class="mt-10" justify="center" no-gutters>
            <v-btn
              color="secondary"
              large
              rounded
              @click="$vuetify.goTo('#form')"
            >
              Get started for your child
              <v-icon right> $mdiArrowUp </v-icon>
            </v-btn>
          </v-row>
        </v-container>
      </div>
      <div class="section bg--white">
        <v-container>
          <h2 class="section__header text-center">
            Websites created by our students
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
              Get your child' website now
              <v-icon right> $mdiCreation </v-icon>
            </v-btn>
          </v-row>
        </v-container>
      </div>
      <div class="section bg--lighter">
        <v-container>
          <h2 class="section__header text-center">Camp FAQs</h2>
          <v-row justify="center" class="mt-8">
            <v-col cols="12" md="10" lg="9">
              <faqs-list :faqs="faqs" class="px-4" section-bg-color="lighter" />
            </v-col>
          </v-row>
          <v-row class="mt-6" justify="center" no-gutters>
            <v-btn color="secondary" large rounded @click="onRegisterBtnClick">
              Book your child's spot now
              <v-icon right> $mdiArrowUp </v-icon>
            </v-btn>
          </v-row>
        </v-container>
      </div>

      <div class="section bg--white">
        <v-container>
          <h2 class="section__header text-center">Our other offerings</h2>
          <courses-offering class="mt-8" />
          <v-row class="mt-6" justify="center" no-gutters>
            <v-btn color="secondary" large rounded @click="onRegisterBtnClick">
              Get started now
              <v-icon right> $mdiArrowUp </v-icon>
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
      socialImage: `https://firebasestorage.googleapis.com/v0/b/jrinlab.appspot.com/o/website%2Fimages%2Fwinter-camp%2Fwinter-camp-sg.jpg?alt=media&token=c90f7bc6-888f-4bc0-9181-c883af80986d`,
      title: `Online Summer Coding Camp for kids 7-14 years`,
      description: `Keep your child creatively engaged during the summer break with our Scratch, AppLab + WebDev & Python coding camps. Small batches. Best instructors.`,
      imageAlt: 'A girl smiling, and working on her laptop',
      overlay: false,
      workshopBatches: [
        {
          label: 'Scratch (7+ Years)',
          value: 'scratch',
        },
        {
          label: 'AppLab & Website Dev (10+ Years)',
          value: 'applab_webdev',
        },
        {
          label: 'Python (12+ Years)',
          value: 'python',
        },
      ],
      benefits: [
        {
          icon: require('~/assets/images/web_developer.svg'),
          title: `Project based learning`,
          description: `These camps are project based, giving a clear idea about what the kids are going to build, and how. This helps them in learning concepts in an easy manner.`,
        },
        {
          icon: require('~/assets/images/good_team.svg'),
          title: `Scratch, AppLab + WebDev & Python Camps`,
          description: `We'll be running summer camp batches for Scratch, AppLab + WebDev and Python. Your child can enrol to more than one camp (if they are eligible).`,
        },
        {
          icon: require('~/assets/images/teacher.svg'),
          title: `Qualified & experienced instructors`,
          description: `The camp will be conducted by experienced teachers led by our founders. Your child will always be in a safe and fun environment.`,
        },
        {
          icon: require('~/assets/images/content.svg'),
          title: `Tangible camp outcome`,
          description: `At the end of the camp, the kids will be able to code animations / games on their own using Scratch / Python. For WebDev they'll create & host their live website.`,
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
          question:
            'What is Scratch, AppLab + WebDev & Python? Who should go for what?',
          answer:
            '- Scratch is a programming language made specially for teaching programming to kids. Kids combine different blocks, like Lego, to create logic.\n- Using AppLab kids get to create projects (using blocks) which give them a feel of a mobile app\n- WebDev is for developing websites & webpages using HTML and some styling.\n- Python is a text based programing language where the kids will need to type out the code themselves. Python is used everywhere in the real world.\n- Scratch is suitable for all ages, specially for younger kids, while teens can opt for Python.',
        },
        {
          question: 'How is the camp conducted?',
          answer:
            '- The sessions are conducted online over live video conference. You will receive the details to join these sessions ahead of time.\n- To join the sessions you will need a laptop or a desktop, with a functioning camera and mic, and a reliable internet connection.',
        },
        {
          question: 'What is the duration of this camp?',
          answer:
            'The camp is **2 weeks long** with **10 sessions overall**. All sessions will be conducted on weekdays.',
        },
        {
          question: 'What is your typical batch size?',
          answer:
            'Our batch size is small, usually between 3-4 students. We have found this to be the optimal group size for meaningful collaboration and individual attention.',
        },
        {
          question: 'What is the camp pricing?',
          answer:
            'The camp fees is ***S$ 199*** all inclusive (for each batch).',
        },
        {
          question: 'Any details of the camp activities?',
          answer: `- There will be separate batches for Scratch, AppLab + WebDev and Python (Turtle) programming languages. Eligible kids can enrol to multiple batches.\n- These camps are completely projects based. Kids will learn to follow a step by step approach to solve a complex problem, by breaking it down into smaller and simpler steps.\n- Kids will also get the exposure to work on different types of problems in different projects.`,
        },
        {
          question: 'What is the outcome of the camp?',
          answer: `- Kids will be able to code cool animations and games using Scratch / Python (Turtle).\n- Kids opting for AppLab + WebDev will be creating a basic website and mobile app at the end of the camp.\n- Visual coding gives children a platform to express their thoughts in an attractive and confident manner.\n- Our camps are structured in a manner that even shy kids open up and express themselves, it will boost their creativity and confidence.`,
        },
        {
          question: 'Will my child get a certificate for the camp?',
          answer: `Yes. All students will receive a camp completion cum participation certificate, signed by our founders, on the completion of the camp.`,
        },
      ],
      tags: ['Creativity', 'Logic', 'Scratch', 'Python', 'WebDev'],
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
          value: '10',
          subvalue: '(5/week)',
        },
        {
          label: 'Session duration',
          value: '60 mins each',
        },
        {
          label: 'Batches starting',
          value: 'Every Week',
          stretch: true,
        },
        {
          label: 'Camp fees (for each batch)',
          value: 'S$ 198',
          subValue: '(10% Early bird discount)',
          strikeValue: '$ 220',
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
          hid: 'og:image:width',
          property: 'og:image:width',
          content: 1200,
        },
        {
          hid: 'og:image:height',
          property: 'og:image:height',
          content: 628,
        },
        {
          hid: 'og:image:alt',
          property: 'og:image:alt',
          content: this.imageAlt,
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: 'https://www.jrinlab.com/sg-summer-coding-camp',
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
  color: $primary-dark;

  .sub-value-text {
    line-height: 1.375;
  }
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
