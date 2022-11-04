<template>
  <marketing-container>
    <template #header-bg>
      <div class="header-bg" />
    </template>

    <template #header>
      <h1 class="page-headline">{ tech club } for Schools</h1>
    </template>

    <template #default>
      <div class="card-inner-container">
        <v-row id="form">
          <v-col cols="12" sm="6">
            <v-card class="form-container" flat>
              <div>
                <div class="form-title mt-2 text-center">
                  Get Your School The JrInLab Edge
                </div>
                <v-form ref="form" lazy-validation @submit.prevent="submitForm">
                  <v-card-text
                    :class="{ 'px-0': $vuetify.breakpoint.xsOnly }"
                    class="mt-2"
                  >
                    <v-text-field
                      v-model="form.name"
                      :rules="[requiredRules('Your name')]"
                      append-icon="$mdiAccountOutline"
                      label="Your name *"
                      outlined
                      required
                      shaped
                      validate-on-blur
                    />
                    <v-select
                      v-model="form.role"
                      :items="roles"
                      :rules="[requiredRules('Your role')]"
                      label="Your role at School *"
                      outlined
                      required
                      shaped
                    />
                    <mobile-phone-field
                      v-model="form.phone"
                      append-icon="$mdiPhoneOutline"
                      label="Your Mobile No."
                      outlined
                      shaped
                    />
                    <v-text-field
                      v-model="form.school"
                      :rules="[requiredRules('School name')]"
                      append-icon="$mdiCastEducation"
                      label="School name *"
                      outlined
                      required
                      shaped
                      validate-on-blur
                    />
                    <v-textarea
                      v-model="form.message"
                      append-icon="$mdiMessageTextOutline"
                      label="Your Message"
                      outlined
                      rows="3"
                      shaped
                      validate-on-blur
                    />
                    <v-alert
                      v-model="alert.show"
                      :type="alert.type"
                      prominent
                      dismissible
                    >
                      {{
                        alert.type === 'success'
                          ? alert.message.success
                          : alert.message.failure
                      }}
                    </v-alert>
                    <v-btn
                      :disabled="loading"
                      :loading="loading"
                      block
                      color="secondary"
                      rounded
                      type="submit"
                      x-large
                    >
                      Submit
                      <v-icon right> $mdiArrowRight </v-icon>
                    </v-btn>
                  </v-card-text>
                </v-form>
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
                Get a callback now
              </v-btn>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </template>
    <template #details>
      <div class="section bg--lighter">
        <v-container>
          <h2 class="section__header text-center">What is { tech club }?</h2>
          <v-row align="center" class="mt-6" justify="center">
            <v-col class="section__description" cols="12" sm="10" lg="8">
              <p>
                JrInLab's "Tech Clubs" aim to supplement schools, in their quest
                to provide quality technical education to their students.
              </p>
              <p>
                Hiring and retaining good technical educators for smaller, and
                independent schools is very difficult, more so, if you're in a
                non-metro city or town. At the same time, the technical field is
                quite vast, and ever changing, so it is not possible for a
                single faculty to keep pace with this rapid change.
              </p>
              <p>
                We, at JrInLab, aim to change this through the concept of tech
                clubs. Tech club gives your school access to:
              </p>
              <ul>
                <li>Experts in various technical fields</li>
                <li>Up-to-date & frequently refreshed quality curriculum</li>
                <li>
                  A channel for your students to collaborate and learn from each
                  other
                </li>
              </ul>
            </v-col>
          </v-row>
        </v-container>
      </div>
      <div class="section bg--white">
        <v-container>
          <h2 class="section__header text-center">{ tech club } Activities</h2>
          <v-row justify="space-between" class="mt-12">
            <v-col cols="12" sm="3">
              <v-card class="section-card">
                <div class="pa-4">
                  <v-img
                    :src="require('~/assets/images/programming.svg')"
                    alt="Illustration of coding"
                    height="120"
                    max-width="100%"
                    contain
                  />
                </div>
                <v-card-title class="card-title justify-center mt-4">
                  Coding & Website hosting
                </v-card-title>
              </v-card>
            </v-col>
            <v-col cols="12" sm="3">
              <v-card class="section-card">
                <div class="pa-4">
                  <v-img
                    :src="require('~/assets/images/robotics_iot.svg')"
                    alt="Illustration of robotics and IoT"
                    height="120"
                    max-width="100%"
                    contain
                  />
                </div>
                <v-card-title class="card-title justify-center mt-4">
                  Robotics, Circuits & IoT
                </v-card-title>
              </v-card>
            </v-col>
            <v-col cols="12" sm="3">
              <v-card class="section-card">
                <div class="pa-4">
                  <v-img
                    :src="
                      require('~/assets/images/artificial_intelligence_1.svg')
                    "
                    alt="Depiction of A.I."
                    height="120"
                    max-width="100%"
                    contain
                  />
                </div>
                <v-card-title class="card-title justify-center mt-4">
                  AI, 3D Modeling & Design
                </v-card-title>
              </v-card>
            </v-col>
            <v-col cols="12" sm="3">
              <v-card class="section-card">
                <div class="pa-4">
                  <v-img
                    :src="require('~/assets/images/duplicate.svg')"
                    alt="Depiction of more activities"
                    height="120"
                    max-width="100%"
                    contain
                  />
                </div>
                <v-card-title class="card-title justify-center mt-4">
                  And much more...
                </v-card-title>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </div>
      <div class="section bg--lighter">
        <v-container>
          <h2 class="section__header text-center">
            Parents and students love us
          </h2>
          <card-carousel
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
              To know more, talk to us now
              <v-icon right> $mdiCastEducation </v-icon>
            </v-btn>
          </v-row>
        </v-container>
      </div>
      <div class="section bg--white">
        <v-container>
          <h2 class="section__header text-center">Our kids in action</h2>
          <h3 class="section__subheader mt-2 text-center">
            Some pictures of our students & their projects' presentations
          </h3>
          <card-carousel
            :aspect-ratio="4 / 3"
            :slides="campsMedia"
            :slides-per-screen="2"
            class="mt-12"
            section-bg-color="lighter"
            slide-type="media"
          />
          <v-row class="mt-10" justify="center" no-gutters>
            <v-btn
              class="uncased-btn"
              color="secondary"
              large
              rounded
              @click="$vuetify.goTo('#form')"
            >
              Get started for your school
              <v-icon right> $mdiArrowUp </v-icon>
            </v-btn>
          </v-row>
        </v-container>
      </div>
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
              class="uncased-btn"
              large
              rounded
              color="secondary"
              @click="$vuetify.goTo('#form')"
            >
              Get your students' websites online
              <v-icon right> $mdiCreation </v-icon>
            </v-btn>
          </v-row>
        </v-container>
      </div>
      <div class="section bg--white">
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
              class="uncased-btn"
              color="secondary"
              large
              rounded
              @click="$vuetify.goTo('#form')"
            >
              Fill the form to get a callback
              <v-icon right> $mdiArrowUp </v-icon>
            </v-btn>
          </v-row>
        </v-container>
      </div>
    </template>
  </marketing-container>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  layout: 'sahitya-bhawan',
  data() {
    return {
      form: {
        name: null,
        school: null,
        role: null,
        phone: { number: null, country: null },
        message: null,
      },
      loading: false,
      roles: [
        'School Owner',
        'Trustee / Director',
        'Principal',
        'Teacher',
        'Other',
      ],
      alert: {
        show: false,
        type: 'success',
        message: {
          success:
            "Thank you! Your request was successful. We'll reach out to you soon.",
          failure:
            'Oops! Failed to submit your message, please try again later.',
        },
      },
      requiredRules: (type) => {
        return (v) => !!v || `${type} is required.`
      },
      benefits: [
        {
          icon: require('~/assets/images/content.svg'),
          title: 'Quality Tech Curriculum',
          description:
            'Our curriculum is reviewed and refreshed frequently based on how it is received by students. This keeps it up-to-date and relevant.',
        },
        {
          icon: require('~/assets/images/experts.svg'),
          title: 'Access to Experts',
          description:
            'Tech club brings you at par with other schools, by providing you access to experts in different technical fields.',
        },
        {
          icon: require('~/assets/images/building_blocks.svg'),
          title: 'Hands On, Experiential Learning',
          description:
            'No boring lectures. Our curriculum focuses heavily on projects based hands on, experiential learning with active doubt clearing and regular assessments.',
        },
        {
          icon: require('~/assets/images/teaching_1.svg'),
          title: 'Mentoring School Teams',
          description:
            'It is equally important for students to take part in competitions to build confidence. Tech club mentors school teams for various competitions, to bring laurels to your school.',
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
      campsMedia: [
        {
          src: require('~/assets/images/school-camps/pic_1.jpg'),
          alt: 'Karnal students learning about web development',
        },
        {
          src: require('~/assets/images/school-camps/pic_2.jpg'),
          alt: 'MPS World School, Agra students working on their websites',
        },
        {
          src: require('~/assets/images/school-camps/pic_3.jpg'),
          alt: 'MPS World School, Agra students showing their IoT kits & project sheets',
        },
        {
          src: require('~/assets/images/school-camps/pic_4.jpg'),
          alt: 'Online camp students learning about Scratch',
        },
        {
          src: require('~/assets/images/school-camps/pic_5.png'),
          alt: 'Students interacting & learning about Scratch',
        },
        {
          src: require('~/assets/images/school-camps/pic_6.png'),
          alt: 'Students participating in the online summer camp',
        },
        {
          src: require('~/assets/images/school-camps/pic_7.png'),
          alt: 'Culmination of offline summer camp in Karnal, organized by the district administration',
        },
        {
          src: require('~/assets/images/school-camps/pic_8.png'),
          alt: 'Girls School, Karnal students posing with their IoT kits',
        },
        {
          src: require('~/assets/images/school-camps/pic_9.png'),
          alt: 'Certificate & Prize distribution ceremony for Karnal Govt. School students',
        },
        {
          src: require('~/assets/images/school-camps/pic_10.png'),
          alt: 'MPS World School, Agra students working on their IoT project',
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
      title: 'Tech club for school students',
      description:
        'Sahitya Bhawan & JrInLab present tech club for schools, a one stop solution for all your tech education needs for your school students.',
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
          hid: 'og:url',
          property: 'og:url',
          content: 'https://www.jrinlab.com/sb-school-partnerships',
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
      ],
    }
  },
  methods: {
    ...mapActions('user', ['sendPartnershipMessage']),
    async submitForm() {
      this.alert.show = false

      if (this.$refs.form.validate()) {
        this.loading = true
        try {
          const data = {
            page: 'sb-school-partnerships',
            name: this.form.name.trim(),
            school: this.form.school.trim(),
            role: this.form.role,
            phone: this.form.phone.number.trim(),
            country: {
              name: this.form.phone.country.name,
              dialCode: this.form.phone.country.calling_code,
            },
            query: this.$route.query,
          }

          if (this.form.message) {
            data.message = this.form.message.trim()
          }

          await this.sendPartnershipMessage({ data })

          this.$refs.form.reset()
          this.alert.type = 'success'
        } catch (error) {
          this.alert.type = 'error'
        }

        this.alert.show = true
        this.loading = false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.card-title {
  font-size: 1.125rem;
  line-height: 1.25;
}

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
  padding: 8px 12px 16px 12px;
  text-align: center;
  color: white;
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
