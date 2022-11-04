import Vue from 'vue'

const formatter = new Intl.DateTimeFormat('en-IN', {
  month: 'short',
  day: '2-digit',
  year: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
})

Vue.filter('dateFilter', (date) => {
  return formatter.format(new Date(date))
})

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

Vue.filter('dateMonthFilter', (date) => {
  return dateFormatter.format(new Date(date))
})

Vue.filter('sizeFilter', (size) => {
  if (size) {
    const sizeInKB = (size / 1024).toFixed(2)
    return sizeInKB < 1024
      ? `${sizeInKB} KB`
      : `${(sizeInKB / 1024).toFixed(2)} MB`
  }

  return '0 KB'
})
