import { Route, Routes, Outlet, Navigate } from "react-router-dom";
import { PageLink, PageTitle } from "../../../../_metronic/layout/core";
import clsx from "clsx";
import { useLayout } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";
import { BankTransactionWrapper } from "./overview/components/BankTransactionWrapper";
import { BookingRuleWrapper } from "./rules/components/BookingRuleWrapper";
const AccountingPage = () => {
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
      title: intl.formatMessage({ id: "Menu.HeaderAccounting" }).toLowerCase(),
      path: "/accounting/transactions",
      isSeparator: false,
      isActive: false,
    },
  ];
  const breadcrumbs1: Array<PageLink> = [
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
      title: intl
        .formatMessage({ id: "Fields.SearchPanelTitleBookingRule" })
        .toLowerCase(),
      path: "/accounting/routing-rule",
      isSeparator: false,
      isActive: false,
    },
  ];

  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path="transactions"
          element={
            <>
              <PageTitle breadcrumbs={breadcrumbs}>
                {intl.formatMessage({
                  id: "Fields.SearchPanelTitleBankMutation",
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
                <BankTransactionWrapper />
              </div>
            </>
          }
        />
        <Route
          path="routing-rule"
          element={
            <>
              <PageTitle breadcrumbs={breadcrumbs1}>
                {intl.formatMessage({
                  id: "Fields.SearchPanelTitleBookingRule",
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
                <BookingRuleWrapper />
              </div>
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to="/accounting/transactions" />} />
    </Routes>
  );
};

export default AccountingPage;
