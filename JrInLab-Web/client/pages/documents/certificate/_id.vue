<template>
  <v-container class="pa-0">
    <v-progress-linear v-if="loading" indeterminate large />
    <v-card
      v-else-if="currCustomer"
      class="text-center certificate-card-outer"
      flat
    >
      <v-card-text
        :class="`certificate-${cardBackground}`"
        class="certificate-card"
      >
        <logo-base height="72" dark />
        <div class="certificate-name">
          {{ certificateType }}
        </div>
      </v-card-text>
      <div v-if="isMaths" class="py-4" />
      <div :class="startDate ? 'mt-14' : 'mt-16'" class="certificate-text">
        THIS CERTIFICATE IS PRESENTED TO
      </div>
      <div class="awardee-name">
        {{ currCustomer.kidsName }}
      </div>
      <div :class="isSummer ? 'mt-9' : 'mt-6'" class="certificate-text">
        for
      </div>
      <div
        :class="isSummer ? 'mt-8' : 'mt-6'"
        class="certificate-text mx-8 px-16"
        v-html="certificateText"
      />
      <div v-if="isMaths" class="py-4" />
      <v-row :class="isSummer ? 'mt-12' : 'mt-10'" no-gutters justify="center">
        <v-img
          :src="require('~/assets/images/certificate-ribbon.png')"
          max-width="90%"
          contain
        >
          <v-row
            no-gutters
            justify="center"
            align="center"
            class="certificate-banner-text fill-height"
          >
            {{ bannerText }}
          </v-row>
        </v-img>
      </v-row>
      <v-row v-if="startDate" justify="center" class="certificate-dates">
        {{ startDate }} - {{ endDate }}
      </v-row>
      <div v-if="isMaths" class="py-10" />
      <v-row
        v-if="isMaths"
        align="center"
        class="pb-6"
        justify="center"
        no-gutters
      >
        <v-col cols="4">
          <v-row no-gutters justify="center">
            <div>
              <v-row no-gutters justify="center">
                <v-img
                  :src="require('~/assets/images/manu-tripathi-signature.png')"
                  max-width="60%"
                />
              </v-row>
              <v-divider class="mx-auto my-4" color="grey" width="70%" />
              <div class="signature-names">Manu Tripathi</div>
            </div>
          </v-row>
        </v-col>

        <v-col cols="4">
          <v-row no-gutters justify="center">
            <v-img
              :src="require('~/assets/images/certificate-badge.png')"
              max-width="160"
              contain
            >
              <v-row
                no-gutters
                align="center"
                justify="center"
                class="fill-height"
              >
                <div class="certified">
                  <span class="brand">JrInLab</span>
                  <br />
                  <span class="text">CERTIFIED</span>
                </div>
              </v-row>
            </v-img>
          </v-row>
        </v-col>
      </v-row>
      <v-row
        v-else
        :class="startDate ? 'mt-12' : 'mt-14'"
        align="center"
        justify="center"
        no-gutters
        class="pb-6"
      >
        <v-col cols="4">
          <v-row no-gutters justify="center">
            <div>
              <v-row no-gutters justify="center">
                <v-img
                  :src="require('~/assets/images/vivek-signature.png')"
                  max-width="60%"
                />
              </v-row>
              <v-divider class="mx-auto my-4" color="grey" width="70%" />
              <div class="signature-names">
                Vivek Negi<br />
                Co-Founder, JrInLab
              </div>
            </div>
          </v-row>
        </v-col>

        <v-col cols="4">
          <v-row no-gutters justify="center">
            <v-img :src="require('~/assets/images/firmware.svg')" />

            <v-img
              :src="require('~/assets/images/certificate-badge.png')"
              max-width="120"
              contain
              style="margin-top: -34px"
            >
              <v-row
                no-gutters
                align="center"
                justify="center"
                class="fill-height"
              >
                <div class="certified">
                  <span class="brand">JrInLab</span>
                  <br />
                  <span class="text">CERTIFIED</span>
                </div>
              </v-row>
            </v-img>
          </v-row>
        </v-col>

        <v-col cols="4">
          <v-row no-gutters justify="center">
            <div>
              <v-row no-gutters justify="center">
                <v-img
                  :src="require('~/assets/images/rajeev-signature.png')"
                  max-width="60%"
                  contain
                />
              </v-row>
              <v-divider class="mx-auto my-4" color="grey" width="70%" />

              <div class="signature-names">
                Rajeev R. Sharma<br />
                Co-Founder, JrInLab
              </div>
            </div>
          </v-row>
        </v-col>
      </v-row>
    </v-card>
    <template v-else>
      <div class="mt-16 text-center">
        <h2 class="display-2">No customer data</h2>
        <p class="mt-6 headline">
          Not able to find the related entry, please recheck!!
        </p>
      </div>
    </template>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  layout: 'empty',
  data() {
    return {
      loading: false,
    }
  },
  head() {
    return {
      title: this.currCustomer
        ? `${this.currCustomer.kidsName} - JrInLab's ${this.bannerText} Certificate`
        : 'certificate',
      titleTemplate: '',
      meta: [
        {
          hid: 'robots',
          name: 'robots',
          content: 'noindex',
        },
      ],
    }
  },
  computed: {
    ...mapGetters('admin', ['currentCustomer', 'demoReqInEdit']),
    course() {
      return this.currCustomer ? this.currCustomer.course : null
    },
    cardBackground() {
      let headerBg = 'default'
      if (this.isMaths) {
        headerBg = 'green-blue'
      } else if (
        this.currCustomer.page === 'free-2-code' &&
        (!this.course || this.course.type !== 'regular')
      ) {
        headerBg = 'orange-green'
        const bgValues = ['red-cyan', 'yellow-cyan', 'purple-green']
        if (this.currCustomer.query && this.currCustomer.query.utm_campaign) {
          switch (this.currCustomer.query.utm_campaign) {
            case 'free-2-code-11-17':
              headerBg = bgValues[2]
              break
            case 'free-2-code-01-29':
              headerBg = bgValues[0]
              break
          }
        }
      } else if (this.course && this.course.course === 'appDev') {
        headerBg = 'blue-green'
      } else if (this.course && this.course.course.includes('python')) {
        headerBg = 'blue-yellow'
      } else if (this.course && this.course.course.includes('summer-22')) {
        headerBg = 'purple-green'
      } else if (this.course && this.course.course.includes('web-dev-camp')) {
        headerBg = 'crimson-yellow'
      }

      return headerBg
    },
    isMaths() {
      return this.course ? this.course.course.includes('vedic-maths') : false
    },
    isSummer() {
      return this.course
        ? this.course.course.includes('summer') ||
            this.course.course.includes('web-dev-camp')
        : false
    },
    startDate() {
      const startDates = {
        'summer-21-ind-may-1': '05/11/2021',
        'summer-21-ind-may-2': '05/18/2021',
        'summer-21-ind-jun-1': '06/04/2021',
        'summer-21-sg-jun-1': '06/07/2021',
        'vedic-maths-21-jun-1': '06/12/2021',
        'vedic-maths-21-jun-2': '06/12/2021',
        'summer-22-ind-apr-1': '04/25/2022',
        'summer-22-ind-apr-2': '04/26/2022',
        'summer-22-ind-may-1': '05/12/2022',
        'summer-22-ind-may-2': '05/12/2022',
        'summer-22-sg-jun': '06/13/2022',
        'web-dev-camp-jun-22': '06/20/2022',
        'summer-22-me-jul': '07/20/2022',
      }

      let startDate

      if (this.course) {
        startDate = this.course.startDate
        if (
          !startDate &&
          this.course.type === 'camp' &&
          startDates[this.course.course]
        ) {
          startDate = new Date(startDates[this.course.course])
        }

        if (typeof startDate !== 'string') {
          startDate = this.$options.filters.certificateDateFilter(startDate)
        }
      }

      return startDate
    },
    endDate() {
      const endDates = {
        'summer-21-ind-may-1': '06/05/2021',
        'summer-21-ind-may-2': '06/12/2021',
        'summer-21-ind-jun-1': '06/30/2021',
        'summer-21-sg-jun-1': '06/18/2021',
        'vedic-maths-21-jun-1': '06/17/2021',
        'vedic-maths-21-jun-2': '06/17/2021',
        'summer-22-ind-apr-1': '05/16/2022',
        'summer-22-ind-apr-2': '05/17/2022',
        'summer-22-ind-may-1': '06/02/2022',
        'summer-22-ind-may-2': '06/02/2022',
        'summer-22-sg-jun': '06/24/2022',
        'web-dev-camp-jun-22': '06/24/2022',
        'summer-22-me-jul': '08/15/2022',
      }

      let endDate
      if (this.course) {
        endDate = this.course.endDate
        if (
          !endDate &&
          this.course.type === 'camp' &&
          endDates[this.course.course]
        ) {
          endDate = new Date(endDates[this.course.course])
        }

        if (typeof endDate !== 'string') {
          endDate = this.$options.filters.certificateDateFilter(endDate)
        }
      }

      return endDate
    },
    isCustomer() {
      return this.$route.query.type === 'customer'
    },
    currCustomer() {
      return this.isCustomer ? this.currentCustomer : this.demoReqInEdit
    },
    certificateType() {
      return this.isCustomer
        ? 'Certificate of Completion'
        : 'Certificate of Participation'
    },
    bannerText() {
      if (this.isCustomer) {
        let banner = 'Course Not Found'
        const banners = {
          regular: {
            beginner: `CODING FOUNDATIONS COURSE`,
            advanced: `ADVANCED CODING & GAME DESIGN`,
            scratchGameDev: `SCRATCH GAME DEVELOPMENT`,
            computer: 'Computer Basics',
            appDev: 'APP DEVELOPMENT COURSE',
            pythonBasics: 'PYTHON BASICS COURSE',
            pythonIntermediate: 'PYTHON INTERMEDIATE COURSE',
            pythonGameDev: 'PYTHON GAME DEVELOPMENT COURSE',
          },
          'summer-21': 'CODING & MATHS SUMMER CAMP 2021',
          'summer-22': 'CODING, MATHS & LOGIC SUMMER CAMP 2022',
          'vedic-maths-21-jun': 'VEDIC MATHS SUMMER CAMP 2021',
          summer: 'SUMMER CODING CAMP, JUNE 2020',
          'learn-2-code-oct-21': '#LEARN2CODE WORKSHOP, OCT 2021',
          'sg-camp-scratch-dec-21': 'SCRATCH CODING CAMP, DEC 2021',
          'sg-camp-python-dec-21': 'PYTHON CODING CAMP, DEC 2021',
          'summer-22-sg-jun': 'APP & WEB DEV SUMMER CAMP 2022',
          'summer-22-me-jul': 'APP DEV SUMMER CAMP 2022',
          'web-dev-camp-jun-22': 'WEB DEV WORKSHOP, JUNE 2022',
        }

        const type = this.course.type
        const course = this.course.course
        if (type === 'regular') {
          banner = banners[type][course] || 'Course Not Found'
        } else if (type === 'camp') {
          if (course.includes('summer-20')) {
            banner = banners.summer
          } else if (course.includes('summer-21')) {
            banner = banners['summer-21']
          } else if (course.includes('summer-22')) {
            banner = banners['summer-22']
            if (course.includes('summer-22-sg-jun')) {
              banner = banners['summer-22-sg-jun']
            } else if (course.includes('summer-22-me-jul')) {
              banner = banners['summer-22-me-jul']
            }
          } else if (course.includes('vedic-maths-21-jun')) {
            banner = banners['vedic-maths-21-jun']
          } else if (course === 'learn-2-code-oct-21') {
            banner = banners['learn-2-code-oct-21']
          } else if (course.includes('sg-camp-scratch-dec-21')) {
            banner = banners['sg-camp-scratch-dec-21']
          } else if (course.includes('sg-camp-python-dec-21')) {
            banner = banners['sg-camp-python-dec-21']
          } else if (course.includes('web-dev-camp-jun-22')) {
            banner = banners['web-dev-camp-jun-22']
          }
        }

        return banner
      } else if (this.currCustomer.page === 'free-2-code') {
        let banner = '#FREE2CODE WORKSHOP, AUGUST 2021'
        if (this.currCustomer.query && this.currCustomer.query.utm_campaign) {
          switch (this.currCustomer.query.utm_campaign) {
            case 'free-2-code-11-17':
              banner = '#FREE2CODE WORKSHOP, NOV 2021'
              break
            case 'free-2-code-01-29':
              banner = '#FREE2CODE WORKSHOP, JAN 2022'
              break
          }
        }

        return banner
      }

      return 'No Such Course'
    },
    certificateText() {
      let certificateText

      if (this.isCustomer) {
        const duration = this.course.duration
        const course = this.course.course
        const type = this.course.type

        const getCampText = () => {
          let summerText
          if (course.includes('summer-22-ind')) {
            summerText =
              'Successfully completing 10 sessions of Coding, Maths and Logic Summer Camp conducted online by JrInLab'
          } else if (course.includes('summer-22-sg-jun')) {
            summerText =
              'Successfully completing 10 sessions of AppLab and Web Development Camp conducted online by JrInLab'
          } else if (course.includes('summer-22-me-jul')) {
            summerText =
              'Successfully completing 12 sessions of AppLab App Development Summer Camp conducted online by JrInLab'
          } else if (course.includes('summer-21-ind')) {
            summerText =
              'Successfully completing the 4 weeks Coding, Maths and Logic Summer Camp conducted online by JrInLab'
          } else if (course.includes('summer-20')) {
            summerText =
              'Successfully completing the 3 weeks Coding and Logical Reasoning Summer Camp conducted online by JrInLab'
          } else if (course.includes('summer-21-sg')) {
            summerText =
              'Successfully completing the 2 weeks Coding, Maths and Logic Summer Camp conducted online by JrInLab'
          } else if (course.includes('vedic-maths-21-jun')) {
            summerText =
              'Successfully completing the 5 days Vedic Maths Summer Camp conducted online by Mr. Manu Tripathi in association with JrInLab'
          } else if (course === 'learn-2-code-oct-21') {
            summerText =
              'Successfully completing the 4 days #learn2code workshop conducted online by JrInLab'
          } else if (course.includes('sg-camp-scratch-dec-21')) {
            summerText =
              'Successfully completing the 12 days Scratch Coding Camp conducted online by JrInLab'
          } else if (course.includes('sg-camp-python-dec-21')) {
            summerText =
              'Successfully completing the 12 days Python Basics Coding Camp conducted online by JrInLab'
          } else if (course.includes('web-dev-camp-jun-22')) {
            summerText =
              'Successfully completing the 5 days Web Development Basics Workshop conducted online by JrInLab'
          }

          return summerText
        }

        if (type === 'regular') {
          switch (course) {
            case 'beginner':
              certificateText = `the successful completion of Coding Foundations Course / ${
                duration || '16'
              } sessions, showing great design, and logical skills in creating games & animations.`
              break
            case 'computer':
              certificateText =
                'Successfully completing the 3 weeks Coding and Logical Reasoning Summer Camp conducted online by JrInLab'
              break
            case 'advanced':
              certificateText = `the successful completion of Advanced Coding & Game Design Course / ${
                duration || '24'
              } sessions, showing good design sense, and advanced coding skills in creating engaging games.`
              break
            case 'scratchGameDev':
              certificateText = `the successful completion of Scratch Game Development Course / ${
                duration || '24'
              } sessions, showing good design sense, and advanced coding skills in creating engaging games.`
              break
            case 'appDev':
              certificateText = `the successful completion of App Development Course / ${
                duration || '24'
              } sessions, showing good UI design sense, and logical skills in creating mobile apps.`
              break
            case 'pythonBasics':
              certificateText = `the successful completion of Python Basics Course / ${
                duration || '24'
              } sessions, showing good understanding & coding skills in creating many Python programs.`
              break
            case 'pythonIntermediate':
              certificateText = `the successful completion of Python Intermediate Course / ${
                duration || '24'
              } sessions, showing good skills, and understanding in creating complex Python projects.`
              break
            case 'pythonGameDev':
              certificateText = `the successful completion of Python Game Development Course / ${
                duration || '24'
              } sessions, showing good design sense, and advanced coding skills in creating immersive Python games.`
              break
          }
        } else if (type === 'camp') {
          certificateText = getCampText()
        } else {
          certificateText = `Unknown type: ${type}`
        }
      } else if (this.currCustomer.page === 'free-2-code') {
        certificateText =
          'participating in the <span class="font-weight-medium">Independence Day Weekend Coding Workshop</span> conducted online by JrInLab. Students learnt to code an interactive animation using block coding.'
        if (
          this.currCustomer.query &&
          this.currCustomer.query.utm_campaign &&
          ['free-2-code-11-17', 'free-2-code-01-29'].includes(
            this.currCustomer.query.utm_campaign
          )
        ) {
          certificateText =
            'participating in the <span class="font-weight-medium">One Day Coding Workshop</span> conducted online by JrInLab. Students learnt to code an interactive animation using block coding.'
        }
      }

      return certificateText
    },
  },
  mounted() {
    if (this.$route.query.type === 'customer') {
      this.fetchCustomer()
    } else {
      this.fetchDemoRequest()
    }
  },
  methods: {
    ...mapActions('admin', ['getCustomer', 'getDemoRequestById']),
    async fetchDemoRequest() {
      this.loading = true
      try {
        await this.getDemoRequestById({ id: this.$route.params.id })
      } catch (error) {
        console.log(error)
      }
      this.loading = false
    },
    async fetchCustomer() {
      this.loading = true
      try {
        await this.getCustomer({
          id: this.$route.params.id,
          courseId: this.$route.query.course,
        })
      } catch (error) {
        console.log(error)
      }
      this.loading = false
    },
  },
}
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Lobster&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@400;500;700&display=swap');

