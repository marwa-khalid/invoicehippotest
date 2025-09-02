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
        <div className="mb-7">
          <label className="required fw-bold fs-6 mb-2">Group Title</label>
          <input
            type="text"
            {...formik.getFieldProps("title")}
            className={clsx("form-control form-control-solid", {
              "is-invalid": formik.touched.title && formik.errors.title,
            })}
          />
        </div>

        <div className="mb-7">
          <label className="required fw-bold fs-6 mb-2">
            Group Description
          </label>
          <ReactQuill
            theme="snow"
            id="description"
            placeholder="Jouw tekst hier..."
            style={{ height: "300px" }}
            onChange={(content) => handleQuillChange(content)}
            value={formik.values.description || ""}
          />
        </div>
      </form>
    </div>
  );
};

export { BudgetGroupAddStep1 };
