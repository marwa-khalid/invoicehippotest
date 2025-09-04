import { DigitalSignature } from "./DigitalSignature";
import { FormikProps } from "formik";
import { FormValues } from "./QuoteValidateStep1";

type Props = { formik: FormikProps<FormValues> };

const QuoteValidateStep4 = ({ formik }: Props) => {
  return (
    <div className="modal-body py-10 px-20 ">
      <div className="row pb-lg-10">
        <DigitalSignature formik={formik} />
        {/* <div className="form-check form-switch mt-10 ms-2 d-flex align-items-center">
          <input
            className="form-check-input h-25px w-45px me-5"
            type="checkbox"
            id="notifyClientSwitch"
            checked={formik.values.notifyClient}
            onChange={(e) => {
              formik.setFieldValue("notifyClient", !formik.values.notifyClient);
            }}
          />
          <label
            className="form-check-label fs-sm text-muted"
            htmlFor="notifyClientSwitch"
          >
            Notify Client
          </label>
        </div> */}
      </div>
    </div>
  );
};

export { QuoteValidateStep4 };
