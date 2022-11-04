let dateFormatter = null

exports.formatDate = (date) => {
  if (!dateFormatter) {
    dateFormatter = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      timeZone: 'Asia/Kolkata',
    })
  }

  if (typeof date.getMonth !== 'function') {
    if (date.date && date.time) {
      date = new Date(`${date.date} ${date.time}`)
    } else {
      date = date.toDate()
    }
  }

  return dateFormatter.format(date)
}

exports.formatDateWithZone = (date, timeZone) => {
  const tDateFormatter = new Intl.DateTimeFormat('en', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZone: timeZone || 'Asia/Kolkata',
    timeZoneName: 'long',
  })

  return tDateFormatter.format(date.toDate())
}
