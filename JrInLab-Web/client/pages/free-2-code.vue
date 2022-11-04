<template>
  <MarketingContainer>
    <template #header-bg>
      <div class="header-bg" />
    </template>
    <template #header>
      <div class="page-headline">
        1 Day Online Coding Workshop!
        <br />
        <span class="page-subheader">
          We're <strong>#free2code</strong>
          <v-icon right dark> $mdiLaptop </v-icon>
        </span>
      </div>
    </template>
    <template #default>
      <div class="card-inner-container">
        <v-row id="form">
          <v-col cols="12" sm="6">
            <v-card class="form-container" flat>
              <div>
                <div class="form-title mt-3 text-center">
                  #free2code workshop, Jan 29, 2022, 2:30 PM IST
                </div>
                <RegisterForm
                  :laptop-mandatory="false"
                  :time-slots="timeSlots"
                  class="mt-4"
                  btn-color="secondary"
                  btn-text="Reserve your child's spot now"
                  direct-enroll
                  fb-track-event="Lead"
                  form-page="free-2-code"
                  google-track-event="generate_lead"
                  success-page="/thank-you"
                  workshop-name="#free2code"
                  campaign-name="free-2-code-01-29"
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
                <div class="assertion-title d-flex align-center">
                  <v-icon left class="assertion-check"> $mdiCheck </v-icon>
                  {{ benefit.title }}
                </div>
                <div
                  class="assertion-text"
                  v-html="$md.render(benefit.description)"
                />
              </div>
              <v-btn
                class="mt-6 hidden-sm-and-up"
                large
                rounded
                block
                color="primary"
                @click="$vuetify.goTo('#form')"
              >
                Register for the workshop now
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
              Join the workshop to see why
              <v-icon right> $mdiCastEducation </v-icon>
            </v-btn>
          </v-row>
        </v-container>
      </div>
      <div class="section bg--white">
        <v-container>
          <h2 class="section__header text-center">Our offerings</h2>
          <CoursesOffering class="mt-8" />
          <v-row class="mt-10" justify="center" no-gutters>
            <v-btn
              class="uncased-btn"
              color="secondary"
              large
              rounded
              @click="$vuetify.goTo('#form')"
            >
              Register for the workshop now
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
              Get your child started now
              <v-icon right> $mdiArrowRight </v-icon>
            </v-btn>
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
          <v-row class="mt-10" justify="center">
            <v-btn
              class="uncased-btn"
              color="secondary"
              large
              rounded
              @click="$vuetify.goTo('#form')"
            >
              Limited spots available, book now
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
      benefits: [
        // {
        //   title: `Independence Day weekend`,
        //   description: `The workshop will be conducted on August 14 & 15, 2021, each session duration being 60 minutes.`,
        // },
        {
          title: `Beginner friendly`,
          description: `We will introduce the basics of block coding during the workshop. Your child will learn to code an interactive animation or a game.`,
        },
        {
          title: `Age appropriate batches`,
          description: `To ensure age appropriate learning, there will be separate batches for 7-9 & 10-12 age groups.\nWorkshop Timing: **2:30-3:30 PM IST, Jan 29, 2022**`,
        },
        {
          title: `#Free2Code`,
          // description: `To celebrate the special occasion of India's Independence Day, we're organizing this workshop completely free of cost.`,
          description: `This workshop is absolutely at no cost to you. We strive to introduce coding to as many kids as possible through these workshops.`,
        },
        {
          title: `Learn from the best`,
          description: `The workshop will be conducted by an experienced team led by our founders. Grab this wonderful opportunity now.`,
        },
        {
          title: `Workshop participation certificate`,
          description: `All students who join the session will receive a participation certificate on the completion of the workshop.`,
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
      faqs: [
        {
          question: 'Who is this for?',
          answer: `- This workshop is ideal for children of ages 7-12 years. To ensure age appropriate learning, we'll run separate batches for age groups 7-9 & 10-12.\n- Children having interest in video games and technology will particularly enjoy it.\n- No prior coding experience of any kind is needed.`,
        },
        {
          question: 'How is the workshop conducted?',
          answer:
            '- The sessions are conducted online over live video conference. You will receive the details to join these sessions ahead of time.\n- You child can join the sessions using a mobile/tablet/iPad or a laptop/desktop. To follow along properly and code with us, we recommend that your child join using a laptop/desktop.',
        },
        {
          question: 'What is the workshop duration & pricing?',
          // answer: `- The workshop is **2 days long**, each session duration being **60 mins**.\n- The celebrate the special occasion of India's Independence Day, we're conducting this workshop completely **free of cost**.`,
          answer: `- The workshop will consist of one session of **60 mins** duration, and will be conducted on **Jan 29, 2022**.\n- Batch Timing: **2:30-3:30 PM IST**\n- This workshop is absolutely **free of cost**.`,
        },
        {
          question: 'What is the outcome of the workshop?',
          answer: `Your child will learn the basics of block coding (Scratch) using which they'll be able to code an interactive animation or a game.`,
        },
        {
          question: 'Will my child get a certificate for the workshop?',
          answer:
            'Yes. All children who join the session will receive a participation certificate on the completion of the workshop.',
        },
      ],
      timeSlots: [
        // {
        //   label: '11:00 AM IST',
        //   value: '140821-1100',
        // },
        // {
        //   label: '4:00 PM IST',
        //   value: '140821-1600',
        // },
      ],
      socialImage: `https://firebasestorage.googleapis.com/v0/b/jrinlab.appspot.com/o/website%2Fimages%2Ffree2code-workshop.jpg?alt=media&token=b3dea0e6-f524-4814-ae8b-195317e9bd10`,
      title: `JrInLab's #free2code coding workshop for kids 7-12 years`,
      description: `Introduce your child to coding, join JrInLab's #free2code online workshop on Jan 29, 2022. Your child will learn to code an interactive animation or game using block coding during the workshop.`,
      imageAlt: `Laptop graphic showing Scratch block coding page`,
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
}
</script>

<style lang="scss" scoped>
.card-inner-container {
  padding: 24px 16px;
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
  background-color: rgba(18, 40, 236, 0.2);
  color: #1228ec;
  border-radius: 50%;
  padding: 2px;
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
  color: #1228ec;

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
}

.play-btn {
  transition: 0.3s all cubic-bezier(0.455, 0.03, 0.515, 0.955);
}

.play-btn--hovered {
  transform: scale(1.2);
}
</style>
