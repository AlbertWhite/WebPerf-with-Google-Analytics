// https://github.com/zeit/next.js/blob/canary/examples/with-google-analytics/pages/_app.js

export const GA_TRACKING_ID = 'UA-162274920-1'

export const trackPageview = (url) => {
  console.warn('ax', { url });
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  })
}
