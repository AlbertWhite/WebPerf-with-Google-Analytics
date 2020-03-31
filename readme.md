### Plan of action

- [x] create a demo with multi routings with Next.js
- [x] add GA
- [x] Track page loading time by route
- [ ] a - b
- [ ] Understand common metrics
- [ ] Try with GA times API and navigation times API to upload userTime 
- [ ] Test with React profiler API, find the useful metrics
- [ ] Create a helper function, or a hook to track the metrics above
- [ ] Create customized dimension in GA, push the data to GA with the help of gtag.js

## Description

This demo is for showing how we can use Google analytics to track our web performance. The sample project is built with Next.js (SSR). Link to access to the sample project: https://web-perf-with-google-analytics.now.sh/

Normally Google analytics is used to user related information and serves in marketing purposes, such as page views, user regions, user behavoirs. However, Google analytics can also be used to track page loading time, and other timing related metrics.

## Technology 

- Nextjs
1. API: https://api.tvmaze.com/search/shows?q=batman
2. Index page, fetch on server side, with SSR.
3. Redirection to post page, fetch on client side.

- Google Analytics

- react-ga library

- Deployed with [Now](https://zeit.co/dashboard). Now is the delivery service from ZEIT. It is the same company who has created Next.js. CD actived on deployment.


## Track average page loading time

#### Description
Average page loading time is one of the default tracking metrics in Google analytics (GA for the following content). It is in **Behavoir > Site Speed > Page Timing**. 

For example, there is a huge loop on the about page, GA can tell us by its longer loading time.
![](https://raw.githubusercontent.com/AlbertWhite/WebPerf-with-Google-Analytics/master/images/1.png)

#### Implementation

Technically, we need to:
1. Set up a google analytics account. Here is the official [tutorial](https://analytics.google.com/analytics/academy/course/6/unit/1/lesson/3) from Google analytics academy.
2. Put the tracking code and intializing script just after the opening `<head>` tag. If it is a react project, we can use the library [react-ga](https://github.com/react-ga/react-ga) to help with intializing GA and tracking. 
3. The intializing of google analytics should be done for every page, which means we can do it in Layout component or the Central Routing component. Here is the example how we are doing in this project:

In [Layout Component](https://github.com/AlbertWhite/WebPerf-with-Google-Analytics/blob/master/components/MyLayout.js),
```js
export default class Layout extends React.Component {
  componentDidMount() {
    if (!window.GA_INITIALIZED) {
      initGA()
      window.GA_INITIALIZED = true
    }
    logPageView()
  }
  render() {
    return (
      <div style={layoutStyle}>
        <Header />
        {this.props.children}
      </div>
    )
  }
}
```

And in [utils](https://github.com/AlbertWhite/WebPerf-with-Google-Analytics/blob/master/utils/analytics.js),
```js
import ReactGA from 'react-ga'
export const initGA = () => {
  ReactGA.initialize('UA-xxxxxxx-x', {
    gaOptions: {
      siteSpeedSampleRate: 100 // need to put 100 here to well track site speed
    }
  })
}
export const logPageView = () => {
  ReactGA.set({ page: window.location.pathname })
  ReactGA.pageview(window.location.pathname)
}
```

#### To be noticed
There are points to be noticed:

1. Remember to set siteSpeedSampleRate into 100 on intializing if there is not much traffic on the site
If we don't set siteSpeedSampleRate to 100 (100%), maybe there will be no data on site loading time. Because by default, GA tracks only 10% or fewer traffic for site speed.  

2. Remember to modify the range of time if you want to see today's traffic
![](https://raw.githubusercontent.com/AlbertWhite/WebPerf-with-Google-Analytics/master/images/2.png)
By default, the time range for reports (Audience, Acquisition, Behavoir) are until yesterday. We can modify the time range and set "Hourly" if we want to see today's traffic (useful for developing or debugging).

#### Conclusion
**It is a good start point for measuring web perf, to know which page takes the longest time to load, and to know how it changes overtime.**

## Resources

Demo from https://github.com/AlbertWhite/next-learn-demo/tree/master/6-fetching-data

[Using Google Analytics with Next.js](https://medium.com/@austintoddj/using-google-analytics-with-next-js-423ea2d16a98)


[Track user timing](https://developers.google.com/analytics/devguides/collection/analyticsjs/user-timings)

[google tag manager](https://analytics.google.com/analytics/academy/course/5/unit/1/lesson/2): maybe we don't need it. [gtag.js](https://developers.google.com/gtagjs) is enough.
