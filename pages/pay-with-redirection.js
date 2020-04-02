import React, { useState } from "react";
import Layout from "../components/MyLayout.js";
import { trackEvent } from "../utils/analytics";

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

export default function About() {
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
          treatPayment({ setIsConfirmed });
        }}
      >
        Buy and redirect
      </button>
      {isConfirmed && <h4>Payment success</h4>}
    </Layout>
  );
}
