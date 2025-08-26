import { useEffect } from "react";
import { InboxLinkingModalHeader } from "./InboxLinkingModalHeader";
import { InboxLinkingModalFooter } from "./InboxLinkingModalFooter";
import { useIntl } from "react-intl";
import { OverlayTrigger, Tooltip } from "react-bootstrap"; // Bootstrap Tooltip

interface InboxLinkingModalProps {
  setLinkingModalOpen: (type: boolean) => void;
  setAttatchCostModalOpen: (type: boolean) => void;
  setBookingListModalOpen: (type: boolean) => void;
  setIinvoiceListModalOpen: (type: boolean) => void;
  setCostListModalOpen: (type: boolean) => void;
  setCostAddModalOpen: (type: boolean) => void;
  setRefresh: (type: boolean) => void;
  refresh: boolean;
  inboxDetail: any;
}

const InboxLinkingModal = ({
  inboxDetail,
  setLinkingModalOpen,
  setAttatchCostModalOpen,
  setBookingListModalOpen,
  setIinvoiceListModalOpen,
  setCostListModalOpen,
  setCostAddModalOpen,
  setRefresh,
  refresh,
}: InboxLinkingModalProps) => {
  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);

  const intl = useIntl();

  // Tile Items with Labels, Tooltips, and Icons
  const tiles = [
    { id: "Fields.ModalInboxAttachToCost", action: setCostAddModalOpen, icon: "bi-cash-stack", bg: "lightblue", label: "New Cost" },
    { id: "Fields.ModalInboxAttachToBooking", action: setAttatchCostModalOpen, icon: "bi-calendar-check", bg: "rgb(229 202 216)", label: "New Booking" },
    { id: "Fields.ModalInboxAttachToCostExisting", action: setCostListModalOpen, icon: "bi-file-earmark-text", bg: "rgba(119, 179, 119,0.50)", label: "Purchase Invoice" },
    { id: "Fields.ModalInboxAttachToInvoiceExisting", action: setIinvoiceListModalOpen, icon: "bi-receipt", bg: "rgba(155, 148, 193, 0.51)", label: "Sale Invoice" },
    { id: "Fields.ModalInboxAttachToBookingExisting", action: setBookingListModalOpen, icon: "bi-bookmark-star", bg: "rgb(249, 229, 229)", label: "Booking" }
  ];

  return (
    <>
      <div className="modal fade show d-block" id="kt_modal_copy_inbox" role="dialog" tabIndex={-1} aria-modal="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            {/* Modal Header */}
            <InboxLinkingModalHeader setLinkingModalOpen={setLinkingModalOpen} inboxDetail={inboxDetail} />

            {/* Modal Body */}
            <div className="modal-body text-center">
              <div className="container">
                
                {/* Top Row */}
                <div className="row justify-content-center mb-3">
                  {tiles.slice(0, 3).map((tile, index) => (
                    <div className="col-auto" key={index}>
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>{intl.formatMessage({ id: tile.id })}</Tooltip>}
                      >
                        <div className="tile" style={{ background: tile.bg }} onClick={() => tile.action(true)}>
                          <i className={`bi ${tile.icon} tile-icon`}></i>
                          <div className="tile-label">{tile.label}</div>
                        </div>
                      </OverlayTrigger>
                    </div>
                  ))}
                </div>

                {/* Divider */}
                <div className="divider"></div>

                {/* Bottom Row */}
                <div className="row justify-content-center">
                  {tiles.slice(3).map((tile, index) => (
                    <div className="col-auto" key={index}>
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>{intl.formatMessage({ id: tile.id })}</Tooltip>}
                      >
                        <div className="tile" style={{ background: tile.bg }} onClick={() => tile.action(true)}>
                          <i className={`bi ${tile.icon} tile-icon`}></i>
                          <div className="tile-label">{tile.label}</div>
                        </div>
                      </OverlayTrigger>
                    </div>
                  ))}
                </div>

              </div>
            </div>

            {/* Modal Footer */}
            <InboxLinkingModalFooter setLinkingModalOpen={setLinkingModalOpen} />
          </div>
        </div>
      </div>

      {/* Modal Backdrop */}
      <div className="modal-backdrop fade show"></div>
     
    </>
  );
};

export { InboxLinkingModal };