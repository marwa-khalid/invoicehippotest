import { useEffect, useState } from "react";
import { SidebarMenuMain } from "./SidebarMenuMain";

const SidebarMenu = () => {
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  useEffect(() => {
    const updateHeight = () => {
      setWindowHeight(window.innerHeight); // Update state on resize
    };

    window.addEventListener("resize", updateHeight); // Listen for resize events

    return () => {
      window.removeEventListener("resize", updateHeight); // Cleanup on unmount
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (
        typeof window !== "undefined" &&
        typeof (window as any).KTScroll !== "undefined"
      ) {
        (window as any).KTScroll.updateAll(); // Ensures Metronic recalculates scrollbars
      }

      const sidebarWrapper = document.getElementById(
        "kt_app_sidebar_menu_wrapper"
      );

      if (sidebarWrapper) {
        const sidebarContent = document.getElementById("kt_app_sidebar_menu");

        if (sidebarContent) {
          const contentHeight = sidebarContent.scrollHeight;
          const availableHeight = windowHeight - 100;

          // Only apply height restriction if content exceeds available height
          if (contentHeight > availableHeight) {
            sidebarWrapper.style.height = `${availableHeight}px`;
          } else {
            sidebarWrapper.style.height = "auto";
          }
        }
      }
    }, 500); // Delay ensures Metronic scripts are loaded
  }, [windowHeight]);
  return (
    <div className="app-sidebar-menu overflow-hidden flex-column-fluid">
      <div
        id="kt_app_sidebar_menu_wrapper"
        className="app-sidebar-wrapper hover-scroll-overlay-y my-5"
        data-kt-scroll="true"
        data-kt-scroll-activate="true"
        data-kt-scroll-height="auto"
        data-kt-scroll-dependencies="#kt_app_sidebar_logo, #kt_app_sidebar_footer"
        data-kt-scroll-wrappers="#kt_app_sidebar_menu"
        data-kt-scroll-offset="5px"
        data-kt-scroll-save-state="true"
      >
        <div
          className="menu menu-column menu-rounded menu-sub-indention px-3"
          id="kt_app_sidebar_menu"
          data-kt-menu="true"
          data-kt-menu-expand="false"
        >
          <SidebarMenuMain />
        </div>
      </div>
    </div>
  );
};

export { SidebarMenu };
