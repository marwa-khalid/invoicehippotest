import ReactQuill from "react-quill-new";
import { FormikProps } from "formik";
import { FormValues } from "./QuoteValidateStep1";
import Select from "react-select";
import { useIntl } from "react-intl";
import enums from "../../../../../_metronic/i18n/messages/invoicehippo.enums.json";
import { getEnumOptions } from "../../../../helpers/intlHelper";
type Props = { formik: FormikProps<FormValues> };

const QuoteValidateStep2 = ({ formik }: Props) => {
  const intl = useIntl();
  const handleQuillChange = (content: string) => {
    const plain = content.replace(/<(.|\n)*?>/g, "").trim();
    formik.setFieldValue("comments", plain.length === 0 ? "" : content);
  };
  const handleReasonTypeChange = (option: any) => {
    if (option === null) {
      formik.setFieldValue("declinedReasonType", null);
    } else formik.setFieldValue("declinedReasonType", option.value);
  };

  return (
    <div className="modal-body px-20">
      <h2 className="fw-bolder d-flex align-items-center mb-7">
        {formik.values.validationStateType === 2
          ? intl.formatMessage({
              id: "Fields.ValidationDeclineReasib",
            })
          : intl.formatMessage({
              id: "Fields.ValidationComments",
            })}
      </h2>

      {formik.values.validationStateType === 2 && (
        <div className="row">
          <label htmlFor="" className="required fw-bold mb-3">
            {intl.formatMessage({
              id: "Fields.SelectDeclineReasonLabel",
            })}
          </label>
          <Select
            className="react-select-styled mb-7"
            placeholder={intl.formatMessage({
              id: "Fields.SelectDeclineReasonLabel",
            })}
            menuPlacement="bottom"
            value={
              getEnumOptions(enums.QuoteDeclinedReasonTypes, intl).find(
                (option) => option.value === formik.values.declinedReasonType
              ) || 1
            }
            onChange={handleReasonTypeChange}
            options={getEnumOptions(enums.QuoteDeclinedReasonTypes, intl)}
          />
        </div>
      )}
      <div className="row pb-lg-10">
        {formik.values.validationStateType === 2 && (
          <label htmlFor="" className="required fw-bold mb-3">
            {intl.formatMessage({
              id: "Fields.ValidationComments",
            })}
          </label>
        )}
        <ReactQuill
          theme="snow"
          placeholder="Jouw tekst hier..."
          style={{ height: "150px" }}
          onChange={handleQuillChange}
          value={formik.values.comments}
        />
        {formik.errors.comments && (
          <div className="fv-plugins-message-container mt-15">
            <div className="fv-help-block">
              <span
                dangerouslySetInnerHTML={{
                  __html: formik.errors.comments,
                }}
                role="alert"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export { QuoteValidateStep2 };
