import { lazy, FC, Suspense } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { MasterLayout } from "../../_metronic/layout/MasterLayout";
import TopBarProgress from "react-topbar-progress-indicator";
import { DashboardWrapper } from "../dashboard/components/DashboardWrapper";
import { getCSSVariableValue } from "../../_metronic/assets/ts/_utils";
import { WithChildren } from "../../_metronic/helpers";
import InboxPage from "../modules/inbox/InboxPage";
import InboxArchivePage from "../modules/inbox/InboxArchivePage";
import AccountingPage from "../modules/accounting/bankTransactions/AccountingPage";
import BudgetsPage from "../modules/budget/BudgetsPage";
const PrivateRoutes = () => {
  const SettingsPage = lazy(
    () => import("../modules/admin-settings/SettingsPage")
  );
  const ClientsPage = lazy(() => import("../modules/client/ClientsPage"));
  const QuotesPage = lazy(() => import("../modules/quotes/QuotesPage"));
  const InvoicesPage = lazy(() => import("../modules/invoices/InvoicesPage"));
  const ProductsPage = lazy(() => import("../modules/products/ProductsPage"));
  const BookingsPage = lazy(
    () => import("../modules/accounting/bookings/BookingsPage")
  );
  const CostsPage = lazy(() => import("../modules/accounting/costs/CostsPage"));

  return (
    <Routes>
      <Route element={<MasterLayout />}>
        {/* Redirect to Dashboard after success login/registartion */}
        <Route path="/*" element={<Navigate to="/dashboard" />} />

        {/* Pages */}
        <Route path="dashboard" element={<DashboardWrapper />} />

        {/* Lazy Modules */}

        <Route
          path="admin/*"
          element={
            <SuspensedView>
              <SettingsPage />
            </SuspensedView>
          }
        />
        <Route
          path="client/*"
          element={
            <SuspensedView>
              <ClientsPage />
            </SuspensedView>
          }
        />
        <Route
          path="estimation/*"
          element={
            <SuspensedView>
              <QuotesPage />
            </SuspensedView>
          }
        />
        <Route
          path="invoice/*"
          element={
            <SuspensedView>
              <InvoicesPage />
            </SuspensedView>
          }
        />
        <Route
          path="booking/*"
          element={
            <SuspensedView>
              <BookingsPage />
            </SuspensedView>
          }
        />
        <Route
          path="cost/*"
          element={
            <SuspensedView>
              <CostsPage />
            </SuspensedView>
          }
        />
        <Route
          path="accounting/*"
          element={
            <SuspensedView>
              <AccountingPage />
            </SuspensedView>
          }
        />
        <Route
          path="product/*"
          element={
            <SuspensedView>
              <ProductsPage />
            </SuspensedView>
          }
        />
        <Route
          path="budget/*"
          element={
            <SuspensedView>
              <BudgetsPage />
            </SuspensedView>
          }
        />
        <Route
          path="inbox/*"
          element={
            <SuspensedView>
              <InboxPage />
            </SuspensedView>
          }
        />
        <Route
          path="inbox/archive/*"
          element={
            <SuspensedView>
              <InboxArchivePage />
            </SuspensedView>
          }
        />
        {/* <Route
          path="apps/user-management/*"
          element={
            <SuspensedView>
              <UsersPage />
            </SuspensedView>
          }
        /> */}
        {/* Page Not Found */}
        <Route path="*" element={<Navigate to="/error/404" />} />
      </Route>
    </Routes>
  );
};

const SuspensedView: FC<WithChildren> = ({ children }) => {
  const baseColor = getCSSVariableValue("--bs-primary");
  TopBarProgress.config({
    barColors: {
      "0": baseColor,
    },
    barThickness: 1,
    shadowBlur: 5,
  });
  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>;
};

export { PrivateRoutes };
