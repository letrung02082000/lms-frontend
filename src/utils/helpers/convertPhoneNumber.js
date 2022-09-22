function convertPhoneNumber(phoneNumber, type) {
  if (type === '.') {
    return phoneNumber.substring(0, 4) + '.' + phoneNumber.substring(4, 7) + '.' + phoneNumber.substring(7, 10)
  }
  if (type === '-') {
    return phoneNumber.substring(0, 4) + '-' + phoneNumber.substring(4, 7) + '-' + phoneNumber.substring(7, 10)
  } else {
    return phoneNumber.replace(phoneNumber.substring(0, 1), type)
  }
}

export default convertPhoneNumber
