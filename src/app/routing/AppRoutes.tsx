import { FC } from "react";
import {
  Routes,
  Route,
  BrowserRouter,
  Navigate,
  useLocation,
} from "react-router-dom";
import { PrivateRoutes } from "./PrivateRoutes";
import { ErrorsPage } from "../modules/errors/ErrorsPage";
import { Logout, AuthPage, useAuth } from "../modules/auth";
import { App } from "../App";
import { SepaValidation } from "../modules/sepa/SepaValidation";
import { ClientSuccessPage } from "../modules/sepa/components/ClientSuccessPage";
import { PaymentFailurePage } from "../modules/sepa/components/PaymentFailurePage";
import { SuccessPage } from "../modules/generic/SuccessPage";
import { FailurePage } from "../modules/generic/FailurePage";
import TwoFactor from "../modules/auth/components/TwoFactor";

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
          <Route path="/customer" element={<TwoFactor />} />
          <Route path="/payment/validate" element={<PaymentFailurePage />} />
          <Route
            path="/banking/connect"
            element={
              <FailurePage message="Fields.BankingConnectStatusFaultInfo" />
            }
          />
          <Route
            path="/banking/connect/success"
            element={
              <SuccessPage message="Fields.BankingConnectStatusSuccessInfo" />
            }
          />

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
