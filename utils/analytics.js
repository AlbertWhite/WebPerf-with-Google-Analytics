// https://github.com/zeit/next.js/blob/canary/examples/with-google-analytics/pages/_app.js

export const GA_TRACKING_ID = "UA-162274920-1";

export const trackTypes = {
  TRACK_START: "trackStart",
  TRACK_END: "trackEnd"
};

if (typeof window !== "undefined") {
  // eventTimeStamp: {eventType, startTimeStamp, endTimeStamp}
  window.eventTimeStamps = [];
}

export const trackPageview = url => {
  window.gtag("config", GA_TRACKING_ID, {
    page_path: url
  });
};

export const trackEvent = ({ action, name, value, event_category }) => {
  window.gtag("event", action, {
    name,
    value,
    event_category
  });
};

export const trackEventTiming = ({ trackType, eventType, timeStamp }) => {
  const eventIndex = window.eventTimeStamps.findIndex(
    event => event.eventType === eventType
  );
  const isEventExist = eventIndex !== -1;
  if (trackType === trackTypes.TRACK_START) {
    if (isEventExist) {
      window.eventTimeStamps[eventIndex].startTimeStamp = timeStamp;
    } else {
      window.eventTimeStamps.push({
        eventType,
        startTimeStamp: timeStamp,
        endTimeStamp: null
      });
    }
  } else if (trackType === trackTypes.TRACK_END && isEventExist) {
    // send GA tracking, then remove from the list
    const deltaTime =
      timeStamp - window.eventTimeStamps[eventIndex].startTimeStamp;
    trackEvent({
      action: "timing_complete",
      name: "test_name",
      value: deltaTime,
      event_category: eventType
    });

    window.eventTimeStamps.splice(eventIndex, 1);
  }

  return window.eventTimeStamps;
};
