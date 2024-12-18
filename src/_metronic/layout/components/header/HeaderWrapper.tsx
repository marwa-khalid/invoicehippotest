import clsx from "clsx";
import { Link } from "react-router-dom";
import { KTIcon, toAbsoluteUrl } from "../../../helpers";
import { LayoutSetup, useLayout } from "../../core";
import { Header } from "./Header";
import { Navbar } from "./Navbar";
import { useAuth } from "../../../../app/modules/auth";
type Props = {
  setProfileModalOpen: (type: boolean) => void;
};
export function HeaderWrapper({ setProfileModalOpen }: Props) {
  const { config, classes } = useLayout();
  if (config.app?.header?.default?.container === "fluid") {
    LayoutSetup.classes.headerContainer.push("container-fluid");
  } else {
    LayoutSetup.classes.headerContainer.push("container-xxl");
  }
  if (!config.app?.header?.display) {
    return null;
  }
  const auth = useAuth();
  return (
    <div
      id="kt_app_header"
      className={clsx(
        "app-header",
        config.app?.header?.default?.containerClass,
        {
          "bg-dark": config.layoutType === "dark-sidebar",
          "bg-light": config.layoutType === "light-sidebar",
        }
      )}
      data-kt-sticky="true"
      data-kt-sticky-activate="{default: true, lg: true}"
      data-kt-sticky-name="app-header-minimize"
      data-kt-sticky-offset='{default: "200px", lg: "0"}'
      data-kt-sticky-animation="false"
    >
      <div
        id="kt_app_header_container"
        className={clsx(
          "app-container mb-2 mb-lg-0",
          classes.headerContainer.join(" "),
          config.app?.header?.default?.containerClass,
          {
            "bg-dark": config.layoutType === "dark-sidebar",
            "bg-light": config.layoutType === "light-sidebar",
          }
        )}
      >
        {config.app.sidebar?.display && (
          <>
            {config.layoutType !== "dark-header" &&
              config.layoutType !== "light-header" && (
                <div
                  className="d-flex align-items-center d-lg-none ms-n2 me-2 mt-6"
                  title="Show sidebar menu"
                >
                  {!auth.currentUser?.result.isAnonymousUser && (
                    <div
                      className="btn btn-icon btn-active-color-primary w-35px h-35px"
                      // id="kt_app_sidebar_mobile_toggle"
                    >
                      <KTIcon iconName="abstract-14" className="fs-1" />
                    </div>
                  )}
                  <div className="d-flex align-items-center flex-grow-1 flex-lg-grow-0">
                    <Link to="/#" className="d-lg-none">
                      <img
                        alt="Logo"
                        src={toAbsoluteUrl(
                          "media/logos/invoicehippo_one_line_art01.svg"
                        )}
                        className="h-200px w-auto ms-n6"
                      />
                    </Link>
                  </div>
                </div>
              )}
          </>
        )}

        {!(
          config.layoutType === "dark-sidebar" ||
          config.layoutType === "light-sidebar"
        ) && (
          <div className="d-flex align-items-center flex-grow-1 flex-lg-grow-0 me-lg-15">
            <Link to="#">
              {config.layoutType === "dark-header" ? (
                <img
                  alt="Logo"
                  src={toAbsoluteUrl("media/logos/default-dark.svg")}
                  className="h-20px h-lg-30px -defapp-sidebar-logoault"
                />
              ) : (
                <>
                  <img
                    alt="Logo"
                    src={toAbsoluteUrl("media/logos/default.svg")}
                    className="h-20px h-lg-30px app-sidebar-logo-default theme-light-show"
                  />
                  <img
                    alt="Logo"
                    src={toAbsoluteUrl("media/logos/default-dark.svg")}
                    className="h-20px h-lg-30px app-sidebar-logo-default theme-dark-show"
                  />
                </>
              )}
            </Link>
          </div>
        )}

        <div
          id="kt_app_header_wrapper"
          className="d-flex align-items-stretch justify-content-between flex-lg-grow-1 mt-lg-0 mt-6"
        >
          {/* {auth.currentUser?.result.isAnonymousUser && (
            <div className="d-flex align-items-center flex-grow-lg-0 justify-content-start">
              <Link to="#" className="d-none d-lg-flex">
                <img
                  alt="Logo"
                  src={toAbsoluteUrl(
                    "media/logos/invoicehippo_one_line_art01.svg"
                  )}
                  className="h-250px w-auto mt-4 ms-n4"
                />
              </Link>
            </div>
          )} */}
          {config.app.header.default?.content === "menu" &&
            config.app.header.default.menu?.display && (
              <div
                className="app-header-menu app-header-mobile-drawer align-items-stretch"
                data-kt-drawer="true"
                data-kt-drawer-name="app-header-menu"
                data-kt-drawer-activate="{default: true, lg: false}"
                data-kt-drawer-overlay="true"
                data-kt-drawer-width="225px"
                data-kt-drawer-direction="start"
                data-kt-drawer-toggle="#kt_app_header_menu_toggle"
                data-kt-swapper="true"
                data-kt-swapper-mode="{default: 'append', lg: 'prepend'}"
                data-kt-swapper-parent="{default: '#kt_app_body', lg: '#kt_app_header_wrapper'}"
              >
                <Header />
              </div>
            )}

          <Navbar setProfileModalOpen={setProfileModalOpen} />
        </div>
      </div>
    </div>
  );
}
