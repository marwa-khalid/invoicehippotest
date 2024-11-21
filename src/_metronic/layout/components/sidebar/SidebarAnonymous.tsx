import clsx from "clsx";
import { useRef } from "react";
import { useLayout } from "../../core";
import { SidebarLogo } from "./SidebarLogo";

const SidebarAnonymous = () => {
  const { config } = useLayout();
  const sidebarRef = useRef<HTMLDivElement>(null);

  if (!config.app?.sidebar?.display) {
    return null;
  }

  return (
    <div
      ref={sidebarRef}
      id="kt_app_sidebar"
      className={clsx(
        "position-fixed top-0 start-0 p-3",
        config.layoutType === "dark-sidebar" ? "bg-dark" : "bg-light"
      )}
      style={{
        width: "auto",
        height: "auto",
        backgroundColor: "transparent",
        zIndex: 1000, // Ensure it's above other content
      }}
    >
      {/* Render the Sidebar Logo */}
      <SidebarLogo sidebarRef={sidebarRef} />
    </div>
  );
};

export { SidebarAnonymous };
