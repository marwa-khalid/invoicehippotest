import { useEffect, useState } from "react";
import { BudgetAddModalHeader } from "./BudgetAddModalHeader";
import { BudgetAddModalFooter } from "./BudgetAddModalFooter";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useIntl } from "react-intl";
import { BudgetAddModalForm } from "./BudgetAddModalForm";
import { handleToast } from "../../../auth/core/_toast";
import { getBudgetById, postBudget } from "../core/_requests";
interface Props {
  setRefresh: (type: boolean) => void;
  setAddModalOpen: (type: boolean) => void;
  editModalId: number;
  refresh: boolean;
  setEditModalId: (type: number) => void;
}
const BudgetAddModal = ({
  setRefresh,
  setAddModalOpen,
  editModalId,
  refresh,
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
  const formik = useFormik({
    initialValues: {
      id: 0,
      title: "",
      description: "",
      budgetGroupId: 0,
      relatedLedgerAccounts: [] as number[],
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
          100,
          intl
            .formatMessage({ id: "Common.ValidationMax" })
            .replace("{0}", intl.formatMessage({ id: "Fields.Title" }))
            .replace("{1}", `100`)
        )
        .required(
          intl
            .formatMessage({ id: "Common.RequiredFieldHint2" })
            .replace("{0}", intl.formatMessage({ id: "Fields.Title" }))
        ),

      budgetGroupId: Yup.number().required(
        intl
          .formatMessage({ id: "Common.RequiredFieldHint2" })
          .replace("{0}", intl.formatMessage({ id: "Menu.BudgetGroups" }))
      ),
      // relatedLedgerAccounts: Yup.array().min(
      //   1,
      //   intl
      //     .formatMessage({ id: "Common.RequiredFieldHint2" })
      //     .replace("{0}", intl.formatMessage({ id: "Fields.LedgerAccount" }))
      // ),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setIsSubmitting(true);
      try {
        const response = await postBudget(values);
        if (response.isValid) {
          formik.resetForm();
          setRefresh(!refresh);
          setAddModalOpen(false);
          setEditModalId(0);
        }
        handleToast(response);
      } catch (error) {
        handleToast({ isValid: false, message: error });
      } finally {
        setIsSubmitting(false);
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await getBudgetById(editModalId);
        if (response.isValid) {
          formik.setValues({
            ...formik.values,
            ...response.result,
          });
        }
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
        <div className="modal-dialog mw-700px">
          <div className="modal-content">
            <BudgetAddModalHeader
              setAddModalOpen={setAddModalOpen}
              editModalId={editModalId}
            />
            <div className="modal-body p-10">
              <BudgetAddModalForm
                formik={formik}
                refresh={refresh}
                setRefresh={setRefresh}
              />
            </div>
            <BudgetAddModalFooter
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

export { BudgetAddModal };
