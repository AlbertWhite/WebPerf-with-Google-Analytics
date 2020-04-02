import React, { useEffect } from "react";
import Layout from "../components/MyLayout.js";
import Link from "next/link";
import fetch from "isomorphic-unfetch";
import { trackEventTiming, trackTypes } from "../utils/analytics";

const Index = props => {
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

  return (
    <Layout>
      <h1>Batman TV Shows</h1>
      <ul>
        {props.shows.map(show => (
          <li key={show.id}>
            <Link href="/p/[id]" as={`/p/${show.id}`}>
              <a>{show.name}</a>
            </Link>
          </li>
        ))}
      </ul>
    </Layout>
  );
};

Index.getInitialProps = async function() {
  const res = await fetch("https://api.tvmaze.com/search/shows?q=batman");
  const data = await res.json();

  console.log(`Show data fetched. Count: ${data.length}`);

  return {
    shows: data.map(entry => entry.show)
  };
};

export default Index;
