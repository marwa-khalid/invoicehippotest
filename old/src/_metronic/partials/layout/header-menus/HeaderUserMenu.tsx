import { Link } from "react-router-dom";
import { useAuth } from "../../../../app/modules/auth";
import { Languages } from "./Languages";
import { KTIcon, KTSVG, toAbsoluteUrl } from "../../../helpers";
import { useIntl } from "react-intl";
import {
  stopTakeOver,
  switchCompany,
} from "../../../../app/modules/auth/core/_requests";
import { handleToast } from "../../../../app/modules/auth/core/_toast";
type Props = {
  setProfileModalOpen: (type: boolean) => void;
};
const HeaderUserMenu = ({ setProfileModalOpen }: Props) => {
  const { currentUser, logout, saveAuth } = useAuth();

  const intl = useIntl();
  const handleSwitch = async (companyId: number) => {
    try {
      const auth = await switchCompany(
        currentUser?.result.subscriberId,
        companyId
      );
      if (auth.isValid) {
        saveAuth(auth);
        window.location.reload();
      }
      handleToast(auth);
    } catch (error) {
      saveAuth(undefined);
    }
  };
  const handleStopTakeOver = async () => {
    try {
      const auth = await stopTakeOver();
      if (auth.isValid) {
        saveAuth(auth);
        window.location.reload();
      }
      handleToast(auth);
    } catch (error) {
      handleToast(error);
    }
  };

  return (
    <div
      className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg menu-state-primary fw-bold pt-0 pb-4 fs-6 w-300px"
      data-kt-menu="true"
    >
      <div className="menu-item text-center py-3 bg-gray-300 rounded-top">
        {currentUser?.result.activeCompany.title}
      </div>
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
              {currentUser?.result.isAnonymousUser
                ? currentUser?.result.activeCompany.title
                : `${currentUser?.result.person.firstName} ${currentUser?.result.person.lastName}`}
            </div>
            <a href="#" className="fw-bold text-muted text-hover-primary fs-7">
              {currentUser?.result.person.emailAddress}
            </a>
          </div>
        </div>
      </div>
      <div className="separator my-1"></div>
      {currentUser?.result.isAnonymousUser ? (
        <>
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
            <button
              className="btn menu-link px-5 w-100"
              onClick={() => setProfileModalOpen(true)}
            >
              {intl.formatMessage({ id: "Menu.TopMenuMyPassword" })}
            </button>
          </div>

          <div
            className="menu-item px-5"
            data-kt-menu-trigger="hover"
            data-kt-menu-placement="left-start"
            data-kt-menu-flip="bottom"
          >
            <a href="/estimation/search" className="menu-link px-5">
              <span className="menu-title">
                {intl.formatMessage({
                  id: "Fields.ModalTitleInvoiceAutomation",
                })}
              </span>
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
        </>
      )}
      <div className="separator mt-2"></div>
      {currentUser?.result.companies.map((company, index) => (
        <div className="menu-item px-2" key={company.id}>
          {!company.isDefault && (
            <div
              className="align-items-center"
              onClick={() => handleSwitch(company.id)}
            >
              <div className="cursor-pointer d-flex menu-link">
                <KTSVG
                  className="svg-icon svg-icon-3x me-2"
                  path="media/icons/hugeicons/square-arrow-transfer.svg"
                />
                <div className="d-flex flex-column">
                  <span className="fw-bold">{company.title}</span>
                  <small className="text-muted">
                    {intl.formatMessage({ id: "Fields.ActionTakeOver" })}
                  </small>
                </div>
              </div>

              <div className="separator mt-2"></div>
            </div>
          )}
        </div>
      ))}

      <Languages />
      {currentUser?.result.isInTakeOverMode && (
        <div className="menu-item px-5">
          <a
            onClick={handleStopTakeOver}
            className="menu-link px-5  d-flex justify-content-between"
          >
            <span>
              {intl.formatMessage({ id: "Fields.ActionStopTakeOver" })}
            </span>
            <span>
              <KTIcon
                iconName="exit-right"
                className="fs-1 text-end text-warning"
              />
            </span>
          </a>
        </div>
      )}
      <div className="menu-item px-5">
        <a
          onClick={logout}
          className="menu-link px-5  d-flex justify-content-between"
        >
          <span>{intl.formatMessage({ id: "Menu.Logout" })}</span>
          <span>
            <KTIcon iconName="exit-right" className="fs-1 text-end" />
          </span>
        </a>
      </div>
    </div>
  );
};

export { HeaderUserMenu };
