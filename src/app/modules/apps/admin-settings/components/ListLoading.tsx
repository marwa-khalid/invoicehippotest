import React from "react";
import { useIntl } from "react-intl";

const ListLoading = () => {
  const intl = useIntl();
  const overlayStyles = {
    // Ensure it is above other elements
  };

  const contentStyles = {};

  return (
    <div
      style={{
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        // backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: "9999", // Ensure it is above other elements
        flexDirection: "column",
        color: "#fff",
      }}
    >
      <iframe
        src="/Animation-v2.html"
        allowTransparency
        width="200"
        height="200"
        style={{ border: "none" }}
      ></iframe>
      <div style={{ marginTop: "1rem" }}>
        {intl.formatMessage({ id: "Common.Busy" })}...
      </div>
    </div>
  );
};

export { ListLoading };
