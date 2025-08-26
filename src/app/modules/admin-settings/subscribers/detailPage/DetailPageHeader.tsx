import { FC } from "react";
import { KTIcon, toAbsoluteUrl } from "../../../../../_metronic/helpers";
import { Link } from "react-router-dom";
import { Dropdown1 } from "../../../../../_metronic/partials";
import { useLocation } from "react-router";
import { ToolbarWrapper } from "../../../../../_metronic/layout/components/toolbar";
import { Content } from "../../../../../_metronic/layout/components/content";
import { SubscriberSingle } from "../core/_models";
import { FormikProps } from "formik";
import { getEnumOptions } from "../../../../helpers/intlHelper";
import { useIntl } from "react-intl";
import enums from "../../../../../_metronic/i18n/messages/invoicehippo.enums.json";
import Tippy from "@tippyjs/react";
interface props {
  formik: FormikProps<SubscriberSingle>;
  usage: any;
}
const DetailPageHeader = ({ formik, usage }: props) => {
  const intl = useIntl();

  type StatusKey =
    | "isActive"
    | "isValidated"
    | "isNewSubscriber"
    | "hasFinishedInitialSetup"
    | "canUseOcrApi";

  const statusIcons: {
    key: StatusKey;
    label: string;
    icon: string;
    color: string;
  }[] = [
    {
      key: "isActive",
      label: "Active",
      icon: "shield-tick",
      color: "text-success",
    },
    {
      key: "isValidated",
      label: "Validated",
      icon: "check-circle",
      color: "text-primary",
    },
    {
      key: "isNewSubscriber",
      label: "New Subscriber",
      icon: "stars",
      color: "text-warning",
    },
    {
      key: "hasFinishedInitialSetup",
      label: "Initial Setup Done",
      icon: "gear",
      color: "text-info",
    },
    {
      key: "canUseOcrApi",
      label: "OCR Enabled",
      icon: "file-check",
      color: "text-dark",
    },
  ];
  const hasAnyStatus = statusIcons.some(({ key }) => formik.values[key]);
  return (
    <div className="bg-body">
      <ToolbarWrapper onSubmit={formik.handleSubmit} />
      <Content>
        <div className="card mb-5 mb-xl-10">
          <div className="card-body pt-9 pb-0">
            <div className="d-flex flex-wrap flex-sm-nowrap mb-3">
              <div className="me-7 mb-4">
                <div className="symbol symbol-100px symbol-lg-160px symbol-fixed position-relative">
                  <img
                    src="/media/logos/10218426.jpg"
                    className="mw-100 mh-300px"
                    alt=""
                  />
                  <div className="position-absolute translate-middle bottom-0 start-100 mb-6 bg-success rounded-circle border border-4 border-white h-20px w-20px"></div>
                </div>
              </div>

              <div className="flex-grow-1">
                <div className="d-flex justify-content-between align-items-start flex-wrap mb-2">
                  <div className="d-flex flex-column">
                    <div className="d-flex align-items-center mb-2">
                      <span className="text-gray-800 text-hover-primary fs-2 fw-bolder me-1">
                        {formik.values.billingContact.firstName}{" "}
                        {formik.values.billingContact.betweenName}{" "}
                        {formik.values.billingContact.lastName}
                      </span>
                      {/* {formik.values.isActive && (
                        <Tippy
                          content={intl.formatMessage({
                            id: "Fields.IsActive",
                          })}
                        >
                          <KTIcon
                            iconName="verify"
                            className="fs-1 text-success cursor-pointer"
                          />
                        </Tippy>
                      )} */}
                    </div>

                    <div className="d-flex flex-wrap fw-bold fs-6 mb-4 fs-7 pe-3">
                      <a
                        href="#"
                        className="d-flex align-items-center text-gray-500 text-hover-primary me-5 mb-2"
                      >
                        <KTIcon iconName="calendar" className="fs-4 me-1" />
                        {formik.values.registrationDateAsString}
                      </a>
                      {formik.values.billingAddress.countryType != 0 && (
                        <a
                          href="#"
                          className="d-flex align-items-center text-gray-500 text-hover-primary me-5 mb-2"
                        >
                          <KTIcon
                            iconName="geolocation"
                            className="fs-4 me-1"
                          />
                          {
                            getEnumOptions(enums.CountryType, intl).find(
                              (item) =>
                                item.value ===
                                formik.values.billingAddress.countryType
                            )?.label
                          }
                        </a>
                      )}
                      <a
                        href="#"
                        className="d-flex align-items-center text-gray-500 text-hover-primary mb-2"
                      >
                        <KTIcon iconName="sms" className="fs-4 me-1" />
                        {formik.values.billingContact.emailAddress}
                      </a>
                    </div>
                  </div>

                  {/* <div className="d-flex my-4">
                    <a
                      href="#"
                      className="btn btn-sm btn-primary me-2"
                      id="kt_user_follow_button"
                    >
                      <KTIcon iconName="check" className="fs-3 d-none" />

                      <span className="indicator-label">Upgrade</span>
                      <span className="indicator-progress">
                        Please wait...
                        <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                      </span>
                    </a>
                    <a
                      href="#"
                      className="btn btn-sm btn-danger me-3"
                      data-bs-toggle="modal"
                      data-bs-target="#kt_modal_offer_a_deal"
                    >
                      Delete
                    </a>
                    <div className="me-0">
                      <button
                        className="btn btn-sm btn-icon btn-bg-light btn-active-color-primary"
                        data-kt-menu-trigger="click"
                        data-kt-menu-placement="bottom-end"
                        data-kt-menu-flip="top-end"
                      >
                        <i className="bi bi-three-dots fs-3"></i>
                      </button>
                      <Dropdown1 />
                    </div>
                  </div> */}
                </div>

                <div className="d-flex flex-wrap flex-stack">
                  <div className="d-flex flex-column flex-grow-1 pe-8">
                    <div className="d-flex flex-wrap">
                      {hasAnyStatus && (
                        <div className="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3">
                          <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center">
                              <div className="fs-2 fw-bolder">
                                {/* Status Icons with Tooltips */}
                                <div className="d-flex gap-2">
                                  {statusIcons.map(
                                    ({ key, label, icon, color }) =>
                                      formik.values[key] ? (
                                        <Tippy content={label} key={key}>
                                          <div>
                                            <KTIcon
                                              iconName={icon}
                                              className={`fs-2 cursor-pointer ${color}`}
                                            />
                                          </div>
                                        </Tippy>
                                      ) : null
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="fw-bold fs-6 text-gray-500">
                            Status
                          </div>
                        </div>
                      )}
                      {formik.values.promotionCode && (
                        <div className="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3">
                          <div className="d-flex align-items-center">
                            <i className="ki-duotone ki-message-programming fs-3 text-warning">
                              <span className="path1"></span>
                              <span className="path2"></span>
                              <span className="path3"></span>
                              <span className="path4"></span>
                            </i>

                            <div className="fs-2 fw-bolder">
                              {formik.values.promotionCode.code}
                            </div>
                          </div>

                          <div className="fw-bold fs-6 text-gray-500">
                            {intl.formatMessage({
                              id: "LoginAndRegistration.PromotionCode",
                            })}
                          </div>
                        </div>
                      )}
                      <div className="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3">
                        <div className="d-flex align-items-center">
                          <KTIcon
                            iconName="arrow-up"
                            className="fs-3 text-success me-2"
                          />
                          <div className="fs-2 fw-bolder">
                            {formik.values.companies.length}
                          </div>
                        </div>

                        <div className="fw-bold fs-6 text-gray-500">
                          Companies
                        </div>
                      </div>
                      {/* 
                      <div className="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3">
                        <div className="d-flex align-items-center">
                          <KTIcon
                            iconName="arrow-down"
                            className="fs-3 text-danger me-2"
                          />
                          <div className="fs-2 fw-bolder">75</div>
                        </div>

                        <div className="fw-bold fs-6 text-gray-500">
                          Projects
                        </div>
                      </div> */}

                      {/* <div className="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3">
                        <div className="d-flex align-items-center">
                          <KTIcon
                            iconName="arrow-up"
                            className="fs-3 text-success me-2"
                          />
                          <div className="fs-2 fw-bolder">60%</div>
                        </div>

                        <div className="fw-bold fs-6 text-gray-500">
                          Success Rate
                        </div>
                      </div> */}
                    </div>
                  </div>

                  <div className="d-flex align-items-center w-200px w-sm-300px flex-column mt-3">
                    <div className="d-flex justify-content-between w-100 mt-auto mb-2">
                      <span className="fw-bold fs-6 text-gray-500">
                        Usage Percentage
                      </span>
                      <span className="fw-bolder fs-6">
                        {usage?.usagePerCompany[0].licenseInfo.usagePercentage}%
                      </span>
                    </div>
                    <div className="h-5px mx-3 w-100 bg-light mb-3">
                      <div
                        className={`${
                          usage?.usagePerCompany[0].licenseInfo
                            .usagePercentage < 70
                            ? "bg-success"
                            : usage?.usagePerCompany[0].licenseInfo
                                .usagePercentage > 90
                            ? "bg-danger"
                            : "bg-warning"
                        } rounded h-5px`}
                        role="progressbar"
                        style={{
                          width: `${usage?.usagePerCompany[0].licenseInfo.usagePercentage}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <ul className="nav nav-line-tabs nav-line-tabs-2xe fs-5 flex-nowrap fw-bold">
              <li className="nav-item">
                <a
                  className="nav-link active text-active-primary d-flex align-items-center justify-content-center py-5"
                  data-bs-toggle="tab"
                  href="#subscriber_tab"
                >
                  <KTIcon iconName="profile-circle" className="fs-2 me-1 " />
                  Subscriber Details
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link d-flex align-items-center justify-content-center text-active-primary py-5 "
                  data-bs-toggle="tab"
                  href="#companies_tab"
                >
                  <KTIcon iconName="office-bag" className="fs-2 me-1 " />
                  Companies
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link d-flex align-items-center justify-content-center text-active-primary py-5"
                  data-bs-toggle="tab"
                  href="#billing_tab"
                >
                  <KTIcon
                    iconName="finance-calculator"
                    className="fs-2 me-1 "
                  />
                  Billing History
                </a>
              </li>
            </ul>
          </div>
        </div>
      </Content>
    </div>
  );
};

export { DetailPageHeader };
