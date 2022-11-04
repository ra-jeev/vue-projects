import Vue from 'vue'

const formatter = new Intl.DateTimeFormat('en-IN', {
  month: '2-digit',
  day: '2-digit',
  year: '2-digit',
  hour: 'numeric',
  minute: 'numeric',
})

const shortDateFormatter = new Intl.DateTimeFormat('en-IN', {
  month: '2-digit',
  day: '2-digit',
  year: 'numeric',
})

const workshopDateFormatter = new Intl.DateTimeFormat('en-IN', {
  month: 'short',
  day: '2-digit',
  year: 'numeric',
  weekday: 'short',
})

const certificateDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: '2-digit',
  year: 'numeric',
})

const timeFormatter = new Intl.DateTimeFormat('en-IN', {
  hour: 'numeric',
  minute: 'numeric',
  timeZone: 'Asia/Kolkata',
  timeZoneName: 'short',
})

Vue.filter('dateFilter', (date) => {
  if (typeof date.getMonth !== 'function') {
    if (date.date && date.time) {
      date = new Date(`${date.date} ${date.time}`)
    } else {
      date = date.toDate()
    }
  }

  return formatter.format(date)
})

Vue.filter('shortDateFilter', (date) => {
  if (typeof date.getMonth !== 'function') {
    date = date.toDate()
  }

  return shortDateFormatter.format(date)
})

Vue.filter('workshopDateFilter', (date) => {
  if (typeof date.getMonth !== 'function') {
    date = date.toDate()
  }

  return workshopDateFormatter.format(date)
})

Vue.filter('certificateDateFilter', (date) => {
  if (typeof date.getMonth !== 'function') {
    date = date.toDate()
  }

  return certificateDateFormatter.format(date)
})

Vue.filter('timeFilter', (date) => {
  if (typeof date.getMonth !== 'function') {
    date = date.toDate()
  }

  return timeFormatter.format(date)
})
