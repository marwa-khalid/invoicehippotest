import { useEffect, useState } from "react";
import { DiscountAddModalHeader } from "./DiscountAddModalHeader";
import { DiscountAddModalFooter } from "./DiscountAddModalFooter";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useIntl } from "react-intl";
import { DiscountAddModalForm } from "./DiscountAddModalForm";
import { handleToast } from "../../../../auth/core/_toast";
import { getCustomFieldById, postCustomField } from "../core/_requests";
interface Props {
  setRefresh: (type: boolean) => void;
  setAddModalOpen: (type: boolean) => void;
  editModalId: number;
  setEditModalId: (type: number) => void;
}
const DiscountAddModal = ({
  setRefresh,
  setAddModalOpen,
  editModalId,
  setEditModalId,
}: Props) => {
  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const intl = useIntl();

  useEffect(() => {
    const fetchInitialData = async () => {
      const res = await getCustomFieldById(editModalId);

      const response = res.result;
      if (res.isValid) {
        formik.setValues({
          ...formik.values,
          ...response,
        });
      }
    };

    if (editModalId != 0) {
      fetchInitialData();
    }
  }, [editModalId]);

  const formik = useFormik({
    initialValues: {
      id: 0,
      uniqueId: "",
      areaUsageType: 0,
      title: "",
      customData: "" || [],
      usageInfo: "",
      fieldType: 0,
      editOptions: {
        isActivlyUsed: true,
      },
      groupDisplayName: "",
      defaultValue: "",
      includeOnInvoiceType: 0,
      includeOnQuoteType: 0,
      includeOnDocumentDisplayName: "",
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
      fieldType: Yup.number().required(
        intl
          .formatMessage({ id: "Common.RequiredFieldHint2" })
          .replace("{0}", intl.formatMessage({ id: "Fields.FieldType" }))
      ),
      areaUsageType: Yup.number().required(
        intl
          .formatMessage({ id: "Common.RequiredFieldHint2" })
          .replace("{0}", intl.formatMessage({ id: "Fields.AreaUsageType" }))
      ),
    }),

    onSubmit: async (values, { setSubmitting }) => {
      setIsSubmitting(true);
      try {
        const response = await postCustomField(
          values.id,
          values.title,
          values.groupDisplayName,
          values.areaUsageType,
          values.fieldType,
          values.includeOnInvoiceType,
          values.includeOnQuoteType,
          Array.isArray(values.customData)
            ? values.customData.join(",").toString()
            : values.customData
        );
        if (response.isValid) {
          formik.resetForm();
          setAddModalOpen(false);
          setRefresh(true);
          setEditModalId(0);
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
        <div className="modal-dialog mw-800px">
          <div className="modal-content">
            <DiscountAddModalHeader
              setAddModalOpen={setAddModalOpen}
              setEditModalId={setEditModalId}
            />
            <div className="modal-body p-10">
              <DiscountAddModalForm
                formik={formik}
                isSubmitting={isSubmitting}
              />
            </div>
            <DiscountAddModalFooter
              formik={formik}
              isSubmitting={isSubmitting}
              setAddModalOpen={setAddModalOpen}
              setEditModalId={setEditModalId}
            />
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export { DiscountAddModal };
