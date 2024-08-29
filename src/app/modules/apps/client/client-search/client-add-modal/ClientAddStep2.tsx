import React, { FC, useState, useEffect } from "react";
import { KTIcon, toAbsoluteUrl } from "../../../../../../_metronic/helpers";
import { useIntl } from "react-intl";
import { FormikProps } from "formik";
import { postContact, getContactListById } from "../core/_requests";
import { handleToast } from "../../../../auth/core/_toast";
import { Divider, Tooltip } from "@chakra-ui/react";
import { toast } from "react-toastify";

interface FormValues {
  customFields: {
    fieldLabel: string;
    fieldInfo: string;
    groupDisplayName: string;
    options: string[];
    fieldType: {
      value: number;
      description: string;
    };
    fieldId: number;
    value: {
      asDate: string;
      asText: string;
      asMoney: number;
      asNumber: number;
      asOptions: string[];
    };
  }[];
  id: number;
  companyId: number;
  customerNr: string;
  importReference: string;
  businessName: string;
  kvkNr: string;
  btwNr: string;
  isPrivateClient: boolean;
  factoringSessionStatement: string;
  clientTypes: number[];
  financialSettings: {
    bankAccountCompanyType: number;
    accountIbanNr: string;
    accountHolderName: string;
    hasSepaMandate: boolean;
    sepaMandateDate: string;
    sepaMandateReference: string;
  };
  invoiceAndQuoteSettings: {
    defaultDeadlineDaysForPayment: number;
    defaultVatTypeId: number;
    defaultLedgerAccountId: number;
    extraCcEmailAddressesInvoice: string[];
    extraCcEmailAddressesQuotes: string[];
    costDefaultLedgerAccountId: number;
    costDefaultVatTypeId: number;
    costDefaultReference: string;
    costDefaultLineReference: string;
  };
  invoiceAddress: {
    id: number;
    streetName: string;
    houseNr: string;
    houseNrAddition: string;
    postCode: string;
    city: string;
    countryType: number;
  };
  deliveryAddress: {
    id: number;
    streetName: string;
    houseNr: string;
    houseNrAddition: string;
    postCode: string;
    city: string;
    countryType: number;
  };
}

