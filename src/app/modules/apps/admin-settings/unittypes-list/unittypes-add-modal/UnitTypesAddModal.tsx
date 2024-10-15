import { useEffect, useState } from "react";
import { UnitTypesAddModalHeader } from "./UnitTypesAddModalHeader";
import { UnitTypesAddModalFooter } from "./UnitTypesAddModalFooter";

import * as Yup from "yup";
import { useFormik } from "formik";
import { useIntl } from "react-intl";
import { UnitTypesAddModalForm } from "./UnitTypesAddModalForm";
import { handleToast } from "../../../../auth/core/_toast";
import { postUnitType } from "../core/_requests";
interface Props {
  setRefresh: (type: boolean) => void;
  setAddModalOpen: (type: boolean) => void;
}
const UnitTypesAddModal = ({ setRefresh, setAddModalOpen }: Props) => {
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
      isDefault: false,
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
        const response = await postUnitType(
          values.id,
          values.title,
          values.isDefault
        );
        if (response.isValid) {
          formik.resetForm();
          setAddModalOpen(false);
          setRefresh(true);
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

  return (
    <>
      <div
        className="modal fade show d-block"
        tabIndex={-1}
        role="dialog"
        id="kt_modal_1"
        aria-modal="true"
      >
        <div className="modal-dialog mw-400px">
          <div className="modal-content">
            <UnitTypesAddModalHeader setAddModalOpen={setAddModalOpen} />
            <div className="modal-body p-10">
              <UnitTypesAddModalForm
                formik={formik}
                isSubmitting={isSubmitting}
              />
            </div>
            <UnitTypesAddModalFooter
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

export { UnitTypesAddModal };
