import { FC } from "react";
import { KTIcon } from "../../../../../../../_metronic/helpers";
import { useIntl } from "react-intl";
import { useAuth } from "../../../../../auth";
import Tippy from "@tippyjs/react";

interface props {
  setShowInvoices: (type: boolean) => void;
  setShowCosts: (type: boolean) => void;
  setBookingModalOpen: (type: boolean) => void;
  setCostModalOpen: (type: boolean) => void;
  setHasMutation: (type: boolean) => void;
}

const DrawerProcess = ({
  setShowInvoices,
  setShowCosts,
  setBookingModalOpen,
  setCostModalOpen,
  setHasMutation,
}: props) => {
  const intl = useIntl();
  const { currentUser } = useAuth();
  const taskMessageIds = [
    "Fields.ModalBankMutationAsBooking",
    "Fields.ModalBankMutationAsCost",
    "Fields.ModalBankMutationAsCostExisting",
    "Fields.ModalBankMutationAsInvoiceExisting",
  ];
  const handleTaskClick = (msgId: string) => {
    switch (msgId) {
      case "Fields.ModalBankMutationAsBooking": {
        setBookingModalOpen(true);
        setHasMutation(true);
        break;
      }
      case "Fields.ModalBankMutationAsInvoiceExisting":
        setShowInvoices(true);
        break;
      case "Fields.ModalBankMutationAsCost":
        {
          setCostModalOpen(true);
          setHasMutation(true);
        }
        break;
      case "Fields.ModalBankMutationAsCostExisting":
        setShowCosts(true);
        break;
      default:
        console.warn("Unhandled task:", msgId);
    }
  };

  const drawerData = JSON.parse(localStorage.getItem("DrawerData")!);
  return (
    <div
      id="kt_drawer_process"
      className="bg-body"
      data-kt-drawer="true"
      data-kt-drawer-name="process"
      data-kt-drawer-activate="true"
      data-kt-drawer-overlay="true"
      data-kt-drawer-width="{default:'300px', 'md': '500px'}"
      data-kt-drawer-direction="end"
      data-kt-drawer-toggle="#kt_drawer_process_toggle"
      data-kt-drawer-close="#kt_drawer_process_close"
    >
      <div className="card w-100 rounded-0" id="kt_drawer_process_messenger">
        <div
          className="card-header rounded-0 d-flex flex-column bg-primary text-white"
          id="kt_drawer_process_messenger_header"
        >
          <div className="d-flex justify-content-between">
            <div className="card-title">
              <h2 className="text-white">
                {intl.formatMessage({
                  id: "Fields.ModalBankMutationAsBooking",
                })}
              </h2>
            </div>

            <div className="card-toolbar">
              <div className="btn btn-sm btn-icon" id="kt_drawer_process_close">
                <KTIcon iconName="cross" className="fs-2 text-white" />
              </div>
            </div>
          </div>
          <div className="w-100" style={{ lineHeight: "0.5" }}>
            <table className="table mt-0">
              <tbody>
                <tr className="my-0">
                  <td className="fw-bold">
                    {intl.formatMessage({ id: "Fields.TransactionDate" })}
                  </td>
                  <td>: {drawerData?.transactionDate}</td>
                </tr>
                {drawerData?.counterAccount?.number && (
                  <tr>
                    <td className="fw-bold">
                      {intl.formatMessage({
                        id: "Fields.CounterPartyAccountHolderId",
                      })}
                    </td>
                    <td>: {drawerData?.counterAccount?.number}</td>
                  </tr>
                )}
                <tr>
                  <td className="fw-bold">
                    {drawerData?.counterAccount?.number
                      ? ""
                      : intl.formatMessage({
                          id: "Fields.CounterPartyAccountHolderId",
                        })}
                  </td>
                  <td>: {drawerData?.counterAccount?.name}</td>
                </tr>
                <tr>
                  <td className="fw-bold">
                    {intl.formatMessage({ id: "Fields.Amount" })}
                  </td>
                  <td>
                    :{" "}
                    {
                      currentUser?.result.activeCompanyDefaults.defaultValuta
                        .sign
                    }{" "}
                    {drawerData?.amount?.toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td className="fw-bold">
                    {intl.formatMessage({ id: "Fields.Reference" })}
                  </td>
                  <td>
                    :{" "}
                    {drawerData?.reference ? (
                      drawerData.reference.length > 35 ? (
                        <Tippy
                          content={
                            <span
                              dangerouslySetInnerHTML={{
                                __html: drawerData.reference,
                              }}
                            />
                          }
                        >
                          <span>{drawerData.reference.slice(0, 30)}...</span>
                        </Tippy>
                      ) : (
                        <span
                          dangerouslySetInnerHTML={{
                            __html: drawerData.reference.slice(0, 35),
                          }}
                        />
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
                  <td>
                    :{" "}
                    {drawerData?.document ? (
                      drawerData.document.length > 35 ? (
                        <Tippy
                          content={
                            <span
                              dangerouslySetInnerHTML={{
                                __html: drawerData.document,
                              }}
                            />
                          }
                        >
                          <span>{drawerData.document.slice(0, 35)}...</span>
                        </Tippy>
                      ) : (
                        <span
                          dangerouslySetInnerHTML={{
                            __html: drawerData.document.slice(0, 35),
                          }}
                        />
                      )
                    ) : (
                      <span>&nbsp;</span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4 p-7">
          {taskMessageIds.map((msgId, index) => (
            <div
              key={index}
              className="alert alert-dismissible bg-light-secondary d-flex align-items-center justify-content-between flex-column flex-sm-row p-5 mb-10 cursor-pointer"
              style={{ borderLeft: "6px solid var(--bs-secondary)" }}
              onClick={() => handleTaskClick(msgId)}
              id="kt_drawer_process_toggle"
            >
              <div className="d-flex flex-column pe-0 pe-sm-10 text-dark">
                {intl.formatMessage({ id: msgId })}
              </div>
              <i className="ki-duotone ki-double-right fs-2hx text-primary mb-5 mb-sm-0">
                <span className="path1"></span>
                <span className="path2"></span>
              </i>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export { DrawerProcess };
