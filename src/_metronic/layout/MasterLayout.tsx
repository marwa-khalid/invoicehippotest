import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { HeaderWrapper } from "./components/header";
import { RightToolbar } from "../partials/layout/RightToolbar";
import { ScrollTop } from "./components/scroll-top";
import { FooterWrapper } from "./components/footer";
import { Sidebar } from "./components/sidebar";
import { PageDataProvider } from "./core";
import { DrawerMessenger } from "../../app/modules/generic/DrawerMessenger";
import { reInitMenu } from "../helpers";
import { ActivityDrawer, InviteUsers, UpgradePlan } from "../partials";
import { PasswordChangeModal } from "./PasswordChangeModal";
import { SidebarAnonymous } from "./components/sidebar/SidebarAnonymous";
import { useAuth } from "../../app/modules/auth";

const MasterLayout = () => {
  const location = useLocation();
  useEffect(() => {
    reInitMenu();
  }, [location.key]);
  const auth = useAuth();
  const [profileModalOpen, setProfileModalOpen] = useState<boolean>();

  return (
    <PageDataProvider>
      <div className="d-flex flex-column flex-root app-root" id="kt_app_root">
        <div
          className="app-page flex-column flex-column-fluid"
          id="kt_app_page"
        >
          <HeaderWrapper setProfileModalOpen={setProfileModalOpen} />

          {!auth.currentUser?.result.isAnonymousUser ? (
            <div
              className="app-wrapper flex-column flex-row-fluid"
              id="kt_app_wrapper"
            >
              <Sidebar />
              <div
                className="app-main flex-column flex-row-fluid"
                id="kt_app_main"
              >
                <div className="d-flex flex-column flex-column-fluid">
                  <Outlet />
                </div>
                {/* <FooterWrapper /> */}
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
        <PasswordChangeModal
          setProfileModalOpen={setProfileModalOpen}
          targerUserId={auth.currentUser?.result.id}
        />
      )}
      {/* begin:: Drawers */}
      <ActivityDrawer />
      {/* <RightToolbar /> */}
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
