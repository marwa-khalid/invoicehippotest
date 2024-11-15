import { Route, Routes, Outlet, Navigate } from "react-router-dom";
import { PageLink, PageTitle } from "../../../../_metronic/layout/core";
import { QuoteListWrapper } from "./components/QuoteListWrapper";
import clsx from "clsx";
import { useLayout } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";
import { QuoteViewWrapper } from "./components/QuoteViewWrapper";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
const InvoicesPage = () => {
  const { config } = useLayout();
  const intl = useIntl();
  const [currentQuote, setCurrentQuote] = useState<any>();
  const location = useLocation();

  useEffect(() => {
    const currentQuote = JSON.parse(localStorage.getItem("currentQuote")!);
    setCurrentQuote(currentQuote);
  }, [location]);
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
      title: intl.formatMessage({
        id: "Fields.SearchPanelSubTitleLedgerAccount",
      }),
      path: "/invoice/search",
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

  const settingsBreadcrumbsView: Array<PageLink> = [
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
      title: intl.formatMessage({ id: "Fields.SearchPanelTitleQuotes" }),
      path: "/invoice/search",
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
      title: currentQuote?.quoteNr,
      path: "/estimation/view",
      isSeparator: false,
      isActive: true,
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
                {intl.formatMessage({ id: "System.UsageStats_AreaInvoices" })}
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
                <QuoteListWrapper />
              </div>
            </>
          }
        />
        <Route
          path="view"
          element={
            <>
              <PageTitle breadcrumbs={settingsBreadcrumbsView}>
                {intl.formatMessage({ id: "System.UsageStats_AreaInvoices" })}
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
                <QuoteViewWrapper />
              </div>
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to="/invoice/search" />} />
    </Routes>
  );
};

export default InvoicesPage;
