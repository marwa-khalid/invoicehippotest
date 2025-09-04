import { KTIcon } from "../../../../../../../_metronic/helpers";
import { useIntl } from "react-intl";
import { useAuth } from "../../../../../auth";
import Tippy from "@tippyjs/react";

interface ComponentProps {
  setUnlinkModalOpen: (type: boolean) => void;
  parsedData: any;
}

const TransactionUnlinkModalHeader = ({
  setUnlinkModalOpen,
  parsedData,
}: ComponentProps) => {
  const intl = useIntl();
  const { currentUser } = useAuth();
  return (
    <div className="modal-header bg-danger d-flex flex-column">
      {/* Modal title */}
      <div className="d-flex w-100 justify-content-between align-items-center">
        <h2 className="fw-bolder mb-0 text-white">
          {intl.formatMessage({ id: "Fields.ActionUnlinkMutation" })}
        </h2>
        <div
          className="btn btn-icon btn-sm btn-active-icon-primary"
          data-kt-users-modal-action="close"
          onClick={() => {
            setUnlinkModalOpen(false);
            localStorage.removeItem("DrawerData");
          }}
          style={{ cursor: "pointer" }}
        >
          <KTIcon iconName="cross" className="fs-1 text-white" />
        </div>
      </div>

      {/* New table below the title */}
      <div className="w-100" style={{ lineHeight: "0.5" }}>
        <table className="table mt-0 text-white">
          <tbody>
            <tr className="my-0">
              <td className="fw-bold">
                {intl.formatMessage({ id: "Fields.TransactionDate" })}
              </td>
              <td>: {parsedData?.transactionDate}</td>
            </tr>
            <tr>
              <td className="fw-bold">
                {intl.formatMessage({
                  id: "Fields.CounterPartyAccountHolderId",
                })}
              </td>
              <td>: {parsedData?.counterAccount?.number}</td>
            </tr>
            <tr>
              <td className="fw-bold"></td>
              <td>: {parsedData?.counterAccount?.name}</td>
            </tr>
            <tr>
              <td className="fw-bold">
                {intl.formatMessage({ id: "Fields.Amount" })}
              </td>
              <td>
                : {currentUser?.result.activeCompanyDefaults.defaultValuta.sign}{" "}
                {parsedData?.amount?.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td className="fw-bold">
                {intl.formatMessage({ id: "Fields.Reference" })}
              </td>
              <td>
                :{" "}
                {parsedData?.reference ? (
                  parsedData.reference.length > 35 ? (
                    <Tippy content={parsedData.reference}>
                      <span>{parsedData.reference.slice(0, 35)}&hellip;</span>
                    </Tippy>
                  ) : (
                    <span>{parsedData.reference}</span>
                  )
                ) : (
                  <span>&nbsp;</span>
                )}
              </td>
            </tr>

            <tr>
              <td className="fw-bold">
                {intl.formatMessage({ id: "Fields.ImportResourceFile" })}
              </td>
              <td>: {parsedData?.document}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export { TransactionUnlinkModalHeader };
