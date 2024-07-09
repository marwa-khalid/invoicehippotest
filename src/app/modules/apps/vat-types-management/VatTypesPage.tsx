import { Route, Routes, Outlet, Navigate } from "react-router-dom";
import { PageLink, PageTitle } from "../../../../_metronic/layout/core";
import { VatListWrapper } from "./vat-list/VatListWrapper";
import clsx from "clsx";
import { useLayout } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";

const VatTypesPage = () => {
  const { config } = useLayout();
  const intl = useIntl();
  const vatTypesBreadcrumbs: Array<PageLink> = [
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
              <PageTitle breadcrumbs={vatTypesBreadcrumbs}>
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
      </Route>
      <Route index element={<Navigate to="/admin/vattype" />} />
    </Routes>
  );
};

export default VatTypesPage;
