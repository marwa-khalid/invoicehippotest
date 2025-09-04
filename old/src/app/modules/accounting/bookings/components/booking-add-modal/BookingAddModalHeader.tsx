import { KTIcon } from "../../../../../../_metronic/helpers";
import { useIntl } from "react-intl";
import { FormikProps } from "formik";
import { BookingPostResult } from "../core/_models";
import { useAuth } from "../../../../auth";
import Tippy from "@tippyjs/react";
import { useEffect, useState } from "react";

interface ComponentProps {
  setAddModalOpen: (type: boolean) => void;
  formik: FormikProps<BookingPostResult>;
  editModalId: number;
  hasMutation: boolean;
}

const BookingAddModalHeader = ({
  setAddModalOpen,
  formik,
  editModalId,
  hasMutation,
}: ComponentProps) => {
  const intl = useIntl();
  const drawerData = JSON.parse(localStorage.getItem("DrawerData")!);
  const { currentUser } = useAuth();
  const [isExpanded, setIsExpanded] = useState<boolean>();
  return (
    <div className="modal-header d-flex flex-column bg-primary pb-3">
      <div className="d-flex flex-column w-100">
        <div className="d-flex justify-content-between align-items-center w-100 mt-2">
          {hasMutation ? (
            <h2 className="fw-bold text-white mt-6">
              {intl.formatMessage({
                id: "Fields.ModalBankMutationAsBooking",
              })}
            </h2>
          ) : (
            <div>
              <span className="text-secondary">
                {editModalId != 0
                  ? intl
                      .formatMessage({
                        id: "Fields.PageBookingDetailTitleEdit",
                      })
                      .replace("{0}", formik.values.voucherNumber)
                  : intl.formatMessage({
                      id: "Fields.PageBookingDetailTitleNew",
                    })}
              </span>
              <h2 className="fw-bold text-white">
                {editModalId != 0
                  ? intl.formatMessage({
                      id: "Fields.PageBookingDetailSubTitleEdit",
                    })
                  : intl.formatMessage({
                      id: "Fields.PageBookingDetailSubTitleNew",
                    })}
              </h2>
            </div>
          )}
          {/* Close Button */}
          <div
            className="btn btn-icon btn-sm btn-active-icon-primary"
            onClick={() => setAddModalOpen(false)}
            style={{ cursor: "pointer" }}
          >
            <KTIcon iconName="cross" className="fs-2x text-white mt-2" />
          </div>
        </div>
        {hasMutation && <div className="separator border-light my-3"></div>}
        {hasMutation && (
          <div className="d-flex-justify-content-between w-100">
            <div className="d-flex justify-content-between align-items-start w-100 text-white mt-2">
              {/* Left side: Calendar + Date + Description */}
              <div className="d-flex flex-column">
                <div className="d-flex align-items-center gap-2">
                  <i className="ki-duotone ki-calendar-2 fs-3x text-white">
                    <span className="path1"></span>
                    <span className="path2"></span>
                    <span className="path3"></span>
                    <span className="path4"></span>
                    <span className="path5"></span>
                  </i>
                  <span className="d-flex flex-column fw-bold">
                    {drawerData?.transactionDate || "-"}
                    <small
                      className="mt-1"
                      dangerouslySetInnerHTML={{
                        __html: drawerData?.reference || "-",
                      }}
                    />
                  </span>
                </div>
              </div>

              {/* Right side: Toggle button */}
              <div
                className="cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? (
                  <i className="ki-duotone ki-double-up fs-1 text-white me-2">
                    <span className="path1"></span>
                    <span className="path2"></span>
                    <span className="path3"></span>
                  </i>
                ) : (
                  <i className="ki-duotone ki-double-down fs-1 text-white me-2">
                    <span className="path1"></span>
                    <span className="path2"></span>
                    <span className="path3"></span>
                  </i>
                )}
              </div>
            </div>

            {/* Conditionally show the table below */}
            {isExpanded && (
              <div className="w-100 text-white mt-3">
                <table className="table mt-0" style={{ lineHeight: "0.5" }}>
                  <tbody>
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
                          currentUser?.result.activeCompanyDefaults
                            .defaultValuta.sign
                        }{" "}
                        {drawerData?.amount.toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td className="fw-bold">
                        {intl.formatMessage({
                          id: "Fields.ImportResourceFile",
                        })}
                      </td>
                      <td>: {drawerData?.document}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
            <div
              className="ribbon ribbon-end ribbon-clip position-absolute cursor-pointer"
              style={{
                top: "10px",
                right: "0px",
                height: "30px",
                width: "100px",
              }}
            >
              <div className="ribbon-label fw-bold">
                {!drawerData?.isDebet && "-"}
                {currentUser?.result.activeCompanyDefaults.defaultValuta.sign}
                {drawerData?.amount.toFixed(2)}
                <span className={`ribbon-inner bg-dark`}></span>
              </div>
            </div>

            <div
              className="ribbon ribbon-start ribbon-clip position-absolute"
              style={{
                left: "0px",
                top: "10px", // Keep it centered
                whiteSpace: "nowrap",
                height: "30px",
              }}
            >
              <div className="ribbon-label fw-bold">
                <span className="ribbon-inner bg-dark" />
                {drawerData?.accountInfo?.name}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Ribbon at the right end of the header */}
      {formik.values.voucherNumber && (
        <div className="ribbon ribbon-end position-absolute top-20 end-0 w-300px">
          <div className="ribbon-label fw-bold bg-secondary">
            <small className="rounded p-0 text-dark fw-bold">
              {formik.values.voucherNumber}
            </small>
          </div>
        </div>
      )}

      <div className="separator border-white mt-3"></div>
    </div>
  );
};

export { BookingAddModalHeader };
