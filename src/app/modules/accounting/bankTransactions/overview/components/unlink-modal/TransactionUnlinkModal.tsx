import { useEffect, useState } from "react";
import { TransactionUnlinkModalHeader } from "./TransactionUnlinkModalHeader";
import { TransactionUnlinkModalFooter } from "./TransactionUnlinkModalFooter";
import { useIntl } from "react-intl";
import { BankTransactionsModel, BankTransactionsResult } from "../core/_models";
interface ComponentProps {
  setUnlinkModalOpen: (type: boolean) => void;
  setBankTransactions: React.Dispatch<
    React.SetStateAction<BankTransactionsModel | undefined>
  >;
  bankTransactions?: BankTransactionsModel;
  bankMutationId: number;
}
const TransactionUnlinkModal = ({
  setUnlinkModalOpen,
  setBankTransactions,
  bankTransactions,
  bankMutationId,
}: ComponentProps) => {
  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);
  const intl = useIntl();

  const parsedData = JSON.parse(localStorage.getItem("DrawerData")!);
  const [deleteRelatedBooking, setDeleteRelatedBooking] =
    useState<boolean>(false);
  const [deleteBankMutation, setDeleteBankMutation] = useState<boolean>(false);
  const [restoreAttachments, setRstoreAttachments] = useState<boolean>(false);
  const [hideCheck, setHideCheck] = useState<boolean>(false);

  useEffect(() => {
    const item = bankTransactions?.result.find((transaction) => {
      return transaction.id === bankMutationId;
    });
    if (item?.routedRelation.routingType.value === 4) {
      setDeleteRelatedBooking(true);
      setHideCheck(true);
    }
  }, [bankMutationId]);
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
        <div className="modal-dialog modal-dialog-centered">
          {/* begin::Modal content */}
          <div className="modal-content">
            <TransactionUnlinkModalHeader
              setUnlinkModalOpen={setUnlinkModalOpen}
              parsedData={parsedData}
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
                    __html: intl.formatMessage({
                      id: "Fields.ModalDeleteDescriptionBankMutation",
                    }),
                  }}
                />
              </div>
              {!hideCheck && (
                <div className="form-check form-switch mt-10 d-flex align-items-center">
                  <input
                    className="form-check-input h-25px w-45px me-5 cursor-pointer"
                    type="checkbox"
                    id="deleteBookingSwitch"
                    checked={deleteRelatedBooking}
                    onChange={() =>
                      setDeleteRelatedBooking(!deleteRelatedBooking)
                    }
                  />
                  <label
                    className="form-check-label fw-bold text-dark"
                    htmlFor="deleteBookingSwitch"
                  >
                    {intl
                      .formatMessage({ id: "Fields.ModalDeleteTitleBooking" })
                      .toLowerCase()}
                  </label>
                </div>
              )}
              <div className="separator my-10"></div>
              <div className="form-check form-switch d-flex align-items-center">
                <input
                  className="form-check-input h-25px w-45px me-5 cursor-pointer"
                  type="checkbox"
                  id="deleteMutationSwitch"
                  checked={deleteBankMutation}
                  onChange={() => setDeleteBankMutation(!deleteBankMutation)}
                />
                <label
                  className="form-check-label fw-bold text-dark"
                  htmlFor="deleteMutationSwitch"
                >
                  {intl
                    .formatMessage({
                      id: "Fields.ActionDeleteMutation",
                    })
                    .toLowerCase()}
                </label>
              </div>
              <div className="separator my-10"></div>
              <div className="row d-flex form-wrapper bg-secondary p-5 rounded">
                <div className="col-2">
                  <i className="ki-duotone ki-information-4 fs-3x text-center text-success">
                    <span className="path1"></span>
                    <span className="path2"></span>
                    <span className="path3"></span>
                  </i>
                </div>
                <span
                  className="col-10"
                  dangerouslySetInnerHTML={{
                    __html: intl.formatMessage({
                      id: "Fields.KeepAttachmentsInfo",
                    }),
                  }}
                />
              </div>
              <div className="form-check form-switch mt-10 d-flex align-items-center">
                <input
                  className="form-check-input  h-25px w-45px me-5 cursor-pointer"
                  type="checkbox"
                  id="restoreAttachmentSwitch"
                  checked={restoreAttachments}
                  onChange={() => setRstoreAttachments(!restoreAttachments)}
                />
                <label
                  className="form-check-label fw-bold text-dark"
                  htmlFor="restoreAttachmentSwitch"
                >
                  {intl.formatMessage({ id: "Fields.KeepAttachments" })}
                </label>
              </div>
            </div>

            {/* end::Modal body */}
            <TransactionUnlinkModalFooter
              bankMutationId={bankMutationId}
              setUnlinkModalOpen={setUnlinkModalOpen}
              setBankTransactions={setBankTransactions}
              deleteRelatedBooking={deleteRelatedBooking}
              restoreAttachments={restoreAttachments}
              deleteBankMutation={deleteBankMutation}
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

export { TransactionUnlinkModal };
