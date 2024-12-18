import clsx from "clsx";
import { KTIcon, toAbsoluteUrl } from "../../../helpers";
import {
  HeaderNotificationsMenu,
  HeaderUserMenu,
  Search,
  ThemeModeSwitcher,
} from "../../../partials";
import { useLayout } from "../../core";
import { useAuth } from "../../../../app/modules/auth";
import { toast } from "react-toastify";

const itemClass = "ms-1 ms-md-4";
const btnClass =
  "btn btn-icon btn-custom btn-icon-muted btn-active-light btn-active-color-primary";
const userAvatarClass = "symbol-20px";
const btnIconClass = "fs-1"; // Increase this to make icons larger (e.g., fs-3 or fs-4)

// Custom styles to increase the size of the buttons
const largeBtnClass = "w-40px h-40px"; // Increase button size to accommodate larger icons

type Props = {
  setProfileModalOpen: (type: boolean) => void;
};

const Navbar = ({ setProfileModalOpen }: Props) => {
  const { config } = useLayout();
  const { logout, currentUser } = useAuth();

  const logOutFunction = () => {
    logout();
    // toast.info("Logged out successfully!");
  };

  return (
    <div className="app-navbar flex-shrink-0">
      {/* Example of a hidden search, if needed later */}
      {/* <div className={clsx('app-navbar-item align-items-stretch', itemClass)}>
        <Search />
      </div> */}
      {/* {config.app?.header?.default?.menu?.display && (
        <div className="app-navbar-item d-lg-none ms-2 me-n3" title="Search">
          <div className={clsx(btnClass, largeBtnClass)}>
            <div className={clsx("app-navbar-item", itemClass)}>
              <Search />
            </div>
          </div>
        </div>
      )} */}

      {!currentUser?.result?.isAnonymousUser && (
        <div className={clsx("app-navbar-item", itemClass)}>
          <div
            data-kt-menu-trigger="{default: 'click'}"
            data-kt-menu-attach="parent"
            data-kt-menu-placement="bottom-end"
            className={clsx(btnClass, largeBtnClass)}
          >
            <KTIcon iconName="element-plus" className={clsx(btnIconClass)} />
          </div>
          <HeaderNotificationsMenu />
        </div>
      )}
      {!currentUser?.result?.isAnonymousUser && (
        <div className={clsx("app-navbar-item", itemClass)}>
          <div
            className={clsx("position-relative", btnClass, largeBtnClass)}
            id="kt_drawer_chat_toggle"
          >
            <KTIcon iconName="message-text-2" className={clsx(btnIconClass)} />
            <span className="bullet bullet-dot bg-success h-6px w-6px position-absolute translate-middle top-0 start-50 animation-blink" />
          </div>
        </div>
      )}
      <div className={clsx("app-navbar-item", itemClass)}>
        <ThemeModeSwitcher
          toggleBtnClass={clsx(
            "btn-active-light-primary btn-custom",
            largeBtnClass
          )}
        />
      </div>
      <div className={clsx("app-navbar-item rounded-lg", itemClass)}>
        <div
          className={clsx("cursor-pointer", userAvatarClass, largeBtnClass)}
          data-kt-menu-trigger="{default: 'hover'}"
          data-kt-menu-attach="parent"
          data-kt-menu-placement="bottom-end"
        >
          <img
            src={toAbsoluteUrl("media/svg/brand-logos/office-building.svg")}
            alt=""
            style={{
              objectFit: "contain", // Ensure the entire image fits within the container
              width: "40px", // Adjust width to a reasonable size
              height: "35px", // Adjust height to a reasonable size
            }}
          />
        </div>
        <HeaderUserMenu setProfileModalOpen={setProfileModalOpen} />
      </div>

      <div className={clsx("app-navbar-item", itemClass)}>
        <div className={clsx(btnClass, largeBtnClass)}>
          <a onClick={logOutFunction}>
            <KTIcon iconName="exit-right" className={clsx(btnIconClass)} />
          </a>
        </div>
      </div>
    </div>
  );
};

export { Navbar };
