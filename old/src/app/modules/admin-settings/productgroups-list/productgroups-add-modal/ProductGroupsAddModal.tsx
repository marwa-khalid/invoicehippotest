import { useEffect, useState } from "react";
import { ProductGroupsAddModalHeader } from "./ProductGroupsAddModalHeader";
import { ProductGroupsAddModalFooter } from "./ProductGroupsAddModalFooter";

import * as Yup from "yup";
import { useFormik } from "formik";
import { useIntl } from "react-intl";
import { handleToast } from "../../../auth/core/_toast";
import { getProductGroupById, postProductGroup } from "../core/_requests";
import clsx from "clsx";
interface Props {
  setRefresh: (type: boolean) => void;
  setAddModalOpen: any;
  editModalId: number;
  refresh: boolean;
}
const ProductGroupsAddModal = ({
  setRefresh,
  setAddModalOpen,
  editModalId,
  refresh,
}: Props) => {
  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const intl = useIntl();

  const formik = useFormik({
    initialValues: {
      id: 0,
      title: "",
    },
    validationSchema: Yup.object().shape({
      title: Yup.string()
        .min(
          3,
          intl
            .formatMessage({ id: "Common.ValidationMin" })
            .replace("{0}", intl.formatMessage({ id: "Fields.Title" }))
            .replace("{1}", `3`)
        )
        .max(
          50,
          intl
            .formatMessage({ id: "Common.ValidationMax" })
            .replace("{0}", intl.formatMessage({ id: "Fields.Title" }))
            .replace("{1}", `50`)
        )
        .required(
          intl
            .formatMessage({ id: "Common.RequiredFieldHint2" })
            .replace("{0}", intl.formatMessage({ id: "Fields.Title" }))
        ),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setIsSubmitting(true);
      try {
        const response = await postProductGroup(values.id, values.title);
        if (response.isValid) {
          formik.resetForm();
          setAddModalOpen();
          setRefresh(!refresh);
        }
        handleToast(response);
      } catch (error) {
        console.error("Post failed:", error);
      } finally {
        setIsSubmitting(false);
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await getProductGroupById(editModalId);
        formik.setValues({
          id: response.result?.id || 0,
          title: response.result?.title || "",
        });
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };
    if (editModalId != 0) {
      fetchInitialData();
    }
  }, [editModalId]);

  return (
    <>
      <div
        className="modal fade show d-block"
        tabIndex={-1}
        role="dialog"
        id="kt_modal_1"
        aria-modal="true"
      >
        <div className="modal-dialog mw-500px">
          <div className="modal-content">
            <ProductGroupsAddModalHeader
              setAddModalOpen={setAddModalOpen}
              editModalId={editModalId}
            />
            <div className="modal-body p-10">
              {/* begin::Input group */}
              <div className="row d-flex mb-7">
                {/* code Field */}

                <div className="fv-row flex-grow-1">
                  <label className="required fw-bold fs-6 mb-2" htmlFor="title">
                    {intl.formatMessage({ id: "Fields.Title" })}
                  </label>
                  <input
                    type="text"
                    id="title"
                    {...formik.getFieldProps("title")}
                    className={clsx(
                      "form-control form-control-solid",
                      {
                        "is-invalid":
                          formik.touched.title && formik.errors.title,
                      },
                      {
                        "is-valid":
                          formik.touched.title && !formik.errors.title,
                      }
                    )}
                    disabled={isSubmitting}
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
              </div>
            </div>
            <ProductGroupsAddModalFooter
              formik={formik}
              isSubmitting={isSubmitting}
              setAddModalOpen={setAddModalOpen}
            />
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export { ProductGroupsAddModal };
