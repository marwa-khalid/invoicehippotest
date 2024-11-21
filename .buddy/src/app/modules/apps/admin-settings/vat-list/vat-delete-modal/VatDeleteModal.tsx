import { useEffect, useState } from "react";
import { VatDeleteModalHeader } from "./VatDeleteModalHeader";
import { VatDeleteModalFooter } from "./VatDeleteModalFooter";
import { VatTypeByIdResult } from "../core/_models";
import { useIntl } from "react-intl";
interface ComponentProps {
  vatTitle: string;
  deleteModalId: number;
  setDeleteModalOpen: (type: boolean) => void;
  setRefresh: (type: boolean) => void;
  refresh: boolean;
}
const VatDeleteModal = ({
  deleteModalId,
  vatTitle,
  setDeleteModalOpen,
  setRefresh,
  refresh,
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
            <VatDeleteModalHeader setDeleteModalOpen={setDeleteModalOpen} />
            {/* begin::Modal body */}
            <div className="modal-body p-10">
              <div className="form-wrapper">
                {
                  intl
                    .formatMessage({
                      id: "Fields.ModalDeleteDescriptionVatType",
                    })
                    .split("{0}")[0]
                }
                <strong>{vatTitle}</strong>
                {
                  intl
                    .formatMessage({
                      id: "Fields.ModalDeleteDescriptionVatType",
                    })
                    .split("{0}")[1]
                }
              </div>
            </div>

            {/* end::Modal body */}
            <VatDeleteModalFooter
              deleteModalId={deleteModalId}
              setDeleteModalOpen={setDeleteModalOpen}
              setRefresh={setRefresh}
              refresh={refresh}
              vatTitle={vatTitle}
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

export { VatDeleteModal };
