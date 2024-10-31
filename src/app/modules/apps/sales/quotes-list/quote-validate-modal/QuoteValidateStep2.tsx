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
      <div className="row pb-lg-10">
        
        {formik.values.validationStateType === 2 && (
          <Select
            className="react-select-styled mb-10"
            placeholder="Select Decline Reason"
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
        )}
        <ReactQuill
          theme="snow"
          placeholder="Jouw tekst hier..."
          style={{ height: "200px" }}
          onChange={handleQuillChange}
          value={formik.values.comments}
        />
      </div>
    </div>
  );
};

export { QuoteValidateStep2 };
