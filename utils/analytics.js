export const GA_TRACKING_ID = 'UA-162274920-1'

export const trackPageview = () => {
  window.gtag('config', GA_TRACKING_ID, {
    page_path: window.location.pathname,
  })
}
