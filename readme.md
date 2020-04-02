### Plan of action

- [x] create a demo with multi routings with Next.js
- [x] add GA
- [x] Track page loading time by route
- [x] Understand common metrics
- [x] Try with GA times API and navigation performance API to upload userTime
- [x] Upload time data by gtag.js
- [x] Implement the substract of two times in order to track the key metric
- [x] Track user action between page (ex: redirection)
- [x] Create helper functions, or a hook to track the metrics above
- [ ] Test with React profiler API, find the useful metrics
- [ ] Talk with collegues for suggestions

## Description

This demo is for showing how we can use Google analytics to track our web performance. The sample project is built with Next.js (SSR). Link to access to the sample project: https://web-perf-with-google-analytics.now.sh/

Normally Google analytics is used to user related information and serves in marketing purposes, such as page views, user regions, user behavoirs. However, Google analytics can also be used to track page loading time, and other timing related metrics.

## Technology

- Nextjs

1. API: https://api.tvmaze.com/search/shows?q=batman
2. Index page, fetch on server side, with SSR.
3. Redirection to post page, fetch on client side.

- Google Analytics

- Deployed with [Now](https://zeit.co/dashboard). Now is the delivery service from ZEIT. It is the same company who has created Next.js. CD actived on deployment.

## Track average page loading time

#### Description

Average page loading time is one of the default tracking metrics in Google analytics (GA for the following content). It is in **Behavoir > Site Speed > Page Timing**.

For example, there is a huge loop on the about page, GA can tell us by its longer loading time.
![](https://raw.githubusercontent.com/AlbertWhite/WebPerf-with-Google-Analytics/master/images/1.png)

If we choose "Technical" under the "Explorer" panel, we will have more valuable web perf metrics, for example, Redirection Time, Server response time.

![](https://raw.githubusercontent.com/AlbertWhite/WebPerf-with-Google-Analytics/master/images/3.png)

#### Technology

- react-ga library

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
      initGA();
      window.GA_INITIALIZED = true;
    }
    logPageView();
  }
  render() {
    return (
      <div style={layoutStyle}>
        <Header />
        {this.props.children}
      </div>
    );
  }
}
```

And in [utils](https://github.com/AlbertWhite/WebPerf-with-Google-Analytics/blob/master/utils/analytics.js),

```js
import ReactGA from "react-ga";
export const initGA = () => {
  ReactGA.initialize("UA-xxxxxxx-x", {
    gaOptions: {
      siteSpeedSampleRate: 100 // need to put 100 here to well track site speed
    }
  });
};
export const logPageView = () => {
  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname);
};
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

## Track user interaction response time

#### Description

In order to track user interaction response time,
we need the help of gtag.js or google tag manager.

In order to use gtag.js, the library react-ga is not a good idea, because it uses analytic.js, the old version of the script for google analytics, instead of gtag.js, a new version of the script for google analytics. [Here](https://github.com/zeit/next.js/blob/canary/examples/with-google-analytics) is a good example for integrating gtag.js in a project of NextJs.

In order to track user interaction response time, the idea is simple:

1. Get the timestamp when the interaction is triggered
2. Get the timestamp when the interaction is finished
3. Calculate the delta of two timestamp, push the data to google analytics

#### Technology

- gtag.js
- window.performance.timing API

#### Implementation

1. Implement GA tracking with gtag.js.

Here is the implementation for next.js in [\_document.js](https://github.com/AlbertWhite/WebPerf-with-Google-Analytics/blob/master/pages/_document.js).

```js
<Head>
  {/* Global Site Tag (gtag.js) - Google Analytics */}
  <script
    async
    src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
  />
  <script
    dangerouslySetInnerHTML={{
      __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              'sample_rate': 100,
              'site_speed_sample_rate' : 100
            });
          `
    }}
  />
</Head>
```

2. Track time with gtag

[Here](https://github.com/AlbertWhite/WebPerf-with-Google-Analytics/blob/master/pages/pay.js) is an example for tracking the payment button.

```js
const treatPayment = ({ setIsConfirmed }) => {
  const startTreatPaymentTime = window.performance.now();

  setTimeout(function() {
    setIsConfirmed(true);
    const endTreatPaymentTime = window.performance.now();
    const deltaTime = Math.round(endTreatPaymentTime - startTreatPaymentTime);
    trackEvent({
      action: "timing_complete",
      name: "test_name",
      value: deltaTime,
      event_category: "payment_confirmation_time"
    });
  }, 999); // mock 1s to treat payment
};
```

We will see the 'payment_confirmation_time' is tracked in google analytics and the average time duration is 1s.

![](https://raw.githubusercontent.com/AlbertWhite/WebPerf-with-Google-Analytics/master/images/4.png)

### Helper function for tracking reponse time to user action

If a user action concerns multiple pages, it is not easy to calculate delta time within one file. We need a helper function and save the timestamp data somewhere stable, for example, redux store, window object or cache.

In this project, I have create a helper function [trackEventTiming](https://github.com/AlbertWhite/WebPerf-with-Google-Analytics/blob/mastsr/utils/analytics.js).

```js
trackEventTiming({
  trackType: TRACK_START | TRACK_END,
  eventType: string,
  timeStamp: number
});
```

In this way, we can track the start time and end time for the same event, in whatever which page.

For using this function, in the file [pay-with-redirection.js](https://github.com/AlbertWhite/WebPerf-with-Google-Analytics/blob/master/pages/pay-with-redirection.js)

```js
const treatPayment = (router, setIsConfirmed) => {
  trackEventTiming({
    trackType: trackTypes.TRACK_START,
    eventType: "paymentWithRedirection",
    timeStamp: window.performance.now()
  });
  setIsConfirmed(true);

  setTimeout(function() {
    router.push("/");
  }, 1999); // mock 1s to treat payment
};
```

Then on the [index page](https://github.com/AlbertWhite/WebPerf-with-Google-Analytics/blob/master/pages/index.js),

```js
useEffect(() => {
  const paymentEventIndex = window.eventTimeStamps.findIndex(
    event => event.eventType === "paymentWithRedirection"
  );
  if (paymentEventIndex !== -1) {
    trackEventTiming({
      trackType: trackTypes.TRACK_END,
      eventType: "paymentWithRedirection",
      timeStamp: window.performance.now()
    });
  }
}, []);
```

In google analytics, we can see that from clicking on the button to redirect to the home page takes 2.3s on average.

![](https://raw.githubusercontent.com/AlbertWhite/WebPerf-with-Google-Analytics/master/images/5.png)

## Resources

Demo from https://github.com/AlbertWhite/next-learn-demo/tree/master/6-fetching-data

[Using Google Analytics with Next.js](https://medium.com/@austintoddj/using-google-analytics-with-next-js-423ea2d16a98)

[Track user timing](https://developers.google.com/analytics/devguides/collection/analyticsjs/user-timings)

[google tag manager](https://analytics.google.com/analytics/academy/course/5/unit/1/lesson/2): maybe we don't need it. [gtag.js](https://developers.google.com/gtagjs) is enough.

[Add secret in Now deployment for enviroment variables](https://zeit.co/docs/v2/build-step#using-environment-variables-and-secrets) Now secrets are lowercased.

[Measure user timings with gtag.js](https://developers.google.com/analytics/devguides/collection/gtagjs/user-timings)

```

```

```

```
