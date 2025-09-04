import { Route, Routes, Outlet, Navigate } from "react-router-dom";
import { PageLink, PageTitle } from "../../../../_metronic/layout/core";
import { BookingsListWrapper } from "./components/BookingsListWrapper";
import clsx from "clsx";
import { useLayout } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";
const BookingsPage = () => {
  const { config } = useLayout();
  const intl = useIntl();
  const settingsBreadcrumbs: Array<PageLink> = [
    {
      title: intl.formatMessage({ id: "Menu.Dashboard" }),
      path: "/dashboard",
      isSeparator: false,
      isActive: false,
    },
    {
      title: "",
      path: "",
      isSeparator: true,
      isActive: false,
    },
    {
      title: intl.formatMessage({ id: "Menu.BookingsOverview" }),
      path: "/booking/search",
      isSeparator: false,
      isActive: false,
    },
  ];

  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path="search"
          element={
            <>
              <PageTitle breadcrumbs={settingsBreadcrumbs}>
                {intl.formatMessage({ id: "Fields.SearchPanelTitleBookings" })}
              </PageTitle>
              <div
                className={clsx(
                  "main rounded",
                  config.app?.sidebar?.default?.class,
                  {
                    "bg-light": config.layoutType === "light-sidebar",
                    "bg-dark": config.layoutType === "dark-sidebar",
                  }
                )}
              >
                <BookingsListWrapper />
              </div>
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to="/booking/search" />} />
    </Routes>
  );
};

export default BookingsPage;
