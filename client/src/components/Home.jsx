import React, { useEffect, useRef } from "react";
import throttle from "lodash.throttle";
import useWebSocket from "react-use-websocket";
import { Cursor } from "./Cursor";

const renderCursor = (users) => {
  return Object.keys(users).map((uuid) => {
    const user = users[uuid];
    console.log([user.state.x, user.state.y])
    return <Cursor key={uuid} point={[user.state.x, user.state.y]} />;
  });
};

const renderPoints = (users) => {
    return Object.keys(users).map((uuid) => {
      const user = users[uuid];
      return <li key={uuid}>{JSON.stringify(users[uuid])} </li>;
    });
  };



function Home({ userName }) {
  const ws_URL = "ws://127.0.0.1:8000";
  const { sendJsonMessage, lastJsonMessage } = useWebSocket(ws_URL, {
    queryParams: { username: userName },
  });

  const THROTLE = 1000;
  const sendJsonMessageThrottled = useRef(throttle(sendJsonMessage, THROTLE));
  useEffect(() => {
    sendJsonMessage({
      x: 0,
      y: 0,
    });
    window.addEventListener("mousemove", (e) => {
      sendJsonMessageThrottled.current({ x: e.clientX, y: e.clientY });
    });
  }, []);

  if (lastJsonMessage) {
    return (
      <>
        {renderCursor(lastJsonMessage)}
        {renderPoints(lastJsonMessage)}
      </>
    );
  }

  return (
    <div>
      <h4>userName : {userName}</h4>
    </div>
  );
}

export default Home;
