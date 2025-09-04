import { FC } from "react";
import { useIntl } from "react-intl";
import Select from "react-select";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { FormikProps } from "formik";
import { useAuth } from "../../../auth";
import {
  BookingItem,
  BookingPostResult,
} from "../../../accounting/bookings/components/core/_models";

type Props = {
  formik: FormikProps<BookingPostResult>;
  ledgers: any;
  vatTypes: any;
};

const BookingAddStep2: FC<Props> = ({ formik, ledgers, vatTypes }) => {
  const intl = useIntl();
  const auth = useAuth();
  const handleInputChange = (index: number, field: string, value: any) => {
    const updatedProducts = [...formik.values.bookingItems];
    updatedProducts[index] = { ...updatedProducts[index], [field]: value };
    formik.setFieldValue("bookingItems", updatedProducts);
  };
  const { currentUser } = useAuth();
  const DC = [
    { value: false, label: "Credit" },
    { value: true, label: "Debit" },
  ];
  const handleAddRow = (e: any, bookingItem: BookingItem) => {
    e.preventDefault();
    const length = formik.values.bookingItems.length;
    const currentProducts = formik.values.bookingItems || [];
    const maxOrderIndex = currentProducts.length
      ? Math.max(...currentProducts.map((p: any) => p.orderIndex ?? 0))
      : -1;
    const newRow = {
      id: 0,
      orderIndex: maxOrderIndex + 1,
      description: bookingItem.description,
      amount: 0,
      balanceType: 1,
      ledgerAccountId: bookingItem.ledgerAccountId,
      vatTypeId: bookingItem.vatTypeId,
      isDebet: bookingItem.isDebet,
      isOriginalFirstLinkedFromMutation:
        bookingItem.isOriginalFirstLinkedFromMutation,
      actions: {
        disableDelete: true,
        disableAmountEdit: true,
        disableBalanceTypeEdit: true,
        disableLedgerAccountEdit: true,
        disableVatTypeEdit: true,
      },
    };
    formik.setFieldValue("bookingItems", [
      ...formik.values.bookingItems,
      newRow,
    ]);
  };

  const handleRemoveRow = (index: number, e: any) => {
    e.preventDefault();
    const updatedProducts = formik.values.bookingItems.filter(
      (_, rowIndex) => rowIndex !== index
    );
    formik.setFieldValue("bookingItems", updatedProducts);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const updatedProducts = [...formik.values.bookingItems];
    const [reorderedItem] = updatedProducts.splice(result.source.index, 1);
    updatedProducts.splice(result.destination.index, 0, reorderedItem);

    formik.setFieldValue("bookingItems", updatedProducts);
  };

  return (
    <div className="modal-body" id="#kt_tab_pane_5">
      <form className="form" noValidate>
        <div className="d-flex justify-content-between align-items-center mb-5">
          {/* Left Section: Title and Subtitle */}
          <div>
            <h2>
              {intl.formatMessage({
                id: "Fields.BookingItemsRegionTitle",
              })}
            </h2>
            <span className="text-muted">
              {intl.formatMessage({
                id: "Fields.BookingItemsRegionSubTitle",
              })}
            </span>
          </div>

          {/* Right Section: Amount */}
          <div className="d-flex col-4 position-relative align-items-center ">
            <label
              className="required text-muted w-100 me-n20"
              htmlFor="amount"
            >
              {intl.formatMessage({
                id: "Fields.TotalValidationAmount",
              })}
            </label>

            <div className="input-group flex-nowrap">
              <span className="input-group-text me-1" id="basic-addon1">
                {currentUser?.result.activeCompanyDefaults.defaultValuta.sign}
              </span>

              <input
                id="amount"
                type="number"
                {...formik.getFieldProps("header.totalValidationAmount")}
                className="form-control form-control-solid"
                placeholder="0"
                aria-label="TotalValidationAmount"
                aria-describedby="basic-addon1"
              />
            </div>
          </div>
        </div>

        <div
          className="d-flex alert alert-custom alert-default bg-secondary align-items-center "
          role="alert"
        >
          <div className="alert-icon col-1 me-4">
            <i className="ki-duotone ki-information-4 fs-3x text-center text-primary">
              <span className="path1"></span>
              <span className="path2"></span>
              <span className="path3"></span>
            </i>
          </div>
          <div className="alert-text col-10 d-flex flex-column">
            <span style={{ wordBreak: "break-all", whiteSpace: "normal" }}>
              {intl.formatMessage({
                id: "Fields.BookingValidationAmountInfo",
              })}
            </span>
          </div>
        </div>

        {/* Editable Table with Drag and Drop */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="bookingItems">
            {(provided) => (
              <table
                className="table gs-3 gy-3"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <thead>
                  <tr className="fw-bold text-muted">
                    <th style={{ width: "50px" }}></th>
                    <th className="required">
                      {intl
                        .formatMessage({ id: "Fields.Amount" })
                        .toUpperCase()}
                    </th>
                    <th className="required w-100px">
                      {intl
                        .formatMessage({ id: "Fields.LedgerAccount" })
                        .toUpperCase()}
                    </th>
                    <th>
                      {intl
                        .formatMessage({ id: "Fields.VatRegistrationType" })
                        .toUpperCase()}
                    </th>
                    <th>
                      {intl
                        .formatMessage({ id: "Fields.DebetAmount" })
                        .toUpperCase()}
                      -/{" "}
                      {intl
                        .formatMessage({ id: "Fields.CreditAmount" })
                        .toUpperCase()}
                    </th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td
                      colSpan={6}
                      style={{
                        borderTop: "1px dotted #d6d4ce",
                        width: "100%",
                        margin: "0",
                      }}
                    />
                  </tr>
                  {formik.values.bookingItems.map(
                    (bookingItem: BookingItem, index: number) => (
                      <Draggable
                        key={index}
                        draggableId={index.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <>
                            <tr
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="pb-0"
                              style={{
                                opacity: bookingItem.actions.disableAmountEdit
                                  ? 0.5
                                  : 1, // Grey out disabled rows
                                pointerEvents: bookingItem.actions
                                  .disableAmountEdit
                                  ? "none"
                                  : "auto", // Prevent interaction
                              }}
                            >
                              <td
                                style={{ width: "50px", textAlign: "center" }}
                              >
                                <span
                                  {...provided.dragHandleProps}
                                  className="btn btn-icon btn-sm btn-light drag-handle"
                                  style={{ cursor: "grab" }}
                                >
                                  <i className="ki-duotone ki-arrow-mix text-muted fs-1">
                                    <span className="path1"></span>
                                    <span className="path2"></span>
                                  </i>
                                </span>
                              </td>
                              <td className="w-150px">
                                <div className="input-group">
                                  <span
                                    className="input-group-text me-1"
                                    id="basic-addon1"
                                    style={{ height: "38px" }}
                                  >
                                    {
                                      currentUser?.result.activeCompanyDefaults
                                        .defaultValuta.sign
                                    }
                                  </span>
                                  <input
                                    type="number"
                                    style={{ height: "38px" }}
                                    className="form-control form-control-solid border-0 p-3"
                                    value={bookingItem.amount}
                                    onChange={(e) =>
                                      handleInputChange(
                                        index,
                                        "amount",
                                        parseInt(e.target.value)
                                      )
                                    }
                                  />
                                </div>
                                {bookingItem.vatTypeId &&
                                  bookingItem.amount > 0 && (
                                    <div
                                      className="text-muted mt-2"
                                      style={{
                                        fontFamily: "monospace",
                                        width: "100%",
                                      }}
                                    >
                                      {(() => {
                                        const vatEntry = vatTypes
                                          .flatMap(
                                            (group: any) => group.options
                                          )
                                          .find((vat: any) => {
                                            return (
                                              vat.value ===
                                              bookingItem.vatTypeId
                                            );
                                          });

                                        const vatPercentage = vatEntry?.amount
                                          ? vatEntry.amount
                                          : NaN;
                                        const isAlwaysExBtw =
                                          vatEntry?.isAlwaysExBtw;
                                        const currencySign =
                                          auth.currentUser?.result
                                            .activeCompanyDefaults.defaultValuta
                                            .sign;

                                        const basePriceExclusive =
                                          isAlwaysExBtw || isNaN(vatPercentage)
                                            ? bookingItem.amount
                                            : bookingItem.amount /
                                              (1 + vatPercentage / 100);

                                        const vatAmount = isNaN(vatPercentage)
                                          ? 0
                                          : basePriceExclusive *
                                            (vatPercentage / 100);

                                        return (
                                          <>
                                            <div className="d-flex justify-content-between px-2">
                                              <span>
                                                {intl.formatMessage({
                                                  id: "Fields.Amount",
                                                })}{" "}
                                                (exc):
                                              </span>
                                              <span>
                                                {currencySign}
                                                {basePriceExclusive.toFixed(2)}
                                              </span>
                                            </div>
                                            <div className="d-flex justify-content-between px-2">
                                              <span>
                                                {intl.formatMessage({
                                                  id: "Fields.VatTitle",
                                                })}
                                                :
                                              </span>
                                              <span>
                                                {currencySign}
                                                {vatAmount.toFixed(2)}
                                              </span>
                                            </div>
                                          </>
                                        );
                                      })()}
                                    </div>
                                  )}
                              </td>
                              <td className="w-250px">
                                <Select
                                  value={
                                    ledgers
                                      .flatMap((group: any) => group.options)
                                      .find(
                                        (option: any) =>
                                          option.value ===
                                          bookingItem.ledgerAccountId
                                      ) || null
                                  }
                                  className="react-select-styled"
                                  options={ledgers}
                                  onChange={(e) =>
                                    handleInputChange(
                                      index,
                                      "ledgerAccountId",
                                      e?.value
                                    )
                                  }
                                  placeholder={intl.formatMessage({
                                    id: "Fields.SelectOptionDefaultLedgerAccount",
                                  })}
                                />
                              </td>

                              <td className="w-150px">
                                <Select
                                  value={vatTypes
                                    .flatMap((group: any) =>
                                      group.options.map((item: any) => ({
                                        value: item.value,
                                        label: item.label,
                                      }))
                                    )
                                    .find((vat: any) => {
                                      return (
                                        vat.value === bookingItem.vatTypeId
                                      );
                                    })}
                                  className="react-select-styled"
                                  options={vatTypes}
                                  isClearable
                                  onChange={(e: any) =>
                                    handleInputChange(
                                      index,
                                      "vatTypeId",
                                      e?.value
                                    )
                                  }
                                  placeholder={intl.formatMessage({
                                    id: "Fields.SelectOptionNoVatType",
                                  })}
                                />
                              </td>
                              <td>
                                <div className="custom-switch mt-1 ms-2 d-flex align-items-center mb-7 position-relative">
                                  <input
                                    className="custom-input"
                                    type="checkbox"
                                    id={`toggle-${index}`}
                                    checked={
                                      bookingItem.isDebet
                                    } /* Always checked */
                                    onChange={() =>
                                      handleInputChange(
                                        index,
                                        "isDebet",
                                        !bookingItem.isDebet
                                      )
                                    }
                                  />
                                  <label
                                    className={`custom-label ${
                                      bookingItem.isDebet
                                        ? "bg-success"
                                        : "bg-danger"
                                    }`}
                                    htmlFor={`toggle-${index}`}
                                  >
                                    {bookingItem.isDebet
                                      ? intl.formatMessage({
                                          id: "Fields.DebetAmount",
                                        })
                                      : intl.formatMessage({
                                          id: "Fields.CreditAmount",
                                        })}
                                  </label>
                                </div>
                              </td>

                              <td
                                className="text-end"
                                style={{
                                  pointerEvents: "auto",
                                  opacity: 1,
                                }}
                              >
                                {formik.values.bookingItems.length === 1 ? (
                                  // Other rows: Only show the remove button
                                  <button
                                    className="btn btn-icon btn-light btn-sm"
                                    onClick={(e) =>
                                      handleAddRow(e, bookingItem)
                                    }
                                  >
                                    <i className="ki-solid ki-plus text-success fs-2" />
                                  </button>
                                ) : index ===
                                  formik.values.bookingItems.length - 1 ? (
                                  // Last row: Show both add and remove buttons
                                  <>
                                    <button
                                      className="btn btn-icon btn-light btn-sm me-2"
                                      onClick={(e) => handleRemoveRow(index, e)}
                                    >
                                      <i className="ki-solid ki-minus text-danger fs-2" />
                                    </button>
                                    <button
                                      className="btn btn-icon btn-light btn-sm"
                                      onClick={(e) =>
                                        handleAddRow(e, bookingItem)
                                      }
                                    >
                                      <i className="ki-solid ki-plus text-success fs-2" />
                                    </button>
                                  </>
                                ) : (
                                  // Other rows: Only show the remove button
                                  <button
                                    className="btn btn-icon btn-light btn-sm"
                                    onClick={(e) => handleRemoveRow(index, e)}
                                  >
                                    <i className="ki-solid ki-minus text-danger fs-2" />
                                  </button>
                                )}
                              </td>
                            </tr>

                            <tr
                              style={{
                                opacity: bookingItem.actions.disableAmountEdit
                                  ? 0.5
                                  : 1, // Grey out disabled rows
                                pointerEvents: bookingItem.actions
                                  .disableAmountEdit
                                  ? "none"
                                  : "auto", // Prevent interaction
                              }}
                            >
                              <td></td>
                              {/* Ensure each row has valid td elements */}
                              <td colSpan={3} className="pt-0">
                                <div>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={bookingItem.description || ""} // Prevent undefined issues
                                    onChange={(e) =>
                                      handleInputChange(
                                        index,
                                        "description",
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>
                              </td>
                            </tr>
                            {index <= formik.values.bookingItems.length - 1 && (
                              <tr>
                                <td
                                  colSpan={6}
                                  style={{
                                    borderTop: "1px dotted #d6d4ce",
                                    width: "100%",
                                    margin: "0",
                                  }}
                                />
                              </tr>
                            )}
                          </>
                        )}
                      </Draggable>
                    )
                  )}
                  {provided.placeholder}
                </tbody>
              </table>
            )}
          </Droppable>
        </DragDropContext>
      </form>

      {formik.errors.bookingItems && (
        <div
          className="d-flex alert alert-custom alert-default align-items-center"
          style={{ backgroundColor: "#FFF4DE" }}
          role="alert"
        >
          <div className="alert-icon col-1 me-4">
            <i className="ki-duotone ki-information-4 fs-3x text-center text-warning">
              <span className="path1"></span>
              <span className="path2"></span>
              <span className="path3"></span>
            </i>
          </div>
          <div className="alert-text col-10 d-flex flex-column text-warning">
            <span
              dangerouslySetInnerHTML={{
                __html: formik.errors.bookingItems as string,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export { BookingAddStep2 };
