import { useEffect, useState } from "react";
import { LocalizationDeleteModalHeader } from "./LocalizationDeleteModalHeader";
import { LocalizationDeleteModalFooter } from "./LocalizationDeleteModalFooter";
import { useIntl } from "react-intl";
interface ComponentProps {
  deleteModalId: number;
  setDeleteModalOpen: (type: boolean) => void;
  setRefresh: (type: boolean) => void;
  refresh: boolean;
  translationKey: string;
}
const LocalizationDeleteModal = ({
  deleteModalId,
  setDeleteModalOpen,
  setRefresh,
  refresh,
  translationKey,
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
        role="dialog"
        tabIndex={-1}
        aria-modal="true"
      >
        {/* begin::Modal dialog */}
        <div className="modal-dialog modal-dialog-centered">
          {/* begin::Modal content */}
          <div className="modal-content">
            <LocalizationDeleteModalHeader
              setDeleteModalOpen={setDeleteModalOpen}
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
                        id: "Fields.ModalDeleteDescriptionTranslation",
                      })
                      .replace("{0}", translationKey),
                  }}
                />
              </div>
            </div>

            {/* end::Modal body */}
            <LocalizationDeleteModalFooter
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

export { LocalizationDeleteModal };
