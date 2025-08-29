import { useState } from "react";
import { useIntl } from "react-intl";
import { handleToast } from "../../../../../auth/core/_toast";
import { restoreRouted } from "../core/_requests";
import { BankTransactionsModel } from "../core/_models";

interface ComponentProps {
  setUnlinkModalOpen: (type: boolean) => void;
  bankMutationId: number;
  setBankTransactions: React.Dispatch<
    React.SetStateAction<BankTransactionsModel | undefined>
  >;
  deleteRelatedBooking: boolean;
  restoreAttachments: boolean;
  deleteBankMutation: boolean;
}

const TransactionUnlinkModalFooter = ({
  bankMutationId,
  setUnlinkModalOpen,
  setBankTransactions,
  deleteBankMutation,
  restoreAttachments,
  deleteRelatedBooking,
}: ComponentProps) => {
  // For localization support
  const intl = useIntl();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const unlink = async () => {
    try {
      setIsSubmitting(true);

      const res = await restoreRouted(
        bankMutationId,
        deleteBankMutation,
        restoreAttachments,
        deleteRelatedBooking
      );
      if (res.isValid) {
        setBankTransactions((prev) => {
          if (!prev) return prev; // if undefined, return as is

          return {
            ...prev,
            result: prev.result.map((item) =>
              item.id === res.result.id ? res.result : item
            ),
          };
        });
        setUnlinkModalOpen(false);
        localStorage.removeItem("DrawerData");
      }

      handleToast(res);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="modal-footer d-flex justify-content-end align-items-center ">
      <div className="d-flex">
        {/* Cancel Button */}
        <button
          type="reset"
          onClick={() => {
            setUnlinkModalOpen(false);
            localStorage.removeItem("ModalData");
          }}
          className="btn btn-secondary me-3"
        >
          {intl.formatMessage({ id: "Fields.ActionClose" })}
        </button>

        {/* Save Button */}
        <button type="submit" className="btn btn-danger" onClick={unlink}>
          {!isSubmitting && intl.formatMessage({ id: "Fields.ActionDelete" })}
          {isSubmitting && (
            <span className="indicator-progress" style={{ display: "block" }}>
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
  );
};

export { TransactionUnlinkModalFooter };
