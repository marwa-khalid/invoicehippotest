import { FC, useEffect, useState } from "react";
import Select from "react-select";
import { useIntl } from "react-intl";
import { FormikProps } from "formik";
import "react-quill/dist/quill.snow.css";
import Flatpickr from "react-flatpickr";
import { ClientAddModal } from "../../../client/client-search/client-add-modal/ClientAddModal";
import {
  getClientById,
  getContactListById,
} from "../../../client/client-search/core/_requests";
import { ClientSearch } from "./ClientSearch";
import { getClientContacts } from "../core/_requests";

export interface FormValues {
  id: number;
  isQuoteEditable: boolean;
  status: number;
  attachmentsTempId: string;
  title: string;
  downloadInfo: {
    fileName: string;
    fileId: number;
    fileType: { value: number; description: string };
    downloadUrl: string;
  };
  header: {
    prospect: {
      clientName: string;
      kvKNr: string;
      vatNr: string;
      ibanNr: string;
    };
    quoteDate: string;
    clientId: number;
    clientContactId: number;
    deadLineForAcceptanceDays: number;
    clientReferenceNr: string;
    valutaType: number;
    companyTradeNameId: number;
    clientDisplayName: string;
  };
  customizations: {
    useCustomQuoteNr: boolean;
    customQuoteNr: string;
    hideProductCodes: boolean;
    notificationCycleId: number;
    dontSendRemindersOnlyTrackStatus: boolean;
  };
  products: {
    productId: number;
    title: string;
    code: string;
    description: string;
    units: number;
    unitPrice: number;
    companyUnitTypeId: number;
    btwExclusive: boolean;
    includeLinkedProductDesciption: boolean;
    linkedProductDescription: string;
    linkedProductId: number;
    ledgerAccountId: number;
    vatTypeId: number;
    discountMarginId: any;
    orderIndex: number;
  }[];
  comments: {
    quoteComments: string;
    privateComments: string;
  };
  customFields: {
    fieldLabel: string;
    fieldInfo: string;
    groupDisplayName: string;
    options: string[];
    fieldType: { value: number; description: string };
    fieldId: number;
    value: {
      asDate: string;
      asText: string;
      asMoney: number;
      asNumber: number;
      asOptions: string[];
    };
  }[];
  attachments: {
    attachmentsToLink: {
      inboxItemId: number;
      attachmentId: number;
      isRemoved: boolean;
      restoreAttachment: boolean;
      isDirectFileReference: boolean;
    }[];
    attachments: {
      id: number;
      relatedEntityId: number;
      fileName: string;
      dateOfUpload: string;
      dateOfUploadAsString: string;
      fileId: number;
      documentDateAsString: string;
      documentDate: string;
      fileType: { value: number; name: string; description: string };
      sizeDescription: string;
      downloadInfo: {
        fileName: string;
        fileId: number;
        fileType: { value: number; name: string; description: string };
        downloadUrl: string;
        fileExtension: any;
      };
      actions: {
        canDelete: boolean;
        canDownload: boolean;
        canView: boolean;
        canChangeState: boolean;
      };
      sendWithEmail: boolean;
    }[];
  };
  hasAttachments: boolean;
}

type Props = {
  formik: FormikProps<FormValues>;
  contactResponse: any;
  setContactResponse: (type: any) => void;
};

