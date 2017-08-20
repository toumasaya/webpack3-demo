// export default (text = 'Hello World') => {
//   const element = document.createElement('div')

//   element.className = 'btn btn-primary'
//   element.innerHTML = text

//   return element
// }

module.exports = () => {
  const element = document.createElement('div')

  element.className = 'alert alert-info'
  element.innerHTML = 'This is from index.js'

  return element
}
