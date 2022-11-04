import Vue from 'vue'

export default {
  setDemoRequests(state, { route, page, data }) {
    const routeParts = route.split('?')
    let finalRoute = routeParts[0]
    const queryParts = routeParts.length > 1 ? routeParts[1].split('&') : null
    if (queryParts) {
      queryParts.sort()
      finalRoute += `?${queryParts.join('&')}`
    }

    finalRoute = finalRoute.toLowerCase()

    console.log(
      `set demos in mutations: route: ${route}, page: ${page}, finalRoute: ${finalRoute}, data: `,
      data
    )

    if (!Object.prototype.hasOwnProperty.call(state.demoRequests, finalRoute)) {
      Vue.set(state.demoRequests, finalRoute, {})
    }

    Vue.set(state.demoRequests[finalRoute], page, data)
  },
  setSchoolRequests(state, { route, page, data }) {
    const routeParts = route.split('?')
    let finalRoute = routeParts[0]
    const queryParts = routeParts.length > 1 ? routeParts[1].split('&') : null
    if (queryParts) {
      queryParts.sort()
      finalRoute += `?${queryParts.join('&')}`
    }

    finalRoute = finalRoute.toLowerCase()

    console.log(
      `set school requests in mutations: route: ${route}, page: ${page}, finalRoute: ${finalRoute}, data: `,
      data
    )

    if (
      !Object.prototype.hasOwnProperty.call(state.schoolRequests, finalRoute)
    ) {
      Vue.set(state.schoolRequests, finalRoute, {})
    }

    Vue.set(state.schoolRequests[finalRoute], page, data)
  },
  setRejectedDemoRequests(state, { route, page, data }) {
    const routeParts = route.split('?')
    let finalRoute = routeParts[0]
    const queryParts = routeParts.length > 1 ? routeParts[1].split('&') : null
    if (queryParts) {
      queryParts.sort()
      finalRoute += `?${queryParts.join('&')}`
    }

    finalRoute = finalRoute.toLowerCase()

    console.log(
      `set rejected demos in mutations: route: ${route}, page: ${page}, finalRoute: ${finalRoute}, data: `,
      data
    )

    if (
      !Object.prototype.hasOwnProperty.call(
        state.rejectedDemoRequests,
        finalRoute
      )
    ) {
      Vue.set(state.rejectedDemoRequests, finalRoute, {})
    }

    Vue.set(state.rejectedDemoRequests[finalRoute], page, data)
  },
  resetDemoRequests(state) {
    state.demoRequests = {}
  },
  setCampRequests(state, campRequests) {
    state.campRequests = campRequests
  },
  markAttendance(state, request) {
    const campRequest = state.campRequests.find(
      (existingRequest) => existingRequest.id === request.id
    )
    if (campRequest) {
      console.log(
        `inside mutation for markAttendance:: ${JSON.stringify(request)}`
      )
      console.log(`found some camp request:: ${JSON.stringify(campRequest)}`)
      if (!Object.prototype.hasOwnProperty.call(campRequest, 'attended')) {
        Vue.set(campRequest, 'attended', request.attended)
      } else {
        campRequest.attended = request.attended
      }
    }
  },
  deleteDemoRequestEntry(state, { id, route, page }) {
    const routeParts = route.split('?')
    let finalRoute = routeParts[0]
    const queryParts = routeParts.length > 1 ? routeParts[1].split('&') : null
    if (queryParts) {
      queryParts.sort()
      finalRoute += `?${queryParts.join('&')}`
    }

    const index = state.demoRequests[finalRoute][page].findIndex(
      (demoRequest) => demoRequest.id === id
    )

    if (index !== -1) {
      state.demoRequests[finalRoute][page].splice(index, 1)
    }
  },
  setDemoReqInEdit(state, demoRequest) {
    state.demoReqInEdit = demoRequest
  },
  setCustomers(state, customers) {
    state.customers = customers
  },
  setCurrDemoReqData(state, demoRequest) {
    state.currDemoReq.data = demoRequest
  },
  setCurrDemoReqHandle(state, demoReqHandle) {
    state.currDemoReq.handle = demoReqHandle
  },
  setCurrDemoReqLogs(state, interactions) {
    if (state.currDemoReq.data) {
      state.currDemoReq.interactions.data = interactions
    }
  },
  setCurrDemoReqLogsHandle(state, interactionsHandle) {
    if (state.currDemoReq.data) {
      state.currDemoReq.interactions.handle = interactionsHandle
    }
  },
  cleanupCurrDemoReq(state) {
    state.currDemoReq = {
      data: null,
      handle: null,
      interactions: {
        data: null,
        handle: null,
      },
    }
  },
  setQueryData(state, data) {
    console.log('setting data:: ', data)
    state.queryData = data
  },
  setCurrentCustomer(state, customer) {
    state.currentCustomer = customer
  },
  setActiveWorkshop(state, workshop) {
    state.activeWorkshop = workshop
  },
  setMetaData(state, data) {
    state.metaData = data
  },
  setMetaDataHandle(state, handle) {
    state.metaDataHandle = handle
  },
  setPartnerRequests(state, requests) {
    state.partnerRequests = requests
  },
  setPartnerSchoolRequests(state, requests) {
    state.partnerSchoolRequests = requests
  },
  setCurrSchoolReqData(state, schoolRequest) {
    state.currSchoolReq.data = schoolRequest
  },
  setCurrSchoolReqHandle(state, schoolReqHandle) {
    state.currSchoolReq.handle = schoolReqHandle
  },
  setCurrSchoolReqLogs(state, interactions) {
    if (state.currSchoolReq.data) {
      state.currSchoolReq.interactions.data = interactions
    }
  },
  setCurrSchoolReqLogsHandle(state, interactionsHandle) {
    if (state.currSchoolReq.data) {
      state.currSchoolReq.interactions.handle = interactionsHandle
    }
  },
  cleanupCurrSchoolReq(state) {
    state.currSchoolReq = {
      data: null,
      handle: null,
      interactions: {
        data: null,
        handle: null,
      },
    }
  },
}