.certificate-card-outer {
  border: 2px double #6c63ff;
}

//right / 25% no-repeat url('~assets/images/firmware.svg')
.certificate-card {
  padding: 48px 16px 56px 16px;
}

.certificate-default {
  background: linear-gradient(
      to top right,
      rgba(107, 99, 255, 0.5),
      rgba(157, 29, 39, 0.6)
    ),
    #6c63ff;
}

.certificate-green-blue {
  background: linear-gradient(
      to right,
      rgba(10, 199, 51, 0.8),
      rgba(23, 109, 221, 0.5)
    ),
    #6c63ff;
}

.certificate-blue-green {
  background: linear-gradient(
      to left,
      rgba(10, 199, 51, 0.8),
      rgba(23, 109, 221, 0.5)
    ),
    #6c63ff;
}

.certificate-blue-yellow {
  background: linear-gradient(
      to left,
      rgba(247, 206, 67, 0.85),
      rgba(52, 113, 160, 0.85)
    ),
    #6c63ff;
}

.certificate-orange-green {
  background: linear-gradient(
      to bottom right,
      rgba(239, 108, 0, 0.75),
      rgba(40, 191, 42, 0.75)
    ),
    #6c63ff;
}

.certificate-crimson-yellow {
  background: linear-gradient(
      to bottom right,
      rgba(220, 20, 60, 0.75),
      rgba(239, 215, 0, 0.815)
    ),
    #6c63ff;
}

