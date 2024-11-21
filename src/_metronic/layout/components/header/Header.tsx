/* eslint-disable no-prototype-builtins */
import { FC, useEffect } from "react";
import { ILayout, useLayout } from "../../core";
import { MenuInner } from "./header-menus";
import { useIntl } from "react-intl";

const Header: FC = () => {
  const { config } = useLayout();
  const intl = useIntl();
  useEffect(() => {
    updateDOM(config);
  }, [config]);

  return (
    <div
      className="
        menu
        menu-rounded
        menu-column
        menu-lg-row
        fw-semibold
        px-2 px-lg-0
        rounded-lg-6
    "
      id="kt_app_header_menu"
      data-kt-menu="true"
    >
      {/* <div className="position-relative">
        <i className="ki-outline ki-magnifier search-icon fs-1 text-gray-500 position-absolute top-50 start-0 ms-3 translate-middle-y"></i>
        <input
          type="text"
          className="search-input form-control form-control border w-lg-400px   h-lg-45px rounded-lg ps-13 pl-5"
          name="search"
          value=""
          placeholder={intl.formatMessage({ id: "Fields.SearchBtn" })}
          data-kt-search-element="input"
        />
      </div> */}
    </div>
  );
};

const updateDOM = (config: ILayout) => {
  if (config.app?.header?.default?.fixed?.desktop) {
    document.body.setAttribute("data-kt-app-header-fixed", "true");
    
  }

  if (config.app?.header?.default?.fixed?.mobile) {
    document.body.setAttribute("data-kt-app-header-fixed-mobile", "true");
  }

  if (config.app?.header?.default?.stacked) {
    document.body.setAttribute("data-kt-app-header-stacked", "true");
  }

  const appHeaderDefaultStickyEnabled =
    config.app?.header?.default?.sticky?.enabled;
  let appHeaderDefaultStickyAttributes: { [attrName: string]: string } = {};
  if (appHeaderDefaultStickyEnabled) {
    appHeaderDefaultStickyAttributes = config.app?.header?.default?.sticky
      ?.attributes as {
      [attrName: string]: string;
    };
  }

  const appHeaderDefaultMinimizeEnabled =
    config.app?.header?.default?.minimize?.enabled;
  let appHeaderDefaultMinimizeAttributes: { [attrName: string]: string } = {};
  if (appHeaderDefaultMinimizeEnabled) {
    appHeaderDefaultMinimizeAttributes = config.app?.header?.default?.minimize
      ?.attributes as {
      [attrName: string]: string;
    };
  }

  setTimeout(() => {
    const headerElement = document.getElementById("kt_app_header");
    // header
    if (headerElement) {
      if (appHeaderDefaultStickyEnabled) {
        for (const key in appHeaderDefaultStickyAttributes) {
          if (appHeaderDefaultStickyAttributes.hasOwnProperty(key)) {
            headerElement.setAttribute(
              key,
              appHeaderDefaultStickyAttributes[key]
            );
          }
        }
      }

      if (appHeaderDefaultMinimizeEnabled) {
        for (const key in appHeaderDefaultMinimizeAttributes) {
          if (appHeaderDefaultMinimizeAttributes.hasOwnProperty(key)) {
            headerElement.setAttribute(
              key,
              appHeaderDefaultMinimizeAttributes[key]
            );
          }
        }
      }
    }
  }, 0);
};

export { Header };
