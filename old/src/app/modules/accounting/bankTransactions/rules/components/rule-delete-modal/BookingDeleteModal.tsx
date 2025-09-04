import { useEffect, useState } from "react";
import { BookingDeleteModalHeader } from "./BookingDeleteModalHeader";
import { BookingDeleteModalFooter } from "./BookingDeleteModalFooter";
import { useIntl } from "react-intl";
interface ComponentProps {
  deleteModalId: number;
  setDeleteModalOpen: (type: boolean) => void;
  setRefresh: (type: boolean) => void;
  refresh: boolean;
}
const BookingDeleteModal = ({
  deleteModalId,
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
  const delParsedData = JSON.parse(localStorage.getItem("ModalData")!);
  const [keepAttachments, setKeepAttachments] = useState<boolean>(false);

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
            <BookingDeleteModalHeader
              setDeleteModalOpen={setDeleteModalOpen}
              delParsedData={delParsedData}
            />
            {/* begin::Modal body */}
            <div className="modal-body p-10">
              <div className="row d-flex form-wrapper bg-secondary p-5 rounded">
                <div className="col-2">
                  <i className="ki-duotone ki-information-4 fs-3x text-center text-danger">
                    <span className="path1"></span>
                    <span className="path2"></span>
                    <span className="path3"></span>
                  </i>
                </div>
                <span
                  className="col-10"
                  dangerouslySetInnerHTML={{
                    __html: intl
                      .formatMessage({
                        id: "Fields.ModalDeleteDescriptionBookingRule",
                      })
                      .replace("{0}", delParsedData?.title),
                  }}
                />
              </div>
            </div>

            {/* end::Modal body */}
            <BookingDeleteModalFooter
              deleteModalId={deleteModalId}
              setDeleteModalOpen={setDeleteModalOpen}
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

export { BookingDeleteModal };
