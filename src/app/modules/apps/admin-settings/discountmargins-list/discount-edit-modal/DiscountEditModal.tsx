import { useEffect, useState } from "react";
import { DiscountEditModalHeader } from "./DiscountEditModalHeader";
import { DiscountEditModalFooter } from "./DiscountEditModalFooter";
import { getDiscountMarginById, postDiscountMargin } from "../core/_requests";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useIntl } from "react-intl";
import FinancialEditModalForm from "./DiscountEditModalForm";
import { handleToast } from "../../../../auth/core/_toast";
import { Value } from "sass";
interface Props {
  setRefresh: (type: boolean) => void;
  setEditModalOpen: (type: boolean) => void;
  editModalId: number;
}
const DiscountEditModal = ({
  setRefresh,
  setEditModalOpen,
  editModalId,
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
      isPercentageMargin: false,
      amount: 0,
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
      amount: Yup.number()
        .min(
          0,
          intl
            .formatMessage({ id: "Common.ValidationMin" })
            .replace("{0}", intl.formatMessage({ id: "Fields.Amount" }))
            .replace("{1}", `0`)
        )
        .max(
          100,
          intl
            .formatMessage({ id: "Common.ValidationMax" })
            .replace("{0}", intl.formatMessage({ id: "Fields.Amount" }))
            .replace("{1}", `100`)
        )
        .required(
          intl
            .formatMessage({ id: "Common.RequiredFieldHint2" })
            .replace("{0}", intl.formatMessage({ id: "Fields.Amount" }))
        ),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setIsSubmitting(true);
      try {
        const response = await postDiscountMargin(
          values.id,
          values.title,
          values.isPercentageMargin,
          values.amount
        );

        if (response.isValid) {
          formik.resetForm();
          setEditModalOpen(false);
          setRefresh(true);
        }
        handleToast(response);
      } catch (error) {
        console.error("Put failed:", error);
      } finally {
        setIsSubmitting(false);
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await getDiscountMarginById(editModalId);
  
        formik.setValues({
          id: response.result?.id || 0,
          title: response.result?.title || "",
          amount: response.result?.amount || 0,
          isPercentageMargin: response.result?.isPercentageMargin || false,
        });
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
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
            <DiscountEditModalHeader setEditModalOpen={setEditModalOpen} />
            <div className="modal-body p-10">
              <FinancialEditModalForm
                formik={formik}
                isSubmitting={isSubmitting}
              />
            </div>
            <DiscountEditModalFooter
              formik={formik}
              isSubmitting={isSubmitting}
              setEditModalOpen={setEditModalOpen}
            />
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export { DiscountEditModal };
