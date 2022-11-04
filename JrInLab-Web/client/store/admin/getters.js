export default {
  demoRequests: (state) => (routePath, page) => {
    const routeParts = routePath.split('?')
    let finalRoute = routeParts[0]
    const queryParts = routeParts.length > 1 ? routeParts[1].split('&') : null
    if (queryParts) {
      queryParts.sort()
      finalRoute += `?${queryParts.join('&')}`
    }

    finalRoute = finalRoute.toLowerCase()
    console.log(
      `inside getters demo requests: routePath: ${routePath}, page: ${page}. finalRoute: ${finalRoute}`
    )

    return state.demoRequests[finalRoute]
      ? state.demoRequests[finalRoute][page]
      : undefined
  },
  schoolRequests: (state) => (routePath, page) => {
    const routeParts = routePath.split('?')
    let finalRoute = routeParts[0]
    const queryParts = routeParts.length > 1 ? routeParts[1].split('&') : null
    if (queryParts) {
      queryParts.sort()
      finalRoute += `?${queryParts.join('&')}`
    }

    finalRoute = finalRoute.toLowerCase()
    console.log(
      `inside getters demo requests: routePath: ${routePath}, page: ${page}. finalRoute: ${finalRoute}`
    )

    return state.schoolRequests[finalRoute]
      ? state.schoolRequests[finalRoute][page]
      : undefined
  },
  rejectedDemoRequests: (state) => (routePath, page) => {
    const routeParts = routePath.split('?')
    let finalRoute = routeParts[0]
    const queryParts = routeParts.length > 1 ? routeParts[1].split('&') : null
    if (queryParts) {
      queryParts.sort()
      finalRoute += `?${queryParts.join('&')}`
    }

    finalRoute = finalRoute.toLowerCase()
    console.log(
      `inside getters rejected demo requests: routePath: ${routePath}, page: ${page}. finalRoute: ${finalRoute}`
    )

    return state.rejectedDemoRequests[finalRoute]
      ? state.rejectedDemoRequests[finalRoute][page]
      : undefined
  },
  campRequests(state) {
    return state.campRequests
  },
  demoReqInEdit(state) {
    return state.demoReqInEdit
  },
  customers(state) {
    return state.customers
  },
  currDemoReq(state) {
    return state.currDemoReq
  },
  currDemoReqData(state) {
    return state.currDemoReq.data || null
  },
  currDemoReqLogs(state) {
    return state.currDemoReq.interactions.data || null
  },
  queryData(state) {
    return state.queryData
  },
  currentCustomer(state) {
    return state.currentCustomer
  },
  activeWorkshop(state) {
    return state.activeWorkshop
  },
  metaData(state) {
    return state.metaData
  },
  metaDataHandle(state) {
    return state.metaDataHandle
  },
  globalConfig(state) {
    return state.metaData ? state.metaData.global : null
  },
  partnerRequests(state) {
    return state.partnerRequests
  },
  partnerSchoolRequests(state) {
    return state.partnerSchoolRequests
  },
  currSchoolReq(state) {
    return state.currSchoolReq
  },
  currSchoolReqData(state) {
    return state.currSchoolReq.data || null
  },
  currSchoolReqLogs(state) {
    return state.currSchoolReq.interactions.data || null
  },
}
