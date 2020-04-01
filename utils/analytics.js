import ReactGA from 'react-ga'
export const initGA = () => {
  const gaKey = process.env.gaKey;
  ReactGA.initialize(gaKey, {
    gaOptions: {
      siteSpeedSampleRate: 100
    }
  })
}
export const logPageView = () => {
  console.log(`Logging pageview for ${window.location.pathname}`)
  ReactGA.set({ page: window.location.pathname })
  ReactGA.pageview(window.location.pathname)
}
export const logEvent = (category = '', action = '') => {
  if (category && action) {
    ReactGA.event({ category, action })
  }
}
export const logException = (description = '', fatal = false) => {
  if (description) {
    ReactGA.exception({ description, fatal })
  }
}

export const logTiming = (category = '', variable = '', value = 0, label = '') => {
  if (category && variable && value) {
    ReactGA.timing({ category, variable, value })
  }
}