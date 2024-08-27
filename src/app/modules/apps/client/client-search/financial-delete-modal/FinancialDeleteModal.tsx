import { useEffect, useState } from "react";
import { FinancialDeleteModalHeader } from "./FinancialDeleteModalHeader";
import { FinancialDeleteModalFooter } from "./FinancialDeleteModalFooter";
import { useIntl } from "react-intl";
interface ComponentProps {
  title: string;
  deleteModalId: number[];
  intlMessage: string;
  setDeleteModalOpen: (type: boolean) => void;
  setRefresh: (type: boolean) => void;
}
const FinancialDeleteModal = ({
  deleteModalId,
  setDeleteModalOpen,
  title,
  intlMessage,
  setRefresh,
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
            <FinancialDeleteModalHeader
              setDeleteModalOpen={setDeleteModalOpen}
            />
            {/* begin::Modal body */}
            <div className="modal-body p-10">
              <div className="form-wrapper">
                {
                  intl
                    .formatMessage({
                      id: `${intlMessage}`,
                    })
                    .split("{0}")[0]
                }
                <strong>{title}</strong>
                {
                  intl
                    .formatMessage({
                      id: `${intlMessage}`,
                    })
                    .split("{0}")[1]
                }
              </div>
            </div>

            {/* end::Modal body */}
            <FinancialDeleteModalFooter
              deleteModalId={deleteModalId}
              setDeleteModalOpen={setDeleteModalOpen}
              setRefresh={setRefresh}
              intlMessage={intlMessage}
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

export { FinancialDeleteModal };