.certificate-yellow-cyan {
  background: linear-gradient(
      to bottom right,
      rgba(239, 215, 0, 0.815),
      rgba(40, 186, 191, 0.75)
    ),
    #6c63ff;
}

.certificate-red-cyan {
  background: linear-gradient(
      to bottom right,
      rgba(239, 36, 0, 0.918),
      rgba(40, 186, 191, 0.75)
    ),
    #6c63ff;
}

.certificate-purple-green {
  background: linear-gradient(
      to bottom right,
      rgba(196, 59, 250, 0.75),
      rgba(45, 175, 13, 0.904)
    ),
    #6c63ff;
}

.certificate-name {
  font-family: 'Lobster', cursive !important;
  font-size: 3rem !important;
  line-height: 3rem;
  letter-spacing: -0.0083333333em !important;
  color: white;
  margin-top: 32px;
}

.certificate-text {
  font-size: 1.25rem !important;
  line-height: 1.75rem;
  font-family: 'Exo 2', sans-serif;
}

.certificate-dates {
  font-size: 1rem !important;
  line-height: 1.5rem;
  font-family: 'Exo 2', sans-serif;
  font-weight: 500;
}

.certified {
  font-family: 'Exo 2', sans-serif;
  .brand {
    font-weight: 700;
    font-size: 14px;
  }

  .text {
    font-weight: 500;
    font-size: 12px;
  }
}

.certificate-banner-text {
  color: white;
  font-size: 1.25rem;
  line-height: 1.25rem;
  font-weight: 700;
  margin-top: -6px;
  font-family: 'Exo 2', sans-serif;
  letter-spacing: 0.1em !important;
}

.awardee-name {
  font-family: 'Dancing Script', cursive !important;
  font-size: 4rem !important;
  line-height: 4rem;
  margin-top: 40px;
}

.signature {
  font-family: 'Dancing Script', cursive !important;
  font-size: 1.5rem;
}

.signature-names {
  font-family: 'Exo 2', sans-serif;
}
</style>