type Props = {
  clientId: number;
  setDeleteModalId: (id: number[]) => void;
  setDeleteModalOpen: (type: boolean) => void;
  setTitle: (type: string) => void;
  setIntlMessage: (type: string) => void;

  deleteModalOpen: boolean;
};
const ClientAddStep2: FC<Props> = ({
  clientId,
  setDeleteModalId,
  setDeleteModalOpen,
  deleteModalOpen,
  setIntlMessage,
  setTitle,
}) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const intl = useIntl();
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentContactId, setCurrentContactId] = useState<number>(0);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [contacts, setContacts] = useState<any[]>([]);
  const [newContact, setNewContact] = useState({
    id: 0,
    clientId: clientId,
    firstName: "",
    lastName: "",
    betweenName: "",
    emailAddress: "",
    department: "",
    phoneNr: "",
    mobileNr: "",
  });
  const [selectedContacts, setSelectedContacts] = useState<number[]>([]);

  useEffect(() => {
    const fecthspecificContacts = async () => {
      const response = await getContactListById(clientId);

      if (response.result?.length > 0) {
        setContacts(response.result);
      } else {
        setContacts([]);
      }
    };
    fecthspecificContacts();
  }, [deleteModalOpen]);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewContact({
      ...newContact,
      [name]: value,
    });
  };

  console.log(contacts);

  const handleOpenModal = (contactId?: number) => {
    console.log(contactId);
    if (contactId !== undefined) {
      // Edit mode
      const contactToEdit = contacts.find(
        (contact: any) => contact.id === contactId
      );
      console.log(contactToEdit);
      if (contactToEdit) {
        setNewContact(contactToEdit);
        setIsEditMode(true);
        setCurrentContactId(contactId);
      }
    } else {
      // Add mode - reset newContact fields
      setNewContact({
        id: 0,
        clientId: clientId,
        firstName: "",
        lastName: "",
        betweenName: "",
        emailAddress: "",
        department: "",
        phoneNr: "",
        mobileNr: "",
      });
      setIsEditMode(false); // Ensure edit mode is false when adding a new contact
      setCurrentContactId(0);
    }
    setModalOpen(true);
  };

  const handleAddOrEditContact = async () => {
    const addContact = await postContact(newContact);
    console.log(newContact);
    if (addContact.isValid) {
      setModalOpen(false);
      setIsEditMode(false);
      setCurrentContactId(0);
      setNewContact({
        id: 0,
        clientId: clientId,
        firstName: "",
        lastName: "",
        betweenName: "",
        emailAddress: "",
        department: "",
        phoneNr: "",
        mobileNr: "",
      });

      handleToast(addContact);
      if (isEditMode && currentContactId !== null) {
        // Edit existing contact
        const updatedContacts = contacts.map((contact: any) =>
          contact.id === currentContactId
            ? { ...newContact, id: currentContactId }
            : contact
        );
        setContacts(updatedContacts);
      } else {
        // Add new contact
        console.log(newContact);
        setContacts([...contacts, { ...newContact, id: Date.now() }]);
      }
    } else {
      handleToast(addContact);
    }
  };

  const toggleRowSelection = (id: number) => {
    setSelectedContacts((prevSelected) => {
      if (prevSelected.includes(id)) {
        // Deselect if already selected
        return prevSelected.filter((itemId) => itemId !== id);
      } else {
        // Select if not already selected
        return [...prevSelected, id];
      }
    });
  };

  const toggleAllRowsSelection = () => {
    if (selectedContacts?.length === contacts?.length) {
      // If all are selected, deselect all
      setSelectedContacts([]);
    } else {
      // Select all
      const allIds = contacts.map((contact: any) => contact.id);
      setSelectedContacts(allIds);
    }
  };

  const handleDeleteSelectedContacts = () => {
    setContacts((prevContacts: any) =>
      prevContacts.filter(
        (contact: any) => !selectedContacts.includes(contact.id)
      )
    );
    setSelectedContacts([]); // Reset selection after deletion
  };

  const openDeleteModal = (id: number, title: string) => {
    setDeleteModalOpen(true);
    setTitle(title);
    setIntlMessage("Fields.ModalDeleteDescriptionClientContact");
    setDeleteModalId([id]);
  };
  console.log(contacts);

  return (
    <>
      <div className="container mt-4 mb-20">
        {/* Add Contact Button */}
        <div className="d-flex mb-3">
          <div className="input-group justify-content-end">
            <button
              className="btn btn-primary d-flex align-items-center"
              onClick={() =>
                clientId ? handleOpenModal() : setInfoModalOpen(true)
              }
            >
              <i className="ki-duotone ki-plus-square fs-2x text-white ">
                <span className="path1"></span>
                <span className="path2"></span>
                <span className="path3"></span>
              </i>
              Add Contact
            </button>
          </div>
          {selectedContacts?.length > 0 && (
            <div>
              <button
                style={{ whiteSpace: "nowrap" }}
                className="btn btn-danger ms-3"
                onClick={handleDeleteSelectedContacts}
              >
                Delete Selected Entries
              </button>
            </div>
          )}
        </div>

        {/* Add Contact Modal */}
        {isModalOpen && (
          <div
            className="modal fade show d-block"
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
          >
            <div className="modal-dialog mw-600px">
              <div className="modal-content">
                <div className="modal-header bg-dark">
                  <div className="fv-row col-12 d-flex justify-content-between align-items-center mb-0">
                    <h2 className="fw-bolder mb-0 text-white">
                      {isEditMode
                        ? intl.formatMessage({ id: "Fields.EditContactPerson" })
                        : intl.formatMessage({ id: "Fields.NewContactPerson" })}
                    </h2>
                    <div
                      className="btn btn-icon btn-sm btn-active-icon-primary"
                      onClick={() => setModalOpen(false)}
                      style={{ cursor: "pointer" }}
                    >
                      <KTIcon iconName="cross" className="fs-1 text-white" />
                    </div>
                  </div>
                </div>
                <div className="modal-body">
                  {/* Input fields for the contact form */}
                  <div className="row d-flex mb-5">
                    <label className="fw-bold fs-6 mb-2">
                      {intl.formatMessage({ id: "Fields.FullName" })}
                    </label>
                    <div className="fv-row col-4 mb-3">
                      <input
                        type="text"
                        name="firstName"
                        // {...formik.getFieldProps("KvkNr")}
                        value={newContact.firstName}
                        className="form-control form-control-solid"
                        placeholder={intl.formatMessage({
                          id: "Fields.FirstName",
                        })}
                        onChange={handleInputChange}
                      />
                    </div>{" "}
                    <div className="fv-row col-4 mb-3">
                      <input
                        type="text"
                        name="betweenName"
                        value={newContact.betweenName}
                        // {...formik.getFieldProps("BtwNr")}
                        className="form-control form-control-solid"
                        placeholder={intl.formatMessage({
                          id: "Fields.BetweenName",
                        })}
                        onChange={handleInputChange}
                      />
                    </div>{" "}
                    <div className="fv-row col-4 mb-3">
                      <input
                        type="text"
                        name="lastName"
                        // {...formik.getFieldProps("BtwNr")}
                        value={newContact.lastName}
                        className="form-control form-control-solid"
                        placeholder={intl.formatMessage({
                          id: "Fields.LastName",
                        })}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="row flex-grow-1 d-flex mb-5">
                    <label className="fw-bold fs-6 mb-2">
                      {intl.formatMessage({ id: "Fields.EmailAddress" })}
                    </label>
                    <input
                      type="email"
                      name="emailAddress"
                      value={newContact.emailAddress}
                      placeholder={intl.formatMessage({
                        id: "Fields.EmailAddress",
                      })}
                      onChange={handleInputChange}
                      className="form-control form-control-solid"
                    />
                  </div>

                  <div className="row flex-grow-1 d-flex mb-5">
                    <label className="fw-bold fs-6 mb-2">
                      {intl.formatMessage({ id: "Fields.Department" })}
                    </label>
                    <input
                      type="department"
                      name="department"
                      value={newContact.department}
                      placeholder={intl.formatMessage({
                        id: "Fields.Department",
                      })}
                      onChange={handleInputChange}
                      className="form-control form-control-solid"
                    />
                  </div>

                  <div className="row flex-grow-1 d-flex mb-5">
                    <label className="fw-bold fs-6 mb-2">
                      {intl.formatMessage({ id: "Fields.PhoneNr" })}
                    </label>
                    <div className="fv-row col-6">
                      <div className="input-group">
                        <span
                          className="input-group-text me-1"
                          id="basic-addon1"
                        >
                          <i className="fa fa-phone" />
                        </span>
                        <input
                          type="phoneNr"
                          name="phoneNr"
                          placeholder={intl.formatMessage({
                            id: "Fields.PhoneNr",
                          })}
                          value={newContact.phoneNr}
                          onChange={handleInputChange}
                          className="form-control form-control-solid"
                        />
                      </div>
                    </div>
                    <div className="fv-row col-6">
                      <div className="input-group">
                        <span
                          className="input-group-text me-1"
                          id="basic-addon1"
                        >
                          <i className="ki-duotone ki-phone fs-1 text-dark">
                            <span className="path1"></span>
                            <span className="path2"></span>
                          </i>
                        </span>
                        <input
                          type="text"
                          name="mobileNr"
                          placeholder={intl.formatMessage({
                            id: "Fields.MobileNr",
                          })}
                          value={newContact.mobileNr}
                          onChange={handleInputChange}
                          className="form-control form-control-solid"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setModalOpen(false)}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-dark"
                    onClick={handleAddOrEditContact}
                  >
                    {isEditMode ? "Save Changes" : "Add"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {infoModalOpen && (
          <div
            className="modal fade show d-block"
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
          >
            <div className="modal-dialog mw-600px">
              <div className="modal-content">
                <div className="modal-header bg-info">
                  <h2 className="fw-bolder mb-0 text-white">
                    Information Modal
                  </h2>
                </div>
                <div className="modal-body">
                  <div
                    className="row alert alert-custom alert-default align-items-center mt-8 p-8 "
                    style={{ backgroundColor: "#eee6fe" }}
                    role="alert"
                  >
                    <div className="alert-icon col-1 me-4">
                      <i className="ki-duotone ki-information-4 fs-3x my-auto text-center text-info">
                        <span className="path1"></span>
                        <span className="path2"></span>
                        <span className="path3"></span>
                      </i>
                    </div>
                    <div className="alert-text col-10 ">
                      <h5 className="text-info">
                        Contacts can not be linked until client settings are
                        added
                      </h5>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-info"
                    onClick={() => setInfoModalOpen(false)}
                  >
                    {intl.formatMessage({ id: "Fields.ActionClose" })}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Contacts Table */}
        {contacts?.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
              <thead>
                <tr className="fw-bold text-muted">
                  <th className="w-25px">
                    <div className="form-check form-check-sm form-check-custom form-check-solid">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={selectedContacts.length === contacts.length}
                        onChange={toggleAllRowsSelection}
                      />
                    </div>
                  </th>
                  {/* Table Headers */}
                  <th>{intl.formatMessage({ id: "Fields.FirstName" })}</th>
                  <th>{intl.formatMessage({ id: "Fields.LastName" })}</th>
                  <th>{intl.formatMessage({ id: "Fields.BetweenName" })}</th>
                  <th>{intl.formatMessage({ id: "Fields.EmailAddress" })}</th>
                  <th>{intl.formatMessage({ id: "Fields.Department" })}</th>
                  <th>{intl.formatMessage({ id: "Fields.PhoneNr" })}</th>
                  <th>{intl.formatMessage({ id: "Fields.MobileNr" })}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact: any) => (
                  <tr key={contact.id}>
                    <td>
                      <div className="form-check form-check-sm form-check-custom form-check-solid">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={selectedContacts.includes(contact.id)}
                          onChange={() => toggleRowSelection(contact.id)}
                        />
                      </div>
                    </td>
                    {/* Contact Information */}
                    <td>{contact.firstName}</td>
                    <td>{contact.lastName}</td>
                    <td>{contact.betweenName}</td>
                    <td>{contact.emailAddress}</td>
                    <td>{contact.department}</td>
                    <td>{contact.phoneNr}</td>
                    <td>{contact.mobileNr}</td>
                    <td className="text-end w-auto d-flex justify-content-end">
                      <Tooltip
                        label={intl.formatMessage({
                          id: "Fields.ToolTipEdit",
                        })}
                        fontSize="sm"
                        className="bg-gray-800 text-white p-2 rounded "
                        placement="top"
                      >
                        <button
                          className="btn btn-icon btn-light btn-sm me-4"
                          onClick={() => handleOpenModal(contact.id)}
                        >
                          <i className="ki-solid ki-pencil text-warning fs-1" />
                        </button>
                      </Tooltip>

                      <Tooltip
                        label={intl.formatMessage({
                          id: "Fields.ToolTipDelete",
                        })}
                        fontSize="sm"
                        className="bg-gray-800 text-white p-2 rounded "
                        placement="top"
                      >
                        <button
                          className="btn btn-icon btn-light btn-sm"
                          onClick={() => {
                            openDeleteModal(
                              contact.id,
                              contact.emailAddress || contact.firstName
                            );
                          }}
                        >
                          <i className="ki-solid ki-trash text-danger fs-1"></i>
                        </button>
                      </Tooltip>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          // No Contacts Found

          <div className="text-center d-flex justify-content-center align-items-center flex-column">
            <img
              alt=""
              src={toAbsoluteUrl("media/logos/nocontacts.svg")}
              className="h-250px w-400px mb-10"
            />
            <h3>no contacts have been created yet</h3>
          </div>
        )}
      </div>
      <div className="modal-footer flex-end p-10"></div>
    </>
  );
};

export { ClientAddStep2 };
