import { Route, Routes, Outlet, Navigate } from "react-router-dom";
import { PageLink, PageTitle } from "../../../../_metronic/layout/core";
import { VatListWrapper } from "./users-list/VatListWrapper";
import clsx from "clsx";
import { useLayout } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";
const usersBreadcrumbs: Array<PageLink> = [
  {
    title: "Tax types",
    path: "/admin/vattype",
    isSeparator: false,
    isActive: false,
  },
  {
    title: "",
    path: "",
    isSeparator: true,
    isActive: false,
  },
];

const UsersPage = () => {
  const intl = useIntl();
  const { config } = useLayout();
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path="users"
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>
                {intl.formatMessage({ id: "Settings.ManageTaxTypes" })}
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
                <VatListWrapper />
              </div>
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to="/admin/vattype" />} />
    </Routes>
  );
};

export default UsersPage;
