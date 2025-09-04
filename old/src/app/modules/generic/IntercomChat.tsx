import React, { useEffect } from "react";
import IntercomService from "./IntercomService";

export const IntercomChat = () => {
  useEffect(() => {
    IntercomService.boot(); // This works for login page as fallback
  }, []);

  const showIntercom = () => {
    window.Intercom?.("show");
  };

  return <button onClick={showIntercom}>Open Intercom</button>;
};
