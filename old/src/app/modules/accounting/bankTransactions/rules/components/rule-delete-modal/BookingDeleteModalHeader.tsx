import { KTIcon } from "../../../../../../../_metronic/helpers";
import { useIntl } from "react-intl";

interface ComponentProps {
  setDeleteModalOpen: (type: boolean) => void;
  delParsedData: any;
}

const BookingDeleteModalHeader = ({
  setDeleteModalOpen,
  delParsedData,
}: ComponentProps) => {
  const intl = useIntl();

  return (
    <div className="modal-header bg-danger d-flex flex-column">
      {/* Modal title */}
      <div className="d-flex w-100 justify-content-between align-items-center">
        <h2 className="fw-bolder mb-0 text-white">
          {intl.formatMessage({ id: "Fields.ModalDeleteTitleBookingRule" })}
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
      <div className="w-100 text-white">
        <table className="table mt-0" style={{ lineHeight: "0.5" }}>
          <tbody>
            <tr
              style={{
                lineHeight: "1.5",
              }}
            >
              <td className="fw-bold">
                {intl.formatMessage({
                  id: "Fields.Title",
                })}
              </td>
              <td>: {delParsedData?.title}</td>
            </tr>
            {delParsedData?.accounts.map((account: any, index: number) => (
              <tr key={index}>
                <td className="fw-bold">
                  {index > 0
                    ? " "
                    : intl.formatMessage({
                        id: "Fields.MainAccountNumber",
                      })}
                </td>
                <td className="text-break">: {account?.accountNumber}</td>
              </tr>
            ))}
            {delParsedData?.holders.map((holder: any, index: number) => (
              <tr
                key={index}
                style={{
                  lineHeight: "1.5",
                }}
              >
                <td className="fw-bold">
                  {index > 0
                    ? " "
                    : intl.formatMessage({
                        id: "Fields.CounterPartyAccountNumber",
                      })}
                </td>
                <td>: {holder?.accountNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export { BookingDeleteModalHeader };
