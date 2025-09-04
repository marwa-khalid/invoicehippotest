import { useEffect, useState } from "react";
import { ProductDeleteModalHeader } from "./ProductDeleteModalHeader";
import { ProductDeleteModalFooter } from "./ProductDeleteModalFooter";
import { useIntl } from "react-intl";
interface ComponentProps {
  deleteModalId: number[];
  setDeleteModalOpen: (type: boolean) => void;
  setRefresh: (type: boolean) => void;
  setDeleteModalId: (type: number[]) => void;
  refresh:boolean
}
const ProductDeleteModal = ({
  deleteModalId,
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
  const parsedData = JSON.parse(localStorage.getItem("ModalData")!);

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
            <ProductDeleteModalHeader
              setDeleteModalOpen={setDeleteModalOpen}
              parsedData={parsedData}
              setDeleteModalId={setDeleteModalId}
            />
            {/* begin::Modal body */}
            <div className="modal-body p-10">
              <div className="form-wrapper">
                <span
                  dangerouslySetInnerHTML={{
                    __html: intl
                      .formatMessage({
                        id: "Fields.ModalDeleteDescriptionProduct",
                      })
                      .replace("{0}", parsedData?.displayName),
                  }}
                />
              </div>
            </div>

            {/* end::Modal body */}
            <ProductDeleteModalFooter
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

export { ProductDeleteModal };
