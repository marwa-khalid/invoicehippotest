import { KTIcon } from "../../../../../_metronic/helpers";
import { useIntl } from "react-intl";

interface ComponentProps {
  setOdataModalOpen: (type: boolean) => void;
}

const QuoteOdataModalHeader = ({ setOdataModalOpen }: ComponentProps) => {
  const intl = useIntl();

  return (
    <div className="modal-header bg-info d-flex flex-column">
      {/* Modal title */}
      <div className="d-flex w-100 justify-content-between align-items-center">
        <h2 className="fw-bolder mb-0 text-white">
          {intl.formatMessage({ id: "Fields.ActionCopy" })} odata
        </h2>
        <div
          className="btn btn-icon btn-sm btn-active-icon-primary"
          data-kt-users-modal-action="close"
          onClick={() => {
            setOdataModalOpen(false);
          }}
          style={{ cursor: "pointer" }}
        >
          <KTIcon iconName="cross" className="fs-1 text-white" />
        </div>
      </div>

      {/* New table below the title */}
      {/* <div className="w-100 mt-3" style={{ lineHeight: "0.5" }}>
        <table className="table text-white mt-0">
          <tbody>
            <tr className="my-0">
              <td className="fw-bold">
                {intl.formatMessage({ id: "Fields.QuoteDate" })}
              </td>
              <td>: {parsedData?.quoteDateAsString}</td>
            </tr>
            <tr>
              <td className="fw-bold">
                {intl.formatMessage({ id: "Fields.QuoteNr" })}
              </td>
              <td>: {quoteNumber}</td>
            </tr>
            <tr>
              <td className="fw-bold">
                {intl.formatMessage({ id: "Fields.Client" })}
              </td>
              <td>: {parsedData?.client}</td>
            </tr>
            <tr>
              <td className="fw-bold">
                {intl.formatMessage({ id: "Fields.Total" })}
              </td>
              <td>
                : {parsedData?.sign} {parsedData?.totalPriceWithVat}
              </td>
            </tr>
          </tbody>
        </table>
      </div> */}
    </div>
  );
};

export { QuoteOdataModalHeader };
