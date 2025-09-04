import { useIntl } from "react-intl";
import { InvoiceListResult } from "../invoices/overview/core/_models";
import { CostListResult } from "../accounting/costs/components/core/_models";

type Props = {
  data: InvoiceListResult | CostListResult | null;
  reset: any;
  setInvoiceSearch: (type: boolean) => void;
};
const InvoiceAddButtons = ({ data, reset, setInvoiceSearch }: Props) => {
  const intl = useIntl();
  return (
    <div className="d-flex w-100 h-40px">
      {/* Primary button - long */}
      {data ? (
        <button
          className="btn btn-primary d-inline-flex align-items-center w-100 rounded-end-0 flex-grow-1"
          onClick={(e) => {
            e.preventDefault();
            setInvoiceSearch(true);
          }}
        >
          <i className="la la-user fs-2"></i>
          <span className="ms-1">
            {data.invoiceDateAsString} | {data.invoiceNr} |{" "}
            {data.totals.totalPriceWithVAT}
          </span>
        </button>
      ) : (
        <button
          className="btn btn-primary d-inline-flex align-items-center w-100 rounded-end-0 flex-grow-1"
          onClick={(e) => {
            e.preventDefault();
            setInvoiceSearch(true);
          }}
        >
          <i className="la la-user-plus fs-2"></i>
          <span className="ms-1">
            {intl.formatMessage({
              id: "Fields.PickerInvoiceToolTipSearch",
            })}
          </span>
        </button>
      )}
      {/* Small icon buttons */}
      {data && (
        <button
          className="btn btn-secondary btn-icon h-40px rounded-0 ms-1 flex-shrink-0"
          onClick={() => reset()}
        >
          <i className="fa fa-remove fs-3"></i>
        </button>
      )}
      <button
        className="btn btn-warning btn-icon rounded-start-0 mx-1 h-40px flex-shrink-0"
        onClick={(e) => {
          e.preventDefault();
          setInvoiceSearch(true);
        }}
      >
        <i className="la la-search fs-3"></i>
      </button>
    </div>
  );
};

export { InvoiceAddButtons };
