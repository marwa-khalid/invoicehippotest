import { useRef } from "react";
import * as Yup from "yup";
import { FormikProps } from "formik";
import { useIntl } from "react-intl";
import Select from "react-select";
import enums from "../../../../../../_metronic/i18n/messages/invoicehippo.enums.json";
import Tags from "@yaireo/tagify/dist/react.tagify";
import Tippy from "@tippyjs/react";
import { CompanyPostResult } from "../../core/_models";
import {
  KTIcon,
  KTSVG,
  toAbsoluteUrl,
} from "../../../../../../_metronic/helpers";
import { getEnumOptions } from "../../../../../helpers/intlHelper";

interface Props {
  formik: FormikProps<CompanyPostResult | any>;
  setAttachmentsModalOpen: (type: boolean) => void;
}

const CompanyDetails = ({ formik, setAttachmentsModalOpen }: Props) => {
  const tagifyRef = useRef<any>(null);
  const intl = useIntl();
  const handleInvalidEmail = (e: any) => {
    const tagData = e.detail.data;

    if (!Yup.string().email(tagData.value)) {
      // Highlight invalid email with red background
      tagifyRef.current?.tagify.editTag(tagData, false, {
        className: "tagify__tag--invalid",
        style: { backgroundColor: "red" },
      });

      // Remove invalid email after highlighting
      setTimeout(() => {
        tagifyRef.current?.tagify.removeTag(tagData);
      }, 1500);
    }
  };

  return (
    <div className="card-body">
      <div className="row mb-6">
        <div className="text-center">
          <label className="fw-bold fs-6 mb-3">
            {intl.formatMessage({ id: "Fields.CompanyLogo" })}
          </label>
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
                src={toAbsoluteUrl("media/svg/brand-logos/office-building.svg")}
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
              {/* Pencil (Edit) Icon */}
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

          <span
            className="text-muted"
            dangerouslySetInnerHTML={{
              __html: intl.formatMessage({
                id: "Fields.CompanyLogoInfo",
              }),
            }}
          />
        </div>
      </div>
      <div className="separator my-7"></div>
      <div className="row">
        <div className="fv-row col-lg-6">
          <label className="required fw-bold fs-6 mb-3">
            {intl.formatMessage({ id: "Fields.CompanyName" })}
          </label>
          <input
            type="text"
            className="form-control form-control-lg form-control-solid"
            placeholder={intl.formatMessage({ id: "Fields.CompanyName" })}
            {...formik.getFieldProps("companyName")}
          />
          {formik.touched.companyName && formik.errors.companyName && (
            <div className="fv-plugins-message-container">
              <span
                className="fv-help-block"
                dangerouslySetInnerHTML={{
                  __html: formik.errors.companyName as string,
                }}
              />
            </div>
          )}
        </div>
        <div className="fv-row col-lg-3">
          <label className="fw-bold fs-6 mb-3">
            {intl.formatMessage({ id: "Fields.BtwNr" })}
          </label>
          <input
            type="text"
            className="form-control form-control-lg form-control-solid mb-5"
            placeholder={intl.formatMessage({ id: "Fields.BtwNr" })}
            {...formik.getFieldProps("btwNr")}
          />
        </div>
        <div className="fv-row col-lg-3">
          <label className="fw-bold fs-6 mb-3">
            <span className="">
              {intl.formatMessage({ id: "Fields.KvkNr" })}
            </span>
          </label>
          <input
            type="text"
            className="form-control form-control-lg form-control-solid"
            placeholder={intl.formatMessage({ id: "Fields.KvkNr" })}
            {...formik.getFieldProps("kvkNr")}
          />
        </div>
      </div>
      <span
        className="text-muted"
        dangerouslySetInnerHTML={{
          __html: intl.formatMessage({
            id: "Fields.BtwNrSettingsInfo",
          }),
        }}
      />

      <div className="separator my-7"></div>
      <h5 className="text-muted">
        {intl.formatMessage({
          id: "Fields.FinancialAccountDetailHeader",
        })}
      </h5>
      <div className="row my-6">
        <div className="col-lg-6 fv-row">
          <label className="required fw-bold fs-6 mb-3">
            {intl.formatMessage({ id: "Fields.BankAccountCompanyType" })}
          </label>
          <Select
            className="react-select-styled react-select-transparent"
            value={
              formik.values.bankAccountCompanyType === 0
                ? null
                : getEnumOptions(enums.BankAccountCompanyTypes, intl).find(
                    (option) =>
                      option.value === formik.values.bankAccountCompanyType
                  ) || null
            }
            onBlur={() =>
              formik.setFieldTouched("bankAccountCompanyType", true)
            }
            placeholder={intl.formatMessage({
              id: "Fields.SelectOptionDefaultBankAccountCompanyType",
            })}
            isClearable
            options={getEnumOptions(enums.BankAccountCompanyTypes, intl)}
            onChange={(selectedOption: any) => {
              formik.setFieldValue(
                "bankAccountCompanyType",
                selectedOption ? selectedOption.value : null
              );
            }}
          />

          {formik.touched.bankAccountCompanyType &&
            formik.errors.bankAccountCompanyType && (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: formik.errors.bankAccountCompanyType as string,
                    }}
                    role="alert"
                  />
                </div>
              </div>
            )}
        </div>
        <div className="col-lg-6 fv-row">
          <label className="required fw-bold fs-6 mb-3">
            {intl.formatMessage({ id: "Fields.AccountHolderName" })}
          </label>
          <input
            type="text"
            className="form-control form-control-lg form-control-solid"
            placeholder={intl.formatMessage({
              id: "Fields.AccountHolderName",
            })}
            {...formik.getFieldProps("accountHolderName")}
          />
          {formik.touched.accountHolderName &&
            formik.errors.accountHolderName && (
              <div className="fv-plugins-message-container">
                <span
                  className="fv-help-block"
                  dangerouslySetInnerHTML={{
                    __html: formik.errors.accountHolderName as string,
                  }}
                />
              </div>
            )}
        </div>
      </div>

      <div className="row mb-6">
        <label className="fw-bold fs-6 mb-3">
          <span className="required">
            {intl.formatMessage({ id: "Fields.AccountNrIBAN" })}
          </span>
        </label>

        <input
          type="text"
          className="form-control form-control-lg form-control-solid"
          placeholder={intl.formatMessage({
            id: "Fields.AccountNrIBAN",
          })}
          {...formik.getFieldProps("accountNrIBAN")}
        />
        {formik.touched.accountNrIBAN && formik.errors.accountNrIBAN && (
          <div className="fv-plugins-message-container">
            <span
              className="fv-help-block"
              dangerouslySetInnerHTML={{
                __html: formik.errors.accountNrIBAN as string,
              }}
            />
          </div>
        )}
      </div>

      <div className="separator mb-7"></div>
      <h5 className=" text-muted">
        {intl.formatMessage({
          id: "Fields.CommonNotificationSettingsHeader",
        })}
      </h5>

      <div
        className="d-flex alert p-5 mt-4"
        style={{ backgroundColor: "#e0f0ff" }}
      >
        <div className="col-1 ms-5 align-items-center">
          <i className="ki-duotone ki-information-4 fs-3x text-center text-primary">
            <span className="path1"></span>
            <span className="path2"></span>
            <span className="path3"></span>
          </i>
        </div>
        <div className="col-10 text-primary">
          <span
            dangerouslySetInnerHTML={{
              __html: intl.formatMessage({
                id: "Fields.CommonNotificationSettingsInfo",
              }),
            }}
          />
        </div>
      </div>
      <div className="row mb-6">
        <label className="fw-bold fs-6 mb-3">
          <span className="required">
            {intl.formatMessage({ id: "Fields.EmailAddresses" })}
          </span>
        </label>

        <Tags
          tagifyRef={tagifyRef}
          className="form-control form-control-solid tagify p-3"
          placeholder={intl.formatMessage({
            id: "Fields.EmailAddresses",
          })}
          settings={{
            dropdown: {
              enabled: 0,
            },
            validate: (tagData: any) =>
              /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tagData.value),
          }}
          value={formik.values.notificationEmailAddresses || []}
          onChange={(e: any) => {
            const value = e.detail.tagify.value.map((tag: any) => tag.value); // Get the clean value from Tagify
            formik.setFieldValue("notificationEmailAddresses", value);
          }}
          onInvalid={handleInvalidEmail}
        />
        {formik.errors.notificationEmailAddresses && (
          <div className="fv-plugins-message-container">
            <span
              className="fv-help-block"
              dangerouslySetInnerHTML={{
                __html: formik.errors.notificationEmailAddresses as string,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export { CompanyDetails };