const QuoteAddStep1: FC<Props> = ({
  formik,
  contactResponse,
  setContactResponse,
}) => {
  const intl = useIntl();
  const [clientModal, openClientModal] = useState<boolean>(false);
  const [editModalId, setEditModalId] = useState<number>(0);
  const [deleteModalId, setDeleteModalId] = useState<number[]>([0]);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [intlMessage, setIntlMessage] = useState<string>("");
  const [refresh, setRefresh] = useState(false);

  const [clientSearch, setClientSearch] = useState<any>();

  useEffect(() => {
    const clientResponse = JSON.parse(localStorage.getItem("clientResponse")!);

    if (clientResponse != null) {
      formik.setFieldValue("header.clientId", clientResponse.id);
      // formik.setFieldValue(
      //   "header.clientReferenceNr",
      //   clientResponse.customerNr
      // );
      formik.setFieldValue(
        "header.clientDisplayName",
        clientResponse.customerNr + " " + clientResponse.businessName
      );
    }
    const contactResponse = JSON.parse(
      localStorage.getItem("contactResponse")!
    );
    if (contactResponse != null) {
      formik.setFieldValue("header.clientContactId", 0);
      setContactResponse(contactResponse);
    } else {
      const defaultContact = contactResponse?.find(
        (contact: any) => contact.isDefaultContact === true
      )?.id;
      formik.setFieldValue("header.clientContactId", defaultContact);
    }
  }, [clientModal, clientSearch]);

  useEffect(() => {
    const fetchContacts = async () => {
      const response = await getContactListById(formik.values.header.clientId);

      if (response.isValid) {
        setContactResponse(response.result);
        const defaultContact = response.result.find(
          (contact) => contact.isDefaultContact === true
        )?.id;
        formik.setFieldValue("header.clientContactId", defaultContact);
      }
    };
    if (formik.values.id != 0) {
      fetchContacts();
    }
  }, [formik.values.header.clientId]);

  const reset = () => {
    localStorage.removeItem("contactResponse");
    localStorage.removeItem("clientResponse");
    formik.setFieldValue("header.clientDisplayName", "");
    // formik.setFieldValue("header.clientReferenceNr", "");
    // formik.setFieldValue("header.clientContactId", 0);
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

  const handleClose = () => {
    setClientSearch(false);
  };
  // Auto-select if there's only one contact
  // useEffect(() => {
  //   if (contactsArray.length === 1) {
  //     const singleContact = contactOptions[0];
  //     setSelectedContact(singleContact);
  //     formik.setFieldValue("header.clientContactId", singleContact.value);
  //   }
  // }, [contactsArray]);

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
              <div className="d-flex w-100 h-40px">
                {/* Primary button - long */}
                {formik.values.header.clientDisplayName ? (
                  <button
                    className="btn btn-primary d-inline-flex align-items-center w-100 rounded-end-0 flex-grow-1"
                    onClick={(e) => {
                      e.preventDefault();
                      setEditModalId(formik.values.header.clientId);
                      openClientModal(true);
                    }}
                  >
                    <i className="la la-user fs-2"></i>
                    <span className="ms-1">
                      {formik.values.header.clientDisplayName.length >
                      (window.innerWidth <= 576 ? 10 : 35)
                        ? `${formik.values.header.clientDisplayName.slice(
                            0,
                            window.innerWidth <= 576 ? 10 : 35
                          )}...`
                        : formik.values.header.clientDisplayName}
                    </span>
                  </button>
                ) : (
                  <button
                    className="btn btn-primary d-inline-flex align-items-center w-100 rounded-end-0 flex-grow-1"
                    onClick={(e) => {
                      e.preventDefault();
                      setEditModalId(0);
                      openClientModal(true);
                    }}
                  >
                    <i className="la la-user-plus fs-2"></i>
                    <span className="ms-1">
                      {intl.formatMessage({
                        id: "Fields.ActionPickerAddNewClient",
                      })}
                    </span>
                  </button>
                )}
                {/* Small icon buttons */}
                {formik.values.header.clientDisplayName && (
                  <button
                    className="btn btn-secondary btn-icon h-40px rounded-0 ms-1 flex-shrink-0"
                    onClick={() => reset()}
                  >
                    <i className="fa fa-remove fs-3"></i>
                  </button>
                )}
                <button
                  className="btn btn-warning btn-icon rounded-start-0 mx-1 h-40px flex-shrink-0"
                  onClick={(e) => {
                    e.preventDefault();
                    setClientSearch(true);
                  }}
                >
                  <i className="la la-search fs-3"></i>
                </button>
              </div>
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
                  value={formik.values.header.quoteDate}
                  onChange={(date: Date[]) =>
                    formik.setFieldValue(
                      "header.quoteDate",
                      date[0].toISOString()
                    )
                  }
                  options={{ weekNumbers: true, dateFormat: "d-m-Y" }}
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

          {contactsArray.length > 0 && (
            <div className="row d-flex mb-7">
              <div className="col-6">
                {/* <h5>{intl.formatMessage({ id: "Fields.Contacts" })}</h5> */}
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
              </div>
            </div>
          )}
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
                value={formik.values.header.clientReferenceNr}
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
        {clientModal && (
          <ClientAddModal
            setRefresh={setRefresh}
            refresh={refresh}
            setEditModalId={setEditModalId}
            setAddModalOpen={openClientModal}
            setDeleteModalId={setDeleteModalId}
            setDeleteModalOpen={setDeleteModalOpen}
            setIntlMessage={setIntlMessage}
            setTitle={setTitle}
            editModalId={editModalId}
            deleteModalOpen={deleteModalOpen}
          />
        )}
        {clientSearch && (
          <ClientSearch handleClose={handleClose} formik={formik} />
        )}
      </div>
    </>
  );
};

export { QuoteAddStep1 };
