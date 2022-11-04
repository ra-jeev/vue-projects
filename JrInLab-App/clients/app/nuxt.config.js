console.log(
  `the environment variables: ${JSON.stringify(process.env, null, 2)}`
)
export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'JrInLab Students App',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: 'Students portal on JrInLab',
      },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  publicRuntimeConfig: {
    APP_API_GW_URL: process.env.APP_API_GW_URL,
    APP_WSS_API_GW_URL: process.env.APP_WSS_API_GW_URL,
    DOMAIN_SUFFIX: process.env.DOMAIN_SUFFIX,
    USER_POOL_ID: process.env.USER_POOL_ID,
    APP_CLIENT_ID: process.env.APP_CLIENT_ID,
    axios: {
      baseURL: process.env.APP_API_GW_URL,
    },
  },
  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['~/assets/app.scss'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@plugins/auth.js',
    '@plugins/axios.js',
    '@plugins/filters.js',
    { src: '@plugins/webSocket', mode: 'client' },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  loading: {
    color: '#F7B801',
    height: '4px',
  },

  loadingIndicator: {
    name: 'pulse',
    color: 'white',
    background: '#FF5E29',
  },

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    'nuxt-webfontloader',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: '/',
  },

  router: {
    middleware: 'auth-router',
  },

  webfontloader: {
    google: {
      families: ['Roboto:400,500,700&display=swap'],
    },
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    defaultAssets: false,
    optionsPath: '~/vuetify.options.js',
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
}
