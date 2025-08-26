import { useEffect } from "react";
import { TradeNameDeleteModalHeader } from "./TradeNameDeleteModalHeader";
import { TradeNameDeleteModalFooter } from "./TradeNameDeleteModalFooter";
import { useIntl } from "react-intl";
interface ComponentProps {
  title: string;
  deleteModalId: number;
  setDeleteModalOpen: (type: boolean) => void;
  setRefresh: (type: boolean) => void;
  refresh: boolean;
  setDeleteModalId: (type: number) => void;
}
const TradeNameDeleteModal = ({
  deleteModalId,
  title,
  setDeleteModalOpen,
  setDeleteModalId,
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
            <TradeNameDeleteModalHeader
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
                        id: "Fields.ModalDeleteDescriptionTradeName",
                      })
                      .replace("{0}", title),
                  }}
                />
              </div>
            </div>

            {/* end::Modal body */}
            <TradeNameDeleteModalFooter
              deleteModalId={deleteModalId}
              setDeleteModalOpen={setDeleteModalOpen}
              setRefresh={setRefresh}
              refresh={refresh}
              setDeleteModalId={setDeleteModalId}
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

export { TradeNameDeleteModal };
