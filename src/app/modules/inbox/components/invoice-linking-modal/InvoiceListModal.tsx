import { useEffect, useState } from "react";
import { InvoiceAddModalHeader } from "./InvoiceAddModalHeader";
import { InvoiceAddModalFooter } from "./InvoiceAddModalFooter";
import { InvoiceListWrapper } from "../../../invoices/overview/InvoiceListWrapper";

interface Props {
  setAttatchCostModalOpen: (type: boolean) => void;
  inboxDetail: any;
  setLinkingModalOpen: (type: boolean) => void;
  setInvoiceId: (type: number) => void;
}

const InvoiceListModal = ({
  setInvoiceId,
  setAttatchCostModalOpen,
  setLinkingModalOpen,
  inboxDetail,
}: Props) => {
  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [action, setAction] = useState<number>();

  return (
    <>
      <div
        className="modal fade show d-block"
        role="dialog"
        id="invoice_add_modal"
        aria-modal="true"
        tabIndex={-1}
      >
        <div
          className="modal-dialog"
          style={{
            maxWidth: "1024px",
            width: "100%",
          }}
        >
          <div className="modal-content">
            <InvoiceAddModalHeader
              setAttatchCostModalOpen={setAttatchCostModalOpen}
              inboxDetail={inboxDetail}
            />
            <div className="pt-6">
              <InvoiceListWrapper
                isModal={true}
                setInvoiceId={setInvoiceId}
              ></InvoiceListWrapper>
            </div>

            <InvoiceAddModalFooter
              isSubmitting={isSubmitting}
              setAttatchCostModalOpen={setAttatchCostModalOpen}
              setLinkingModalOpen={setLinkingModalOpen}
              showLinking={false}
            />
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export { InvoiceListModal };
function postInvoiceItem(values: {
  skipBalanceValidation: boolean;
  id: number;
  isInvoiceEditable: boolean;
  attachmentsTempId: string;
  title: string;
  voucherNumber: string;
  comments: string;
  header: {
    prospect: {
      clientName: string;
      kvKNr: string;
      vatNr: string;
      ibanNr: string;
    };
    invoiceDate: string;
    clientId: number;
    companyTradeNameId: number;
    totalValidationAmount: number;
    relatedActivaInvoiceId: number;
    clientDisplayName: string;
  };
  invoiceItems: {
    id: number;
    orderIndex: number;
    description: string;
    amount: number;
    balanceType: number;
    ledgerAccountId: number;
    vatTypeId: number;
    isDebet: boolean;
    isOriginalFirstLinkedFromMutation: boolean;
    actions: {
      disableDelete: boolean;
      disableAmountEdit: boolean;
      disableBalanceTypeEdit: boolean;
      disableLedgerAccountEdit: boolean;
      disableVatTypeEdit: boolean;
    };
  }[];
  attachments: {
    attachmentsToLink: {
      inboxItemId: number;
      attachmentId: number;
      isRemoved: boolean;
      restoreAttachment: boolean;
      isDirectFileReference: boolean;
    }[];
    attachments: (
      | {
          id: number;
          relatedEntityId: number;
          fileName: string;
          dateOfUpload: string;
          fileType: { value: number; description: string };
          sizeDescription: string;
          downloadInfo: {
            fileName: string;
            fileId: number;
            fileType: { value: number; description: string };
            downloadUrl: string;
          };
          actions: {
            canDelete: boolean;
            canDownload: boolean;
            canView: boolean;
            canChangeState: boolean;
          };
          sendWithEmail?: undefined;
        }
      | {
          id: number;
          relatedEntityId: number;
          fileName: string;
          dateOfUpload: string;
          fileType: { value: number; description: string };
          sizeDescription: string;
          downloadInfo: {
            fileName: string;
            fileId: number;
            fileType: { value: number; description: string };
            downloadUrl: string;
          };
          actions: {
            canDelete: boolean;
            canDownload: boolean;
            canView: boolean;
            canChangeState: boolean;
          };
          sendWithEmail: boolean;
        }
    )[];
  };
  actions: { canEdit: boolean; canDelete: boolean; canAddAttachments: boolean };
  viewTabs: { showActionHistory: boolean; showInvoiceMutations: boolean };
}) {
  throw new Error("Function not implemented.");
}
