import { FC } from "react";
import { useIntl } from "react-intl";
import { FormikProps } from "formik";
import "quill/dist/quill.snow.css";
import { BudgetGroupPost } from "../core/_models";
import clsx from "clsx";
import ReactQuill from "react-quill-new";

type Props = {
  formik: FormikProps<BudgetGroupPost>;
};

const BudgetGroupAddStep1: FC<Props> = ({ formik }) => {
  const intl = useIntl();
  const handleQuillChange = (content: string) => {
    formik.setFieldValue("description", content);
  };
  return (
    <div className="modal-body" id="#kt_tab_pane_4">
      <form className="form p-4" noValidate>
        <div className="mb-5">
          <label className="required fw-bold fs-6 mb-3" htmlFor="title">
            {intl.formatMessage({ id: "Fields.Title" })}
          </label>
          <input
            type="text"
            id="title"
            {...formik.getFieldProps("title")}
            className={clsx("form-control form-control-solid", {
              "is-invalid": formik.touched.title && formik.errors.title,
            })}
            placeholder={intl.formatMessage({ id: "Fields.Title" })}
          />
          {formik.touched.title && formik.errors.title && (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">
                <span
                  dangerouslySetInnerHTML={{
                    __html: formik.errors.title,
                  }}
                  role="alert"
                />
              </div>
            </div>
          )}
        </div>

        <div className="row mb-5">
          <label className="fw-bold fs-6 mb-3">
            {intl.formatMessage({ id: "Fields.Description" })}
            <ReactQuill
              theme="snow"
              className="mt-3"
              placeholder="Jouw tekst hier..."
              style={{ height: "200px" }}
              onChange={(content) => handleQuillChange(content)}
              value={formik.values.description || ""}
            />
          </label>
        </div>
      </form>
    </div>
  );
};

export { BudgetGroupAddStep1 };
