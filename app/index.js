// import 'bootstrap'
import 'font-awesome/scss/font-awesome.scss'
import './sass/main.sass'
import component from './component'

let demoComponent = component()

document.body.appendChild(demoComponent)

// HMR interface
if (module.hot) {
  // Capture hot update
  module.hot.accept('./component', () => {
    const nextComponent = component()

    // Replace old content with the hot loaded one
    document.body.replaceChild(nextComponent, demoComponent)

    demoComponent = nextComponent
  })
}
