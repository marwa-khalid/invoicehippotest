import { FC, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import Select from "react-select";
import { FormikProps } from "formik";
import enums from "../../../../../../../_metronic/i18n/messages/invoicehippo.enums.json";
import { BookingRuleResult } from "../core/_models";
import { getEnumOptions } from "../../../../../../helpers/intlHelper";
import { ClientAddButtons } from "../../../../../generic/ClientAddButtons";
import { ClientAddModal } from "../../../../../client/client-search/client-add-modal/ClientAddModal";
import { ClientSearch } from "../../../../../generic/ClientSearch";
import { GroupedOption } from "../../../../../admin-settings/ledgeraccounts-list/ledger-add-modal/LedgerAddModalForm";
import { AnyAaaaRecord } from "dns";
type Props = {
  formik: FormikProps<BookingRuleResult>;
  vatTypes: any;
  setSelectedBearingTypeOption: any;
  ledgers: any;
  splitVatTypes: any;
};

const RuleAddStep2: FC<Props> = ({
  formik,
  vatTypes,
  setSelectedBearingTypeOption,
  ledgers,
  splitVatTypes,
}) => {
  const intl = useIntl();
  const [clientModal, setClientModalOpen] = useState<boolean>(false);
  const [editModalId, setEditModalId] = useState<number>(0);
  const [clientSearch, setClientSearch] = useState<any>();
  useEffect(() => {
    const updateClient = async () => {
      const clientResponse = JSON.parse(
        localStorage.getItem("clientResponse")!
      );
      if (clientResponse !== null) {
        formik.setFieldValue("clientId", clientResponse.id);

        setClientDisplayName(
          clientResponse.customerNr + " - " + clientResponse.businessName
        );
      }
    };
    updateClient();
  }, [clientModal, clientSearch]);
  const openClientModal = () => {
    setEditModalId(formik.values.clientId);
    setClientModalOpen(true);
  };
  const handleQuillChange1 = (content: string) => {
    formik.setFieldValue("comments", content); // Set statement number in formik
  };
  const openClientModalInNewMode = () => {
    setEditModalId(0);
    setClientModalOpen(true);
  };
  const [clientDisplayName, setClientDisplayName] = useState<string>("");
  const reset = () => {
    localStorage.removeItem("contactResponse");
    localStorage.removeItem("clientResponse");
    setClientDisplayName("");
    formik.setFieldValue("clientId", 0);
  };

  const handleClose = () => {
    setClientSearch(false);
  };
  const bookingTypes = getEnumOptions(
    enums.BookingRegistrationTypes,
    intl
  ).filter((type) => {
    if (type.value === 2 || type.value === 5 || type.value === 9) {
      return type;
    }
  });

  useEffect(() => {
    if (!formik.values.hasSplitting) {
      formik.setFieldValue("splitDeviation", null);
    }
  }, [formik.values.hasSplitting]);
  // const [ledgers, setLedgers] = useState<GroupedOption[]>([]);
  // useEffect(() => {
  //   const toTitleCase = (str: string) => {
  //     return str.replace(/\w\S*/g, (txt) => {
  //       return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  //     });
  //   };

  //   const transformTypes = () => {
  //     const groupMap: { [key: string]: GroupedOption } = {};

  //     enums.BearingTypes.forEach((item: any) => {
  //       const group = toTitleCase(item.Group);
  //       const subGroup = toTitleCase(item.SubGroup);
  //       const groupKey = `${group} - ${subGroup}`;

  //       if (!groupMap[groupKey]) {
  //         groupMap[groupKey] = {
  //           label: (
  //             <div>
  //               {group} - <small>{subGroup}</small>
  //             </div>
  //           ) as any,
  //           options: [],
  //         };
  //       }

  //       groupMap[groupKey].options.push({
  //         value: item.Value,
  //         label: item.LocalizationValueKey
  //           ? intl.formatMessage({
  //               id: `Enums.${item.LocalizationValueKey}`,
  //             })
  //           : item.Title,
  //         IsAccountTypeOmzet: item.IsAccountTypeOmzet,
  //         IsAccountTypeBtw: item.IsAccountTypeBtw,
  //         IsAccountTypeCost: item.IsAccountTypeCost,
  //         IsAccountTypeResult: item.IsAccountTypeResult,
  //         IsAccountTypePrive: item.IsAccountTypePrive,
  //       });
  //     });

  //     const sortedGroups = Object.values(groupMap).sort((a, b) => {
  //       const aLabel = (a.label as any).props.children[0];
  //       const bLabel = (b.label as any).props.children[0];
  //       return aLabel.localeCompare(bLabel);
  //     });

  //     setLedgers(sortedGroups);
  //   };

  //   transformTypes();
  // }, []);

  return (
    <div className="modal-body">
      <form className="form p-4" noValidate>
        <div className="row d-flex mb-5">
          <div className="col-5">
            <label className="required fw-bold fs-6 mb-3">
              {intl.formatMessage({ id: "Fields.BookingRouteType" })}
            </label>
            <Select
              inputId="accountType"
              className="react-select-styled flex flex-wrap"
              isClearable
              menuPlacement="bottom"
              placeholder={intl.formatMessage({
                id: "Fields.BookingRouteType",
              })}
              value={bookingTypes.find((option) => {
                return formik.values.bookingRouteType === option.value;
              })}
              options={bookingTypes}
              onChange={(e) =>
                formik.setFieldValue("bookingRouteType", e?.value)
              }
            />
          </div>
          <div className="col-7">
            <label className="fw-bold fs-6 mb-3">
              {intl.formatMessage({
                id: "Fields.Client",
              })}
            </label>
            <ClientAddButtons
              clientDisplayName={clientDisplayName}
              openClientModal={openClientModal}
              openClientModalInNewMode={openClientModalInNewMode}
              reset={reset}
              setClientSearch={setClientSearch}
              type="modal"
            />
          </div>
        </div>

        <div className="row mb-5">
          <div className="col-5">
            <label className="required fw-bold fs-6 mb-3" htmlFor="ledger">
              {intl.formatMessage({ id: "Fields.LedgerAccount" })}
            </label>
            <Select
              value={
                ledgers
                  .flatMap((group: any) => group.options)
                  .find(
                    (option: any) =>
                      option.value === formik.values.ledgerAccountId
                  ) || null
              }
              className="react-select-styled"
              options={ledgers}
              onChange={(e) => {
                formik.setFieldValue("ledgerAccountId", e?.value);
                setSelectedBearingTypeOption(e);
                formik.setFieldValue("btwTypeId", 0);
              }}
              inputId="ledger"
              placeholder={intl.formatMessage({
                id: "Fields.SelectOptionDefaultLedgerAccount",
              })}
            />
          </div>

          <div className="col-7">
            <label className="fw-bold fs-6 mb-3" htmlFor="vatType">
              {intl.formatMessage({ id: "Fields.VatTypeId" })}
            </label>
            <Select
              value={
                formik.values.btwTypeId
                  ? vatTypes
                      .flatMap((group: any) =>
                        group.options.map((item: any) => ({
                          value: item.value,
                          label: item.label,
                        }))
                      )
                      .find((vat: any) => {
                        return vat.value === formik.values.btwTypeId;
                      })
                  : null
              }
              className="react-select-styled"
              options={vatTypes}
              isDisabled={!formik.values.ledgerAccountId}
              isClearable
              inputId="vatType"
              onChange={(e: any) => formik.setFieldValue("btwTypeId", e?.value)}
              placeholder={intl.formatMessage({
                id: "Fields.SelectOptionNoVatType",
              })}
            />
          </div>
        </div>
        <div className="row mb-5">
          <div>
            <label className="fw-bold fs-6 mb-3">
              {intl.formatMessage({ id: "Fields.BookingDescription" })}
            </label>
            <textarea
              className="form-control"
              rows={2}
              placeholder="Jouw tekst hier..."
              {...formik.getFieldProps("bookingDescription")}
              value={formik.values.bookingDescription || ""}
            />
          </div>
        </div>
        <div className="separator my-5"></div>
        <div className="p-3">
          <div className="row d-flex form-wrapper bg-secondary p-5 rounded mb-5">
            <div className="col-1">
              <i className="ki-duotone ki-information-4 fs-3x text-center text-info">
                <span className="path1"></span>
                <span className="path2"></span>
                <span className="path3"></span>
              </i>
            </div>
            <span
              className="col-11"
              dangerouslySetInnerHTML={{
                __html: intl.formatMessage({
                  id: "Fields.UseSplittingInfo",
                }),
              }}
            />
          </div>
        </div>
        <Select
          className="react-select-styled"
          value={getEnumOptions(enums.RoutingSplitTypes, intl).find(
            (option) => formik.values.splitDeviation?.splitType === option.value
          )}
          menuPlacement="top"
          options={getEnumOptions(enums.RoutingSplitTypes, intl)}
          isClearable
          onChange={(e: any) => {
            if (!e) {
              formik.setFieldValue("hasSplitting", false);
            } else {
              formik.setFieldValue("splitDeviation.splitType", e?.value);
              formik.setFieldValue("hasSplitting", true);
            }
          }}
          placeholder={intl.formatMessage({
            id: "Fields.SplitTypeOptionNone",
          })}
        />
        {formik.values.hasSplitting && (
          <div className="row mt-5">
            <div className="col-3">
              <label className="required fw-bold fs-6 mb-3" htmlFor="ledger">
                {formik.values.splitDeviation.splitType === 1
                  ? intl.formatMessage({ id: "Fields.SplitPercentage" })
                  : intl.formatMessage({ id: "Fields.SplitAmount" })}
              </label>
              <input
                type="number"
                className="form-control form-control-solid"
                {...formik.getFieldProps("splitDeviation.splitAmount")}
              />
            </div>
            <div className="col-5">
              <label className="required fw-bold fs-6 mb-3" htmlFor="ledger">
                {intl.formatMessage({ id: "Fields.LedgerAccount" })}
              </label>
              <Select
                value={
                  ledgers
                    .flatMap((group: any) => group.options)
                    .find(
                      (option: any) =>
                        option.value ===
                        formik.values.splitDeviation.ledgerAccountId
                    ) || null
                }
                className="react-select-styled"
                options={ledgers}
                onChange={(e) => {
                  formik.setFieldValue(
                    "splitDeviation.ledgerAccountId",
                    e?.value
                  );
                  formik.setFieldValue("splitDeviation.vatTypeId", 0);
                }}
                inputId="ledger"
                placeholder={intl.formatMessage({
                  id: "Fields.SelectOptionDefaultLedgerAccount",
                })}
                menuPlacement="top"
                isClearable
              />
            </div>
            <div className="col-4">
              <label className="fw-bold fs-6 mb-3" htmlFor="vatType">
                {intl.formatMessage({ id: "Fields.VatTypeId" })}
              </label>
              <Select
                value={
                  formik.values.splitDeviation.vatTypeId
                    ? splitVatTypes
                        .flatMap((group: any) =>
                          group.options.map((item: any) => ({
                            value: item.value,
                            label: item.label,
                          }))
                        )
                        .find((vat: any) => {
                          return (
                            vat.value === formik.values.splitDeviation.vatTypeId
                          );
                        })
                    : null
                }
                className="react-select-styled"
                options={splitVatTypes}
                isClearable
                isDisabled={!formik.values.splitDeviation.ledgerAccountId}
                inputId="vatType"
                onChange={(e: any) =>
                  formik.setFieldValue("splitDeviation.vatTypeId", e?.value)
                }
                placeholder={intl.formatMessage({
                  id: "Fields.SelectOptionNoVatType",
                })}
                menuPlacement="top"
              />
            </div>
          </div>
        )}
      </form>
      {clientModal && (
        <ClientAddModal
          setEditModalId={setEditModalId}
          setAddModalOpen={setClientModalOpen}
          editModalId={editModalId}
        />
      )}
      {clientSearch && (
        <ClientSearch
          handleClose={handleClose}
          formik={formik}
          storageName="storedClientForRule"
        />
      )}
    </div>
  );
};

export { RuleAddStep2 };
