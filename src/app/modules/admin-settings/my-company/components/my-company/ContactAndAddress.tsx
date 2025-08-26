import { FormikProps } from "formik";
import { useIntl } from "react-intl";
import Select from "react-select";
import { useAuth } from "../../../../auth";
import enums from "../../../../../../_metronic/i18n/messages/invoicehippo.enums.json";
import { CompanyPostResult } from "../../core/_models";
import { getEnumOptions } from "../../../../../helpers/intlHelper";

interface Props {
  formik: FormikProps<CompanyPostResult | any>;
}
const ContactAndAddress = ({ formik }: Props) => {
  const intl = useIntl();
  const { currentUser } = useAuth();
  return (
    <div className="card-body">
      <div className="row mb-6">
        <label className="form-label fw-bold fs-6">
          {intl.formatMessage({ id: "Fields.Street" })} &{" "}
          {intl.formatMessage({ id: "Fields.HouseNr" })}
        </label>
        <div className="fv-row col-8">
          <input
            type="text"
            {...formik.getFieldProps("companyAddress")}
            className="form-control form-control-solid mb-3"
            placeholder={intl.formatMessage({ id: "Fields.Street" })}
          />
        </div>
        <div className="fv-row col-2">
          <input
            type="text"
            {...formik.getFieldProps("companyHouseNr")}
            className="form-control form-control-solid mb-3"
            placeholder={intl.formatMessage({ id: "Fields.HouseNr" })}
          />
        </div>
        <div className="fv-row col-2">
          <input
            type="text"
            {...formik.getFieldProps("companyHouseNrAddition")}
            className="form-control form-control-solid"
            placeholder={intl.formatMessage({ id: "Fields.HouseNrAddon" })}
          />
        </div>
      </div>

      <div className="row mb-6">
        <label className="form-label fw-bold fs-6">
          {intl.formatMessage({ id: "Fields.PostCode" })} &{" "}
          {intl.formatMessage({ id: "Fields.City" })}
        </label>
        <div className="fv-row col-4">
          <input
            type="text"
            {...formik.getFieldProps("companyPostCode")}
            className="form-control form-control-solid mb-3"
            placeholder={intl.formatMessage({ id: "Fields.PostCode" })}
          />
        </div>
        <div className="fv-row col-8">
          <input
            type="text"
            {...formik.getFieldProps("companyCity")}
            className="form-control form-control-solid"
            placeholder={intl.formatMessage({ id: "Fields.City" })}
          />
        </div>
      </div>

      <div className="row mb-6">
        <label className="form-label fw-bold fs-6">
          {intl.formatMessage({ id: "Fields.Country" })}
        </label>
        <Select
          options={getEnumOptions(enums.CountryType, intl)}
          value={
            getEnumOptions(enums.CountryType, intl).find(
              (item) => item.value === formik.values.companyCountryType
            ) || null
          }
          onChange={(option: any) =>
            formik.setFieldValue("companyCountryType", option?.value)
          }
          className="react-select-styled"
          isClearable
        />
      </div>

      <div className="separator mb-7"></div>
      <h5 className="text-muted">
        {intl.formatMessage({ id: "Fields.WebAndPhoneNumbersHeader" })}
      </h5>

      <div className="row mb-6 mt-7">
        <label className="form-label fw-bold fs-6 required">
          {intl.formatMessage({ id: "Fields.PhoneNumbers" })}
        </label>
        <div className="fv-row col-4">
          <input
            type="text"
            {...formik.getFieldProps("companyPhoneNumber")}
            className="form-control form-control-solid mb-3"
            placeholder={intl.formatMessage({ id: "Fields.PhoneNr" })}
          />
        </div>
        <div className="fv-row col-4">
          <input
            type="text"
            {...formik.getFieldProps("companyMobileNumber")}
            className="form-control form-control-solid mb-3"
            placeholder={intl.formatMessage({ id: "Fields.MobileNr" })}
          />
        </div>
        <div className="fv-row col-4">
          <input
            type="text"
            {...formik.getFieldProps("companyFaxNumber")}
            className="form-control form-control-solid"
            placeholder={intl.formatMessage({ id: "Fields.FaxNr" })}
          />
        </div>
        {formik.touched.companyPhoneNumber &&
          formik.errors.companyPhoneNumber && (
            <div className="fv-plugins-message-container">
              <span
                className="fv-help-block"
                dangerouslySetInnerHTML={{
                  __html: formik.errors.companyPhoneNumber as string,
                }}
              />
            </div>
          )}
      </div>

      <div className="row mb-6">
        <label className="form-label fw-bold fs-6">
          {intl.formatMessage({ id: "Fields.CompanyEmailAndWeb" })}
        </label>

        <input
          type="text"
          {...formik.getFieldProps("companyEmailAddress")}
          className="form-control form-control-solid mb-3"
          placeholder={intl.formatMessage({ id: "Fields.EmailAddress" })}
        />
      </div>
      <div className="row mb-6">
        <label className="form-label fw-bold fs-6">
          {intl.formatMessage({ id: "Fields.CompanyEmailAndWeb" })}
        </label>

        <input
          type="text"
          {...formik.getFieldProps("companyWebUrl")}
          className="form-control form-control-solid"
          placeholder={intl.formatMessage({ id: "Fields.WebsiteUrl" })}
        />
      </div>
    </div>
  );
};

export { ContactAndAddress };
