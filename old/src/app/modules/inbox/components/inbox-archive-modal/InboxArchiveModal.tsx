import { useEffect } from "react";
import { InboxArchiveModalHeader } from "./InboxArchiveModalHeader";
import { InboxArchiveModalFooter } from "./InboxArchiveModalFooter";
import Flatpickr from "react-flatpickr";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useIntl } from "react-intl";
import * as Yup from "yup";
import { archiveInbox } from "../core/_requests";
import { handleToast } from "../../../auth/core/_toast";
import { InboxListResult } from "../core/_models";

interface InboxArchiveModalProps {
  setArchiveModalOpen: (type: boolean) => void;
  setRefresh: (type: boolean) => void;
  refresh: boolean;
  showBackButton: boolean;
  inboxDetail: any;
  archiveTypeList: any;
}

const InboxArchiveModal = ({
  inboxDetail,
  setArchiveModalOpen,
  setRefresh,
  refresh,
  archiveTypeList,
  showBackButton,
}: InboxArchiveModalProps) => {
  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);

  const intl = useIntl();

  // Extract required data safely
  const defaultArchiveFolder = inboxDetail?.archiveType?.value ?? 0;
  const defaultArchiveDate = inboxDetail?.documentDate ?? "";
  const defaultArchiveDescription = inboxDetail?.fileName ?? "";

  // Form Validation Schema
  const validationSchema = Yup.object({
    archiveFolder: Yup.number().required(
      intl.formatMessage({ id: "Validation.Required" })
    ),
    archiveDate: Yup.date().required(
      intl.formatMessage({ id: "Validation.Required" })
    ),
    archiveDescription: Yup.string()
      .min(3, intl.formatMessage({ id: "Validation.MinLength" }))
      .max(255, intl.formatMessage({ id: "Validation.MaxLength" }))
      .required(intl.formatMessage({ id: "Validation.Required" })),
  });

  // Handle form submission
  const handleSubmit = async (values: {
    archiveFolder: number;
    archiveDate: string;
    archiveDescription: string;
  }) => {
    try {
      // Extract required values first
      const inboxItemId = inboxDetail.inboxItemId ?? 0; // Default to 0 if undefined
      const fileId = inboxDetail.fileId ?? 0;

      // Create payload
      const payload = {
        inboxItemId,
        fileId,
        archiveType: Number(values.archiveFolder),
        archiveItemTitle: values.archiveDescription,
        archiveItemDate: values.archiveDate,
      };

      const response = await archiveInbox(payload);

      setArchiveModalOpen(false);
      setRefresh(!refresh);
      handleToast(response);
    } catch (error) {
      console.error("Error archiving:", error);
    }
  };

  return (
    <>
      <div
        className="modal fade show d-block"
        id="kt_modal_copy_inbox"
        role="dialog"
        tabIndex={-1}
        aria-modal="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <InboxArchiveModalHeader
              setArchiveModalOpen={setArchiveModalOpen}
              inboxDetail={inboxDetail}
            />

            {/* Formik Form */}
            <Formik
              initialValues={{
                archiveFolder: defaultArchiveFolder,
                archiveDate: defaultArchiveDate,
                archiveDescription: defaultArchiveDescription,
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ setFieldValue, values }) => (
                <Form className="modal-body p-10" placeholder={undefined}>
                  <div className="row d-flex mb-5">
                    {/* Archive Folder Field */}
                    <div className="col-6">
                      <label className="required fw-bold fs-6 mb-3">
                        {intl.formatMessage({ id: "Fields.ArchiveType" })}
                      </label>
                      <Field
                        as="select"
                        name="archiveFolder"
                        className="form-select form-select-sm form-select-solid"
                      >
                        {archiveTypeList?.leaves &&
                          archiveTypeList?.leaves.map((folder: any) => (
                            <option
                              key={folder.archiveType.value}
                              value={folder.archiveType.value}
                              selected={
                                folder.archiveType.value ===
                                values.archiveFolder
                              }
                            >
                              {folder.archiveType.name}
                            </option>
                          ))}
                      </Field>
                      <ErrorMessage
                        name="archiveFolder"
                        component="div"
                        className="text-danger mt-1"
                      />
                    </div>

                    {/* Archive Date Field */}
                    <div className="col-6">
                      <label className="required fw-bold fs-6 mb-3">
                        {intl.formatMessage({ id: "Fields.ArchiveItemDate" })}
                      </label>
                      <div className="input-group" id="kt_td_picker_date_only">
                        <Flatpickr
                          value={values.archiveDate}
                          onChange={(date: Date[]) =>
                            setFieldValue("archiveDate", date[0].toISOString())
                          }
                          options={{ dateFormat: "d-m-Y" }}
                          className="form-control"
                          placeholder="dd-MM-yyyy"
                        />
                        <ErrorMessage
                          name="archiveDate"
                          component="div"
                          className="text-danger mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Archive Description Field */}
                  <div className="row d-flex">
                    <div className="col-12">
                      <label className="fw-bold fs-6 mb-3">
                        {intl.formatMessage({ id: "Fields.ArchiveTitle" })}
                      </label>
                      <Field
                        type="text"
                        name="archiveDescription"
                        className="form-control form-control-solid"
                        placeholder={intl.formatMessage({
                          id: "Fields.ArchiveTitle",
                        })}
                      />
                      <ErrorMessage
                        name="archiveDescription"
                        component="div"
                        className="text-danger mt-1"
                      />
                    </div>
                  </div>

                  {/* Submit & Footer */}
                  <InboxArchiveModalFooter
                    setArchiveModalOpen={setArchiveModalOpen}
                    setRefresh={setRefresh}
                    refresh={refresh}
                    inboxDetail={inboxDetail}
                    showBackButton={showBackButton}
                  />
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>

      {/* Modal Backdrop */}
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export { InboxArchiveModal };
