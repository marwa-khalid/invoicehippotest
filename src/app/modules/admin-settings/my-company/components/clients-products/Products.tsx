import { FormikProps } from "formik";
import { useIntl } from "react-intl";

interface Props {
  formik: FormikProps<any>;
}
const Products = ({ formik }: Props) => {
  const intl = useIntl();

  return (
    <div className="card-body">
      <div className="row mb-6">
        <label className="col-lg-4 col-form-label fw-bold fs-6">
          {intl.formatMessage({ id: "Fields.AnnualStartIndex" })}
        </label>
        <div className="col-lg-8">
          <div className="mb-4">
            <input
              type="number"
              className="form-control form-control-lg form-control-solid"
              placeholder={intl.formatMessage({
                id: "Fields.AnnualStartIndex",
              })}
              {...formik.getFieldProps(
                "companyNumberingSettings.defaultStartIndexProducts"
              )}
            />
          </div>
          <span
            className="text-muted"
            // dangerouslySetInnerHTML={{
            //   __html: intl.formatMessage({
            //     id: "Fields.CompanyLogoInfo",
            //   }),
            // }}
          >
            Dit het eerste nummer wat aan jouw eerste product wordt toegekend.
            Elk jaar start de telling opnieuw met dit nummer als start!
          </span>
        </div>
      </div>

      <div className="row mb-6">
        <label className="col-lg-4 col-form-label required fw-bold fs-6">
          {/* {intl.formatMessage({ id: "Fields.CompanyName" })} */}
          uitleg opmaak productnummer
        </label>

        <div className="col-lg-8 fv-row">
          <div
            className="d-flex alert p-5 mt-4"
            style={{ backgroundColor: "#e0f0ff" }}
          >
            <div className="col-1 me-5 align-items-center">
              <i className="ki-duotone ki-information-4 fs-3x text-center text-primary">
                <span className="path1"></span>
                <span className="path2"></span>
                <span className="path3"></span>
              </i>
            </div>
            <div className="col-10 text-primary">
              <span
              // dangerouslySetInnerHTML={{
              //   __html: intl.formatMessage({
              //     id: "Fields.CommonNotificationSettingsInfo",
              //   }),
              // }}
              >
                Bepaal hier het format van jouw productnummers. Hieronder zie je
                een voorbeeld en wat de mogelijkheden zijn. Bijvoorbeeld:
                P%year%-%nr% wordt 2024-0001 Placeholders: %yyyy% = huidig
                jaartal, voorbeeld: 2024 %yy% = huidig jaartal, voorbeeld: 24
                %nr% = huidige factuur index, voorbeeld: 0001 %nr1% = huidige
                factuur index, voorbeeld: 1 %nr2% = huidige factuur index,
                voorbeeld: 01 %nr3% = huidige factuur index, voorbeeld: 001
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <label className="col-lg-4 col-form-label fw-bold fs-6">
          <span className="">
            {/* {intl.formatMessage({ id: "Fields.BtwNr" })} */}
            productnummer
          </span>
        </label>

        <div className="col-lg-8 fv-row">
          <input
            type="text"
            className="form-control form-control-lg form-control-solid mb-5"
            placeholder="productnummer"
            // {intl.formatMessage({ id: "Fields.BtwNr" })}
            {...formik.getFieldProps(
              "companyNumberingSettings.productNumberFormat"
            )}
          />

          {/* {formik.touched.contactPhone && formik.errors.contactPhone && (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      {formik.errors.contactPhone}
                    </div>
                  </div>
                )} */}
        </div>
      </div>
    </div>
  );
};

export { Products };
