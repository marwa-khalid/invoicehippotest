import React, { FC, useState, useEffect } from "react";
import { useIntl } from "react-intl";
import { getContactListById } from "../core/_requests";
import { FormikProps } from "formik";
import { FormValues } from "./ClientAddStep1";

type Props = {
  clientId: number;
  refresh: boolean;
  formik: any;
  additionalContacts: any;
  hasFetchedContacts: any;
  setPrimaryContact: (contact: any) => void;
  setAdditionalContacts: (contacts: any) => void;
  primaryContact: any;
};

const ClientAddStep2: FC<Props> = ({
  clientId,
  refresh,
  formik,
  additionalContacts,
  primaryContact,
  setAdditionalContacts,
  setPrimaryContact,
  hasFetchedContacts,
}) => {
  const intl = useIntl();

  // Fetch contacts for the client
  useEffect(() => {
    const fetchSpecificContacts = async () => {
      try {
        const response = await getContactListById(clientId);
        console.log(response.result.length);
        const contacts = response.result?.length > 0 ? response.result : [];
        // Separate primary contact and additional contacts
        const primary =
          contacts.find((contact) => contact.isDefaultContact) || {};
        console.log(primary);
        const others = contacts.filter((contact) => !contact.isDefaultContact);
        setPrimaryContact(primary);
        setAdditionalContacts(others);
        hasFetchedContacts.current = true;
        formik.setFieldValue("contactlist.contacts", contacts); // Initialize Formik with contacts
      } catch (error) {
        console.error("Failed to fetch contacts:", error);
        setPrimaryContact({});
        setAdditionalContacts([]);
      }
    };

    if (clientId !== undefined && !hasFetchedContacts.current) {
      fetchSpecificContacts();
    }
  }, [clientId, refresh]);
  // Handle primary contact change
  const handlePrimaryContactChange = (field: string, value: any) => {
    const updatedPrimaryContact = {
      id: primaryContact.id || 0,
      clientId: clientId || 0,
      firstName: primaryContact.firstName || "",
      betweenName: primaryContact.betweenName || "",
      lastName: primaryContact.lastName || "",
      emailAddress: primaryContact.emailAddress || "",
      department: primaryContact.department || "",
      phoneNr: primaryContact.phoneNr || "",
      mobileNr: primaryContact.mobileNr || "",
      isDefaultContact: true,
      [field]: value, // Update the specific field with the new value
    };

    setPrimaryContact(updatedPrimaryContact);

    // Update Formik with the updated contact list
    formik.setFieldValue("contactlist.contacts", [
      updatedPrimaryContact,
      ...additionalContacts,
    ]);
  };

  // Handle additional contact changes
  const handleAdditionalContactChange = (
    index: number,
    field: string,
    value: any
  ) => {
    const updatedContacts = [...additionalContacts];
    updatedContacts[index] = { ...updatedContacts[index], [field]: value };

    // Update the additionalContacts state
    setAdditionalContacts(updatedContacts);

    // Update Formik with the new contact list (including primary contact)
    formik.setFieldValue("contactlist.contacts", [
      primaryContact,
      ...updatedContacts,
    ]);
  };

  // Handle adding new contact
  const handleAddAccordion = () => {
    const newContact = {
      id: 0, // Assuming 0 for new contacts
      clientId: clientId || 0,
      firstName: "",
      betweenName: "",
      lastName: "",
      emailAddress: "",
      department: "",
      phoneNr: "",
      mobileNr: "",
      isDefaultContact: false,
    };

    // Update the additionalContacts first before updating Formik
    setAdditionalContacts((prev: any) => {
      const updatedContacts = [...prev, newContact];
      formik.setFieldValue("contactlist.contacts", [
        primaryContact, // Ensure the primary contact is always included
        ...updatedContacts,
      ]);
      return updatedContacts;
    });
  };

  // Handle removing contact
  const handleRemoveContact = (id: number, index: number) => {
    const updatedContacts = additionalContacts.filter(
      (_: any, i: any) => i !== index
    );

    const deletedIds =
      formik.values.contactlist.listOfDeletedClientContactIDs || [];

    // Add the contact's ID to the deleted list if it has a valid ID
    if (id) {
      deletedIds.push(id);
    }

    // Set the updated deleted contact IDs and contacts
    formik.setFieldValue(
      "contactlist.listOfDeletedClientContactIDs",
      deletedIds
    );
    setAdditionalContacts(updatedContacts);
    formik.setFieldValue("contactlist.contacts", [
      primaryContact, // Ensure primary contact is always included
      ...updatedContacts,
    ]);
  };

  return (
    <div className="modal-body">
      <form className="form p-3" id="formContact">
        {/* Primary Contact Form */}

        <div className="p-6 rounded bg-secondary">
          <h4 className="mb-2 text-start text-gray-600">
            {intl.formatMessage({ id: "Fields.PrimarContactPerson" })}
          </h4>
          <div className="separator border-gray-300 my-6"></div>

          <div className="row d-flex mb-7">
            <div className="col-5">
              <input
                type="text"
                className="form-control form-control-white"
                placeholder={intl.formatMessage({ id: "Fields.FirstName" })}
                value={primaryContact.firstName || ""}
                onChange={(e) =>
                  handlePrimaryContactChange("firstName", e.target.value)
                }
              />
            </div>
            <div className="col-3">
              <input
                type="text"
                className="form-control form-control-white"
                placeholder={intl.formatMessage({ id: "Fields.BetweenName" })}
                value={primaryContact.betweenName || ""}
                onChange={(e) =>
                  handlePrimaryContactChange("betweenName", e.target.value)
                }
              />
            </div>
            <div className="col-4">
              <input
                type="text"
                className="form-control form-control-white"
                placeholder={intl.formatMessage({ id: "Fields.LastName" })}
                value={primaryContact.lastName || ""}
                onChange={(e) =>
                  handlePrimaryContactChange("lastName", e.target.value)
                }
              />
            </div>
          </div>
          <div className="row d-flex mb-7">
            <div className="col-8">
              <div className="input-group">
                <span className="input-group-text" id="basic-addon1">
                  <i className="fa fa-envelope" />
                </span>
                <input
                  type="email"
                  className="form-control form-control-white"
                  placeholder={intl.formatMessage({
                    id: "Fields.ContactEmailAddress",
                  })}
                  value={primaryContact.emailAddress || ""}
                  onChange={(e) =>
                    handlePrimaryContactChange("emailAddress", e.target.value)
                  }
                />
              </div>

              {formik.touched.contactlist?.contacts?.[0]?.emailAddress &&
                formik.errors.contactlist?.contacts?.[0]?.emailAddress && (
                  <div className="fv-plugins-message-container mt-2 ">
                    <div className="fv-help-block ">
                      <span
                        dangerouslySetInnerHTML={{
                          __html:
                            formik.errors.contactlist.contacts[0].emailAddress,
                        }}
                        role="alert"
                      />
                    </div>
                  </div>
                )}
            </div>
            <div className="col-4">
              <input
                type="text"
                className="form-control form-control-white"
                placeholder={intl.formatMessage({ id: "Fields.Department" })}
                value={primaryContact.department || ""}
                onChange={(e) =>
                  handlePrimaryContactChange("department", e.target.value)
                }
              />
            </div>
          </div>
          <div className="row d-flex mb-7">
            <div className="col-6">
              <div className="input-group">
                <span className="input-group-text" id="basic-addon1">
                  <i className="fa fa-phone" />
                </span>
                <input
                  type="text"
                  name="phoneNr"
                  placeholder={intl.formatMessage({ id: "Fields.PhoneNr" })}
                  className="form-control form-control-white"
                  value={primaryContact.phoneNr || ""}
                  onChange={(e) =>
                    handlePrimaryContactChange("phoneNr", e.target.value)
                  }
                />
              </div>
              {formik.touched.contactlist?.contacts?.[0]?.phoneNr &&
                formik.errors.contactlist?.contacts?.[0]?.phoneNr && (
                  <div className="fv-plugins-message-container mt-2 ">
                    <div className="fv-help-block ">
                      <span
                        dangerouslySetInnerHTML={{
                          __html: formik.errors.contactlist.contacts[0].phoneNr,
                        }}
                        role="alert"
                      />
                    </div>
                  </div>
                )}
            </div>
            <div className="col-6">
              <div className="input-group">
                <span className="input-group-text " id="basic-addon1">
                  <i className="ki-duotone ki-phone fs-1 text-dark">
                    <span className="path1"></span>
                    <span className="path2"></span>
                  </i>
                </span>
                <input
                  type="text"
                  name="mobileNr"
                  placeholder={intl.formatMessage({ id: "Fields.MobileNr" })}
                  className="form-control form-control-white"
                  value={primaryContact.mobileNr || ""}
                  onChange={(e) =>
                    handlePrimaryContactChange("mobileNr", e.target.value)
                  }
                />
              </div>
              {formik.touched.contactlist?.contacts?.[0]?.mobileNr &&
                formik.errors.contactlist?.contacts?.[0]?.mobileNr && (
                  <div className="fv-plugins-message-container mt-2 ">
                    <div className="fv-help-block ">
                      <span
                        dangerouslySetInnerHTML={{
                          __html:
                            formik.errors.contactlist.contacts[0].mobileNr,
                        }}
                        role="alert"
                      />
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>

        <div className="accordion pt-4 " id="contactAccordion">
          {additionalContacts.map((contact: any, index: any) => (
            <div className="accordion-item mb-7" key={index}>
              <h2 className="accordion-header" id={`heading_${index}`}>
                <button
                  className="accordion-button collapsed align-items-center bg-secondary "
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapse_${index}`}
                  aria-expanded="false"
                  aria-controls={`collapse_${index}`}
                >
                  <i className="ki-duotone ki-profile-circle fs-1 me-2">
                    <span className="path1"></span>
                    <span className="path2"></span>
                    <span className="path3"></span>
                  </i>
                  {contact.displayName
                    ? contact.displayName
                    : intl.formatMessage({ id: "Fields.NewContactPerson" })}
                </button>
              </h2>

              <div
                id={`collapse_${index}`}
                data-bs-parent="#contactAccordion"
                className="accordion-collapse collapse "
                aria-labelledby={`heading_${index}`}
              >
                <div className="separator border-gray-300"></div>
                <div className="accordion-body bg-secondary">
                  {/* Secondary Contact Form Fields */}

                  <div className="innerContainer">
                    <div className="row d-flex mb-7">
                      <div className="col-5">
                        <input
                          type="text"
                          className="form-control form-control-white"
                          placeholder={intl.formatMessage({
                            id: "Fields.FirstName",
                          })}
                          value={contact?.firstName || ""}
                          onChange={(e) =>
                            handleAdditionalContactChange(
                              index,
                              "firstName",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div className="col-3">
                        <input
                          type="text"
                          className="form-control form-control-white"
                          placeholder={intl.formatMessage({
                            id: "Fields.BetweenName",
                          })}
                          value={contact.betweenName || ""}
                          onChange={(e) =>
                            handleAdditionalContactChange(
                              index,
                              "betweenName",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="col-4">
                        <input
                          type="text"
                          className="form-control form-control-white"
                          placeholder={intl.formatMessage({
                            id: "Fields.LastName",
                          })}
                          value={contact.lastName || ""}
                          onChange={(e) =>
                            handleAdditionalContactChange(
                              index,
                              "lastName",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                    <div className="row d-flex mb-7">
                      <div className="col-8">
                        <div className="input-group">
                          <span className="input-group-text" id="basic-addon1">
                            <i className="fa fa-envelope" />
                          </span>
                          <input
                            type="text"
                            className="form-control form-control-white"
                            placeholder={intl.formatMessage({
                              id: "Fields.ContactEmailAddress",
                            })}
                            value={contact.emailAddress || ""}
                            onChange={(e) =>
                              handleAdditionalContactChange(
                                index,
                                "emailAddress",
                                e.target.value
                              )
                            }
                          />
                        </div>

                        {formik.touched.contactlist?.contacts?.[index + 1]
                          ?.emailAddress &&
                          formik.errors.contactlist?.contacts?.[index + 1]
                            ?.emailAddress && (
                            <div className="fv-plugins-message-container mt-2 ">
                              <div className="fv-help-block ">
                                <span
                                  dangerouslySetInnerHTML={{
                                    __html:
                                      formik.errors.contactlist.contacts[
                                        index + 1
                                      ].emailAddress,
                                  }}
                                  role="alert"
                                />
                              </div>
                            </div>
                          )}
                      </div>
                      <div className="col-4">
                        <input
                          type="text"
                          className="form-control form-control-white"
                          placeholder={intl.formatMessage({
                            id: "Fields.Department",
                          })}
                          value={contact.department || ""}
                          onChange={(e) =>
                            handleAdditionalContactChange(
                              index,
                              "department",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                    <div className="row d-flex mb-7">
                      <div className="col-6">
                        <div className="input-group">
                          <span className="input-group-text" id="basic-addon1">
                            <i className="fa fa-phone" />
                          </span>
                          <input
                            type="text"
                            name="phoneNr"
                            placeholder={intl.formatMessage({
                              id: "Fields.PhoneNr",
                            })}
                            value={contact.phoneNr || ""}
                            className="form-control form-control-white"
                            onChange={(e) =>
                              handleAdditionalContactChange(
                                index,
                                "phoneNr",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="input-group">
                          <span className="input-group-text " id="basic-addon1">
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
                            value={contact.mobileNr || ""}
                            className="form-control form-control-white"
                            onChange={(e) =>
                              handleAdditionalContactChange(
                                index,
                                "mobileNr",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div className="text-end ">
                      <button
                        type="button"
                        className="btn btn-icon btn-danger"
                        onClick={() => handleRemoveContact(contact.id, index)}
                      >
                        <i className="ki-solid ki-trash text-white fs-2 "></i>
                        {/* {intl.formatMessage({ id: "Fields.ActionDelete" })} */}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add New Contact Button */}
        <div className="text-end ">
          <button
            type="button"
            className="btn btn-primary align-items-center"
            onClick={handleAddAccordion}
          >
            <i className="ki-duotone ki-plus-square fs-1 text-white">
              <span className="path1"></span>
              <span className="path2"></span>
              <span className="path3"></span>
            </i>
            <span>
              {intl.formatMessage({ id: "Fields.ModalNewTitleClientContact" })}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};

export { ClientAddStep2 };
