import { useState } from "react";
import { ToolbarWrapper } from "../../../../_metronic/layout/components/toolbar";
import { Content } from "../../../../_metronic/layout/components/content";
import { KTIcon, KTSVG, toAbsoluteUrl } from "../../../../_metronic/helpers";
import { useIntl } from "react-intl";
import Tippy from "@tippyjs/react";
import { FormikProps } from "formik";
import { Menu, MenuButton, MenuList } from "@chakra-ui/react";
import { CompanySwitchMenu } from "./components/CompanySwitchMenu";
import { UsageQuotasChart } from "../../generic/Charts/UsageQuotasChart";
import { useAuth } from "../../auth";

interface Props {
  formik: FormikProps<any>;
  setAttachmentsModalOpen: (type: boolean) => void;
  activeCompanyId?: number;
  setActiveCompanyId: (type: number) => void;
  licenseData: any;
  usageQuotas: any;
}
const CompanyHeader = ({
  formik,
  setAttachmentsModalOpen,
  activeCompanyId,
  setActiveCompanyId,
  licenseData,
  usageQuotas,
}: Props) => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser } = useAuth();

  const toggleMenu = () => {
    setIsOpen((prev) => !prev); // Toggle menu open/close
  };
  return (
    <div className="mt-200">
      <ToolbarWrapper />
      <Content>
        <div className="card mb-5 mb-xl-10">
          <div className="card-body pt-9 pb-0">
            <div className="row d-flex flex-wrap flex-sm-nowrap mb-3">
              {/* Pencil (Edit) Icon */}
              {/* <div className="col-2 mb-4 d-flex flex-column">
                <div className="symbol symbol-100px symbol-lg-160px symbol-fixed position-relative text-center">
                 
                  {formik.values.companyLogo ? (
                    <img
                      src={formik.values.companyLogo.downloadInfo.downloadUrl}
                      alt="Company Logo"
                      style={{
                        objectFit: "contain",
                        width: "100%",
                        maxWidth: "200px",
                        height: "auto",
                      }}
                    />
                  ) : (
                    <img
                      src={toAbsoluteUrl(
                        "media/svg/brand-logos/office-building.svg"
                      )}
                      alt="Default Logo"
                      style={{
                        objectFit: "contain",
                        width: "100%",
                        maxWidth: "100px",
                        height: "auto",
                      }}
                    />
                  )}
                </div>
                <div className="d-flex gap-2 align-items-center justify-content-center text-center mt-2">
               
                  <Tippy
                    content={intl.formatMessage({
                      id: "Fields.CompanyLogoInfo",
                    })}
                  >
                    <div
                      // type="button"
                      // className="btn btn-icon btn-sm btn-light-primary"
                      className="cursor-pointer"
                      style={{ zIndex: 1 }}
                      onClick={() => setAttachmentsModalOpen(true)}
                    >
                      {formik.values.companyLogo ? (
                        <KTSVG
                          className="svg-icon svg-icon-1"
                          path="media/icons/hugeicons/pencil-edit.svg"
                        />
                      ) : (
                        <KTIcon
                          iconName="plus-square"
                          className="fs-2 text-primary"
                        />
                      )}
                    </div>
                  </Tippy>
                  {(formik.values.companyLogoFileId > 0 ||
                    formik.values.companyLogo) && (
                    <Tippy
                      content={intl.formatMessage({
                        id: "Fields.ToolTipDelete",
                      })}
                    >
                      <div
                        // type="button"
                        className="cursor-pointer"
                        style={{ zIndex: 1 }}
                        onClick={() => {
                          formik.setFieldValue("onSaveActions", {
                            removeLogo: true,
                          });
                          formik.setFieldValue("companyLogo", null);
                          formik.setFieldValue("companyLogoFileId", 0);
                        }}
                      >
                        <KTSVG
                          className="svg-icon svg-icon-2 text-danger"
                          path="media/icons/duotune/general/gen034.svg"
                        />
                      </div>
                    </Tippy>
                  )}
                </div>
              </div> */}

              <div className="d-flex justify-content-between align-items-center flex-wrap mb-2">
                <div className="d-flex flex-column">
                  <div className="d-flex align-items-center">
                    <a
                      href="#"
                      className="text-gray-800 text-hover-primary fs-2 fw-bolder me-1"
                    >
                      {formik.values.companyName}
                    </a>
                    <Tippy content={licenseData?.statusType.description}>
                      <div className="cursor-pointer">
                        {licenseData?.statusType.value != 4 ? (
                          <KTIcon
                            iconName="verify"
                            className="fs-1 text-muted"
                          />
                        ) : (
                          <KTIcon
                            iconName="verify"
                            className="fs-1 text-primary"
                          />
                        )}
                      </div>
                    </Tippy>
                    <a
                      href="#"
                      className="btn btn-sm btn-light-success fw-bolder ms-2 fs-8 py-1 px-3"
                      data-bs-toggle="modal"
                      data-bs-target="#kt_modal_upgrade_plan"
                    >
                      Upgrade to Pro
                    </a>
                  </div>

                  <div className="d-flex flex-wrap fw-bold fs-6 mt-2 pe-2">
                    <a
                      href="#"
                      className="d-flex align-items-center text-gray-500 text-hover-primary me-5 mb-2"
                    >
                      <KTIcon iconName="check-circle" className="fs-4 me-1" />
                      <small>{licenseData?.title}</small>
                    </a>

                    <a
                      href="#"
                      className="d-flex align-items-center text-gray-500 text-hover-primary me-5 mb-2"
                    >
                      <KTIcon iconName="calendar-2" className="fs-4 me-1" />
                      <small>
                        {licenseData?.validFromAsString} t/m{" "}
                        {licenseData?.validTillAsString}
                      </small>
                    </a>
                  </div>
                </div>
                {currentUser && currentUser.result.companies.length > 1 && (
                  <div className="d-flex">
                    <Menu
                      isOpen={isOpen}
                      onClose={() => setIsOpen(false)}
                      closeOnBlur={false}
                      flip={false}
                      placement="bottom-end"
                    >
                      <Tippy content="Switch Company">
                        <MenuButton
                          className="btn btn-icon btn-primary fw-bold"
                          onClick={toggleMenu}
                        >
                          <KTIcon
                            iconName="arrow-right-left"
                            className="fs-1"
                          />
                        </MenuButton>
                      </Tippy>
                      <MenuList
                        className="p-5 bg-body border-0 shadow-sm rounded"
                        zIndex={3}
                      >
                        <CompanySwitchMenu
                          toggleMenu={toggleMenu}
                          isOpen={isOpen}
                          setIsOpen={setIsOpen}
                          setActiveCompanyId={setActiveCompanyId}
                          activeCompanyId={activeCompanyId}
                        />
                      </MenuList>
                    </Menu>
                  </div>
                )}
              </div>

              {/* <div className="d-flex flex-wrap flex-stack">
                  <div className="horizontal-scroll-container col-9">
                    <div className="horizontal-scroll-wrapper">
                      {Object.keys(usageQuotas).map((key, index) => {
                        const data = usageQuotas[key];

                        return (
                          <>
                            <div className="scroll-item" key={key}>
                              <UsageQuotasChart
                                title={data.title}
                                descriptionTotal={
                                  data.totalUsedQuotaTitle
                                    ? data.totalUsedQuotaTitle
                                    : "0 verbruikt"
                                }
                                descriptionCurrent={
                                  data.currentAllowedQuotaTitle
                                }
                                totalCount={data.totalCount}
                                currentAllowedCount={data.currentAllowedCount}
                              />
                            </div>
                            <span className="bg-gray-300 w-1px h-80px my-12"></span>
                          </>
                        );
                      })}
                    </div>
                  </div>
                </div> */}
            </div>
          </div>
          {/* <div className="card-footer d-flex bg-primary py-3 px-8">
            <ul className="nav nav-line-tabs nav-line-tabs-2x-custom border-transparent fs-5 flex-nowrap">
              <li className="nav-item">
                <a
                  className="nav-link active border-bottom-white d-flex align-items-center justify-content-center text-white"
                  data-bs-toggle="tab"
                  href="#company_tab"
                >
                  <KTIcon
                    iconName="office-bag"
                    className="fs-2 me-1 text-white"
                  />
                  {intl.formatMessage({ id: "Settings.SideMenuMyCompany" })}
                </a>
              </li>
              <div className="bg-gray-100 h-35px w-1px"></div>
              <li className="nav-item">
                <a
                  className="nav-link d-flex align-items-center justify-content-center text-white"
                  data-bs-toggle="tab"
                  href="#clientproduct_tab"
                >
                  <KTIcon
                    iconName="add-item"
                    className="fs-2 me-1 text-white"
                  />
                  {intl.formatMessage({
                    id: "Settings.SideMenuClientsAndProducts",
                  })}
                </a>
              </li>
              <div className="bg-gray-100 h-35px w-1px"></div>
              <li className="nav-item">
                <a
                  className="nav-link d-flex align-items-center justify-content-center text-white"
                  data-bs-toggle="tab"
                  href="#quote_tab"
                >
                  <KTIcon
                    iconName="finance-calculator"
                    className="fs-2 me-1 text-white"
                  />
                  {intl.formatMessage({
                    id: "Settings.SideMenuQuote",
                  })}
                </a>
              </li>
              <div className="bg-gray-100 h-35px w-1px"></div>
              <li className="nav-item">
                <a
                  className="nav-link d-flex align-items-center justify-content-center text-white"
                  data-bs-toggle="tab"
                  href="#invoice_tab"
                >
                  <KTIcon
                    iconName="receipt-square"
                    className="fs-2 me-1 text-white"
                  />
                  {intl.formatMessage({
                    id: "Settings.SideMenuInvoice",
                  })}
                </a>
              </li>
              <div className="bg-gray-100 h-35px w-1px"></div>
              <li className="nav-item">
                <a
                  className="nav-link d-flex align-items-center justify-content-center text-white"
                  data-bs-toggle="tab"
                  href="#tradename_tab"
                >
                  <KTIcon
                    iconName="finance-calculator"
                    className="fs-2 me-1 text-white"
                  />
                  {intl.formatMessage({
                    id: "Settings.SideMenuTradeNames",
                  })}
                </a>
              </li>
            </ul>
          </div> */}
        </div>
      </Content>
    </div>
  );
};

export { CompanyHeader };
