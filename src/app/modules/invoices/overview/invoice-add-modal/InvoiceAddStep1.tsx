import { FC, useEffect } from "react";
import Select from "react-select";
import { useIntl } from "react-intl";
import { FormikProps } from "formik";
import "quill/dist/quill.snow.css";
import Flatpickr from "react-flatpickr";
import { getContactListById } from "../../../client/client-search/core/_requests";
import { ClientAddButtons } from "../../../generic/ClientAddButtons";
import { InvoicePostResult } from "../core/_models";

type Props = {
  formik: FormikProps<InvoicePostResult>;
  contactResponse: any;
  setContactResponse: (type: any) => void;
  clientCheck: boolean;
  setClientModalId: (type: number) => void;
  setClientModalOpen: (type: boolean) => void;
  setClientSearch: (type: boolean) => void;
  clientSearch: boolean;
  clientModal: boolean;
};

const InvoiceAddStep1: FC<Props> = ({
  formik,
  contactResponse,
  setContactResponse,
  clientCheck,
  setClientModalId,
  setClientModalOpen,
  clientSearch,
  clientModal,
  setClientSearch,
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
  }, [clientCheck, clientModal, clientSearch]);

  useEffect(() => {
    localStorage.removeItem("isNew");
  }, [clientModal]);
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
          <div className="row d-flex mb-5">
            <div className="col-4">
              <label
                className="required fw-bold fs-6 mb-3"
                htmlFor="invoice_date_picker"
              >
                {intl.formatMessage({ id: "Fields.InvoiceDate" })}
              </label>
              <div
                className="input-group"
                data-td-target-input="nearest"
                data-td-target-toggle="nearest"
              >
                <Flatpickr
                  value={
                    formik.values.header.invoiceDate
                      ? new Date(formik.values.header.invoiceDate)
                      : ""
                  }
                  id="invoice_date_picker"
                  onChange={(date: Date[]) =>
                    formik.setFieldValue(
                      "header.invoiceDate",
                      date[0].toISOString()
                    )
                  }
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
                  data-td-target="#invoice_date_picker"
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
              <label className="required fw-bold fs-6 mb-3" htmlFor="deadline">
                {intl.formatMessage({
                  id: "Fields.DeadLineForPaymentDays",
                })}
              </label>
              <Select
                name="header.deadLineForPaymentDays"
                inputId="deadline"
                value={
                  formik.values.header.deadLineForPaymentDays === 0
                    ? null
                    : {
                        value: formik.values.header.deadLineForPaymentDays,
                        label:
                          formik.values.header.deadLineForPaymentDays?.toString(),
                      }
                }
                onChange={(option) =>
                  formik.setFieldValue(
                    "header.deadLineForPaymentDays",
                    option ? option.value : null
                  )
                }
                options={Array.from({ length: 89 }, (_, index) => {
                  const value = index + 2;
                  return { value, label: value.toString() };
                })}
              />
            </div>
            <div className="col-5">
              <label
                className="fw-bold fs-6 mb-3"
                htmlFor="delivery_date_picker"
              >
                {intl.formatMessage({ id: "Fields.DeliveryDate" })}
              </label>
              <div
                className="input-group"
                data-td-target-input="nearest"
                data-td-target-toggle="nearest"
              >
                <Flatpickr
                  id="delivery_date_picker"
                  value={
                    formik.values.header.deliveryDate
                      ? new Date(formik.values.header.deliveryDate)
                      : ""
                  }
                  onChange={(date: Date[]) =>
                    formik.setFieldValue(
                      "header.deliveryDate",
                      date[0].toISOString()
                    )
                  }
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
                  data-td-target="#delivery_date_picker"
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
          <div className="row d-flex mb-7">
            <div className="col-7">
              {/* Label for the first field */}
              <h2 className="required fw-bold fs-6 mb-4">
                {intl.formatMessage({ id: "Fields.Client" })}
              </h2>

              <ClientAddButtons
                clientDisplayName={formik.values.header.clientDisplayName}
                openClientModal={openClientModal}
                openClientModalInNewMode={openClientModalInNewMode}
                reset={reset}
                setClientSearch={setClientSearch}
                type="modal"
              />
            </div>
            <div className="col-5">
              {/* Label for the second field */}
              <label className=" fw-bold fs-6 mb-3" htmlFor="referenceNr">
                {intl.formatMessage({ id: "Fields.ClientReferenceNr" })}
              </label>
              {/* Input field */}
              <input
                type="text"
                id="referenceNr"
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
          <div className="row d-flex mb-7">
            <div className="col-7">
              {contactsArray?.length > 0 && (
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
                  inputId="contacts"
                  options={contactOptions}
                  placeholder={intl.formatMessage({ id: "Fields.Contacts" })}
                />
              )}
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export { InvoiceAddStep1 };
