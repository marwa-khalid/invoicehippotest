import { KTIcon } from "../../../../../../_metronic/helpers";
import { useIntl } from "react-intl";
import { useState } from "react";
import { useAuth } from "../../../../auth";
import { FormValues } from "./QuoteAddStep1";
import { FormikProps } from "formik";
import enums from "../../../../../../invoicehippo.enums.json";

interface ComponentProps {
  setAddModalOpen: (type: boolean) => void;
  businessName: string;
  customerNr: string;
  disableTabs: boolean;
  tabs: any;
  activeTab: any;
  handleTabClick: (type: boolean) => void;
  formik: FormikProps<FormValues>;
  editModalId: number;
}

const QuoteAddModalHeader = ({
  setAddModalOpen,
  customerNr,
  businessName,
  disableTabs,
  tabs,
  activeTab,
  formik,
  handleTabClick,
  editModalId,
}: ComponentProps) => {
  const intl = useIntl();
  const [showModal, setShowModal] = useState(false);

  const auth = useAuth();
  const getStatusClass = (quoteStatusValue: number) => {
    switch (quoteStatusValue) {
      case 1: // Concept
        return "bg-light";
      case 2: // Wachten op goedkeuring (Waiting for approval)
        return "bg-info";
      case 4: // Geaccepteerd door de klant (Accepted by the client)
        return "bg-success";
      case 8: // Afgekeurd door de klant (Rejected by the client)
        return "bg-danger";
      case 16: // Verlopen-/1e Herinnering (Overdue/1st reminder)
        return "bg-warning";
      case 32: // Verlopen-/2e Herinnering (Overdue/2nd reminder)
      case 64: // Verlopen-/Laatste Herinnering (Overdue/Last reminder)
        return "bg-danger";
      case 128: // Geannuleerd (Cancelled)
        return "bg-dark";
      case 256: // Gepauzeerd (Paused)
        return "bg-warning";
      case 512: // Planning
        return "bg-primary";
      case 1024: // Realisatie (Realization)
        return "bg-info";
      case 2048: // Afgerond (Completed)
        return "bg-success";
      default:
        return "bg-default"; // Default case
    }
  };
  return (
    <div className="modal-header d-flex flex-column bg-primary pb-3">
      <div className="d-flex justify-content-between align-items-center w-100">
        <div>
          <span className="text-secondary">
            {editModalId != 0
              ? intl
                  .formatMessage({
                    id: "Fields.PageQuoteDetailTitleEdit",
                  })
                  .replace("{0}", formik.values.title)
              : intl.formatMessage({
                  id: "Fields.PageQuoteDetailTitleNew",
                })}
          </span>
          <h2 className="fw-bold text-white">
            {editModalId != 0
              ? intl.formatMessage({
                  id: "Fields.PageQuoteDetailSubTitleEdit",
                })
              : intl.formatMessage({
                  id: "Fields.PageQuoteDetailSubTitleNew",
                })}
          </h2>

          {formik.values.status === 1 ? (
            <span className="text-white">Concept</span>
          ) : null}
        </div>

        {/* Close Button */}
        <div
          className="btn btn-icon btn-sm btn-active-icon-primary"
          onClick={() => setAddModalOpen(false)}
          style={{ cursor: "pointer" }}
        >
          <KTIcon iconName="cross" className="fs-2x text-white mt-2" />
        </div>
      </div>

      {/* Ribbon at the right end of the header */}
      {formik.values.status !== 1 && (
        <div className="ribbon ribbon-end position-absolute top-20 end-0 w-300px">
          <div
            className={`ribbon-label fw-bold ${getStatusClass(
              formik.values.status
            )}`}
          >
            <small
              className={`${getStatusClass(
                formik.values.status
              )} rounded p-0 text-white fw-bold `}
            >
              {
                enums.QuoteStatusTypes.find(
                  (status: any) => status.Value === formik.values.status
                )?.Title
              }
            </small>
          </div>
        </div>
      )}

      <div className="separator border-white mt-3"></div>
    </div>
  );
};

export { QuoteAddModalHeader };
