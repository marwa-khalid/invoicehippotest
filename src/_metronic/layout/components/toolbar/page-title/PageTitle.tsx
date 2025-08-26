import clsx from "clsx";
import { Link } from "react-router-dom";
import { useLayout } from "../../../core";
import { usePageData } from "../../../core/PageData";
import { useAuth } from "../../../../../app/modules/auth";

const PageTitle = () => {
  const { pageTitle, pageDescription, pageBreadcrumbs } = usePageData();
  const { config, classes } = useLayout();
  const appPageTitleDirection = config.app?.pageTitle?.direction;
  const { currentUser } = useAuth();
  const currentItem = JSON.parse(localStorage.getItem("currentItem")!);
  const isViewPage = location.pathname.match(
    /^\/(estimation|invoice)\/view\/[^/]+$/
  );

  return (
    <div
      id="kt_page_title"
      data-kt-swapper="true"
      data-kt-swapper-mode="prepend"
      data-kt-swapper-parent="{default: '#kt_content_container', 'lg': '#kt_toolbar_container'}"
      className={clsx(
        "page-title d-flex flex-wrap me-3",
        classes.pageTitle.join(" "),
        config.app?.pageTitle?.class,
        {
          "flex-column justify-content-center":
            appPageTitleDirection === "column",
          "align-items-center": appPageTitleDirection !== "column",
        }
      )}
    >
      {/* begin::Title */}
      {config.app?.pageTitle?.display && pageTitle && (
        <h1
          className={clsx(
            "page-heading d-flex text-gray-900 fw-bold fs-3 my-0",
            {
              "flex-column justify-content-center": appPageTitleDirection,
              "align-items-center": !appPageTitleDirection,
            }
          )}
        >
          {pageTitle}
          {pageDescription &&
            config.app?.pageTitle &&
            config.app?.pageTitle?.description && (
              <span
                className={clsx("page-desc text-muted fs-7 fw-semibold", {
                  "pt-2": appPageTitleDirection === "column",
                })}
              >
                {config.app?.pageTitle?.direction === "row" && (
                  <span className="h-20px border-1 border-gray-300 border-start ms-3 mx-2"></span>
                )}
                {pageDescription}{" "}
              </span>
            )}
        </h1>
      )}
      {/* end::Title */}

      {pageBreadcrumbs &&
        pageBreadcrumbs.length > 0 &&
        config.app?.pageTitle &&
        config.app?.pageTitle?.breadCrumb && (
          <>
            {config.app?.pageTitle?.direction === "row" && (
              <span className="h-20px border-gray-300 border-start mx-4"></span>
            )}
            <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
              {Array.from(pageBreadcrumbs).map((item, index) => (
                <li
                  className={clsx("breadcrumb-item", {
                    "text-gray-900": !item.isSeparator && item.isActive,
                    "text-muted": !item.isSeparator && !item.isActive,
                  })}
                  key={`${item.path}${index}`}
                >
                  {!item.isSeparator ? (
                    <Link
                      className="text-muted text-hover-primary"
                      to={item.path}
                    >
                      {currentItem && index === 4
                        ? item.title
                        : currentItem &&
                          currentUser?.result.isAnonymousUser &&
                          index === 2
                        ? item.title
                        : item.title?.toLowerCase()}
                    </Link>
                  ) : (
                    <span className="bullet bg-gray-500 w-5px h-2px"></span>
                  )}
                </li>
              ))}

              {pageBreadcrumbs[2]?.title === "Settings" && (
                <li className="breadcrumb-item text-gray-900">
                  {isViewPage ? "" : pageTitle?.toLowerCase()}
                </li>
              )}
            </ul>
          </>
        )}
    </div>
  );
};

export { PageTitle };
