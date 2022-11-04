export default {
  async getDemoRequests({ commit, getters }, options) {
    const {
      page,
      route,
      count,
      status,
      source,
      campaign,
      tag,
      search,
      time_slot: timeSlot,
      lead_page: leadPage,
      age,
    } = options

    const existingDemoRequests = getters.demoRequests(route, page)
    console.log('existing demo requests in action: ', existingDemoRequests)
    if (!existingDemoRequests) {
      let collectionRef = this.$fire.firestore.collection('demos')

      if (status) {
        console.log(`adding where clause for status: ${status}`)
        collectionRef = collectionRef.where('status', 'in', status.split(','))
      }

      if (source) {
        console.log(`adding where clause for source: ${source}`)
        collectionRef = collectionRef.where('query.utm_source', '==', source)
      }

      if (age) {
        console.log(`adding where clause for age: `, age)
        const ageParts = age.split(',')
        const clause = { eq: '==', lt: '<', lteq: '<=', gt: '>', gteq: '>=' }[
          ageParts[0]
        ]
        collectionRef = collectionRef.where(
          'kidsAge',
          clause,
          parseInt(ageParts[1])
        )
      }

      if (campaign) {
        console.log(`adding where clause for campaign: ${campaign}`)
        collectionRef = collectionRef.where(
          'query.utm_campaign',
          '==',
          campaign
        )
      }

      if (timeSlot) {
        console.log(`adding where clause for campaign slot: ${timeSlot}`)
        collectionRef = collectionRef.where('timeSlot.value', '==', timeSlot)
      }

      if (leadPage) {
        console.log(`adding where clause for lead page: ${leadPage}`)
        collectionRef = collectionRef.where('page', '==', leadPage)
      }

      if (tag) {
        console.log(`adding where clause for tag: ${tag}`)
        collectionRef = collectionRef.where('tags', 'array-contains', tag)
      }

      if (search) {
        console.log(`adding where clause for search: ${search}`)
        collectionRef = collectionRef.where(
          'searchable.info',
          'array-contains',
          search.toLowerCase()
        )
      }

      if (age && !age.startsWith('eq')) {
        collectionRef = collectionRef.orderBy('kidsAge', 'desc')
      } else {
        collectionRef = collectionRef.orderBy('updatedAt', 'desc')
      }

      const pageNo = parseInt(page)
      const prevDocs = getters.demoRequests(route, pageNo - 1)
      const nextDocs = getters.demoRequests(route, pageNo + 1)
      console.log('prevDocs: ', prevDocs)
      console.log('nextDocs: ', nextDocs)
      if (prevDocs) {
        if (age && !age.startsWith('eq')) {
          const doc = await this.$fire.firestore
            .collection('demos')
            .doc(prevDocs[prevDocs.length - 1].id)
            .get()
          collectionRef = collectionRef.startAfter(doc)
        } else {
          collectionRef = collectionRef.startAfter(
            prevDocs[prevDocs.length - 1].updatedAt
          )
        }
      } else if (nextDocs) {
        if (age && !age.startsWith('eq')) {
          const doc = await this.$fire.firestore
            .collection('demos')
            .doc(nextDocs[0].id)
            .get()
          collectionRef = collectionRef.endBefore(doc)
        } else {
          collectionRef = collectionRef.endBefore(nextDocs[0].updatedAt)
        }
      }

      if (pageNo > 1 && !prevDocs && !nextDocs) {
        // Can't fetch these docs, need to reset the page to 1
        return true
      }

      const demoRequestsSnap = await collectionRef.limit(count).get()

      const demoRequests = []
      let index = count * (pageNo - 1)
      demoRequestsSnap.forEach((doc) => {
        const leadInfo = {
          parent: {
            value: doc.data().parentsName,
            to: `/admin/demo-requests/${doc.id}`,
          },
          kid: `${doc.data().kidsName}, ${doc.data().kidsAge}`,
        }

        let completePhone = ''
        let suffix
        if (doc.data().country) {
          completePhone += doc.data().country.dialCode + '-'
          suffix = doc.data().country.name
        }

        completePhone += doc.data().parentsPhone
        const contactInfo = {
          phone: {
            value: completePhone,
            suffix,
            href: `tel:${completePhone}`,
          },
          email: {
            value: doc.data().parentsEmail,
            href: `mailto:${doc.data().parentsEmail}`,
          },
        }

        const query = doc.data().query
        let source = `${doc.data().page}`
        if (query && query.utm_campaign) {
          source += ` | ${query.utm_campaign}`
          source += `\n${query.utm_source}`
          if (query.utm_medium) {
            source += ` | ${query.utm_medium}`
          }
        } else {
          source += `\norganic`
        }

        demoRequests.push({
          id: doc.id,
          index,
          leadInfo,
          contactInfo,
          source,
          ...doc.data(),
        })

        index++
      })

      console.log(
        `demo requests in action: size: ${demoRequestsSnap.size}: `,
        demoRequests
      )

      commit('setDemoRequests', { route, page, data: demoRequests })
    }

    return false
  },
  async getRejectedDemoRequests(
    { commit, getters },
    { page, route, count, status, source, campaign, search }
  ) {
    const existingDemoRequests = getters.rejectedDemoRequests(route, page)
    console.log(
      'existing rejected demo requests in action: ',
      existingDemoRequests
    )
    if (!existingDemoRequests) {
      let collectionRef = this.$fire.firestore.collection('rejectedDemos')

      if (status) {
        console.log(`adding where clause for status: ${status}`)
        collectionRef = collectionRef.where('status', 'in', status.split(','))
      }

      if (source) {
        console.log(`adding where clause for source: ${source}`)
        collectionRef = collectionRef.where('query.utm_source', '==', source)
      }

      if (campaign) {
        console.log(`adding where clause for campaign: ${campaign}`)
        collectionRef = collectionRef.where(
          'query.utm_campaign',
          '==',
          campaign
        )
      }

      if (search) {
        console.log(`adding where clause for search: ${search}`)
        collectionRef = collectionRef.where(
          'searchable.info',
          'array-contains',
          search.toLowerCase()
        )
      }

      collectionRef = collectionRef.orderBy('updatedAt', 'desc')

      const pageNo = parseInt(page)
      const prevDocs = getters.rejectedDemoRequests(route, pageNo - 1)
      const nextDocs = getters.rejectedDemoRequests(route, pageNo + 1)
      console.log('prevDocs: ', prevDocs)
      console.log('nextDocs: ', nextDocs)
      if (prevDocs) {
        collectionRef = collectionRef.startAfter(
          prevDocs[prevDocs.length - 1].updatedAt
        )
      } else if (nextDocs) {
        collectionRef = collectionRef.endBefore(nextDocs[0].updatedAt)
      }

      if (pageNo > 1 && !prevDocs && !nextDocs) {
        // Can't fetch these docs, need to reset the page to 1
        return true
      }

      const demoRequestsSnap = await collectionRef.limit(count).get()

      const demoRequests = []
      let index = count * (pageNo - 1)
      demoRequestsSnap.forEach((doc) => {
        const leadInfo = {
          parent: {
            value: doc.data().parentsName,
            to: `/admin/demo-requests/${doc.id}`,
          },
          kid: `${doc.data().kidsName}, ${doc.data().kidsAge}`,
        }

        let completePhone = ''
        let suffix
        if (doc.data().country) {
          completePhone += doc.data().country.dialCode + '-'
          suffix = doc.data().country.name
        }

        completePhone += doc.data().parentsPhone
        const contactInfo = {
          phone: {
            value: completePhone,
            suffix,
            href: `tel:${completePhone}`,
          },
          email: {
            value: doc.data().parentsEmail,
            href: `mailto:${doc.data().parentsEmail}`,
          },
        }

        const query = doc.data().query
        let source = `${doc.data().page}`
        if (query && query.utm_campaign) {
          source += ` | ${query.utm_campaign}`
          source += `\n${query.utm_source}`
          if (query.utm_medium) {
            source += ` | ${query.utm_medium}`
          }
        } else {
          source += `\norganic`
        }

        demoRequests.push({
          id: doc.id,
          index,
          leadInfo,
          contactInfo,
          source,
          ...doc.data(),
        })

        index++
      })

      console.log(
        `rejected demo requests in action: size: ${demoRequestsSnap.size}: `,
        demoRequests
      )

      commit('setRejectedDemoRequests', { route, page, data: demoRequests })
    }

    return false
  },
  async getSchoolRequests({ commit, getters }, options) {
    const { page, route, count, search } = options

    const existingDemoRequests = getters.schoolRequests(route, page)
    console.log('existing school requests in action: ', existingDemoRequests)
    console.log('fetch options school requests in action: ', options)
    if (!existingDemoRequests) {
      let collectionRef = this.$fire.firestore.collection('partnerships')

      if (search) {
        console.log(`adding where clause for search: ${search}`)
        collectionRef = collectionRef.where(
          'searchable.info',
          'array-contains',
          search.toLowerCase()
        )
      }

      collectionRef = collectionRef.orderBy('updatedAt', 'desc')

      const pageNo = parseInt(page)
      const prevDocs = getters.schoolRequests(route, pageNo - 1)
      const nextDocs = getters.schoolRequests(route, pageNo + 1)
      console.log('prevDocs: ', prevDocs)
      console.log('nextDocs: ', nextDocs)
      if (prevDocs) {
        collectionRef = collectionRef.startAfter(
          prevDocs[prevDocs.length - 1].updatedAt
        )
      } else if (nextDocs) {
        collectionRef = collectionRef.endBefore(nextDocs[0].updatedAt)
      }

      if (pageNo > 1 && !prevDocs && !nextDocs) {
        // Can't fetch these docs, need to reset the page to 1
        return true
      }

      const demoRequestsSnap = await collectionRef.limit(count).get()

      const demoRequests = []
      let index = count * (pageNo - 1)
      demoRequestsSnap.forEach((doc) => {
        const leadInfo = {
          name: {
            value: doc.data().name,
            to: `/admin/school-requests/${doc.id}`,
          },
          role: doc.data().role,
          school: doc.data().school,
        }

        let completePhone = ''
        let suffix
        if (doc.data().country) {
          completePhone += doc.data().country.dialCode + '-'
          suffix = doc.data().country.name
        }

        completePhone += doc.data().phone
        const contactInfo = {
          phone: {
            value: completePhone,
            suffix,
            href: `tel:${completePhone}`,
          },
        }

        const data = {
          id: doc.id,
          index,
          leadInfo,
          contactInfo,
          ...doc.data(),
        }

        demoRequests.push(data)
        index++
      })

      console.log(
        `school requests in action: size: ${demoRequestsSnap.size}: `,
        demoRequests
      )

      commit('setSchoolRequests', { route, page, data: demoRequests })
    }

    return false
  },
  async deleteSchoolEntry(data) {
    await new Promise((resolve) => {
      setTimeout(() => {
        console.log('resolving the delete call: data: ', data)
        resolve()
      }, 1000)
    })
  },
  async getActiveWorkshop({ commit }) {
    const workshopSnap = await this.$fire.firestore
      .collection('workshops')
      .doc('active')
      .get()

    if (workshopSnap.exists) {
      commit('setActiveWorkshop', workshopSnap.data())
    }
  },
  async getCampRequests({ commit }, workshopName) {
    const campRequestsSnap = await this.$fire.firestore
      .collection('demos')
      .where('workshopName', '==', workshopName)
      .orderBy('createdAt', 'desc')
      .get()

    const campRequests = []
    campRequestsSnap.forEach((doc) => {
      campRequests.push({ id: doc.id, ...doc.data() })
    })

    commit('setCampRequests', campRequests)
  },
  async markAttendance({ commit }, { id, attended }) {
    await this.$fire.firestore.collection('demos').doc(id).update({ attended })
    commit('markAttendance', { id, attended })
  },
  async getDemoRequestById({ commit, rootGetters }, { id }) {
    const demoRequest = await this.$fire.firestore
      .collection('demos')
      .doc(id)
      .get()

    if (demoRequest.exists) {
      const isSuperAdmin = rootGetters['user/isSuperAdmin']
      console.log(`rootGetters['user/isSuperAdmin']: ${isSuperAdmin}`)
      const courses = []
      if (isSuperAdmin) {
        const coursesSnap = await demoRequest.ref.collection('courses').get()
        coursesSnap.forEach((course) => {
          courses.push({ id: course.id, ...course.data() })
        })
      }

      commit('setDemoReqInEdit', {
        id: demoRequest.id,
        courses,
        ...demoRequest.data(),
      })
    }
  },
  async getCustomers({ commit }) {
    const customersSnap = await this.$fire.firestore
      .collection('customers')
      .orderBy('createdAt', 'desc')
      .get()
    const customers = []
    customersSnap.forEach((doc) => {
      customers.push({ id: doc.id, ...doc.data() })
    })

    commit('setCustomers', customers)
  },
  async fetchCustomers() {
    const customersSnap = await this.$fire.firestore
      .collection('customers')
      .orderBy('createdAt', 'desc')
      .get()

    console.log('customerDOcs: ', customersSnap)

    const enrolledSnap = await this.$fire.firestore
      .collection('demos')
      .where('status', '==', 'enrolled')
      .orderBy('updatedAt', 'desc')
      .get()

    const customers = []
    const batchJob = this.$fire.firestore.batch()
    enrolledSnap.forEach((doc) => {
      const customer = { id: doc.id, ...doc.data(), courses: [] }
      const entries = customersSnap.docs.filter(
        (custDoc) => custDoc.data().parentId === doc.id
      )

      // console.log(`entries for ${doc.data().kidsName}: `, entries)
      if (entries) {
        entries.forEach((entry) => {
          const entryData = entry.data()
          const setObj = {
            type: entryData.type,
            course: entryData.course,
            installments: entryData.installments,
          }

          console.log(
            `entryData.kidsName: ${entryData.kidsName} type: ${setObj.type}, course: ${setObj.course}`
          )

          if (setObj.course === 'summer') {
            if (setObj.type === 'summer') {
              setObj.course = 'summer-20-ind'
            } else {
              setObj.course = setObj.type
            }
          }

          if (setObj.type.includes('summer')) {
            setObj.type = 'camp'
          }

          console.log(
            `Modified: type: ${setObj.type}, course: ${setObj.course}`
          )

          if (entryData.startDate && entryData.endDate) {
            setObj.startDate = entryData.startDate
            setObj.endDate = entryData.endDate
          }

          batchJob.set(doc.ref.collection('courses').doc(entry.id), setObj)
          customer.courses.push(setObj)
        })
      }

      customers.push(customer)
    })

    await batchJob.commit()

    console.log('fetchCustomers: ', customers)
    console.log('batch: ', batchJob)
  },
  observeDemoRequestLogs({ commit }, { id }) {
    const closeRequest = this.$fire.firestore
      .collection('demos')
      .doc(id)
      .collection('logs')
      .orderBy('createdAt', 'desc')
      .onSnapshot({
        next: (logsSnap) => {
          if (!logsSnap.metadata.hasPendingWrites) {
            const logs = []
            logsSnap.forEach((logDoc) => {
              if (!logDoc.metadata.hasPendingWrites) {
                logs.push({ id: logDoc.id, ...logDoc.data() })
              }
            })

            commit('setCurrDemoReqLogs', logs)
          }
        },
        error: (error) => {
          console.log(error)
        },
      })

    commit('setCurrDemoReqLogsHandle', closeRequest)
  },
  async observeDemoRequest({ commit, dispatch, getters }, { id }) {
    await new Promise((resolve, reject) => {
      const closeRequest = this.$fire.firestore
        .collection('demos')
        .doc(id)
        .onSnapshot({
          next: (demoRequestDoc) => {
            if (demoRequestDoc.exists) {
              commit('setCurrDemoReqData', {
                id,
                ...demoRequestDoc.data(),
              })

              if (!getters.currDemoReq.interactions.handle) {
                dispatch('observeDemoRequestLogs', { id })
              }
            }

            resolve()
          },
          error: (error) => {
            console.log('observeDemoReuqest failed with error', error)
            reject(error)
          },
        })

      commit('setCurrDemoReqHandle', closeRequest)
    })
  },
  unobserveDemoRequest({ commit, getters }) {
    const currDemoReq = getters.currDemoReq
    if (currDemoReq.handle) {
      currDemoReq.handle()
    }

    if (currDemoReq.interactions.handle) {
      currDemoReq.interactions.handle()
    }

    commit('cleanupCurrDemoReq')
  },
  async logCustomerInteraction({ getters, rootGetters }, { log }) {
    if (!getters.currDemoReq.data) {
      return
    }

    const user = rootGetters['user/user']
    log.createdAt = this.$fireModule.firestore.FieldValue.serverTimestamp()
    log.updatedAt = this.$fireModule.firestore.FieldValue.serverTimestamp()
    log.author = {
      name: user.displayName,
      id: user.id,
    }

    await this.$fire.firestore
      .collection('demos')
      .doc(getters.currDemoReq.data.id)
      .collection('logs')
      .add(log)
  },
  async editCustomerInteraction({ getters }, { id, data }) {
    if (!getters.currDemoReq.data) {
      return
    }

    data.updatedAt = this.$fireModule.firestore.FieldValue.serverTimestamp()

    await this.$fire.firestore
      .collection('demos')
      .doc(getters.currDemoReq.data.id)
      .collection('logs')
      .doc(id)
      .update(data)
  },
  async getEntries({ commit }, reqData) {
    if (reqData) {
      const promises = []
      const types = []
      if (reqData.collectionGroup) {
        for (const field of reqData.collectionGroup.fields) {
          const promise = this.$fire.firestore
            .collectionGroup(reqData.collectionGroup.name)
            .where(field.name, field.filter, field.value)
            .get()

          promises.push(promise)
          types.push({ name: reqData.collectionGroup.name, field: field.name })
        }
      }

      if (reqData.collection) {
        for (const field of reqData.collection.fields) {
          const promise = this.$fire.firestore
            .collection(reqData.collection.name)
            .where(field.name, field.filter, field.value)
            .get()

          promises.push(promise)
          types.push({ name: reqData.collection.name, field: field.name })
        }
      }

      if (promises.length) {
        const data = {}
        const snaps = await Promise.all(promises)
        for (const snapIndex in snaps) {
          const snap = snaps[snapIndex]
          console.log(`the snap for snapIndex ${snapIndex} is: `, snap)
          if (
            !Object.prototype.hasOwnProperty.call(data, types[snapIndex].name)
          ) {
            data[types[snapIndex].name] = {}
          }

          snap.forEach((doc) => {
            data[types[snapIndex].name][doc.id] = {
              field: types[snapIndex].field,
              id: doc.id,
              ...doc.data(),
              path: doc.ref.path,
            }
          })
        }

        commit('setQueryData', data)
      }
    }
  },
  async updateEntries({ commit }, reqData) {
    if (reqData) {
      const batchJob = this.$fire.firestore.batch()
      for (const jobKey in reqData) {
        const job = reqData[jobKey]
        console.log('will be adding the job:: ', job)
        batchJob.update(this.$fire.firestore.doc(job.path), job.data)
      }

      await batchJob.commit()

      commit('setQueryData', null)
    }
  },
  async createEnrolledCustomers() {
    const shouldCommit = false
    const { default: customers } = await import('~/assets/customers.json')
    const demoRef = this.$fire.firestore.collection('demos')
    const enrolledSnap = await demoRef.where('status', '==', 'enrolled').get()
    const enrolledCustomers = {}
    enrolledSnap.forEach((doc) => {
      enrolledCustomers[doc.id] = doc.data()
    })

    const batchJob = this.$fire.firestore.batch()
    const customersRef = this.$fire.firestore.collection('customers')

    const existingCustomersSnap = await customersRef.get()
    const existingCustomers = []
    existingCustomersSnap.forEach((doc) => {
      existingCustomers.push({ id: doc.id, ...doc.data() })
    })

    const getExistingEntry = (docId, course) => {
      return existingCustomers.find(
        (doc) => doc.parentId === docId && doc.course === course
      )
    }

    const handleInstallments = (installments, dataObj) => {
      let formedInstallments
      if (Array.isArray(installments)) {
        formedInstallments = []
        installments.forEach((installment) => {
          const installmentObj = {
            actualPrice: installment.actualPrice,
            amountPaid: installment.amountPaid,
            paymentDate: getConvertedDate(installment.paymentDate),
            invoiceNo: installment.invoiceNo,
          }

          if (installment.invoiceDate) {
            installmentObj.invoiceDate = getConvertedDate(
              installment.invoiceDate
            )
          }

          if (installment.currency) {
            installmentObj.currency = installment.currency
          }

          formedInstallments.push(installmentObj)
        })
      } else {
        formedInstallments = {
          actualPrice: installments.actualPrice,
          amountPaid: installments.amountPaid,
          paymentDate: getConvertedDate(installments.paymentDate),
          invoiceNo: installments.invoiceNo,
        }

        if (installments.invoiceDate) {
          formedInstallments.invoiceDate = getConvertedDate(
            installments.invoiceDate
          )
        }

        if (installments.currency) {
          formedInstallments.currency = installments.currency
        }
      }

      if (dataObj) {
        dataObj.installments = formedInstallments
      } else {
        return formedInstallments
      }
    }

    const datas = []
    for (const customerId in customers) {
      const customerData = customers[customerId]
      console.log(`customerId: ${customerId}, customerData:: `, customerData)
      const paymentData = customerData.info
      const existingEntry = getExistingEntry(customerId, paymentData.course)

      if (existingEntry) {
        console.log(
          `Existing ${paymentData.course} course for ${customerData.name} with payment data: `,
          existingEntry.installments
        )

        const installments = handleInstallments(paymentData.installments)
        console.log(
          `customerId: ${existingEntry.id}, will add payment data: `,
          installments
        )

        batchJob.update(customersRef.doc(existingEntry.id), {
          installments: this.$fireModule.firestore.FieldValue.arrayUnion(
            ...installments
          ),
        })
      } else {
        const address = {
          address: paymentData.address,
          city: paymentData.city,
          state: paymentData.state,
          country: paymentData.country,
          pincode: paymentData.pincode || '',
        }

        if (!enrolledCustomers[customerId]) {
          console.log(`no enrolled customer found for ${customerData.name}`)
          continue
        }

        if (!enrolledCustomers[customerId].address) {
          console.log(
            `the original doc for ${enrolledCustomers[customerId].parentsName} doesn't have address, so adding:: `,
            address
          )

          batchJob.update(demoRef.doc(customerId), { address })
        }

        const dataToStore = {
          parentId: customerId,
          type: paymentData.type,
          course: paymentData.course,
          address,
          ...enrolledCustomers[customerId],
        }

        handleInstallments(paymentData.installments, dataToStore)

        batchJob.set(customersRef.doc(), dataToStore)

        datas.push(dataToStore)
        console.log('dataToStore:: ', dataToStore)

        if (paymentData.new) {
          const newData = { ...dataToStore }
          newData.kidsName = paymentData.new.kidsName
          newData.kidsAge = paymentData.new.kidsAge
          newData.course = paymentData.new.course
          newData.type = paymentData.new.type
          newData.installments = paymentData.new.installments
          if (Array.isArray(paymentData.new.installments)) {
            newData.installments = []
            paymentData.new.installments.forEach((installment) => {
              newData.installments.push({
                actualPrice: installment.actualPrice,
                amountPaid: installment.amountPaid,
                paymentDate: getConvertedDate(installment.paymentDate),
                invoiceNo: installment.invoiceNo,
              })
            })
          } else {
            newData.installments = {
              actualPrice: paymentData.new.installments.actualPrice,
              amountPaid: paymentData.new.installments.amountPaid,
              paymentDate: getConvertedDate(
                paymentData.new.installments.paymentDate
              ),
              invoiceNo: paymentData.new.installments.invoiceNo,
            }
          }

          console.log('new data to store:: ', newData)
          datas.push(newData)
          batchJob.set(customersRef.doc(), newData)
        }
      }
    }

    console.log('customers to create:: ', datas)

    if (shouldCommit) {
      console.log('shouldCommit is ON, so committing...')
      await batchJob.commit()
    } else {
      console.log('shouldCommit is OFF, so bailing out...')
    }
  },
  async getCustomer({ commit, rootGetters }, { id, courseId }) {
    const customerDoc = await this.$fire.firestore
      .collection('demos')
      .doc(id)
      .get()

    if (customerDoc.exists) {
      const isSuperAdmin = rootGetters['user/isSuperAdmin']
      console.log(`rootGetters['user/isSuperAdmin']: ${isSuperAdmin}`)

      if (isSuperAdmin) {
        const courseDoc = await customerDoc.ref
          .collection('courses')
          .doc(courseId)
          .get()
        console.log(`fethcing course: ${courseId}`)
        commit('setCurrentCustomer', {
          id: customerDoc.id,
          ...customerDoc.data(),
          course: { id: courseDoc.id, ...courseDoc.data() },
        })

        console.log('set currCustomer course as: ', {
          id: courseDoc.id,
          ...courseDoc.data(),
        })
      } else {
        commit('setCurrentCustomer', {
          id: customerDoc.id,
          ...customerDoc.data(),
        })
      }
    }
  },
  async getDemoRequest({ commit }, { id }) {
    const customerDoc = await this.$fire.firestore
      .collection('demos')
      .doc(id)
      .get()

    if (customerDoc.exists) {
      commit('setCurrentCustomer', {
        id: customerDoc.id,
        ...customerDoc.data(),
      })
    }
  },
  async editCustomerDetails({ rootGetters }, { id, data, changes }) {
    if (id && data && changes) {
      const user = rootGetters['user/user']
      const log = {
        createdAt: this.$fireModule.firestore.FieldValue.serverTimestamp(),
        updatedAt: this.$fireModule.firestore.FieldValue.serverTimestamp(),
        author: {
          name: user.displayName,
          id: user.id,
        },
        ...changes,
        data,
      }

      await this.$fire.firestore
        .collection('demos')
        .doc(id)
        .collection('logs')
        .add(log)
    }
  },
  async addCourseAndPayments(_, { id, courses }) {
    const coursesCollectionRef = this.$fire.firestore
      .collection('demos')
      .doc(id)
      .collection('courses')

    const batchJob = this.$fire.firestore.batch()
    for (const course of courses) {
      if (course.id) {
        batchJob.update(coursesCollectionRef.doc(course.id), {
          installments: this.$fireModule.firestore.FieldValue.arrayUnion(
            ...course.installments
          ),
        })
      } else {
        batchJob.set(coursesCollectionRef.doc(), course)
      }
    }

    await batchJob.commit()
  },
  async deleteCustomerEntry({ commit }, { id, route, page }) {
    if (id) {
      const docSnap = await this.$fire.firestore
        .collection('demos')
        .doc(id)
        .get()
      if (docSnap.exists) {
        const logs = docSnap.data().logs
        if (logs) {
          const logDeletePromises = []
          for (const logId in logs) {
            logDeletePromises.push(
              this.$fire.firestore
                .collection('demos')
                .doc(id)
                .collection('logs')
                .doc(logId)
                .delete()
            )
          }

          await Promise.all(logDeletePromises)
        }

        await this.$fire.firestore.collection('demos').doc(id).delete()
        commit('deleteDemoRequestEntry', { id, route, page })
      }
    }
  },
  async archiveActiveWorkshop() {
    const workshopsRef = this.$fire.firestore.collection('workshops')
    const snap = await workshopsRef.doc('active').get()

    console.log(JSON.stringify(snap.data()))

    if (snap.exists && !snap.data().archived) {
      await workshopsRef.add(snap.data())
      await workshopsRef.doc('active').update({ archived: true })
    }
  },
  async saveActiveWorkshop() {
    const workshop = await import('~/assets/workshop.json')
    await this.$fire.firestore
      .collection('workshops')
      .doc('active')
      .set(workshop)
  },
  async getMetaData({ commit, getters }) {
    if (!getters.metaDataHandle) {
      await new Promise((resolve, reject) => {
        console.log('calling getMetaData: time: ', Date.now())
        const metaDataHandle = this.$fire.firestore
          .collection('meta')
          .onSnapshot({
            next: (snap) => {
              const metaData = {}
              snap.forEach((doc) => {
                metaData[doc.id] = { ...doc.data() }
              })

              console.log('meta data fetched:: ', metaData)

              commit('setMetaDataHandle', metaDataHandle)
              commit('setMetaData', metaData)
              resolve()
            },
            error: (error) => {
              console.log(
                'getMetaData failed with error',
                error,
                ', time',
                Date.now()
              )

              metaDataHandle()
              reject(error)
            },
          })
      })
    }
  },
  detachMetaDataListener({ getters, commit }) {
    if (getters.metaDataHandle) {
      getters.metaDataHandle()
      commit('setMetaDataHandle', null)
    }
  },
  async setConfigs(_, configs) {
    const batchObj = this.$fire.firestore.batch()
    const configsRef = this.$fire.firestore.collection('meta')
    for (const configKey in configs) {
      batchObj.set(configsRef.doc(configKey), configs[configKey])
    }

    await batchObj.commit()
  },
  async sendEmailToCustomer(_, emailData) {
    const sendEmail = this.$fire.functions.httpsCallable('sendEmail')
    const response = await sendEmail(emailData)

    console.log('sendEmail response:: ', response)
    return response
  },
  async sendBulkTextEmails(_, emailData) {
    const sendEmail = this.$fire.functions.httpsCallable('sendBulkTextEmails')
    const response = await sendEmail(emailData)

    console.log('sendBulkTextEmails response:: ', response)
    return response
  },
  async sendBatchEmails(_, emailData) {
    const sendEmail = this.$fire.functions.httpsCallable('sendBatchEmails')
    const response = await sendEmail(emailData)

    console.log('sendBatchEmails response:: ', response)
    return response
  },
  async addSearchable() {
    const batchJob = this.$fire.firestore.batch()
    const requestsSnap = await this.$fire.firestore
      .collection('rejectedDemos')
      .get()

    requestsSnap.forEach((doc) => {
      const payload = doc.data()
      const searchable = [
        `${payload.country.dialCode}-${payload.parentsPhone}`,
        payload.parentsPhone,
        payload.parentsEmail,
        payload.parentsName,
        ...payload.parentsName.split(' '),
        payload.kidsName,
        ...payload.kidsName.split(' '),
      ]

      const info = new Set()
      searchable.forEach((term) => {
        term = term.toLowerCase()
        for (let index = 1; index <= term.length; index++) {
          info.add(term.substring(0, index))
        }
      })

      const update = {}
      update[`searchable.info`] = Array.from(info)

      batchJob.update(doc.ref, update)
    })

    await batchJob.commit()
  },
  async getUsersForFilter(_, filters) {
    let query = this.$fire.firestore.collection('demos')

    for (const filter of filters) {
      console.log(filter.field, filter.clause, filter.value)
      query = query.where(filter.field, filter.clause, filter.value)
    }

    const snaps = await query.get()
    console.log('result size', snaps.size)

    const docs = []
    snaps.forEach((doc) => {
      docs.push({ id: doc.id, ...doc.data() })
    })

    return docs

    // const slots = {
    //   'lower-1100': {
    //     rejectedEntries: [],
    //     emailList: new Set(),
    //     recipientVariables: {},
    //   },
    //   'lower-1600': {
    //     rejectedEntries: [],
    //     emailList: new Set(),
    //     recipientVariables: {},
    //   },
    //   'upper-1100': {
    //     rejectedEntries: [],
    //     emailList: new Set(),
    //     recipientVariables: {},
    //   },
    //   'upper-1600': {
    //     rejectedEntries: [],
    //     emailList: new Set(),
    //     recipientVariables: {},
    //   },
    // }

    // const getOperatingObj = (age, slot) => {
    //   let key = 'upper'
    //   if (age <= 9) {
    //     key = 'lower'
    //   }

    //   if (slot === '140821-1100') {
    //     key += '-1100'
    //   } else if (slot === '140821-1600') {
    //     key += '-1600'
    //   }

    //   return slots[key]
    // }

    // const masterList = new Set()
    // const masterRejectedList = []
    // snaps.forEach((doc) => {
    //   const data = doc.data()
    //   const obj = getOperatingObj(data.kidsAge, data.timeSlot.value)
    //   if (obj) {
    //     if (data.query && data.query.utm_source === 'an') {
    //       console.log(`skipping audience network source: ${data.parentsName}`)
    //       obj.rejectedEntries.push({
    //         name: data.parentsName,
    //         reason: 'an',
    //         email: data.parentsEmail,
    //         id: doc.id,
    //         kidsName: data.kidsName,
    //       })
    //     } else if (!obj.emailList.has(data.parentsEmail)) {
    //       obj.emailList.add(data.parentsEmail)

    //       obj.recipientVariables[data.parentsEmail] = {
    //         name: getFirstName(data.parentsName),
    //         kidsName: getFirstName(data.kidsName),
    //       }

    //       if (!masterList.has(data.parentsEmail)) {
    //         masterList.add(data.parentsEmail)
    //       } else {
    //         masterRejectedList.push(data.parentsEmail)
    //       }
    //     } else {
    //       console.log(`duplicate entry for :: ${data.parentsEmail}`)
    //       obj.rejectedEntries.push({
    //         name: data.parentsName,
    //         reason: 'duplicate',
    //         email: data.parentsEmail,
    //         id: doc.id,
    //         kidsName: data.kidsName,
    //       })
    //       masterRejectedList.push(data.parentsEmail)
    //     }
    //   }
    // })

    // for (const value of Object.values(slots)) {
    //   console.log('the value is:', value)
    //   value.emailList = Array.from(value.emailList)
    // }

    // console.log('final data structure:', slots)
    // console.log('master rejected list:', masterRejectedList)
  },
  async addLeadFromBackend(_, data) {
    data.createdAt = this.$fireModule.firestore.FieldValue.serverTimestamp()
    data.updatedAt = this.$fireModule.firestore.FieldValue.serverTimestamp()
    data.skipEmail = true

    await this.$fire.firestore.collection('demos').add(data)
  },
  async addSiblingToDemos(_, data) {
    data.updatedAt = this.$fireModule.firestore.FieldValue.serverTimestamp()
    data.skipEmail = true

    if (!data.createdAt) {
      console.log('No createdAt present, discarding...')
      return
    }

    const createdAt = data.createdAt
    if (
      !(
        typeof createdAt.getMonth === 'function' ||
        typeof createdAt.toDate === 'function'
      )
    ) {
      if (createdAt.seconds && createdAt.nanoseconds) {
        const Timestamp = this.$fireModule.firestore.Timestamp
        data.createdAt = new Timestamp(createdAt.seconds, createdAt.nanoseconds)
      } else {
        console.log(
          'createdAt present in unknown format, bailing out...',
          createdAt
        )
        return
      }
    }

    await this.$fire.firestore.collection('demos').add(data)
  },
  async adminCreateUser(_, data) {
    const createUser = this.$fire.functions.httpsCallable('adminCreateUser')
    const response = await createUser(data)

    console.log('createUser response:: ', response)
  },
  async getPartnerRequests({ rootGetters, getters, commit }) {
    const user = rootGetters['user/user']
    const userId = user.id // '8BsNGOYZJ9dtggC4cMEq' // user.id
    const existingRequests = getters.partnerRequests
    console.log('existingPartnerRequests: ', existingRequests)
    if (!existingRequests) {
      const partnerRequestsSnap = await this.$fire.firestore
        .collection('demos')
        .where('query.ref_id', '==', userId)
        .orderBy('updatedAt', 'desc')
        .get()

      const partnerRequests = []
      partnerRequestsSnap.forEach((doc) => {
        partnerRequests.push({ id: doc.id, ...doc.data() })
      })

      console.log('fetched partnerRequests from backend: ', partnerRequests)

      commit('setPartnerRequests', partnerRequests)
    }
  },
  async getPartnerSchoolRequests({ rootGetters, getters, commit }) {
    const user = rootGetters['user/user']
    const userId = user.id // '8BsNGOYZJ9dtggC4cMEq' // user.id
    const existingRequests = getters.partnerSchoolRequests
    console.log('existingPartnerRequests: ', existingRequests)
    if (!existingRequests) {
      const partnerRequestsSnap = await this.$fire.firestore
        .collection('partnerships')
        .where('query.ref_id', '==', userId)
        .orderBy('updatedAt', 'desc')
        .get()

      const partnerRequests = []
      partnerRequestsSnap.forEach((doc) => {
        partnerRequests.push({ id: doc.id, ...doc.data() })
      })

      console.log(
        'fetched partnerSchoolRequests from backend: ',
        partnerRequests
      )

      commit('setPartnerSchoolRequests', partnerRequests)
    }
  },
  observeSchoolRequestLogs({ commit }, { id }) {
    const closeRequest = this.$fire.firestore
      .collection('partnerships')
      .doc(id)
      .collection('logs')
      .orderBy('createdAt', 'desc')
      .onSnapshot({
        next: (logsSnap) => {
          if (!logsSnap.metadata.hasPendingWrites) {
            const logs = []
            logsSnap.forEach((logDoc) => {
              if (!logDoc.metadata.hasPendingWrites) {
                logs.push({ id: logDoc.id, ...logDoc.data() })
              }
            })

            commit('setCurrSchoolReqLogs', logs)
          }
        },
        error: (error) => {
          console.log(error)
        },
      })

    commit('setCurrSchoolReqLogsHandle', closeRequest)
  },
  async observeSchoolRequest({ commit, dispatch, getters }, { id }) {
    await new Promise((resolve, reject) => {
      const closeRequest = this.$fire.firestore
        .collection('partnerships')
        .doc(id)
        .onSnapshot({
          next: (demoRequestDoc) => {
            if (demoRequestDoc.exists) {
              commit('setCurrSchoolReqData', {
                id,
                ...demoRequestDoc.data(),
              })

              if (!getters.currDemoReq.interactions.handle) {
                dispatch('observeSchoolRequestLogs', { id })
              }
            }

            resolve()
          },
          error: (error) => {
            console.log('observeSchoolRequest failed with error', error)
            reject(error)
          },
        })

      commit('setCurrSchoolReqHandle', closeRequest)
    })
  },
  unobserveSchoolRequest({ commit, getters }) {
    const currDemoReq = getters.currSchoolReq
    if (currDemoReq.handle) {
      currDemoReq.handle()
    }

    if (currDemoReq.interactions.handle) {
      currDemoReq.interactions.handle()
    }

    commit('cleanupCurrSchoolReq')
  },
  async logSchoolInteraction({ getters, rootGetters }, { log }) {
    if (!getters.currSchoolReq.data) {
      return
    }

    const user = rootGetters['user/user']
    log.createdAt = this.$fireModule.firestore.FieldValue.serverTimestamp()
    log.updatedAt = this.$fireModule.firestore.FieldValue.serverTimestamp()
    log.author = {
      name: user.displayName,
      id: user.id,
    }

    await this.$fire.firestore
      .collection('partnerships')
      .doc(getters.currSchoolReq.data.id)
      .collection('logs')
      .add(log)
  },
  async editSchoolInteraction({ getters }, { id, data }) {
    if (!getters.currSchoolReq.data) {
      return
    }

    data.updatedAt = this.$fireModule.firestore.FieldValue.serverTimestamp()

    await this.$fire.firestore
      .collection('partnerships')
      .doc(getters.currSchoolReq.data.id)
      .collection('logs')
      .doc(id)
      .update(data)
  },
}

const getConvertedDate = (date) => {
  const dateParts = date.split('/')
  return new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`)
}

// const getFirstName = (name) => {
//   const nameParts = name.split(' ')
//   let firstName = nameParts[0].toLowerCase()
//   if (
//     firstName.includes('mr') ||
//     firstName.includes('dr') ||
//     firstName.includes('ms') ||
//     firstName.includes('mrs') ||
//     firstName.length <= 3
//   ) {
//     firstName = `${nameParts[0]}${nameParts[1] ? ` ${nameParts[1]}` : ''}`
//   } else {
//     firstName = nameParts[0]
//   }

//   return firstName
// }
