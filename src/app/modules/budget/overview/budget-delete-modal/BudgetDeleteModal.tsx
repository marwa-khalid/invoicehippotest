import { useEffect } from "react";
import { BudgetDeleteModalHeader } from "./BudgetDeleteModalHeader";
import { BudgetDeleteModalFooter } from "./BudgetDeleteModalFooter";
import { useIntl } from "react-intl";
interface ComponentProps {
  deleteModalId: number[];
  setDeleteModalOpen: (type: boolean) => void;
  setRefresh: (type: boolean) => void;
  setDeleteModalId: (type: number[]) => void;
  refresh: boolean;
  budgetTitle: string;
}
const BudgetDeleteModal = ({
  deleteModalId,
  setDeleteModalOpen,
  setDeleteModalId,
  setRefresh,
  refresh,
  budgetTitle,
}: ComponentProps) => {
  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);
  const intl = useIntl();

  return (
    <>
      <div
        className="modal fade show d-block"
        id="kt_modal_add_user"
        role="dialog"
        tabIndex={-1}
        aria-modal="true"
      >
        {/* begin::Modal dialog */}
        <div className="modal-dialog modal-dialog-centered ">
          {/* begin::Modal content */}
          <div className="modal-content">
            <BudgetDeleteModalHeader
              setDeleteModalOpen={setDeleteModalOpen}
              setDeleteModalId={setDeleteModalId}
            />
            {/* begin::Modal body */}
            <div className="modal-body p-10">
              <div className="form-wrapper">
                <span
                  dangerouslySetInnerHTML={{
                    __html: intl
                      .formatMessage({
                        id: "Fields.ModalDeleteDescriptionBudgetTopic",
                      })
                      .replace("{0}", budgetTitle),
                  }}
                />
              </div>
            </div>

            {/* end::Modal body */}
            <BudgetDeleteModalFooter
              deleteModalId={deleteModalId}
              setDeleteModalOpen={setDeleteModalOpen}
              setRefresh={setRefresh}
              setDeleteModalId={setDeleteModalId}
              refresh={refresh}
            />
          </div>
          {/* end::Modal content */}
        </div>
        {/* end::Modal dialog */}
      </div>
      {/* begin::Modal Backdrop */}
      <div className="modal-backdrop fade show"></div>
      {/* end::Modal Backdrop */}
    </>
  );
};

export { BudgetDeleteModal };
