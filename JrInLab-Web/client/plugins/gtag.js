import Vue from 'vue'
import VueGtag from 'vue-gtag'

export default (context) => {
  Vue.use(
    VueGtag,
    {
      config: { id: 'AW-419410625' },
    },
    context.app.router
  )
}
