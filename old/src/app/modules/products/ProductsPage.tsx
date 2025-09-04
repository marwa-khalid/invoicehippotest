import { Route, Routes, Outlet, Navigate } from "react-router-dom";
import { PageLink, PageTitle } from "../../../_metronic/layout/core";
import { ProductWrapper } from "./products-list/ProductWrapper";
import clsx from "clsx";
import { useLayout } from "../../../_metronic/layout/core";
import { useIntl } from "react-intl";

const ProductsPage = () => {
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
      title: intl.formatMessage({ id: "Fields.SearchPanelSubTitleProduct" }),
      path: "/product/search",
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
                {intl.formatMessage({ id: "Fields.SearchPanelTitleProduct" })}
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
                <ProductWrapper />
              </div>
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to="/product/search" />} />
    </Routes>
  );
};

export default ProductsPage;
