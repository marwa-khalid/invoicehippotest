import { Route, Routes, Outlet, Navigate } from "react-router-dom";
import { PageLink, PageTitle } from "../../../../_metronic/layout/core";
import clsx from "clsx";
import { useLayout } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";
import { CostsListWrapper } from "./components/CostsListWrapper";
const CostsPage = () => {
  const { config } = useLayout();
  const intl = useIntl();
  const breadcrumbs: Array<PageLink> = [
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
      title: intl.formatMessage({ id: "Menu.PurchasesOverview" }),
      path: "/cost/search",
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
              <PageTitle breadcrumbs={breadcrumbs}>
                {intl.formatMessage({ id: "Fields.SearchPanelTitleReceipts" })}
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
                <CostsListWrapper />
              </div>
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to="/cost/search" />} />
    </Routes>
  );
};

export default CostsPage;
