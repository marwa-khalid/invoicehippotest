import { useEffect, useState } from "react";
import { CostLinkingModalHeader } from "./CostLinkingModalHeader";
import { CostLinkingModalFooter } from "./CostLinkingModalFooter";
import { CostsListWrapper } from "../../../accounting/costs/components/CostsListWrapper";

interface Props {
  setAttatchCostModalOpen: (type: boolean) => void;
  inboxDetail: any;
  setLinkingModalOpen: (type: boolean) => void;
  setCostId: (type: number) => void;
}

const CostListModal = ({
  setAttatchCostModalOpen,
  setLinkingModalOpen,
  inboxDetail,
  setCostId
}: Props) => {
  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [attachmentsModalOpen, setAttachmentsModalOpen] =
    useState<boolean>(false);
  

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
            <CostLinkingModalHeader
              setAttatchCostModalOpen={setAttatchCostModalOpen}
              inboxDetail={inboxDetail}
            />
            <div className="pt-6">
              <CostsListWrapper isModal={true} setCostId={setCostId} />
            </div>
            <CostLinkingModalFooter
              isSubmitting={isSubmitting}
              attachmentsModalOpen={attachmentsModalOpen}
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

export { CostListModal };