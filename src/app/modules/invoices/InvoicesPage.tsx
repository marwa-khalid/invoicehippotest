import { Route, Routes, Outlet, Navigate, useParams } from "react-router-dom";
import { PageLink, PageTitle } from "../../../_metronic/layout/core";
import { InvoiceListWrapper } from "./overview/InvoiceListWrapper";
import clsx from "clsx";
import { useLayout } from "../../../_metronic/layout/core";
import { useIntl } from "react-intl";
import { InvoiceViewWrapper } from "./overview/InvoiceViewWrapper";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../auth";
import { SubscriptionListWrapper } from "./subscriptions/SubscriptionListWrapper";
const InvoicesPage = () => {
  const { config } = useLayout();
  const intl = useIntl();
  const [currentInvoice, setCurrentInvoice] = useState<any>();
  const location = useLocation();
  const { uniqueId } = useParams();

  useEffect(() => {
    setTimeout(() => {
      const invoiceNr = JSON.parse(localStorage.getItem("currentNr")!);
      setCurrentInvoice(invoiceNr);
    }, 1000);
  }, [uniqueId, location]);
  const auth = useAuth();
  const getBreadcrumbs = (): Array<PageLink> => {
    if (location.pathname.includes("/invoice/search")) {
      return [
        ...(!auth.currentUser?.result.isAnonymousUser
          ? [
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
            ]
          : []),
        {
          title: intl.formatMessage({
            id: "Fields.SearchPanelSubTitleLedgerAccount",
          }),
          path: "/invoice/search",
          isSeparator: false,
          isActive: false,
        },
      ];
    } else if (location.pathname.includes("/invoice/subscriptions")) {
      return [
        ...(!auth.currentUser?.result.isAnonymousUser
          ? [
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
            ]
          : []),
        {
          title: intl.formatMessage({
            id: "Fields.SearchPanelTitleInvoices",
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
        {
          title: intl.formatMessage({
            id: "Fields.SearchPanelTitleSubscriptionInvoices",
          }),
          path: "/invoice/subscriptions",
          isSeparator: false,
          isActive: false,
        },
      ];
    }
    return [];
  };

  const settingsBreadcrumbsView: Array<PageLink> = [
    ...(!auth.currentUser?.result.isAnonymousUser
      ? [
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
        ]
      : []),

    {
      title: intl.formatMessage({ id: "Fields.SearchPanelTitleInvoices" }),
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
      title: currentInvoice,
      path: "invoice/view",
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
              <PageTitle breadcrumbs={getBreadcrumbs()}>
                {intl.formatMessage({ id: "System.UsageStats_AreaInvoices" })}
              </PageTitle>
              <div
                className={clsx(
                  "main rounded",
                  config.app?.sidebar?.default?.class
                  // {
                  //   "bg-light": config.layoutType === "light-sidebar",
                  //   "bg-dark": config.layoutType === "dark-sidebar",
                  // }
                )}
              >
                <InvoiceListWrapper />
              </div>
            </>
          }
        />
        <Route
          path="subscriptions"
          element={
            <>
              <PageTitle breadcrumbs={getBreadcrumbs()}>
                {intl.formatMessage({
                  id: "Fields.SearchPanelTitleSubscriptionInvoices",
                })}
              </PageTitle>
              <div
                className={clsx(
                  "main rounded",
                  config.app?.sidebar?.default?.class
                  // {
                  //   "bg-light": config.layoutType === "light-sidebar",
                  //   "bg-dark": config.layoutType === "dark-sidebar",
                  // }
                )}
              >
                <SubscriptionListWrapper />
              </div>
            </>
          }
        />
        <Route
          path="view/:id"
          element={
            <>
              <PageTitle breadcrumbs={settingsBreadcrumbsView}>
                {intl.formatMessage({ id: "System.UsageStats_AreaInvoices" })}
              </PageTitle>
              <div
                className={clsx(
                  "main rounded",
                  config.app?.sidebar?.default?.class
                  // {
                  //   "bg-light": config.layoutType === "light-sidebar",
                  //   "bg-dark": config.layoutType === "dark-sidebar",
                  // }
                )}
              >
                <InvoiceViewWrapper />
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
