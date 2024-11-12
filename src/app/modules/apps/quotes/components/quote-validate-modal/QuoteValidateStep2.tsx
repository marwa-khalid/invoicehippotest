import ReactQuill from "react-quill";
import { FormikProps } from "formik";
import { FormValues } from "./QuoteValidateStep1";
import Select from "react-select";
import { useIntl } from "react-intl";
import enums from "../../../../../../invoicehippo.enums.json";
type Props = { formik: FormikProps<FormValues> };

const QuoteValidateStep2 = ({ formik }: Props) => {
  const intl = useIntl();
  const handleQuillChange = (content: string) => {
    formik.setFieldValue("comments", content); // Set statement number in formik
  };
  const handleReasonTypeChange = (option: any) => {
    if (option === null) {
      formik.setFieldValue("declinedReasonType", null);
    } else formik.setFieldValue("declinedReasonType", option.value);
  };

  return (
    <div className="modal-body py-10 px-20 ">
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
              enums.QuoteDeclinedReasonTypes.map((item: any) => ({
                value: item.Value,
                label: item.Title,
              })).find(
                (option) => option.value === formik.values.declinedReasonType
              ) || 1
            }
            onChange={handleReasonTypeChange}
            options={enums.QuoteDeclinedReasonTypes.map((item: any) => ({
              value: item.Value,
              label: item.Title,
            }))}
          />
        </div>
      )}
      <div className="row pb-lg-10">
        <label htmlFor="" className="required fw-bold mb-3">
          {intl.formatMessage({
            id: "Fields.ValidationComments",
          })}
        </label>
        <ReactQuill
          theme="snow"
          placeholder="Jouw tekst hier..."
          style={{ height: "200px" }}
          onChange={handleQuillChange}
          value={formik.values.comments}
        />
        {formik.errors.comments && (
          <div className="fv-plugins-message-container mt-20">
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
