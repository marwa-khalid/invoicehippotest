import { useEffect, useState } from "react";
import { AutoProcessModalHeader } from "./AutoProcessModalHeader";
import { AutoProcessModalFooter } from "./AutoProcessModalFooter";
import { useIntl } from "react-intl";
import Select from "react-select";
import { AccountsResult } from "../core/_models";
interface ComponentProps {
  itemsCount: number;
  setDeleteModalOpen: (type: boolean) => void;
  setRefresh: (type: boolean) => void;
  refresh: boolean;
  financialAccounts: AccountsResult[];
}
const AutoProcessModal = ({
  itemsCount,
  setDeleteModalOpen,
  setRefresh,
  refresh,
  financialAccounts,
}: ComponentProps) => {
  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);
  const intl = useIntl();
  const accounts = financialAccounts.map((account) => {
    return { value: account.id, label: account.title };
  });
  const [financialAccountId, setFinancialAccountId] = useState<number | null>(
    null
  );
  const handleAccountChange = (selectedOption: any) => {
    setFinancialAccountId(selectedOption ? selectedOption.value : null);
  };
  return (
    <>
      <div
        className="modal fade show d-block"
        id="kt_modal_add_user"
        role="dialog"
        tabIndex={-1}
        aria-modal="true"
      >
        {/* begin::Modal dialog */}
        <div className="modal-dialog modal-dialog-centered">
          {/* begin::Modal content */}
          <div className="modal-content">
            <AutoProcessModalHeader
              setDeleteModalOpen={setDeleteModalOpen}
              itemsCount={itemsCount}
            />
            {/* begin::Modal body */}
            <div className="modal-body p-10">
              <div className="row d-flex form-wrapper bg-secondary p-5 rounded">
                <div className="col-2">
                  <i className="ki-duotone ki-information-4 fs-3x text-center text-primary">
                    <span className="path1"></span>
                    <span className="path2"></span>
                    <span className="path3"></span>
                  </i>
                </div>
                <span
                  className="col-10"
                  dangerouslySetInnerHTML={{
                    __html: intl.formatMessage({
                      id: "Fields.TransactionExecuteAutoRouteInfo",
                    }),
                  }}
                />
              </div>
              <div className="separator my-10"></div>
              <div className="row d-flex form-wrapper bg-secondary p-5 rounded align-items-center mb-5">
                <div className="col-2">
                  <i className="ki-duotone ki-information-4 fs-3x text-center text-primary">
                    <span className="path1"></span>
                    <span className="path2"></span>
                    <span className="path3"></span>
                  </i>
                </div>
                <span className="col-10">
                  Please select a financial account if you want to only process
                  automated records for the selected financial accounts, so that
                  we dont process everything at once
                </span>
              </div>
              <div>
                <label className="fw-bold form-label" htmlFor="accountType">
                  {intl.formatMessage({
                    id: "Fields.SelectOptionDefaultFinancialAccount",
                  })}
                </label>
                <Select
                  inputId="accountType"
                  // isMulti
                  className="react-select-styled flex flex-wrap"
                  isClearable
                  menuPlacement="top"
                  placeholder={intl.formatMessage({
                    id: "Fields.SelectOptionDefaultFinancialAccount",
                  })}
                  value={accounts.filter(
                    (option) => financialAccountId === option.value
                  )}
                  onChange={handleAccountChange}
                  options={accounts}
                />
              </div>
            </div>

            {/* end::Modal body */}
            <AutoProcessModalFooter
              setDeleteModalOpen={setDeleteModalOpen}
              setRefresh={setRefresh}
              refresh={refresh}
              financialAccountId={financialAccountId}
            />
          </div>
          {/* end::Modal content */}
        </div>
        {/* end::Modal dialog */}
      </div>
      {/* begin::Modal Backdrop */}
      <div className="modal-backdrop fade show"></div>
      {/* end::Modal Backdrop */}
    </>
  );
};

export { AutoProcessModal };
