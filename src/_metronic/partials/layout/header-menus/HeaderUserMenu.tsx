import { FC } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../../app/modules/auth";
import { Languages } from "./Languages";
import { toAbsoluteUrl } from "../../../helpers";
import { useIntl } from "react-intl";
const HeaderUserMenu: FC = () => {
  const { currentUser, logout } = useAuth();
  console.log(currentUser);

  const intl = useIntl();
  return (
    <div
      className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-275px"
      data-kt-menu="true"
    >
      <div className="menu-item px-3">
        <div className="menu-content d-flex flex-column align-items-center px-3">
          {/* Logo in a full row */}
          <div className="symbol symbol-50px mb-3 w-100 text-center">
            {currentUser?.result.activeCompany.hasCompanyLogoUrl ? (
              <img
                src={currentUser?.result.activeCompany.companyLogoUrl}
                alt=""
                style={{
                  objectFit: "contain",
                  width: "100%",
                  maxWidth: "100px",
                  height: "auto",
                }}
              />
            ) : (
              <img
                src={toAbsoluteUrl("media/svg/brand-logos/office-building.svg")}
                alt=""
                style={{
                  objectFit: "contain",
                  width: "100%",
                  maxWidth: "100px",
                  height: "auto",
                }}
              />
            )}
          </div>

          {/* Name and email stacked */}
          <div className="d-flex flex-column align-items-center text-start">
            <div className="fw-bolder fs-5 text-start">
              {currentUser?.result.person.firstName}{" "}
              {currentUser?.result.person.lastName}
            </div>
            <a href="#" className="fw-bold text-muted text-hover-primary fs-7">
              {currentUser?.result.person.emailAddress}
            </a>
          </div>
        </div>
      </div>
      <div className="separator my-2"></div>

      {currentUser?.result.isAnonymousUser ? (
        <>
          <div className="separator my-2"></div>

          <div className="menu-item px-5">
            <Link to={"/estimation/search"} className="menu-link px-5">
              My Estimations
            </Link>
          </div>
          <div className="menu-item px-5">
            <Link to={"/invoice/search"} className="menu-link px-5">
              My Invoices
            </Link>
          </div>
        </>
      ) : (
        <>
          <div className="menu-item px-5">
            <Link to={"/crafted/pages/profile"} className="menu-link px-5">
              {intl.formatMessage({ id: "Fields.ModalManageMyUserProfile" })}
            </Link>
          </div>

          <div className="menu-item px-5">
            <a href="#" className="menu-link px-5">
              <span className="menu-text">My Projects</span>
              <span className="menu-badge">
                <span className="badge badge-light-danger badge-circle fw-bolder fs-7">
                  3
                </span>
              </span>
            </a>
          </div>

          <div
            className="menu-item px-5"
            data-kt-menu-trigger="hover"
            data-kt-menu-placement="left-start"
            data-kt-menu-flip="bottom"
          >
            <a href="/estimation/search" className="menu-link px-5">
              <span className="menu-title">My Subscription</span>
              <span className="menu-arrow"></span>
            </a>

            <div className="menu-sub menu-sub-dropdown w-175px py-4">
              <div className="menu-item px-3">
                <a href="#" className="menu-link px-5">
                  Referrals
                </a>
              </div>

              <div className="menu-item px-3">
                <a href="#" className="menu-link px-5">
                  Billing
                </a>
              </div>

              <div className="menu-item px-3">
                <a href="#" className="menu-link px-5">
                  Payments
                </a>
              </div>

              <div className="menu-item px-3">
                <a href="#" className="menu-link d-flex flex-stack px-5">
                  Statements
                  <i
                    className="fas fa-exclamation-circle ms-2 fs-7"
                    data-bs-toggle="tooltip"
                    title="View your statements"
                  ></i>
                </a>
              </div>

              <div className="separator my-2"></div>

              <div className="menu-item px-3">
                <div className="menu-content px-3">
                  <label className="form-check form-switch form-check-custom form-check-solid">
                    <input
                      className="form-check-input w-30px h-20px"
                      type="checkbox"
                      value="1"
                      defaultChecked={true}
                      name="notifications"
                    />
                    <span className="form-check-label text-muted fs-7">
                      Notifications
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="menu-item px-5">
            <a href="#" className="menu-link px-5">
              My Statements
            </a>
          </div>
        </>
      )}

      <div className="separator my-2"></div>

      <Languages />

      <div className="menu-item px-5">
        <a onClick={logout} className="menu-link px-5">
          {intl.formatMessage({ id: "Menu.Logout" })}
        </a>
      </div>
    </div>
  );
};

export { HeaderUserMenu };
