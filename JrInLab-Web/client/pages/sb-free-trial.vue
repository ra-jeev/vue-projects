<template>
  <marketing-container>
    <template #header-bg>
      <div class="header-bg" />
    </template>

    <template #default>
      <div class="card-inner-container">
        <h1 class="page-headline">
          Live online coding classes for kids 6-14 years
        </h1>
        <v-row id="form">
          <v-col cols="12" sm="6">
            <v-card class="form-container" flat>
              <div>
                <div class="form-title mt-1 text-center">
                  Get a FREE trial class
                </div>
                <register-form
                  btn-text="Book your free trial now"
                  btn-color="secondary"
                  form-page="sb-free-trial"
                  success-page="/booking-done"
                  class="mt-4"
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
                Get your free trial class now
              </v-btn>
            </v-card>
          </v-col>
        </v-row>
        <div class="form-title text-center py-3">
          One day your child might start a unicorn
          <span class="display-1">🦄</span>!
        </div>
      </div>
    </template>
    <template #details>
      <div class="section bg--white">
        <v-container>
          <h2 class="section__header text-center">Who we are</h2>
          <v-row align="center" class="mt-6" justify="center">
            <v-col cols="12" lg="3" class="text-center">
              <img src="~/assets/images/children.svg" contain height="172" />
            </v-col>
            <v-col cols="12" lg="5">
              We're a passionate group of coders, educators &mdash; and parents.
              We believe that teaching & handling kids is not a part time job,
              and that is why all of us are fulltime educators here.
              <br />
              <br />
              We have spent a lot of time designing a curriculum which is age
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
            Parents and students love us
          </h2>
          <CardCarousel
            :slides="testimonials"
            :slides-per-screen="2"
            class="mt-12"
            section-bg-color="lighter"
            slide-type="testimonial"
          />
          <v-row class="mt-6" justify="center" no-gutters>
            <v-btn
              class="uncased-btn"
              large
              rounded
              color="secondary"
              @click="$vuetify.goTo('#form')"
            >
              Experience a live class & see why
              <v-icon right> $mdiCastEducation </v-icon>
            </v-btn>
          </v-row>
        </v-container>
      </div>
      <div class="section bg--white">
        <v-container>
          <h2 class="section__header text-center">Our offerings</h2>
          <h3 class="section__subheader text-center">
            Details and road map of our coding courses
          </h3>
          <CoursesOffering class="mt-8" />
          <v-row class="mt-10" justify="center" no-gutters>
            <v-btn
              class="uncased-btn"
              color="secondary"
              large
              rounded
              @click="$vuetify.goTo('#form')"
            >
              Get your child started, now
              <v-icon right> $mdiArrowRight </v-icon>
            </v-btn>
          </v-row>
        </v-container>
      </div>
      <div class="section bg--lighter">
        <v-container>
          <h2 class="section__header text-center">
            Some of our students' creations
          </h2>
          <CardCarousel
            :slides="media"
            :slides-per-screen="2"
            class="mt-12"
            section-bg-color="white"
            slide-type="media"
          />
          <v-row class="mt-10" justify="center" no-gutters>
            <v-btn
              class="uncased-btn"
              large
              rounded
              color="secondary"
              @click="$vuetify.goTo('#form')"
            >
              Start your child's creator journey
              <v-icon right> $mdiCreation </v-icon>
            </v-btn>
          </v-row>
        </v-container>
      </div>
      <div class="section bg--white">
        <v-container>
          <h2 class="section__header text-center">Some FAQs</h2>
          <v-row justify="center" class="mt-8">
            <v-col cols="12" md="10" lg="9">
              <FaqsList :faqs="faqs" class="px-4" />
            </v-col>
          </v-row>
          <v-row class="mt-10" justify="center">
            <v-btn
              class="uncased-btn"
              color="secondary"
              large
              rounded
              @click="$vuetify.goTo('#form')"
            >
              Get a free trial now
              <v-icon right> $mdiArrowRight </v-icon>
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
          icon: require('~/assets/images/doll_play.svg'),
          title: `Coding boosts creativity`,
          description: `Coding gives your child the right tools to bring their ideas to life. This makes it one of the best after school programmes which the kids can do.`,
        },
        {
          icon: require('~/assets/images/web_developer.svg'),
          title: `Project based learning`,
          description: `Coding enables kids to learn and follow the step by step approach for solving a complex problem, by breaking it down into smaller and simpler steps.`,
        },
        {
          icon: require('~/assets/images/graduation.svg'),
          title: `Academic excellence`,
          description: `Coding is "Theory in Action". It helps your child understand and apply the concepts of Maths & Science taught in schools, in a fun and easy way.`,
        },
        {
          icon: require('~/assets/images/teacher.svg'),
          title: `Learn from the best`,
          description: `Our classes are conducted by experienced teachers led by our founders. Your child will always be in a safe and fun environment.`,
        },
      ],
      faqs: [
        {
          question: 'What is Scratch & Python? Who should do what?',
          answer:
            '- Scratch is a programming language made specially for teaching programming to kids. Kids combine different blocks, like Lego, to create logic.\n- On the other hand, Python is a text based programing language where the kids will need to type out the whole code themselves. Python is used everywhere in the real world.\n- Scratch is suitable for all ages, specially for younger kids, while teens can opt for Python.',
        },
        {
          question: `What is the purpose of the trial class?`,
          answer: `- The trial class is for you & your child to get a first hand experience of a live class. You also get to see and understand our teaching methodology.\n- It also gives you an opportunity to interact with the teacher and get your questions answered. We specifically reserve 10 minutes of the trial class for this purpose.\n- Your child will be doing a hands on coding activity following the teacher's instructions. No prior coding experience is needed to do this.`,
        },
        {
          question: `How are the classes conducted?`,
          answer: `- The sessions are conducted online over live video conference.\n- To join the sessions you will need a laptop or a desktop, with a functioning camera and mic, and a reliable internet connection.`,
        },
        {
          question: `Can my child join the class using a mobile?`,
          answer: `- No. Our trial class consists of hands on coding activity which can not be done on a mobile.\n- We'll have to reschedule the session till the time a laptop, or a desktop is available.`,
        },
        {
          question: `How about an iPad/tablet?`,
          answer: `If you must. But to fully enjoy the trial class we recommend that you join using a laptop (with a mouse), or a desktop.`,
        },
        {
          question: `Do you provide a certificate for completing the trial class?`,
          answer: `No. We don't provide any certificate for attending the trial class. We believe that tt has no real meaning, or value.`,
        },
        {
          question: `Ok I'm convinced, but what if I don't like the trial class?`,
          answer: `- No problem. You can simply let us know the same during the feedback interaction with our team after the trial class.\n- **We don't believe in harassing the parents** by making unnecessary calls.`,
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
        {
          text: 'I found it hard to get Vedant to learn coding, but you guys and Scratch did the trick.',
          author: {
            name: 'Vivek Pandey',
            avatar: require('~/assets/images/testimonial-pics/vivek-pandey.jpeg'),
            gender: 'male',
            info: `Vedant's father, USA`,
          },
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
      ],
      socialImage: `https://www.jrinlab.com${require('~/assets/images/hero-image.jpg')}`,
      title: 'Online coding classes for kids 6-14 years',
      description:
        'Channelize your kids screen time, and turn them into creators. Get them started today with a free trial coding class.',
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
