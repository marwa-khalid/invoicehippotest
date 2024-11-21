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
        <>
          <div
            className="modal fade show d-block"
            id="profileModal"
            role="dialog"
            tabIndex={-1}
            aria-modal="true"
          >
            {/* begin::Modal dialog */}
            <div className="modal-dialog modal-dialog-centered ">
              {/* begin::Modal content */}
              <div className="modal-content">
                <div className="modal-header bg-primary d-flex flex-column">
                  {/* Modal title */}
                  <div className="d-flex w-100 justify-content-between align-items-center">
                    <h2 className="fw-bolder mb-0 text-white">
                      {intl.formatMessage({
                        id: "Fields.ModalTitleManagePassword",
                      })}
                    </h2>
                    <div
                      className="btn btn-icon btn-sm btn-active-icon-primary"
                      data-kt-users-modal-action="close"
                      onClick={() => {
                        setProfileModalOpen(false);
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <KTIcon iconName="cross" className="fs-1 text-white" />
                    </div>
                  </div>
                </div>
                {/* begin::Modal body */}
                <div className="modal-body p-10">
                  <div className="row d-flex form-wrapper bg-secondary p-5 rounded">
                    <div className="col-2">
                      <i className="ki-duotone ki-information-4 fs-3x  my-auto">
                        <span className="path1"></span>
                        <span className="path2"></span>
                        <span className="path3"></span>
                      </i>
                    </div>
                    <span
                      className="col-10"
                      dangerouslySetInnerHTML={{
                        __html: intl.formatMessage({
                          id: "Fields.RegionInfoUserNewPassword",
                        }),
                      }}
                    />
                  </div>
                </div>

                {/* end::Modal body */}
                <div className="modal-footer d-flex justify-content-end align-items-center ">
                  <div className="d-flex">
                    {/* Cancel Button */}
                    <button
                      type="reset"
                      onClick={() => {
                        setProfileModalOpen(false);
                      }}
                      className="btn btn-secondary me-3"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
              {/* end::Modal content */}
            </div>
            {/* end::Modal dialog */}
          </div>
          {/* begin::Modal Backdrop */}
          <div className="modal-backdrop fade show"></div>
          {/* end::Modal Backdrop */}
        </>
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
