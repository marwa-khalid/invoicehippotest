import { FC, useEffect, useState } from "react";
import Select from "react-select";
import { useIntl } from "react-intl";
import { FormikProps } from "formik";
import "quill/dist/quill.snow.css";
import Flatpickr from "react-flatpickr";
import { ClientAddModal } from "../../../client/client-search/client-add-modal/ClientAddModal";
import { getContactListById } from "../../../client/client-search/core/_requests";
import { ClientSearch } from "../../../generic/ClientSearch";
import { ClientAddButtons } from "../../../generic/ClientAddButtons";
import { QuotePostResult } from "../core/_models";

type Props = {
  formik: FormikProps<QuotePostResult>;
  contactResponse: any;
  setContactResponse: (type: any) => void;
  clientCheck: boolean;
  clientModal: boolean;
  setClientModalOpen: (type: boolean) => void;
  setClientModalId: (type: number) => void;
  clientSearch: boolean;
  setClientSearch: (type: boolean) => void;
};

const QuoteAddStep1: FC<Props> = ({
  formik,
  contactResponse,
  setContactResponse,
  clientCheck,
  setClientModalId,
  setClientModalOpen,
  setClientSearch,
  clientModal,
  clientSearch,
}) => {
  const intl = useIntl();

  const openClientModal = () => {
    setClientModalId(formik.values.header.clientId);
    setClientModalOpen(true);
  };
  const openClientModalInNewMode = () => {
    setClientModalId(0);
    setClientModalOpen(true);
  };

  useEffect(() => {
    if (clientCheck) {
      const clientResponse = JSON.parse(
        localStorage.getItem("clientResponse")!
      );

      if (clientResponse != null) {
        formik.setFieldValue("header.clientId", clientResponse.id);

        fetchContacts();

        formik.setFieldValue(
          "header.clientDisplayName",
          clientResponse.customerNr + " " + clientResponse.businessName
        );
      }
    }
  }, [clientModal, clientSearch, clientCheck]);

  const fetchContacts = async () => {
    let count = 1;
    const response = await getContactListById(formik.values.header.clientId);
    if (response.isValid) {
      const defaultContact = response.result.find(
        (contact) => contact.isDefaultContact === true
      )?.id;
      formik.setFieldValue("header.clientContactId", defaultContact);
      setContactResponse(response.result);
    }
    count++;
  };
  useEffect(() => {
    if (formik.values.header.clientId != 0) {
      fetchContacts();
    }
  }, [formik.values.header.clientId]);

  const reset = () => {
    localStorage.removeItem("contactResponse");
    localStorage.removeItem("clientResponse");
    formik.setFieldValue("header.clientDisplayName", "");
    formik.setFieldValue("header.clientId", 0);
    setContactResponse(null);
  };
  const contactsArray = Array.isArray(contactResponse)
    ? contactResponse
    : contactResponse
    ? [contactResponse]
    : [];

  const contactOptions = contactsArray.map((contact: any) => ({
    value: contact.id,
    label: contact.fullName,
  }));

  return (
    <>
      <div className="modal-body" id="#kt_tab_pane_4">
        <form className="form p-4" noValidate>
          <div className="row d-flex mb-7">
            <div className="fv-row col-6">
              {/* Label for the first field */}
              <label className="required fw-bold fs-6 mb-3">
                {intl.formatMessage({ id: "Fields.Client" })}
              </label>
              {/* Button group for actions */}

              <ClientAddButtons
                clientDisplayName={formik.values.header.clientDisplayName}
                openClientModal={openClientModal}
                openClientModalInNewMode={openClientModalInNewMode}
                reset={reset}
                setClientSearch={setClientSearch}
                type="modal"
              />
            </div>

            <div className="col-3">
              <label className="required fw-bold fs-6 mb-3">
                {intl.formatMessage({ id: "Fields.QuoteDate" })}
              </label>
              <div
                className="input-group"
                id="kt_td_picker_date_only"
                data-td-target-input="nearest"
                data-td-target-toggle="nearest"
              >
                <Flatpickr
                  value={
                    formik.values.header.quoteDate
                      ? new Date(formik.values.header.quoteDate)
                      : ""
                  }
                  onChange={(date: Date[]) => {
                    if (date[0]) {
                      const d = date[0];
                      const formatted =
                        `${d.getFullYear()}-` +
                        `${String(d.getMonth() + 1).padStart(2, "0")}-` +
                        `${String(d.getDate()).padStart(2, "0")}T00:00:00`;

                      formik.setFieldValue("header.quoteDate", formatted);
                    }
                  }}
                  options={{
                    weekNumbers: true,
                    dateFormat: "d-m-Y",
                    allowInput: true,
                  }}
                  disabled={formik.values.status === 4}
                  className="form-control"
                  placeholder="dd-MM-yyyy"
                  style={{ height: "38px" }}
                />

                <span
                  className="input-group-text"
                  style={{ height: "38px" }}
                  data-td-target="#kt_td_picker_date_only"
                  data-td-toggle="datetimepicker"
                >
                  <i className="ki-duotone ki-calendar fs-2 text-primary">
                    <span className="path1"></span>
                    <span className="path2"></span>
                  </i>
                </span>
              </div>
            </div>
            <div className="col-3">
              <label className="required fw-bold fs-6 mb-3">
                {intl.formatMessage({
                  id: "Fields.DeadLineForAcceptanceDays",
                })}
              </label>
              <Select
                name="header.deadLineForAcceptanceDays"
                value={
                  formik.values.header.deadLineForAcceptanceDays === 0
                    ? null
                    : {
                        value: formik.values.header.deadLineForAcceptanceDays,
                        label:
                          formik.values.header.deadLineForAcceptanceDays.toString(),
                      }
                }
                onChange={(option) =>
                  formik.setFieldValue(
                    "header.deadLineForAcceptanceDays",
                    option ? option.value : null
                  )
                }
                options={Array.from({ length: 89 }, (_, index) => {
                  const value = index + 2;
                  return { value, label: value.toString() };
                })}
              />
            </div>
          </div>

          <div className="row d-flex mb-7">
            <div className="col-6">
              {contactsArray.length > 0 && (
                <>
                  <label className=" fw-bold fs-6 mb-3">&nbsp;</label>
                  <Select
                    value={
                      formik.values.header.clientContactId != 0
                        ? contactOptions.find(
                            (contact) =>
                              contact.value ===
                              formik.values.header.clientContactId
                          )
                        : null
                    }
                    onChange={(selectedOption: any) => {
                      formik.setFieldValue(
                        "header.clientContactId",
                        selectedOption.value
                      );
                    }}
                    options={contactOptions}
                    placeholder={intl.formatMessage({ id: "Fields.Contacts" })}
                  />
                </>
              )}
            </div>
            <div className="col-3">
              <label className="fw-bold fs-6 mb-3">
                {intl.formatMessage({ id: "Fields.DeliveryDate" })}
              </label>
              <div
                className="input-group"
                id="kt_td_picker_date_only"
                data-td-target-input="nearest"
                data-td-target-toggle="nearest"
              >
                <Flatpickr
                  value={
                    formik.values.header.expectedDeliveryDate
                      ? new Date(formik.values.header.expectedDeliveryDate)
                      : ""
                  }
                  onChange={(date: Date[]) => {
                    if (date[0]) {
                      const d = date[0];
                      const formatted =
                        `${d.getFullYear()}-` +
                        `${String(d.getMonth() + 1).padStart(2, "0")}-` +
                        `${String(d.getDate()).padStart(2, "0")}T00:00:00`;

                      formik.setFieldValue(
                        "header.expectedDeliveryDate",
                        formatted
                      );
                    }
                  }}
                  options={{
                    weekNumbers: true,
                    dateFormat: "d-m-Y",
                    allowInput: true,
                  }}
                  className="form-control"
                  placeholder="dd-MM-yyyy"
                  style={{ height: "38px" }}
                />
                <span
                  className="input-group-text"
                  style={{ height: "38px" }}
                  data-td-target="#kt_td_picker_date_only"
                  data-td-toggle="datetimepicker"
                >
                  <i className="ki-duotone ki-calendar fs-2 text-primary">
                    <span className="path1"></span>
                    <span className="path2"></span>
                  </i>
                </span>
              </div>
            </div>
          </div>

          {/* secondContainer */}
          <div className="row d-flex">
            <div className="col-6">
              {/* Label for the second field */}
              <label className=" fw-bold fs-6 mb-3">
                {intl.formatMessage({ id: "Fields.ClientReferenceNr" })}
              </label>
              {/* Input field */}
              <input
                type="text"
                name="header.clientReferenceNr"
                value={formik.values.header.clientReferenceNr || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="form-control form-control-solid"
                placeholder={intl.formatMessage({
                  id: "Fields.ClientReferenceNr",
                })}
              />
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export { QuoteAddStep1 };
