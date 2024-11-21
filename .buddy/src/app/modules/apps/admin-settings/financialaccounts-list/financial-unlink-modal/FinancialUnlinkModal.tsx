import { useEffect, useState } from "react";
import { FinancialUnlinkModalHeader } from "./FinancialUnlinkModalHeader";
import { FinancialUnlinkModalFooter } from "./FinancialUnlinkModalFooter";
import { useIntl } from "react-intl";
interface ComponentProps {
  deleteModalId: number;
  setUnlinkModalOpen: (type: boolean) => void;
  setRefresh: (type: boolean) => void;
  refresh: boolean;
}
const FinancialUnlinkModal = ({
  deleteModalId,
  setUnlinkModalOpen,
  setRefresh,
  refresh
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
            <FinancialUnlinkModalHeader
              setDeleteModalOpen={setUnlinkModalOpen}
            />
            {/* begin::Modal body */}
            <div className="modal-body p-10">
              <div className="form-wrapper">
                <p
                  dangerouslySetInnerHTML={{
                    __html: intl.formatMessage({
                      id: "Fields.ModalRemoveSyncConsensusDescriptionFinancialAccount",
                    }),
                  }}
                />
              </div>
            </div>

            {/* end::Modal body */}
            <FinancialUnlinkModalFooter
              deleteModalId={deleteModalId}
              setDeleteModalOpen={setUnlinkModalOpen}
              setRefresh={setRefresh}
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

export { FinancialUnlinkModal };
