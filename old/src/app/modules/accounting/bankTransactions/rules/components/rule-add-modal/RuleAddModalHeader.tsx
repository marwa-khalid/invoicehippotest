import { KTIcon } from "../../../../../../../_metronic/helpers";
import { useIntl } from "react-intl";
import { FormikProps } from "formik";
import { BookingRuleResult } from "../core/_models";
import { useAuth } from "../../../../../auth";
import Tippy from "@tippyjs/react";
import { useEffect, useState } from "react";

interface ComponentProps {
  setAddModalOpen: (type: boolean) => void;
  formik: FormikProps<BookingRuleResult>;
  editModalId: number;
  hasMutation: boolean;
}

const RuleAddModalHeader = ({
  setAddModalOpen,
  formik,
  editModalId,
  hasMutation,
}: ComponentProps) => {
  const intl = useIntl();

  const headerData = JSON.parse(localStorage.getItem("ModalData")!);
  const { currentUser } = useAuth();
  const [isExpanded, setIsExpanded] = useState<boolean>();
  return (
    <div className="modal-header d-flex flex-column bg-primary pb-3">
      <div className="d-flex flex-column align-items-center w-100">
        <div className="d-flex justify-content-between align-items-center w-100 mt-2">
          <div>
            <h2 className="fw-bold text-white">
              {editModalId != 0
                ? intl.formatMessage({
                    id: "Fields.ModalTitleEditBookingRule",
                  })
                : intl.formatMessage({
                    id: "Fields.ModalTitleNewBookingRule",
                  })}
            </h2>
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

        <div className="d-flex-justify-content-between w-100">
          {/* <div className="d-flex justify-content-between align-items-start w-100 text-white mt-2">
           
            <div className="d-flex flex-column">
              <div className="d-flex align-items-center gap-2">
                {intl.formatMessage({
                  id: "Fields.Title",
                })}
                : {headerData?.title}
              </div>
            </div>

           
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
          </div> */}
          {/* Conditionally show the table below */}
          {/* {isExpanded && ( */}
          {editModalId !== 0 && (
            <div className="w-100 text-white">
              <table className="table mt-0" style={{ lineHeight: "0.5" }}>
                <tbody>
                  <tr>
                    <td className="fw-bold">
                      {intl.formatMessage({
                        id: "Fields.Title",
                      })}
                    </td>
                    <td>: {headerData?.title}</td>
                  </tr>
                  {headerData?.accounts.map((account: any, index: number) => (
                    <tr key={index}>
                      <td className="fw-bold">
                        {index > 0
                          ? " "
                          : intl.formatMessage({
                              id: "Fields.MainAccountNumber",
                            })}
                      </td>
                      <td>: {account?.accountNumber}</td>
                    </tr>
                  ))}
                  {headerData?.holders.map((holder: any, index: number) => (
                    <tr>
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
          )}
          {/* )} */}
        </div>
      </div>

      <div className="separator border-white mt-3"></div>
    </div>
  );
};

export { RuleAddModalHeader };
