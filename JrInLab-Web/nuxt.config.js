export default {
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: 'static',
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    titleTemplate: 'JrInLab: %s',
    title: 'Coding for kids | Online coding classes for ages 6-14',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: `Best teachers, and activity based curriculum with courses on Scratch programming, App development on MIT AppInventor, Python and others.`,
      },
      {
        hid: 'og:type',
        property: 'og:type',
        content: 'website',
      },
      {
        hid: 'og:title',
        property: 'og:title',
        content:
          'JrInLab: Coding for kids | Online coding classes for ages 6-14',
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content:
          'Best teachers, and activity based curriculum with courses on Scratch programming, App development on MIT AppInventor, Python and others.',
      },
      {
        hid: 'og:url',
        property: 'og:url',
        content: 'https://www.jrinlab.com',
      },
      {
        hid: 'og:image',
        property: 'og:image',
        content:
          'https://firebasestorage.googleapis.com/v0/b/jrinlab.appspot.com/o/website%2Fimages%2FLogo.png?alt=media&token=645b7aee-438b-459d-8dc2-df7c8c764934',
      },
      {
        hid: 'og:image:alt',
        property: 'og:image:alt',
        content: 'JrInLab Logo',
      },
      {
        hid: 'twitter:card',
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        hid: 'twitter:site',
        name: 'twitter:site',
        content: '@jrinlab',
      },
      {
        hid: 'twitter:creator',
        name: 'twitter:creator',
        content: '@ra_jeeves',
      },
      {
        hid: 'twitter:title',
        name: 'twitter:title',
        content:
          'JrInLab: Coding for kids | Online coding classes for ages 6-14',
      },
      {
        hid: 'twitter:description',
        name: 'twitter:description',
        content:
          'Best teachers, and activity based curriculum with courses on Scratch programming, App development on MIT AppInventor, Python and others.',
      },
      {
        hid: 'twitter:image',
        name: 'twitter:image',
        content: `https://firebasestorage.googleapis.com/v0/b/jrinlab.appspot.com/o/website%2Fimages%2FLogo.png?alt=media&token=645b7aee-438b-459d-8dc2-df7c8c764934`,
      },
      {
        hid: 'twitter:image:alt',
        name: 'twitter:image:alt',
        content: 'JrInLab Logo',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  srcDir: 'client/',
  /*
   ** Global CSS
   */
  css: ['~/assets/app.scss'],
  publicRuntimeConfig: {
    razorpayKey: process.env.RAZORPAY_KEY || 'rzp_test_wcJFteOwSyAUqn',
  },
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['@plugins/filters.js', { src: '@plugins/gtag.js', mode: 'client' }],
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: true,
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify',
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/firebase',
    '@nuxtjs/markdownit',
    'nuxt-facebook-pixel-module',
    'nuxt-webfontloader',
    '@nuxtjs/sitemap',
  ],
  sitemap: {
    hostname: 'https://www.jrinlab.com',
    exclude: [
      '/admin',
      '/admin/**',
      '/documents/**',
      '/summer-camp',
      '/sign-in',
      '/camp-booking-done',
      '/thank-you',
      '/sg-summer-camp',
      '/webinar-register',
      '/vedic-maths',
      '/sg-coding-camp-2021',
      '/sg-summer-coding-camp',
      '/payment-done',
      '/kids-winter-camp-2021',
      '/free-2-code',
      '/code-a-game',
      '/code-2-learn',
      '/booking-done',
      '/book-free-class',
      '/sb-free-trial',
      '/sb-school-partnerships',
      '/school-summer-camps',
    ],
  },
  markdownit: {
    injected: true,
  },
  webfontloader: {
    google: {
      families: ['Roboto:100,300,400,500,700,900&display=swap'],
    },
  },
  facebook: {
    /* module options */
    pixelId: '273993477105816',
    autoPageView: true,
  },
  firebase: {
    config: {
      production: {
        apiKey: '<API_KEY>',
        authDomain: '<AUTH_DOMAIN>',
        databaseURL: '<DB_URL>',
        projectId: '<PROJECT_ID>',
        storageBucket: '<STORAGE_BUCKET>',
        messagingSenderId: '<SENDER_ID>',
        appId: '<APP_ID>',
        measurementId: '<MEASUREMENT_ID>',
      },
      staging: {
        apiKey: '<API_KEY>',
        authDomain: '<AUTH_DOMAIN>',
        databaseURL: '<DB_URL>',
        projectId: '<PROJECT_ID>',
        storageBucket: '<STORAGE_BUCKET>',
        messagingSenderId: '<SENDER_ID>',
        appId: '<APP_ID>',
        measurementId: '<MEASUREMENT_ID>',
      },
      development: {
        apiKey: '<API_KEY>',
        authDomain: '<AUTH_DOMAIN>',
        databaseURL: '<DB_URL>',
        projectId: '<PROJECT_ID>',
        storageBucket: '<STORAGE_BUCKET>',
        messagingSenderId: '<SENDER_ID>',
        appId: '<APP_ID>',
        measurementId: '<MEASUREMENT_ID>',
      },
    },
    customEnv: true,
    services: {
      auth: {
        initialize: {
          onAuthStateChangedMutation: 'user/setUser',
        },
      },
      firestore: true,
      analytics: true,
      functions: {
        location: 'asia-east2',
      },
    },
  },
  router: {
    middleware: 'auth',
  },
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    defaultAssets: false,
    optionsPath: '~/vuetify.options.js',
  },
  /*
   ** Static generation config
   */
  generate: {
    dir: 'public',
    fallback: true,
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {},
  },
}
