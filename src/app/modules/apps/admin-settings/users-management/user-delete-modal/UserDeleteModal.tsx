import { useEffect } from "react";
import { UserDeleteModalHeader } from "./UserDeleteModalHeader";
import { UserDeleteModalFooter } from "./UserDeleteModalFooter";
import { useIntl } from "react-intl";
interface ComponentProps {
  userName: string;
  deleteModalId: number;
  setDeleteModalOpen: (type: boolean) => void;
  setRefresh: (type: boolean) => void;
}
const UserDeleteModal = ({
  deleteModalId,
  userName,
  setDeleteModalOpen,
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
            <UserDeleteModalHeader setDeleteModalOpen={setDeleteModalOpen} />
            {/* begin::Modal body */}
            <div className="modal-body p-10">
              <div className="form-wrapper">
                {
                  intl
                    .formatMessage({
                      id: "Fields.ModalDeleteDescriptionUserProfile",
                    })
                    .split("{0}")[0]
                }
                <strong>{userName}</strong>
                {
                  intl
                    .formatMessage({
                      id: "Fields.ModalDeleteDescriptionUserProfile",
                    })
                    .split("{0}")[1]
                }
              </div>
            </div>

            {/* end::Modal body */}
            <UserDeleteModalFooter
              deleteModalId={deleteModalId}
              setDeleteModalOpen={setDeleteModalOpen}
              setRefresh={setRefresh}
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

export { UserDeleteModal };
