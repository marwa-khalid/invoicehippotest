import { useIntl } from "react-intl";

interface ComponentProps {
  setOdataModalOpen: (type: boolean) => void;
  odataUrl: string;
}

const QuoteOdataModalFooter = ({
  setOdataModalOpen,
  odataUrl,
}: ComponentProps) => {
  // For localization support
  const intl = useIntl();

  return (
    <div className="modal-footer d-flex justify-content-end align-items-center ">
      <div className="d-flex">
        {/* Cancel Button */}
        <button
          type="reset"
          onClick={() => setOdataModalOpen(false)}
          className="btn btn-secondary me-3"
        >
          {intl.formatMessage({ id: "Fields.ActionClose" })}
        </button>

        {/* Save Button */}
        <button
          type="submit"
          className="btn btn-info"
          onClick={() => window.open(odataUrl, "_blank")}
        >
          Open Link in New tab
        </button>
      </div>
    </div>
  );
};

export { QuoteOdataModalFooter };
