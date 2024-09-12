import React, { FC, useState, useEffect } from "react";
import { KTIcon, toAbsoluteUrl } from "../../../../../../_metronic/helpers";
import { useIntl } from "react-intl";
import { postContact, getContactListById } from "../core/_requests";
import { handleToast } from "../../../../auth/core/_toast";
import { Tooltip } from "@chakra-ui/react";
import { toast } from "react-toastify";
import { Formik } from "formik";

type Props = {
  clientId: number;
  refresh: boolean;
  setDeleteModalId: (id: number[]) => void;
  setDeleteModalOpen: (type: boolean) => void;
  setTitle: (type: string) => void;
  setIntlMessage: (type: string) => void;
  businessName: string;
  deleteModalOpen: boolean;
};
const ClientAddStep2: FC<Props> = ({
  clientId,
  refresh,
  setDeleteModalId,
  setDeleteModalOpen,
  deleteModalOpen,
  setIntlMessage,
  businessName,
  setTitle,
}) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const intl = useIntl();
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentContactId, setCurrentContactId] = useState<number>(0);
  const [accordions, setAccordions] = useState<any[]>([]);
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

  useEffect(() => {
    const fetchSpecificContacts = async () => {
      try {
        const response = await getContactListById(clientId);
        setContacts(response.result?.length > 0 ? response.result : []);
      } catch (error) {
        console.error("Failed to fetch contacts:", error);
        setContacts([]);
      }
    };

    if (clientId !== undefined) {
      fetchSpecificContacts();
    }
  }, [clientId, deleteModalOpen, refresh]);

  useEffect(() => {
    setContacts((prevContacts: any) =>
      prevContacts.filter(
        (contact: any) => !selectedContacts.includes(contact.id)
      )
    );
    setSelectedContacts([]);
  }, [refresh]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewContact({
      ...newContact,
      [name]: value,
    });
  };

  const handleOpenModal = (contactId?: number) => {
    if (contactId !== undefined) {
      // Edit mode
      const contactToEdit = contacts.find(
        (contact: any) => contact.id === contactId
      );

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
    setDeleteModalOpen(true);
    setIntlMessage("Fields.ModalDeleteDescriptionClientContact");

    // Extract the titles of selected contacts
    const selectedTitles = contacts
      .filter((contact: any) => selectedContacts.includes(contact.id)) // Find contacts by their IDs
      .map((contact: any) => contact.firstName || contact.emailAddress) // Extract the title of each selected contact
      .join(", "); // Join the titles into a comma-separated string

    setDeleteModalId(selectedContacts); // Set the IDs for deletion modal
    setTitle(selectedTitles); // Set the comma-separated titles
  };

  const openDeleteModal = (id: number, title: string) => {
    setDeleteModalOpen(true);
    setTitle(title);
    setIntlMessage("Fields.ModalDeleteDescriptionClientContact");
    setDeleteModalId([id]);
  };

  //let index = 0;
  const Accordion = () => {
    // index++;
    return (
      <div
        className="accordion accordion-icon-collapse"
        //id={`accordion_${index}`}
        id="kt-A1"
      >
        {/* Accordion Item */}
        <div className="mb-5">
          {/* Card with Accordion Header */}
          <div className="card card-custom">
            {/* Card Header */}
            <div className="card-header d-flex justify-content-between align-items-center">
              {/* Accordion Title */}
              <h4 className="card-title mb-0 text-start text-black-600">
                {intl.formatMessage({
                  id: "Fields.NewContactPerson",
                })}
              </h4>

              {/* Accordion Toggle Icon */}
              <span
                className="accordion-icon"
                data-bs-toggle="collapse"
                // data-bs-target={`#accordion_${index}`}
                data-bs-target="#kt_accordion_3_item_1"
              >
                <i className="ki-duotone ki-plus-square fs-3 accordion-icon-off">
                  <span className="path1"></span>
                  <span className="path2"></span>
                  <span className="path3"></span>
                </i>
                <i className="ki-duotone ki-minus-square fs-3 accordion-icon-on">
                  <span className="path1"></span>
                  <span className="path2"></span>
                </i>
              </span>
            </div>

            {/* Accordion Body */}
            <div
              id="kt_accordion_3_item_1"
              className="fs-6 collapse show ps-10"
              data-bs-parent="#kt-A1"
            >
              {/* Card Body - Form */}
              <div className="card-body">
                <form className="form p-3" noValidate>
                  <div className="innerContainer">
                    <div className="row d-flex mb-5">
                      <div className="col-4">
                        <input
                          type="text"
                          className="form-control form-control-solid"
                          placeholder={intl.formatMessage({
                            id: "Fields.FirstName",
                          })}
                        />
                      </div>
                      <div className="col-4">
                        <input
                          type="text"
                          className="form-control form-control-solid"
                          placeholder={intl.formatMessage({
                            id: "Fields.BetweenName",
                          })}
                        />
                      </div>
                      <div className="col-4">
                        <input
                          type="text"
                          className="form-control form-control-solid"
                          placeholder={intl.formatMessage({
                            id: "Fields.LastName",
                          })}
                        />
                      </div>
                    </div>
                    <div className="row d-flex mb-5">
                      <div className="col-8">
                        <input
                          type="text"
                          className="form-control form-control-solid"
                          placeholder={intl.formatMessage({
                            id: "Fields.ContactEmailAddress",
                          })}
                        />
                      </div>
                      <div className="col-4">
                        <input
                          type="text"
                          className="form-control form-control-solid"
                          placeholder={intl.formatMessage({
                            id: "Fields.Department",
                          })}
                        />
                      </div>
                    </div>
                    <div className="row d-flex mb-5">
                      <div className="col-7">
                        <input
                          type="text"
                          className="form-control form-control-solid"
                          placeholder={intl.formatMessage({
                            id: "Fields.PhoneNumbers",
                          })}
                        />
                      </div>
                      <div className="col-5">
                        <input
                          type="text"
                          className="form-control form-control-solid"
                          placeholder={intl.formatMessage({
                            id: "Fields.MobileNr",
                          })}
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              {/* Card Footer */}
              <div className="text-end p-5">
                {/* Delete Button */}
                <button type="button" className="btn btn-danger">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  const handleAddAccordion = () => {
    setAccordions((prevAccordions) => [
      ...prevAccordions,
      <Accordion key={prevAccordions.length} />,
    ]);
  };

  return (
    <>
      <div className="modal-body">
        <form
          className="form p-3"
          // onSubmit={formik.handleSubmit}
          noValidate
        >
          <div className=" p-6 rounded mb-7">
            <h4 className="mb-2 text-start text-black-600">
              {intl.formatMessage({ id: "Fields.Contacts" })}
            </h4>
            <span className="mt-0 text-muted fs-7">
              {intl.formatMessage({
                id: "Fields.ContactPersonSettingsSubTitle",
              })}
            </span>
            <div className="separator border-gray-300 my-6"></div>
            <div className="innerContainer">
              <h4 className="mb-5 text-start text-black-600">
                {intl.formatMessage({
                  id: "Fields.PrimarContactPerson",
                })}
              </h4>
              <div className="row d-flex mb-5">
                <div className="col-4">
                  <input
                    type="text"
                    // {...formik.getFieldProps(
                    //   "financialSettings.accountHolderName"
                    // )}
                    className="form-control form-control-solid"
                    placeholder={intl.formatMessage({
                      id: "Fields.FirstName",
                    })}
                  />
                </div>
                <div className="col-4">
                  <input
                    type="text"
                    // {...formik.getFieldProps(
                    //   "financialSettings.accountHolderName"
                    // )}
                    className="form-control form-control-solid"
                    placeholder={intl.formatMessage({
                      id: "Fields.BetweenName",
                    })}
                  />
                </div>
                <div className="col-4">
                  <input
                    type="text"
                    // {...formik.getFieldProps(
                    //   "financialSettings.accountHolderName"
                    // )}
                    className="form-control form-control-solid"
                    placeholder={intl.formatMessage({
                      id: "Fields.LastName",
                    })}
                  />
                </div>
              </div>
              <div className="row d-flex mb-5">
                <div className="col-8">
                  <input
                    type="text"
                    // {...formik.getFieldProps(
                    //   "financialSettings.accountHolderName"
                    // )}
                    className="form-control form-control-solid"
                    placeholder={intl.formatMessage({
                      id: "Fields.ContactEmailAddress",
                    })}
                  />
                </div>
                <div className="col-4">
                  <input
                    type="text"
                    // {...formik.getFieldProps(
                    //   "financialSettings.accountHolderName"
                    // )}
                    className="form-control form-control-solid"
                    placeholder={intl.formatMessage({
                      id: "Fields.Department",
                    })}
                  />
                </div>
              </div>
              <div className="row d-flex mb-5">
                <div className="col-7">
                  <input
                    type="text"
                    // {...formik.getFieldProps(
                    //   "financialSettings.accountHolderName"
                    // )}
                    className="form-control form-control-solid"
                    placeholder={intl.formatMessage({
                      id: "Fields.PhoneNumbers",
                    })}
                  />
                </div>
                <div className="col-5">
                  <input
                    type="text"
                    // {...formik.getFieldProps(
                    //   "financialSettings.accountHolderName"
                    // )}
                    className="form-control form-control-solid"
                    placeholder={intl.formatMessage({
                      id: "Fields.MobileNr",
                    })}
                  />
                </div>
              </div>
            </div>
            <div className="separator border-gray-300 my-6"></div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleAddAccordion}
            >
              <i className="ki-duotone ki-plus-square fs-2x text-white ">
                <span className="path1"></span>
                <span className="path2"></span>
                <span className="path3"></span>
              </i>
              overige contactpersonon
              {/* {intl.formatMessage({
                id: "Fields.ContactPersonSettingsSubTitle",
              })} */}
            </button>
            <div className="mt-5">
              {accordions.map((accordion, index) => (
                <div key={index}>{accordion}</div>
              ))}
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export { ClientAddStep2 };
