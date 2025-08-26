import { FC } from "react";
import { useIntl } from "react-intl";
import ReactQuill from "react-quill-new";
import { FormikProps } from "formik";
import { InvoicePostResult } from "../core/_models";
type Props = {
  formik: FormikProps<InvoicePostResult>;
};

const InvoiceAddStep3: FC<Props> = ({ formik }) => {
  const intl = useIntl();
  const handleQuillChange1 = (content: string) => {
    formik.setFieldValue("comments.invoiceComments", content); // Set statement number in formik
  };
  const handleQuillChange2 = (content: string) => {
    formik.setFieldValue("comments.privateComments", content); // Set statement number in formik
  };
  return (
    <>
      <div className="modal-body h-100vh">
        <form className="form p-3" noValidate>
          <ul className="nav nav-tabs nav-line-tabs nav-line-tabs-2xe mb-5 fs-6 align-items-center d-flex justify-content-start">
            <li className="nav-item">
              <a
                className="nav-link active d-flex align-items-center justify-content-center"
                data-bs-toggle="tab"
                href="#kt_tab_pane_1"
              >
                <i className="ki-duotone ki-home me-2 fs-2" />
                {intl.formatMessage({ id: "Fields.InvoiceComments" })}
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link d-flex align-items-center justify-content-center"
                data-bs-toggle="tab"
                href="#kt_tab_pane_2"
              >
                <i className="ki-duotone ki-home me-2 fs-2" />
                {intl.formatMessage({
                  id: "Fields.PrivateComments",
                })}
              </a>
            </li>
          </ul>

          <div className="tab-content" id="myTabContent">
            <div
              className="tab-pane fade show active"
              id="kt_tab_pane_1"
              role="tabpanel"
            >
              <div className="row d-flex mb-5">
                <ReactQuill
                  theme="snow"
                  id="invoiceComments"
                  placeholder="Jouw tekst hier..."
                  style={{ height: "300px" }}
                  onChange={handleQuillChange1}
                  value={formik.values.comments.invoiceComments}
                />
              </div>
            </div>

            <div className="tab-pane fade" id="kt_tab_pane_2" role="tabpanel">
              <div className="row d-flex mb-5 ">
                <ReactQuill
                  theme="snow"
                  id="privateComments"
                  onChange={handleQuillChange2}
                  value={formik.values.comments.privateComments}
                  placeholder="Jouw tekst hier..."
                  style={{ height: "300px" }}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export { InvoiceAddStep3 };
