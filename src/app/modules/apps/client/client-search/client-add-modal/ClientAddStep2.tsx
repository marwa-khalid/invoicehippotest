import React, { FC, useState, useEffect } from "react";
import { KTIcon, toAbsoluteUrl } from "../../../../../../_metronic/helpers";
import { useIntl } from "react-intl";
import {
  postContact,
  getContactListById,
  deleteContact,
} from "../core/_requests";
import { handleToast } from "../../../../auth/core/_toast";
import { Tooltip } from "@chakra-ui/react";
import { toast } from "react-toastify";

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
    clientId: clientId || 0,
    firstName: "",
    lastName: "",
    betweenName: "",
    emailAddress: "",
    department: "",
    phoneNr: "",
    mobileNr: "",
  });
  const [selectedContacts, setSelectedContacts] = useState<number[]>([]);
  console.log(clientId);
  useEffect(() => {
    const fecthspecificContacts = async () => {
      const response = await getContactListById(clientId);

      if (response.result?.length > 0) {
        setContacts(response.result);
      } else {
        setContacts([]);
      }
    };
    if (clientId != undefined) {
      fecthspecificContacts();
    }
  }, [deleteModalOpen, clientId]);
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
      toast.error("Client ID not provided. Please complete step 1.");
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

  const handleDeleteSelectedContacts = async () => {
    const response = await deleteContact(selectedContacts);
    if (response.isValid) {
      setContacts((prevContacts: any) =>
        prevContacts.filter(
          (contact: any) => !selectedContacts.includes(contact.id)
        )
      );
      console.log(selectedContacts);

      setSelectedContacts([]);
    } else {
      handleToast(response);
    } // Reset selection after deletion
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
      <div className="container my-4 ">
        {/* Add Contact Button */}
        <div className="d-flex mb-3">
          <div className="input-group justify-content-between">
            {contacts.length > 0 ? (
              <div className="form-check form-check-sm form-check-custom form-check-solid">
                <input
                  className="form-check-input me-3"
                  type="checkbox"
                  checked={selectedContacts.length === contacts.length}
                  onChange={toggleAllRowsSelection}
                />
                <label className="text-muted">Delete All</label>
              </div>
            ) : (
              <div className="form-check form-check-sm form-check-custom form-check-solid">
                <input
                  className="form-check-input me-3"
                  type="checkbox"
                  disabled
                />
                <label className="text-muted">No records</label>
              </div>
            )}
            <button
              className="btn btn-primary d-flex align-items-center rounded p-3"
              onClick={() => handleOpenModal()}
            >
              <i className="ki-duotone ki-plus-square fs-2x text-white ">
                <span className="path1"></span>
                <span className="path2"></span>
                <span className="path3"></span>
              </i>
              {intl.formatMessage({ id: "Fields.ModalNewTitleClientContact" })}
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
        {/* {infoModalOpen && (
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
        )} */}
        {/* Contacts Table */}
        {contacts?.length > 0 ? (
          <>
            <div className="">
              {contacts.map((contact: any, index: number) => {
                const initials = `${contact.firstName[0] || ""}${
                  contact.betweenName ? contact.betweenName[0] : ""
                }${contact.lastName[0] || ""}`;
                const avatarColors = [
                  "bg-light-danger text-danger",
                  "bg-light-success text-success",
                  "bg-light-primary text-primary",
                  "bg-light-warning text-warning",
                  "bg-light-info text-info",
                  "bg-light-dark text-dark",
                ];

                // Step 2: Select a color based on the index
                const colorClass = avatarColors[index % avatarColors.length];

                return (
                  <React.Fragment key={contact.id}>
                    {/* Contact Record */}
                    <div className="list-group-item d-flex align-items-center justify-content-between py-3">
                      {/* Avatar and Name */}
                      <div className="d-flex align-items-center">
                        <div className="form-check form-check-sm form-check-custom form-check-solid me-3">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={selectedContacts.includes(contact.id)}
                            onChange={() => toggleRowSelection(contact.id)}
                          />
                        </div>
                        <div className="symbol symbol-50px symbol-circle me-5">
                          <span
                            className={`symbol-label fw-bold ${colorClass}`}
                          >
                            {initials.toUpperCase()}
                          </span>
                        </div>
                        <div className="">
                          <div className="fw-bold fs-5">
                            {contact.firstName} {contact.betweenName}{" "}
                            {contact.lastName}
                          </div>
                          <div className="text-muted fs-8 mt-1">
                            {contact.emailAddress && (
                              <div className="d-flex align-items-center mb-1">
                                <i className="ki-duotone ki-sms me-2 fs-3">
                                  <span className="path1"></span>
                                  <span className="path2"></span>
                                </i>
                                {contact.emailAddress}
                              </div>
                            )}
                          </div>
                          <div className="text-muted d-flex flex-row gap-3 fs-8 mt-2">
                            {contact.phoneNr && (
                              <div className="d-flex align-items-center mb-1">
                                <i className="fa fa-phone me-2 fs-6" />
                                {contact.phoneNr}
                              </div>
                            )}
                            {contact.mobileNr && (
                              <div className="d-flex align-items-center">
                                <i className="ki-duotone ki-phone fs-2 me-2">
                                  <span className="path1"></span>
                                  <span className="path2"></span>
                                </i>
                                {contact.mobileNr}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="d-flex align-items-center">
                        <Tooltip
                          label={intl.formatMessage({
                            id: "Fields.ToolTipEdit",
                          })}
                          fontSize="sm"
                          className="bg-gray-800 text-white p-2 rounded"
                          placement="top"
                        >
                          <button
                            className="btn btn-icon btn-light btn-sm me-2"
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
                          className="bg-gray-800 text-white p-2 rounded"
                          placement="top"
                        >
                          <button
                            className="btn btn-icon btn-light btn-sm"
                            onClick={() =>
                              openDeleteModal(
                                contact.id,
                                `${contact.firstName} ${contact.lastName}`
                              )
                            }
                          >
                            <i className="ki-solid ki-trash text-danger fs-1" />
                          </button>
                        </Tooltip>
                      </div>
                    </div>

                    {/* Separator */}
                    {index < contacts.length - 1 && (
                      <div className="separator separator-solid border-secondary  my-3"></div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </>
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
