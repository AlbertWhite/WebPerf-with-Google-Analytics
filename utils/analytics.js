// https://github.com/zeit/next.js/blob/canary/examples/with-google-analytics/pages/_app.js

export const GA_TRACKING_ID = "UA-162274920-1";

export const trackTypes = {
  TRACK_START: "trackStart",
  TRACK_END: "trackEnd"
};

// eventTimeStamp: {eventType, startTimeStamp, endTimeStamp}
let eventTimeStamps = [];

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
  const eventIndex = eventTimeStamps.findIndex(
    event => event.eventType === eventType
  );
  const isEventExist = eventIndex !== -1;
  if (trackType === trackTypes.TRACK_START) {
    if (isEventExist) {
      eventTimeStamps[eventIndex].startTimeStamp = timeStamp;
    } else {
      eventTimeStamps.push({
        eventType,
        startTimeStamp: timeStamp,
        endTimeStamp: null
      });
    }
  } else if (trackType === trackTypes.TRACK_END && isEventExist) {
    // send GA tracking, then remove from the list
    const deltaTime = timeStamp - eventTimeStamps[eventIndex].startTimeStamp;
    trackEvent({
      action: "timing_complete",
      name: "test_name",
      value: deltaTime,
      event_category: eventType
    });

    eventTimeStamps.splice(eventIndex, 1);
  }

  return eventTimeStamps;
};
