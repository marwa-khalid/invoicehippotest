import { FC } from "react";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import { PrivateRoutes } from "./PrivateRoutes";
import { ErrorsPage } from "../modules/errors/ErrorsPage";
import { Logout, AuthPage, useAuth } from "../modules/auth";
import { App } from "../App";
import { SepaValidation } from "../modules/sepa/SepaValidation";
import { ClientSuccessPage } from "../modules/sepa/components/ClientSuccessPage";
import { PaymentFailurePage } from "../modules/sepa/components/PaymentFailurePage";
import { FailurePage } from "../modules/apps/admin-settings/financialaccounts-list/components/automation/FailurePage";
import { SuccessPage } from "../modules/apps/admin-settings/financialaccounts-list/components/automation/SuccessPage";

const { BASE_URL } = import.meta.env;

const AppRoutes: FC = () => {
  const { currentUser } = useAuth();

  return (
    <BrowserRouter basename={BASE_URL}>
      <Routes>
        <Route element={<App />}>
          <Route path="error/*" element={<ErrorsPage />} />
          <Route path="logout" element={<Logout />} />
          <Route path="/sepa/validate" element={<SepaValidation />} />
          <Route
            path="/sepa/validate/success"
            element={<ClientSuccessPage />}
          />
          <Route path="/payment/validate" element={<PaymentFailurePage />} />
          <Route path="/banking/connect" element={<FailurePage />} />
          <Route path="/banking/connect/success" element={<SuccessPage />} />

          {currentUser ? (
            <>
              <Route path="/*" element={<PrivateRoutes />} />
              <Route index element={<Navigate to="/dashboard" />} />
            </>
          ) : (
            <>
              <Route path="/*" element={<AuthPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export { AppRoutes };
