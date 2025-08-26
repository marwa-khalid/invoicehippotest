import { FC, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { FormikProps } from "formik";
import "quill/dist/quill.snow.css";
import Flatpickr from "react-flatpickr";
import { ClientAddModal } from "../../../../../client/client-search/client-add-modal/ClientAddModal";
import { ClientSearch } from "../../../../../generic/ClientSearch";
import { ClientAddButtons } from "../../../../../generic/ClientAddButtons";
import enums from "../../../../../../../_metronic/i18n/messages/invoicehippo.enums.json";
import {
  AccountsResult,
  BookingRuleModel,
  BookingRuleResult,
  CounterPartyAccounts,
} from "../core/_models";
import ReactQuill from "react-quill-new";
import Select from "react-select";
import { getEnumOptions } from "../../../../../../helpers/intlHelper";
type Props = {
  formik: FormikProps<BookingRuleResult>;
  financialAccounts: AccountsResult[];
  counterPartyAccounts: CounterPartyAccounts[];
};

const RuleAddStep1: FC<Props> = ({
  formik,
  financialAccounts,
  counterPartyAccounts,
}) => {
  const intl = useIntl();
  const [clientModal, setClientModalOpen] = useState<boolean>(false);
  const [editModalId, setEditModalId] = useState<number>(0);
  const [clientSearch, setClientSearch] = useState<any>();
  const accounts = financialAccounts.map((account) => {
    return { value: account.id, label: account.title };
  });
  const counterAccounts = counterPartyAccounts.map((account) => {
    return { value: account.id, label: account.displayName };
  });

  useEffect(() => {
    const updateClient = async () => {
      const clientResponse = JSON.parse(
        localStorage.getItem("clientResponse")!
      );
      if (clientResponse !== null) {
        formik.setFieldValue("header.clientId", clientResponse.id);

        formik.setFieldValue(
          "header.clientDisplayName",
          clientResponse.customerNr + " - " + clientResponse.businessName
        );
      }
    };
    updateClient();
  }, [clientModal, clientSearch]);

  const handleAccountChange = (selectedOptions: any) => {
    const selectedAccounts =
      selectedOptions?.map((opt: any) => ({
        id: opt.value,
        accountNumber: opt.label,
        accountName: opt.label,
      })) || [];

    formik.setFieldValue("associatedAccounts", selectedAccounts);
  };
  const handleCounterAccountChange = (selectedOptions: any) => {
    const selectedAccounts =
      selectedOptions?.map((opt: any) => ({
        id: opt.value,
        accountNumber: opt.label,
        accountName: opt.label,
      })) || [];
    formik.setFieldValue("associatedAccountHolders", selectedAccounts);
  };
  const handleBalanceTypeChange = (selectedOption: any) => {
    formik.setFieldValue(
      "balanceType",
      selectedOption ? selectedOption.value : null
    );
  };

  return (
    <>
      <div className="modal-body">
        <form className="form p-4" noValidate>
          <div className="row d-flex mb-5">
            <div className="col-5">
              <label className="required fw-bold fs-6 mb-3">
                {intl.formatMessage({ id: "Fields.FinancialAccountId" })}
              </label>
              <Select
                inputId="accountType"
                className="react-select-styled flex flex-wrap"
                isClearable
                menuPlacement="bottom"
                placeholder={intl.formatMessage({
                  id: "Fields.SelectOptionDefaultFinancialAccount",
                })}
                value={accounts.filter((option) =>
                  formik.values.associatedAccounts?.some(
                    (selected: any) => selected.id === option.value
                  )
                )}
                onChange={handleAccountChange}
                options={accounts}
                isMulti
              />
            </div>
            <div className="col-5">
              <label className="required fw-bold fs-6 mb-3">
                {intl.formatMessage({
                  id: "Fields.CounterPartyAccountHolderId",
                })}
              </label>
              <Select
                inputId="accountType"
                className="react-select-styled flex flex-wrap"
                isClearable
                menuPlacement="bottom"
                placeholder={intl.formatMessage({
                  id: "Fields.SelectOptionDefaultFinancialAccount",
                })}
                value={counterAccounts.filter((option) =>
                  formik.values.associatedAccountHolders?.some(
                    (selected: any) => selected.id === option.value
                  )
                )}
                onChange={handleCounterAccountChange}
                options={counterAccounts}
                isMulti
              />
            </div>

            <div className="col-2">
              <label className="fw-bold fs-6 mb-3">
                {intl.formatMessage({ id: "Fields.DebetAmount" })}-/
                {intl.formatMessage({ id: "Fields.CreditAmount" })}
              </label>
              <Select
                className="react-select-styled flex flex-wrap"
                isClearable
                inputId="balanceType"
                menuPlacement="top"
                placeholder={intl.formatMessage({
                  id: "Fields.SelectOptionBalanceType",
                })}
                onChange={handleBalanceTypeChange}
                value={getEnumOptions(enums.TransactionBalanceTypes, intl).find(
                  (option) => formik.values.balanceType === option.value
                )}
                options={getEnumOptions(enums.TransactionBalanceTypes, intl)}
              />
            </div>
          </div>

          <div className="row mb-5">
            <div className="col-5">
              <label className="fw-bold fs-6 mb-3" htmlFor="filterByTerm1">
                {intl.formatMessage({ id: "Fields.FilterByTerm" })}
              </label>
              <Select
                className="react-select-styled flex flex-wrap"
                isClearable
                inputId="filterByTerm1"
                menuPlacement="top"
                placeholder={intl.formatMessage({
                  id: "Fields.SelectOptionBalanceType",
                })}
                {...formik.getFieldProps("filterByTextType1")}
                value={getEnumOptions(enums.RoutingTextFilterTypes, intl).find(
                  (option) => formik.values.filterByTextType1 === option.value
                )}
                options={getEnumOptions(enums.RoutingTextFilterTypes, intl)}
              />
            </div>
            <div className="col-7">
              <label className="required fw-bold fs-6 mb-3">
                {intl.formatMessage({ id: "Fields.FilterTerm" })}
              </label>
              <textarea
                className="form-control"
                rows={1}
                placeholder="Jouw tekst hier..."
                {...formik.getFieldProps("filterTerm1")}
                value={formik.values.filterTerm1 || ""}
              />
            </div>
          </div>
          <div className="row mb-5">
            <div className="col-5">
              <label className="fw-bold fs-6 mb-3" htmlFor="filterByTerm2">
                {intl.formatMessage({ id: "Fields.FilterByTerm" })}
              </label>
              <Select
                className="react-select-styled flex flex-wrap"
                isClearable
                inputId="filterByTerm2"
                menuPlacement="top"
                placeholder={intl.formatMessage({
                  id: "Fields.SelectOptionBalanceType",
                })}
                {...formik.getFieldProps("filterByTextType2")}
                value={getEnumOptions(enums.RoutingTextFilterTypes, intl).find(
                  (option) => formik.values.filterByTextType2 === option.value
                )}
                options={getEnumOptions(enums.RoutingTextFilterTypes, intl)}
              />
            </div>
            <div className="col-7">
              <label className="required fw-bold fs-6 mb-3">
                {intl.formatMessage({ id: "Fields.FilterTerm" })}
              </label>
              <textarea
                className="form-control"
                rows={1}
                placeholder="Jouw tekst hier..."
                {...formik.getFieldProps("filterTerm2")}
                value={formik.values.filterTerm2 || ""}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-5">
              <label className="fw-bold fs-6 mb-3" htmlFor="amountTypeFilter">
                {intl.formatMessage({ id: "Fields.FilterByAmountType" })}
              </label>
              <Select
                className="react-select-styled flex flex-wrap"
                isClearable
                inputId="amountTypeFilter"
                menuPlacement="top"
                placeholder={intl.formatMessage({
                  id: "Fields.SelectOptionBalanceType",
                })}
                {...formik.getFieldProps("filterByAmountType")}
                value={getEnumOptions(
                  enums.RoutingAmountFilterTypes,
                  intl
                ).find(
                  (option) => formik.values.filterByAmountType === option.value
                )}
                options={getEnumOptions(enums.RoutingAmountFilterTypes, intl)}
              />
            </div>
            <div className="col-3">
              <label className="required fw-bold fs-6 mb-3">
                {intl.formatMessage({ id: "Fields.FilterAmount" })}
              </label>
              <input
                type="number"
                className="form-control form-control-solid"
                {...formik.getFieldProps("filterAmount")}
                value={formik.values.filterAmount || 0}
              />
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export { RuleAddStep1 };
