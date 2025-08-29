import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { KTIcon } from "../../../_metronic/helpers";
import { removePayment } from "../invoices/overview/core/_requests";
interface ComponentProps {
  deleteModalId: number;
  setDeleteModalOpen: (type: boolean) => void;
  setRefresh: (type: boolean) => void;
  refresh: boolean;
  title: string;
  date: string;
}
const PaymentDeleteModal = ({
  deleteModalId,
  title,
  setDeleteModalOpen,
  setRefresh,
  refresh,
  date,
}: ComponentProps) => {
  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);
  const intl = useIntl();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const deleteApi = async () => {
    try {
      setIsSubmitting(true);
      const response = await removePayment(deleteModalId);
      if (response.isValid) {
        setRefresh(!refresh);
        setDeleteModalOpen(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <div className="modal-header bg-danger d-flex flex-column">
              {/* Modal title */}
              <div className="d-flex w-100 justify-content-between align-items-center">
                <h2 className="fw-bolder mb-0 text-white">
                  {intl.formatMessage({ id: "Fields.ModalDeleteTitlePayment" })}
                </h2>
                <div
                  className="btn btn-icon btn-sm btn-active-icon-primary"
                  data-kt-users-modal-action="close"
                  onClick={() => {
                    setDeleteModalOpen(false);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <KTIcon iconName="cross" className="fs-1 text-white" />
                </div>
              </div>
            </div>
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
                        id: "Fields.ModalDeleteDescriptionPayment",
                      })
                      .replace("{0}", title)
                      .replace("{1}", date),
                  }}
                />
              </div>
            </div>

            {/* end::Modal body */}
            <div className="modal-footer d-flex justify-content-end align-items-center ">
              <div className="d-flex">
                {/* Cancel Button */}
                <button
                  type="reset"
                  onClick={() => {
                    setDeleteModalOpen(false);
                    localStorage.removeItem("ModalData");
                  }}
                  className="btn btn-light me-3"
                >
                  {intl.formatMessage({ id: "Fields.ActionClose" })}
                </button>

                {/* Save Button */}
                <button
                  type="submit"
                  className="btn btn-danger"
                  onClick={deleteApi}
                  //   disabled={!isValid || isSubmitting || !touched}
                >
                  {!isSubmitting &&
                    intl.formatMessage({ id: "Fields.ActionDelete" })}
                  {isSubmitting && (
                    <span
                      className="indicator-progress"
                      style={{ display: "block" }}
                    >
                      <span
                        dangerouslySetInnerHTML={{
                          __html: intl.formatMessage({ id: "Common.Busy" }),
                        }}
                      />
                      <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                    </span>
                  )}
                </button>
              </div>
            </div>
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

export { PaymentDeleteModal };
