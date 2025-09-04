import { Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { I18nProvider } from "../_metronic/i18n/i18nProvider";
import { LayoutProvider, LayoutSplashScreen } from "../_metronic/layout/core";
import { MasterInit } from "../_metronic/layout/MasterInit";
import { AuthInit, useAuth } from "./modules/auth";
import { ThemeModeProvider } from "../_metronic/partials";
import { ToastContainer } from "react-toastify";
import "tippy.js/dist/tippy.css";
// src/contexts/IntercomContext.tsx
import { createContext, useContext } from "react";
import IntercomService from "./modules/generic/IntercomService";
import GlobalIntercomInitializer from "./modules/generic/GlobalIntercomInitializer";
const IntercomContext = createContext({
  boot: IntercomService.boot,
  update: IntercomService.update,
});

export const useIntercom = () => useContext(IntercomContext);

export function IntercomProvider({ children }: any) {
  return (
    <IntercomContext.Provider
      value={{ boot: IntercomService.boot, update: IntercomService.update }}
    >
      {children}
    </IntercomContext.Provider>
  );
}
const App = () => {
  return (
    <IntercomProvider>
      <Suspense fallback={<LayoutSplashScreen />}>
        <I18nProvider>
          <LayoutProvider>
            <ThemeModeProvider>
              <ToastContainer
                position="top-center"
                draggable
                autoClose={5000}
              />
              <AuthInit>
                {/* <GlobalIntercomInitializer /> */}
                <Outlet />
                <MasterInit />
              </AuthInit>
            </ThemeModeProvider>
          </LayoutProvider>
        </I18nProvider>
      </Suspense>
    </IntercomProvider>
  );
};

export { App };
