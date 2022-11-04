exports.getFirstName = (name) => {
  const nameParts = name.split(' ')
  let firstName = nameParts[0].toLowerCase()
  if (
    firstName.includes('mr') ||
    firstName.includes('dr') ||
    firstName.includes('ms') ||
    firstName.includes('mrs') ||
    firstName.length <= 3
  ) {
    firstName = `${nameParts[0]}${nameParts[1] ? ` ${nameParts[1]}` : ''}`
  } else {
    firstName = nameParts[0]
  }

  return firstName
}
