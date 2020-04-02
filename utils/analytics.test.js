import * as trackFunctions from "./analytics";

const trackEventTiming = trackFunctions.trackEventTiming;

const { TRACK_START, TRACK_END } = trackFunctions.trackTypes;
const event = "someEvent";

const trackGA = jest.fn();
window.gtag = trackGA;

describe("trackEventTiming", () => {
  describe("eventType already exists in the array", () => {
    const a = trackEventTiming({
      trackType: TRACK_START,
      eventType: event,
      timeStamp: 100
    });
    it("should send time data to GA if event exists", () => {
      // WHEN
      trackEventTiming({
        trackType: TRACK_END,
        eventType: event,
        timeStamp: 300
      });

      // THEN
      expect(trackGA).toBeCalledWith("event", "timing_complete", {
        name: "test_name",
        value: 200,
        event_category: event
      });
    });
  });
});
