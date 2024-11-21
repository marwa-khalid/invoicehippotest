import { useEffect, useState } from "react";
import { ClientDeleteModalHeader } from "./ClientDeleteModalHeader";
import { ClientDeleteModalFooter } from "./ClientDeleteModalFooter";
import { useIntl } from "react-intl";
interface ComponentProps {
  title: string;
  refresh: boolean;
  deleteModalId: number[];
  intlMessage: string;
  setDeleteModalOpen: (type: boolean) => void;
  setRefresh: (type: boolean) => void;
}
const ClientDeleteModal = ({
  deleteModalId,
  setDeleteModalOpen,
  refresh,
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
            <ClientDeleteModalHeader
              setDeleteModalOpen={setDeleteModalOpen}
              intlMessage={intlMessage}
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
            <ClientDeleteModalFooter
              deleteModalId={deleteModalId}
              setDeleteModalOpen={setDeleteModalOpen}
              refresh={refresh}
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

export { ClientDeleteModal };
