import React from "react";
import clsx from "clsx";
import { useLocation } from "react-router";
import { checkIsActive, KTIcon, WithChildren } from "../../../../helpers";
import { useLayout } from "../../../core";
import { useAuth } from "../../../../../app/modules/auth";

type Props = {
  to: string;
  title: string;
  icon?: string;
  fontIcon?: string;
  hasBullet?: boolean;
};

const SidebarMenuItemWithSub: React.FC<Props & WithChildren> = ({
  children,
  to,
  title,
  icon,
  fontIcon,
  hasBullet,
}) => {
  const { pathname } = useLocation();
  const isActive = checkIsActive(pathname, to);
  const { config } = useLayout();
  const { app } = config;
  const { currentUser } = useAuth();
  return (
    <div
      className={clsx("menu-item", { "here show": isActive }, "menu-accordion")}
      data-kt-menu-trigger="click"
    >
      <span
        className={clsx(
          "menu-link",
          currentUser?.result.isInTakeOverMode ? "text-white" : "text-muted"
        )}
      >
        {hasBullet && (
          <span className="menu-bullet">
            <span className="bullet bullet-dot"></span>
          </span>
        )}
        {icon && app?.sidebar?.default?.menu?.iconType === "svg" && (
          <span className="menu-icon">
            <KTIcon
              iconName={icon}
              className={clsx(
                "fs-2",
                currentUser?.result.isInTakeOverMode && "text-white"
              )}
            />
          </span>
        )}
        {fontIcon && app?.sidebar?.default?.menu?.iconType === "font" && (
          <i className={clsx("bi fs-3", fontIcon)}></i>
        )}
        <span
          className={clsx(
            "menu-title",
            currentUser?.result.isInTakeOverMode && "text-white"
          )}
        >
          {title}
        </span>
        <span
          className={clsx(
            "menu-arrow",
            currentUser?.result.isInTakeOverMode && "text-danger"
          )}
        ></span>
      </span>
      <div
        className={clsx("menu-sub menu-sub-accordion", {
          "menu-active-bg": isActive,
        })}
      >
        {children}
      </div>
    </div>
  );
};

export { SidebarMenuItemWithSub };
