import { Route, Routes, Outlet, useLocation } from "react-router-dom";
import { PageLink, PageTitle, useLayout } from "../../../_metronic/layout/core";
import { InboxArchiveListWrapper } from "./components/InboxArchiveListWrapper";
import clsx from "clsx";
import { useIntl } from "react-intl";
import { useEffect, useState } from "react";
import { useAuth } from "../auth";

const InboxArchivePage = () => {
  const { config } = useLayout();
  const intl = useIntl();

  const auth = useAuth();
  const settingsBreadcrumbs: Array<PageLink> = [
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
        id: "Menu.AttachmentsInbox",
      }),
      path: "/inbox/search",
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

  console.log("callng....");
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path="/"
          element={
            <>
              <PageTitle breadcrumbs={settingsBreadcrumbs}>
                {intl.formatMessage({ id: "Fields.SearchPanelTitleInbox" })}
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
                <InboxArchiveListWrapper />
              </div>
            </>
          }
        />
      </Route>
    </Routes>
  );
};

export default InboxArchivePage;
