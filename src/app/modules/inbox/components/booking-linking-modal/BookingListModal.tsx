import { useEffect, useState } from "react";
import { BookingAddModalHeader } from "./BookingAddModalHeader";
import { BookingAddModalFooter } from "./BookingAddModalFooter";
import { useIntl } from "react-intl";
import { BookingsListWrapper } from "../../../accounting/bookings/components/BookingsListWrapper";

interface Props {
  setAttatchCostModalOpen: (type: boolean) => void;
  inboxDetail: any;
  setLinkingModalOpen: (type: boolean) => void;
  setBookingId: (type: number) => void;
}

const BookingListModal = ({
  setBookingId,
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
  const intl = useIntl();
  const [action, setAction] = useState<number>();

  return (
    <>
      <div
        className="modal fade show d-block"
        role="dialog"
        id="booking_add_modal"
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
            <BookingAddModalHeader
              title={intl.formatMessage({
                id: "Fields.ModalInboxAttachToBookingExisting",
              })}
              setAttatchCostModalOpen={setAttatchCostModalOpen}
              inboxDetail={inboxDetail}
            />
            <div className="pt-6">
              <BookingsListWrapper
                isModal={true}
                setBookingId={setBookingId}
              ></BookingsListWrapper>
            </div>

            <BookingAddModalFooter
              isSubmitting={isSubmitting}
              setAction={setAction}
              setLinkingModalOpen={setLinkingModalOpen}
              showLinking={false}
              setAttatchCostModalOpen={setAttatchCostModalOpen}
            />
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export { BookingListModal };
