import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { HeaderWrapper } from "./components/header";
import { ScrollTop } from "./components/scroll-top";

import { Sidebar } from "./components/sidebar";
import {
  ActivityDrawer,
  DrawerMessenger,
  InviteUsers,
  UpgradePlan,
} from "../partials";
import { PageDataProvider } from "./core";
import { KTIcon, reInitMenu, toAbsoluteUrl } from "../helpers";
import { useLayout } from "./core";
import clsx from "clsx";
import { useAuth } from "../../app/modules/auth";
import { SidebarLogo } from "./components/sidebar/SidebarLogo";
import { SidebarAnonymous } from "./components/sidebar/SidebarAnonymous";
import { useIntl } from "react-intl";
import { PasswordChangeModal } from "./PasswordChangeModal";
const MasterLayout = () => {
  const location = useLocation();
  const { config } = useLayout();
  const intl = useIntl();
  useEffect(() => {
    reInitMenu();
  }, [location.key]);
  const auth = useAuth();
  const [profileModalOpen, setProfileModalOpen] = useState<boolean>();
  return (
    <PageDataProvider>
      <div
        style={{
          maxHeight: "100vh",
          overflowY: "auto",
        }}
        className={clsx(
          "main p-5 d-flex flex-column flex-root app-root",
          config.app?.sidebar?.default?.class,
          {
            "bg-dark": config.layoutType === "dark-sidebar",
            "bg-light": config.layoutType === "light-sidebar",
          }
        )}
        id="kt_app_root"
      >
        <div
          className="app-page flex-column flex-column-fluid"
          id="kt_app_page"
        >
          <HeaderWrapper setProfileModalOpen={setProfileModalOpen} />

          {!auth.currentUser?.result.isAnonymousUser ? (
            <div
              className="app-wrapper flex-column flex-row-fluid"
              id="kt_app_wrapper"
              style={{ overflowY: "auto" }}
            >
              <Sidebar />
              <div
                className="app-main flex-column flex-row-fluid"
                id="kt_app_main"
              >
                <div
                  className="d-flex flex-column flex-column-fluid"
                  // style={{
                  //   maxHeight: "100%", // Allow content to expand within the app-main
                  //   overflowY: "auto", // Enable scrolling for the content area
                  // }}
                >
                  {}
                  <Outlet />
                </div>
              </div>
            </div>
          ) : (
            <>
              <SidebarAnonymous />
              <div className="mt-20">
                <Outlet />
              </div>
            </>
          )}
        </div>
      </div>
      {profileModalOpen && (
        <PasswordChangeModal setProfileModalOpen={setProfileModalOpen} />
      )}
      {/* begin:: Drawers */}
      <ActivityDrawer />
      <DrawerMessenger />
      {/* end:: Drawers */}

      {/* begin:: Modals */}
      <InviteUsers />
      <UpgradePlan />
      {/* end:: Modals */}
      <ScrollTop />
    </PageDataProvider>
  );
};

export { MasterLayout };
