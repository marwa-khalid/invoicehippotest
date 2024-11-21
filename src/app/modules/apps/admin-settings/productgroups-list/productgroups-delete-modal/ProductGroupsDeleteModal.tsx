import { useEffect, useState } from "react";
import { ProductGroupsDeleteModalHeader } from "./ProductGroupsDeleteModalHeader";
import { ProductGroupsDeleteModalFooter } from "./ProductGroupsDeleteModalFooter";
import { useIntl } from "react-intl";
interface ComponentProps {
  productGroupTitle: string;
  deleteModalId: number[];
  setDeleteModalOpen: (type: boolean) => void;
  setRefresh: (type: boolean) => void;
  setDeleteModalId: (type: number[]) => void;
}
const ProductGroupsDeleteModal = ({
  deleteModalId,
  productGroupTitle,
  setDeleteModalOpen,
  setDeleteModalId,
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
            <ProductGroupsDeleteModalHeader
              setDeleteModalOpen={setDeleteModalOpen}
              setDeleteModalId={setDeleteModalId}
            />
            {/* begin::Modal body */}
            <div className="modal-body p-10">
              <div className="form-wrapper">
                {
                  intl
                    .formatMessage({
                      id: "Fields.ModalDeleteDescriptionProductGroup",
                    })
                    .split("{0}")[0]
                }
                <strong>{productGroupTitle}</strong>!?
              </div>
            </div>

            {/* end::Modal body */}
            <ProductGroupsDeleteModalFooter
              deleteModalId={deleteModalId}
              setDeleteModalOpen={setDeleteModalOpen}
              setRefresh={setRefresh}
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

export { ProductGroupsDeleteModal };
