import { Route, Routes, Navigate } from "react-router-dom";
import { Registration } from "./components/Registration";
import { ForgotPassword } from "./components/ForgotPassword";
import Login from "./components/Login";
import { AuthLayout } from "./AuthLayout";
import { SuccessPage } from "./components/SuccessPage";
import { ResetPassword } from "./components/ResetPassword";

const AuthPage = () => (
  <Routes>
    <Route element={<AuthLayout />}>
      <Route path="/" element={<Login />} />
      <Route path="/registration" element={<Registration />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/forgot-password/success" element={<SuccessPage />} />
      <Route path="/reset" element={<ResetPassword />} />
      <Route path="*" element={<Navigate to="/" />} />
      <Route index element={<Login />} />
    </Route>
  </Routes>
);

export { AuthPage };
