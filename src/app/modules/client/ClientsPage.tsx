import { Route, Routes, Outlet, Navigate } from "react-router-dom";
import { PageLink, PageTitle } from "../../../_metronic/layout/core";
import { ClientWrapper } from "./client-search/ClientWrapper";
import clsx from "clsx";
import { useLayout } from "../../../_metronic/layout/core";
import { useIntl } from "react-intl";
const ClientsPage = () => {
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
      title: intl.formatMessage({ id: "Menu.Settings" }),
      path: "/admin/vattype",
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
                {intl.formatMessage({ id: "Fields.SearchPanelTitleClient" })}
              </PageTitle>
              <div
                className={clsx(
                  "main rounded",
                  config.app?.sidebar?.default?.class,
                  // {
                  //   "bg-light": config.layoutType === "light-sidebar",
                  //   "bg-dark": config.layoutType === "dark-sidebar",
                  // }
                )}
              >
                <ClientWrapper />
              </div>
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to="/client/search" />} />
    </Routes>
  );
};

export default ClientsPage;
