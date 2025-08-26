import { useState } from "react";
import { FormikProps, useFormik } from "formik";
import { SubscriberSingle } from "../../../core/_models";
import { useIntl } from "react-intl";
import { getEnumOptions } from "../../../../../../helpers/intlHelper";
import Select from "react-select";
import enums from "../../../../../../../_metronic/i18n/messages/invoicehippo.enums.json";

interface props {
  formik: FormikProps<SubscriberSingle>;
  isLoading: boolean;
}
const SubscriberDetail = ({ formik, isLoading }: props) => {
  const intl = useIntl();
  return (
    <div className="card mb-5 mb-xl-10">
      <div
        className="card-header border-0 cursor-pointer"
        role="button"
        data-bs-toggle="collapse"
        data-bs-target="#kt_account_profile_details"
        aria-expanded="true"
        aria-controls="kt_account_profile_details"
      >
        <div className="card-title m-0">
          <h3 className="fw-bolder m-0">Subscriber Details</h3>
        </div>
      </div>

      <div id="kt_account_profile_details" className="collapse show">
        <form onSubmit={formik.handleSubmit} noValidate className="form">
          <div className="card-body border-top p-9">
            {/* <div className="row mb-6">
              <div className="text-center">
                <label className="fw-bold fs-6 mb-3">Subscriber Avatar</label>
                <div className="mb-4">
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
                </div>
              </div>
            </div> */}
            {/* <div className="separator my-7"></div> */}
            <div className="row mb-6">
              <label className="col-lg-4 col-form-label required fw-bold fs-6">
                {intl.formatMessage({ id: "Fields.ContactFullName" })}
              </label>

              <div className="col-lg-3 fv-row">
                <label className="required fw-bold fs-6 mb-3">
                  {intl.formatMessage({ id: "Fields.FirstName" })}
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg form-control-solid"
                  placeholder={intl.formatMessage({
                    id: "Fields.FirstName",
                  })}
                  {...formik.getFieldProps("billingContact.firstName")}
                  value={formik.values.billingContact.firstName || ""}
                />
                {formik.touched.billingContact?.firstName &&
                  formik.errors.billingContact?.firstName && (
                    <div className="fv-plugins-message-container">
                      <span
                        className="fv-help-block"
                        dangerouslySetInnerHTML={{
                          __html: formik.errors.billingContact?.firstName,
                        }}
                      />
                    </div>
                  )}
              </div>
              <div className="col-lg-2 fv-row">
                <label className="fw-bold fs-6 mb-3">
                  {intl.formatMessage({ id: "Fields.BetweenName" })}
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg form-control-solid mb-5"
                  placeholder={intl.formatMessage({
                    id: "Fields.BetweenName",
                  })}
                  {...formik.getFieldProps("billingContact.betweenName")}
                  value={formik.values.billingContact.betweenName || ""}
                />
                {formik.touched.billingContact?.betweenName &&
                  formik.errors.billingContact?.betweenName && (
                    <div className="fv-plugins-message-container">
                      <span
                        className="fv-help-block"
                        dangerouslySetInnerHTML={{
                          __html: formik.errors.billingContact?.betweenName,
                        }}
                      />
                    </div>
                  )}
              </div>
              <div className="col-lg-3 fv-row">
                <label className="fw-bold fs-6 mb-3">
                  {intl.formatMessage({ id: "Fields.LastName" })}
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg form-control-solid mb-5"
                  placeholder={intl.formatMessage({
                    id: "Fields.LastName",
                  })}
                  {...formik.getFieldProps("billingContact.lastName")}
                  value={formik.values.billingContact.lastName || ""}
                />
                {formik.touched.billingContact?.lastName &&
                  formik.errors.billingContact?.lastName && (
                    <div className="fv-plugins-message-container">
                      <span
                        className="fv-help-block"
                        dangerouslySetInnerHTML={{
                          __html: formik.errors.billingContact?.lastName,
                        }}
                      />
                    </div>
                  )}
              </div>
            </div>
            <div className="row mb-6">
              <label className="col-lg-4 col-form-label required fw-bold fs-6">
                {intl.formatMessage({ id: "Fields.EmailAddress" })}
              </label>

              <div className="fv-row col-8">
                <input
                  type="text"
                  className="form-control form-control-lg form-control-solid mb-5"
                  placeholder={intl.formatMessage({
                    id: "Fields.EmailAddress",
                  })}
                  {...formik.getFieldProps("billingContact.emailAddress")}
                  value={formik.values.billingContact.emailAddress || ""}
                />
                {formik.touched.billingContact?.emailAddress &&
                  formik.errors.billingContact?.emailAddress && (
                    <div className="fv-plugins-message-container">
                      <span
                        className="fv-help-block"
                        dangerouslySetInnerHTML={{
                          __html: formik.errors.billingContact?.emailAddress,
                        }}
                      />
                    </div>
                  )}
              </div>
            </div>
            <div className="row mb-6">
              <label className="col-lg-4 col-form-label fw-bold fs-6">
                <span className="required">
                  {intl.formatMessage({ id: "Fields.MobileNr" })}
                </span>
              </label>

              <div className="fv-row col-lg-4">
                <input
                  type="text"
                  className="form-control form-control-lg form-control-solid"
                  placeholder={intl.formatMessage({ id: "Fields.PhoneNr" })}
                  {...formik.getFieldProps("billingContact.phoneNr")}
                  value={formik.values.billingContact.phoneNr || ""}
                />
                {formik.touched.billingContact?.phoneNr &&
                  formik.errors.billingContact?.phoneNr && (
                    <div className="fv-plugins-message-container">
                      <span
                        className="fv-help-block"
                        dangerouslySetInnerHTML={{
                          __html: formik.errors.billingContact?.phoneNr,
                        }}
                      />
                    </div>
                  )}
              </div>
              <div className="fv-row col-lg-4">
                <input
                  type="text"
                  className="form-control form-control-lg form-control-solid"
                  placeholder={intl.formatMessage({ id: "Fields.MobileNr" })}
                  {...formik.getFieldProps("billingContact.mobileNr")}
                  value={formik.values.billingContact.mobileNr || ""}
                />
                {formik.touched.billingContact?.mobileNr &&
                  formik.errors.billingContact?.mobileNr && (
                    <div className="fv-plugins-message-container">
                      <span
                        className="fv-help-block"
                        dangerouslySetInnerHTML={{
                          __html: formik.errors.billingContact?.mobileNr,
                        }}
                      />
                    </div>
                  )}
              </div>
            </div>

            <div className="separator my-7"></div>
            <div className="row mb-6">
              <label className="col-lg-4 col-form-label fw-bold fs-6">
                {intl.formatMessage({ id: "Fields.Street" })} &{" "}
                {intl.formatMessage({ id: "Fields.HouseNr" })}
              </label>

              <div className="fv-row col-lg-4">
                <input
                  type="text"
                  {...formik.getFieldProps("billingAddress.street")}
                  value={formik.values.billingAddress.street || ""}
                  className="form-control form-control-solid mb-3"
                  placeholder={intl.formatMessage({ id: "Fields.Street" })}
                />
                {formik.touched.billingAddress?.street &&
                  formik.errors.billingAddress?.street && (
                    <div className="fv-plugins-message-container">
                      <span
                        className="fv-help-block"
                        dangerouslySetInnerHTML={{
                          __html: formik.errors.billingAddress?.street,
                        }}
                      />
                    </div>
                  )}
              </div>
              <div className="fv-row col-lg-2">
                <input
                  type="text"
                  {...formik.getFieldProps("billingAddress.houseNr")}
                  value={formik.values.billingAddress.houseNr || ""}
                  className="form-control form-control-solid mb-3"
                  placeholder={intl.formatMessage({ id: "Fields.HouseNr" })}
                />
                {formik.touched.billingAddress?.houseNr &&
                  formik.errors.billingAddress?.houseNr && (
                    <div className="fv-plugins-message-container">
                      <span
                        className="fv-help-block"
                        dangerouslySetInnerHTML={{
                          __html: formik.errors.billingAddress?.houseNr,
                        }}
                      />
                    </div>
                  )}
              </div>
              <div className="fv-row col-lg-2">
                <input
                  type="text"
                  {...formik.getFieldProps("billingAddress.houseNrAddon")}
                  value={formik.values.billingAddress.houseNrAddon || ""}
                  className="form-control form-control-solid"
                  placeholder={intl.formatMessage({
                    id: "Fields.HouseNrAddon",
                  })}
                />
              </div>
            </div>
            <div className="row mb-6">
              <label className="col-lg-4 col-form-label fw-bold fs-6">
                {intl.formatMessage({ id: "Fields.PostCode" })} &{" "}
                {intl.formatMessage({ id: "Fields.City" })}
              </label>
              <div className="fv-row col-lg-2">
                <input
                  type="text"
                  {...formik.getFieldProps("billingAddress.postCode")}
                  value={formik.values.billingAddress.postCode || ""}
                  className="form-control form-control-solid mb-3"
                  placeholder={intl.formatMessage({ id: "Fields.PostCode" })}
                />
                {formik.touched.billingAddress?.postCode &&
                  formik.errors.billingAddress?.postCode && (
                    <div className="fv-plugins-message-container">
                      <span
                        className="fv-help-block"
                        dangerouslySetInnerHTML={{
                          __html: formik.errors.billingAddress?.postCode,
                        }}
                      />
                    </div>
                  )}
              </div>
              <div className="fv-row col-lg-6">
                <input
                  type="text"
                  {...formik.getFieldProps("billingAddress.city")}
                  value={formik.values.billingAddress.city || ""}
                  className="form-control form-control-solid"
                  placeholder={intl.formatMessage({ id: "Fields.City" })}
                />
                {formik.touched.billingAddress?.city &&
                  formik.errors.billingAddress?.city && (
                    <div className="fv-plugins-message-container">
                      <span
                        className="fv-help-block"
                        dangerouslySetInnerHTML={{
                          __html: formik.errors.billingAddress?.city,
                        }}
                      />
                    </div>
                  )}
              </div>
            </div>

            <div className="row mb-6">
              <label className="col-lg-4 col-form-label fw-bold fs-6">
                {intl.formatMessage({ id: "Fields.Country" })}
              </label>
              <div className="fv-row col-lg-8">
                <Select
                  options={getEnumOptions(enums.CountryType, intl)}
                  value={
                    getEnumOptions(enums.CountryType, intl).find(
                      (item) =>
                        item.value === formik.values.billingAddress.countryType
                    ) || null
                  }
                  onChange={(option: any) =>
                    formik.setFieldValue(
                      "billingAddress.countryType",
                      option?.value
                    )
                  }
                  className="react-select-styled"
                  isClearable
                />
                {formik.touched.billingAddress?.countryType &&
                  formik.errors.billingAddress?.countryType && (
                    <div className="fv-plugins-message-container">
                      <span
                        className="fv-help-block"
                        dangerouslySetInnerHTML={{
                          __html: formik.errors.billingAddress?.countryType,
                        }}
                      />
                    </div>
                  )}
              </div>
            </div>
          </div>
          {/* 
          <div className="card-footer d-flex justify-content-end py-6 px-9">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {!isLoading && "Save Changes"}
              {isLoading && (
                <span
                  className="indicator-progress"
                  style={{ display: "block" }}
                >
                  Please wait...{" "}
                  <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                </span>
              )}
            </button>
          </div> */}
        </form>
      </div>
    </div>
  );
};

export { SubscriberDetail };
