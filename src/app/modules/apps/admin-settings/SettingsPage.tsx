import { Route, Routes, Outlet, Navigate } from "react-router-dom";
import { PageLink, PageTitle } from "../../../../_metronic/layout/core";
import { VatListWrapper } from "./vat-list/VatListWrapper";
import { LedgerListWrapper } from "./ledgeraccounts-list/LedgerListWrapper";
import clsx from "clsx";
import { useLayout } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";
import { FinancialListWrapper } from "./financialaccounts-list/FinancialListWrapper";

const VatTypesPage = () => {
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
    {
      title: "",
      path: "",
      isSeparator: true,
      isActive: false,
    },
  ];

  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path="vattype"
          element={
            <>
              <PageTitle breadcrumbs={settingsBreadcrumbs}>
                {intl.formatMessage({ id: "Fields.SearchPanelTitleVatType" })}
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

        <Route
          path="ledgeraccount"
          element={
            <>
              <PageTitle breadcrumbs={settingsBreadcrumbs}>
                {intl.formatMessage({
                  id: "Fields.SearchPanelTitleLedgerAccount",
                })}
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
                <LedgerListWrapper />
              </div>
            </>
          }
        />
        <Route
          path="financialaccount"
          element={
            <>
              <PageTitle breadcrumbs={settingsBreadcrumbs}>
                {intl.formatMessage({
                  id: "Fields.SearchPanelTitleFinancialAccount",
                })}
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
                <FinancialListWrapper />
              </div>
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to="/admin/vattype" />} />
    </Routes>
  );
};

export default VatTypesPage;
