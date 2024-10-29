import { FC, useState } from "react";
import { useIntl } from "react-intl";
import { KTIcon } from "../../../../../../_metronic/helpers";
import Tippy from "@tippyjs/react";
import ReactQuill from "react-quill";
import clsx from "clsx";

type Props = { setActiveTab: any; tabs: any };

const QuoteValidateStep3 = () => {
  const intl = useIntl();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  return (
    <div className="modal-body py-10 px-20 ">
      <div className="row pb-lg-10">
        <div className="fv-row col-6">
          <label className="required fw-bold fs-6 mb-3">
            {intl.formatMessage({ id: "Fields.FullName" })}
          </label>
          <input
            type="text"
            // {...formik.getFieldProps("financialSettings.accountIbanNr")}
            className={clsx(
              "form-control form-control-white"
              // {
              //   "is-invalid":
              //     formik.touched.financialSettings?.accountIbanNr &&
              //     formik.errors.financialSettings?.accountIbanNr,
              // },
              // {
              //   "is-valid":
              //     formik.touched.financialSettings?.accountIbanNr &&
              //     !formik.errors.financialSettings?.accountIbanNr,
              // }
            )}
            placeholder={intl.formatMessage({
              id: "Fields.FullName",
            })}
          />
        </div>
        <div className="fv-row col-6">
          <label className="required fw-bold fs-6 mb-3">
            {intl.formatMessage({ id: "Fields.EmailAddress" })}
          </label>
          <input
            type="text"
            // {...formik.getFieldProps("financialSettings.accountIbanNr")}
            className={clsx(
              "form-control form-control-white"
              // {
              //   "is-invalid":
              //     formik.touched.financialSettings?.accountIbanNr &&
              //     formik.errors.financialSettings?.accountIbanNr,
              // },
              // {
              //   "is-valid":
              //     formik.touched.financialSettings?.accountIbanNr &&
              //     !formik.errors.financialSettings?.accountIbanNr,
              // }
            )}
            placeholder={intl.formatMessage({
              id: "Fields.EmailAddress",
            })}
          />
        </div>
      </div>
      <div className="row">
        <div className="fv-row">
          <label className="required fw-bold fs-6 mb-3">
            {intl.formatMessage({ id: "Fields.Location" })}-/
            {intl.formatMessage({ id: "Fields.City" })}
          </label>
          <input
            type="text"
            // {...formik.getFieldProps("financialSettings.accountIbanNr")}
            className={clsx(
              "form-control form-control-white"
              // {
              //   "is-invalid":
              //     formik.touched.financialSettings?.accountIbanNr &&
              //     formik.errors.financialSettings?.accountIbanNr,
              // },
              // {
              //   "is-valid":
              //     formik.touched.financialSettings?.accountIbanNr &&
              //     !formik.errors.financialSettings?.accountIbanNr,
              // }
            )}
            placeholder={`${intl.formatMessage({
              id: "Fields.Location",
            })}-/${intl.formatMessage({ id: "Fields.City" })}`}
          />
        </div>
      </div>
    </div>
  );
};

export { QuoteValidateStep3 };
