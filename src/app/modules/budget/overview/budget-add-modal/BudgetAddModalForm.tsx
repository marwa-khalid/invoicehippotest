import { useIntl } from "react-intl";
import { FormikProps } from "formik";
import ReactQuill from "react-quill-new";
import { useEffect, useState } from "react";
import Select from "react-select";
import { KTIcon } from "../../../../../_metronic/helpers";
import { BudgetGroupAddModal } from "../../../admin-settings/budgetgroups-list/budgetgroups-add-modal/BudgetGroupAddModal";
import { LedgerAddModal } from "../../../admin-settings/ledgeraccounts-list/ledger-add-modal/LedgerAddModal";
import { BudgetPost } from "../core/_models";
import { getBudgetGroups } from "../../../admin-settings/budgetgroups-list/core/_requests";
import { getLedgerAccountsForFilter } from "../../../admin-settings/ledgeraccounts-list/core/_requests";
import clsx from "clsx";
import * as Tooltip from "@radix-ui/react-tooltip";

type Props = {
  formik: FormikProps<BudgetPost>;
  refresh: boolean;
  setRefresh: (type: boolean) => void;
};

const BudgetAddModalForm = ({ formik, refresh, setRefresh }: Props) => {
  const intl = useIntl();
  const [ledgers, setLedgers] = useState<any>([]);
  const [budgetGroups, setBudgetGroups] = useState<any>([]);

  const [counter, setCounter] = useState<boolean>(false);
  const [counter1, setCounter1] = useState<boolean>(false);
  const fetchLedgers = async () => {
    const response = await getLedgerAccountsForFilter();
    if (response.isValid) {
      const groupByLedgerSubType = (items: any[], groupTitle: string) => {
        const groups: Record<number, { label: string; options: any[] }> = {};
        items.forEach((item) => {
          const subType = item.ledgerSubType;
          if (!groups[subType.value]) {
            groups[subType.value] = {
              label: `${groupTitle} - ${subType.description}`,
              options: [],
            };
          }
          groups[subType.value].options.push({
            value: item.id,
            label: item.title,
            bearingValue: item.bearingType.value,
          });
        });
        return Object.values(groups);
      };

      const groupedOptions = [
        ...groupByLedgerSubType(
          response.result.balanceActivaItems,
          response.result.balanceActivaItemsGroupTitle
        ),
        ...groupByLedgerSubType(
          response.result.balancePassivaItems,
          response.result.balancePassivaItemsGroupTitle
        ),
        ...groupByLedgerSubType(
          response.result.resultItems,
          response.result.resultItemsGroupTitle
        ),
      ];
      setLedgers(groupedOptions);
    }
  };
  useEffect(() => {
    if (ledgers?.length === 0 || counter) {
      fetchLedgers();
    }
  }, []);

  const fetchBudgetGroups = async () => {
    const response = await getBudgetGroups("", 1);
    if (response.isValid) {
      setBudgetGroups(response.result);
    }
  };
  useEffect(() => {
    if (budgetGroups?.length === 0 || counter1) {
      fetchBudgetGroups();
    }
  }, []);

  const handleQuillChange = (content: string) => {
    formik.setFieldValue("description", content);
  };

  const [ledgerModalOpen, setLedgerModalOpen] = useState(false);
  const [budgetGroupModalOpen, setBudgetGroupModalOpen] = useState(false);
  const openBudgetGroupModal = () => {
    setBudgetGroupModalOpen(true);
    setCounter1(true);
  };

  const closeBudgetModal = () => {
    setBudgetGroupModalOpen(false);
    fetchBudgetGroups();
  };
  const closeLedgerModal = () => {
    setLedgerModalOpen(false);
    fetchLedgers();
  };

  // useEffect(() => {
  //   if (counter) {
  //     // find ledger with highest value
  //     const maxLedger = ledgers.reduce((prev: any, curr: any) =>
  //       curr.value > prev.value ? curr : prev
  //     );
  //     formik.setFieldValue("pricing.ledgerAccountId", maxLedger.value);
  //     setCounter(false);
  //   }
  // }, [ledgers]);
  const customSelectStyles = {
    control: (provided: any) => ({
      ...provided,
      minHeight: "calc(1.9rem + 1.3rem + 2px)", // Matches Bootstrap input height
    }),
  };
  useEffect(() => {
    if (counter1) {
      // find ledger with highest value
      const maxBudgetGroup = budgetGroups
        ?.map((item: any) => ({
          value: item.id,
          label: item.title,
        }))
        .reduce((prev: any, curr: any) =>
          curr.value > prev.value ? curr : prev
        );
      formik.setFieldValue("budgetGroupId", maxBudgetGroup.value);
      setCounter1(false);
    }
  }, [budgetGroups]);

  return (
    <>
      <form>
        <div className="row d-flex mb-5">
          <div className="fv-row col-6">
            <label className="required fw-bold mb-3 fs-6" htmlFor="title">
              {intl.formatMessage({
                id: "Fields.Title",
              })}
            </label>
            <input
              type="text"
              id="title"
              {...formik.getFieldProps("title")}
              className={clsx(
                "form-control form-control-solid",
                { "is-invalid": formik.touched.title && formik.errors.title },
                { "is-valid": formik.touched.title && !formik.errors.title }
              )}
              placeholder={intl.formatMessage({
                id: "Fields.Title",
              })}
            />
            {formik.touched.title && formik.errors.title && (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: formik.errors.title,
                    }}
                    role="alert"
                  />
                </div>
              </div>
            )}
          </div>
          <div className="fv-row col-6">
            <div className="d-flex justify-content-between">
              <label
                className="required fw-bold fs-6 mb-3"
                htmlFor="budgetGroup"
              >
                {intl.formatMessage({
                  id: "Menu.BudgetGroups",
                })}
              </label>

              <div className="cursor-pointer" onClick={openBudgetGroupModal}>
                <Tooltip.Provider delayDuration={0}>
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                    <span tabIndex={0}>
                      <KTIcon iconName="plus" className="fs-2 text-primary" />
                      </span>
                    </Tooltip.Trigger>

                    <Tooltip.Portal>
                      <Tooltip.Content side="top" className="app-tooltip">
                        {intl.formatMessage({
                          id: "Fields.ToolTipNew",
                        })}
                        <Tooltip.Arrow className="app-tooltip-arrow" />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                </Tooltip.Provider>
              </div>
            </div>
            <Select
              value={budgetGroups
                ?.map((item: any) => ({
                  value: item.id,
                  label: item.title,
                }))
                .find(
                  (budgetGroups: any) =>
                    budgetGroups.value === formik.values.budgetGroupId
                )}
              hideSelectedOptions={true}
              styles={customSelectStyles}
              inputId="budgetGroup"
              options={budgetGroups.map((item: any) => ({
                value: item.id,
                label: item.title,
              }))}
              placeholder={intl.formatMessage({
                id: "Fields.SelectOptionDefaultBudgetGroup",
              })}
              isClearable
              onChange={(e) => formik.setFieldValue("budgetGroupId", e?.value)}
              onBlur={() => formik.setFieldTouched("budgetGroupId", true)}
            />
            {formik.touched.budgetGroupId && formik.errors.budgetGroupId && (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: formik.errors.budgetGroupId,
                    }}
                    role="alert"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="row d-flex mb-5">
          <label className="fw-bold fs-6 mb-3" htmlFor="linkedledgers">
            {intl.formatMessage({
              id: "Fields.LinkedLedgerAccounts",
            })}
          </label>
          <Select
            isMulti
            inputId="linkedledgers"
            options={ledgers}
            value={ledgers
              .flatMap((g: any) => g.options)
              .filter((o: any) =>
                formik.values.relatedLedgerAccounts?.includes(o?.value)
              )}
            placeholder={intl.formatMessage({
              id: "Fields.SelectOptionDefaultLedgerAccount",
            })}
            onChange={(selected: any) => {
              if (selected && selected.length > 5) {
                // keep only the first 5 selections
                selected = selected.slice(0, 5);
              }
              formik.setFieldValue(
                "relatedLedgerAccounts",
                selected ? selected.map((s: any) => s.value) : []
              );
            }}
            // onBlur={() => formik.setFieldTouched("relatedLedgerAccounts", true)}
          />

          {formik.values.relatedLedgerAccounts.length === 5 && (
            <div className="fv-plugins-message-container text-end mt-2">
              <div className="text-warning">
                <span
                  dangerouslySetInnerHTML={{
                    __html: intl.formatMessage({
                      id: "Fields.LinkedLedgerAccountsComments",
                    }),
                  }}
                  role="alert"
                />
              </div>
            </div>
          )}
        </div>

        <div className="row d-flex mb-5">
          <span className="fw-bold fs-6 mb-3">
            {intl.formatMessage({
              id: "Fields.Description",
            })}
          </span>
          <ReactQuill
            theme="snow"
            placeholder="Jouw tekst hier..."
            style={{ height: "200px" }}
            onChange={(content) => handleQuillChange(content)}
            value={formik.values.description || ""}
          />
        </div>
      </form>
      {budgetGroupModalOpen && (
        <BudgetGroupAddModal
          setRefresh={setRefresh}
          setAddModalOpen={closeBudgetModal}
          editModalId={0}
          refresh={refresh}
        />
      )}

      {ledgerModalOpen && (
        <LedgerAddModal
          setRefresh={setRefresh}
          setAddModalOpen={closeLedgerModal}
          refresh={refresh}
          fromInvoice={true}
        />
      )}
    </>
  );
};

export { BudgetAddModalForm };
