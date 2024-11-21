import { Link } from "react-router-dom";
import clsx from "clsx";
import { KTIcon, toAbsoluteUrl } from "../../../helpers";
import { useLayout } from "../../core";
import { MutableRefObject, useEffect, useRef } from "react";
import { ToggleComponent } from "../../../assets/ts/components";
import { useAuth } from "../../../../app/modules/auth";

type PropsType = {
  sidebarRef: MutableRefObject<HTMLDivElement | null>;
};

const SidebarLogo = (props: PropsType) => {
  const { config } = useLayout();
  const toggleRef = useRef<HTMLDivElement>(null);

  const appSidebarDefaultMinimizeDesktopEnabled =
    config?.app?.sidebar?.default?.minimize?.desktop?.enabled;
  const appSidebarDefaultCollapseDesktopEnabled =
    config?.app?.sidebar?.default?.collapse?.desktop?.enabled;
  const toggleType = appSidebarDefaultCollapseDesktopEnabled
    ? "collapse"
    : appSidebarDefaultMinimizeDesktopEnabled
    ? "minimize"
    : "";
  const toggleState = appSidebarDefaultMinimizeDesktopEnabled ? "active" : "";
  const appSidebarDefaultMinimizeDefault =
    config.app?.sidebar?.default?.minimize?.desktop?.default;

  useEffect(() => {
    setTimeout(() => {
      const toggleObj = ToggleComponent.getInstance(
        toggleRef.current!
      ) as ToggleComponent | null;

      if (toggleObj === null) {
        return;
      }

      // Add a class to prevent sidebar hover effect after toggle click
      toggleObj.on("kt.toggle.change", function () {
        // Set animation state
        props.sidebarRef.current!.classList.add("animating");

        // Wait till animation finishes
        setTimeout(function () {
          // Remove animation state
          props.sidebarRef.current!.classList.remove("animating");
        }, 300);
      });
    }, 600);
  }, [toggleRef, props.sidebarRef]);
  const { currentUser } = useAuth();

  return (
    <div className="app-sidebar-logo ms-9" id="kt_app_sidebar_logo">
      {(appSidebarDefaultMinimizeDesktopEnabled ||
        appSidebarDefaultCollapseDesktopEnabled) &&
        !currentUser?.result.isAnonymousUser && (
          <div
            ref={toggleRef}
            id="kt_app_sidebar_toggle"
            className={clsx(
              "btn btn-md btn-icon btn-active-color-primary w-30px h-30px ms-n3 d-none d-lg-flex",
              { active: appSidebarDefaultMinimizeDefault }
            )}
            data-kt-toggle="true"
            data-kt-toggle-state={toggleState}
            data-kt-toggle-target="body"
            data-kt-toggle-name={`app-sidebar-${toggleType}`}
          >
            <i className="ki-duotone ki-menu fs-3x">
              <span className="path1"></span>
              <span className="path2"></span>
              <span className="path3"></span>
              <span className="path4"></span>
            </i>
            {/* <i className="ki-outline ki-abstract-14 fs-3 mt-1"></i>{" "} */}
          </div>
          //   <KTIcon iconName="ki-abstract-14" className="ki-outline" />
          //   {/* <i
          //     className="ki-outline ki-
          //                     abstract-14                        "
          //   ></i> */}
          // </div>
        )}

      <Link
        to="/dashboard"
        className={`${currentUser?.result.isAnonymousUser ? "ms-n9" : "ms-n4"}`}
      >
        {config.layoutType === "dark-sidebar" ? (
          <img
            alt="Logo"
            src={toAbsoluteUrl("media/logos/invoicehippo_one_line_art01.svg")}
            className="h-250px app-sidebar-logo-default "
          />
        ) : (
          <>
            <img
              alt="Logo"
              src={toAbsoluteUrl("media/logos/invoicehippo_one_line_art01.svg")}
              className="h-250px app-sidebar-logo-default theme-light-show"
            />
            <img
              alt="Logo"
              src={toAbsoluteUrl("media/logos/invoicehippo_one_line_art01.svg")}
              className="h-250px  app-sidebar-logo-default theme-dark-show"
            />
          </>
        )}

        <img
          alt="Logo"
          src={toAbsoluteUrl("media/logos/invoicehippo_one_line_art01.svg")}
          className="h-250px w-auto app-sidebar-logo-minimize me-200px"
        />
      </Link>
    </div>
  );
};

export { SidebarLogo };
