import React, { useState } from "react";
import Layout from "../components/MyLayout.js";
import { trackEventTiming, trackTypes } from "../utils/analytics";
import { useRouter } from "next/router";

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

export default function About() {
  const router = useRouter();
  const [isConfirmed, setIsConfirmed] = useState(false);
  return (
    <Layout>
      <h3>Another test:</h3>
      <h3>
        Click on the button to buy the batman videos and redirect to the home
        page:
      </h3>
      <button
        onClick={() => {
          treatPayment(router, setIsConfirmed);
        }}
      >
        Buy and redirect
      </button>
      {isConfirmed && <h3>Payment success, waiting for redirection...</h3>}
    </Layout>
  );
}
