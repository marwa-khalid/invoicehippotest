import React from "react";
import { useIntl } from "react-intl";

const ListLoading = () => {
  const intl = useIntl();

  return (
    <div
      style={{
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.3)", // Semi-transparent dark overlay
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 0,
        zIndex: "9999",
        flexDirection: "column",
        color: "rgba(0, 0, 0, 0.3)",
      }}
    >
      <iframe
        src="/Animation-v2.html"
        width="200"
        height="200"
        style={{ border: "none", background: "none" }}
      />
      {/* <div
        style={{
          marginTop: "1rem",
          color: "red",
        }}
      >
        {intl.formatMessage({ id: "Common.Busy" })}...
      </div> */}
    </div>
  );
};

export { ListLoading };
