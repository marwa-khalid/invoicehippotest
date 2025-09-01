import { KTIcon } from "../../../../../_metronic/helpers";
import { useIntl } from "react-intl";

interface ComponentProps {
  setDeleteModalOpen: (type: boolean) => void;
  invoiceNr: string;
  delParsedData: any;
}

const InvoiceDeleteModalHeader = ({
  setDeleteModalOpen,
  invoiceNr,
  delParsedData,
}: ComponentProps) => {
  const intl = useIntl();

  return (
    <div className="modal-header bg-danger d-flex flex-column">
      {/* Modal title */}
      <div className="d-flex w-100 justify-content-between align-items-center">
        <h2 className="fw-bolder mb-0 text-white">
          {intl.formatMessage({ id: "Fields.ModalDeleteTitleInvoice" })}
        </h2>
        <div
          className="btn btn-icon btn-sm btn-active-icon-primary"
          data-kt-users-modal-action="close"
          onClick={() => {
            setDeleteModalOpen(false);
            localStorage.removeItem("ModalData");
          }}
          style={{ cursor: "pointer" }}
        >
          <KTIcon iconName="cross" className="fs-1 text-white" />
        </div>
      </div>

      {/* New table below the title */}
      <div className="w-100 mt-3" style={{ lineHeight: "0.5" }}>
        <table className="table text-white mt-0 compact-table">
          <tbody>
            <tr className="my-0">
              <td className="fw-bold">
                {intl.formatMessage({ id: "Fields.InvoiceDate" })}
              </td>
              <td>: {delParsedData.invoiceDateAsString}</td>
            </tr>
            <tr>
              <td className="fw-bold">
                {intl.formatMessage({ id: "Fields.InvoiceNr" })}
              </td>
              <td>: {invoiceNr}</td>
            </tr>
            <tr>
              <td className="fw-bold">
                {intl.formatMessage({ id: "Fields.Client" })}
              </td>
              <td>: {delParsedData.client}</td>
            </tr>
            <tr>
              <td className="fw-bold">
                {intl.formatMessage({ id: "Fields.Total" })}
              </td>
              <td>
                : {delParsedData.sign} {delParsedData.totalPriceWithVat}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export { InvoiceDeleteModalHeader };
