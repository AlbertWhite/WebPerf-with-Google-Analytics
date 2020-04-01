// https://github.com/zeit/next.js/blob/canary/examples/with-google-analytics/pages/_app.js

export const GA_TRACKING_ID = 'UA-162274920-1'

export const trackPageview = (url) => {
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  })
}

export const trackEvent = ({ action, category, label, value }) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}