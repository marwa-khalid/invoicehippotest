import Select from "react-select";
import { useIntl } from "react-intl";
import { FormValues } from "../quote-add-modal/QuoteAddStep1";
import { FormikProps } from "formik";
import { KTIcon, toAbsoluteUrl } from "../../../../../../_metronic/helpers";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { getInboxAttachments, uploadAttachments } from "../core/_requests";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { handleToast } from "../../../../auth/core/_toast";
import { Tooltip } from "@chakra-ui/react";
import { ListPagination } from "../../../components/ListPagination";
import { QuoteViewModal } from "../quote-view-modal/QuoteViewModal";
import Tippy from "@tippyjs/react";

// Set the dropzone container id

interface Props {
  formik: FormikProps<FormValues>;
  setAttachmentsModalOpen: (type: boolean) => void;
}
const AttachmentsModal = ({ formik, setAttachmentsModalOpen }: Props) => {
  const intl = useIntl();

  const getPaginationValues = () => {
    const storedPaginationString = localStorage.getItem("pagination")!;
    if (storedPaginationString) {
      const pagination = JSON.parse(storedPaginationString);
      const currentPage = pagination["attachment-picker"].pageIndex || 1;
      const currentSearchTerm =
        pagination["attachment-picker"].filters.searchTerm || "";

      return {
        currentPage,
        currentSearchTerm,
      };
    }
    return {
      currentPage: 1,
      currentSearchTerm: "",
    };
  };

  const { currentPage, currentSearchTerm } = getPaginationValues();
  const [counter, setCounter] = useState(false);
  const [pageIndex, setPageIndex] = useState<number>(currentPage);
  const [tempFiles, setTempFiles] = useState<any>([]);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>(currentSearchTerm);
  const [localSearchTerm, setLocalSearchTerm] = useState<string>(searchTerm);
  const [attachments, setAttachments] = useState<any>([]);
  const [progressList, setProgressList] = useState<number[]>([]);
  const [completedFiles, setCompletedFiles] = useState<any>([]);
  const maxSize = 5 * 1024 * 1024;
  const maxFiles = 25;

  const handleSearchClick = () => {
    setSearchTerm(localSearchTerm);
    setCounter(!counter);
    setPageIndex(1);

    let storedPaginationString = localStorage.getItem("pagination");

    // Parse the JSON string to get the JavaScript object, or initialize an empty object if it doesn't exist
    let pagination = storedPaginationString
      ? JSON.parse(storedPaginationString)
      : JSON.parse(import.meta.env.VITE_APP_PAGINATION);

    // Update the filter in the module
    pagination["attachment-picker"].filters.searchTerm = localSearchTerm;

    // Convert the updated object back to a JSON string
    const updatedPaginationString = JSON.stringify(pagination);

    // Store the updated JSON string in local storage
    localStorage.setItem("pagination", updatedPaginationString);
  };
  const handleReset = () => {
    localStorage.setItem(
      "pagination",
      JSON.stringify({
        ...JSON.parse(localStorage.getItem("pagination") || "{}"),
        "attachment-picker": {
          ...JSON.parse(localStorage.getItem("pagination") || "{}")[
            "attachment-picker"
          ],
          filters: {
            searchTerm: "",
          },
          pageIndex: 1,
        },
      })
    );
    setLocalSearchTerm("");
    setSearchTerm("");
    setPageIndex(1);
  };

  const onDrop = useCallback(
    (acceptedFiles: any[]) => {
      if (acceptedFiles.length > maxFiles) {
        toast.warning("Can't uplaod more than 25 files at a time.");
        return;
      }

      const validFiles = acceptedFiles.filter((file) => file.size <= maxSize);
      validFiles.forEach((file) => {
        if (file.size > maxSize) {
          toast.warning(`File ${file.name} exceeds maximum size of 5MB.`);
        }
      });

      setTempFiles((prevFiles: any) => [...prevFiles, ...validFiles]);
    },
    [tempFiles]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg", ".png"],
      "application/pdf": [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".txt"],
      archives: [".zip", ".rar"],
    },
    maxSize,
  });
  const updateProgressBars = () => {
    const intervalId = setInterval(() => {
      setProgressList((prev) => {
        const updatedProgress = prev.map((progress) =>
          Math.min(progress + 10, 100)
        );
        if (updatedProgress.every((value) => value === 100)) {
          clearInterval(intervalId);
          // Stop when all uploads are complete
        }
        return updatedProgress;
      });
    }, 200);
  };

  const fetchAttachments = async () => {
    const response = await getInboxAttachments(searchTerm, pageIndex);
    if (response.isValid) {
      setAttachments(response);
    }
  };
  useEffect(() => {
    fetchAttachments();
  }, [searchTerm, pageIndex, counter]);
  const removeFile = (file: any) => {
    setTempFiles((prevFiles: any) => prevFiles.filter((f: any) => f !== file));
  };

  const handlePageChange = (page: number) => {
    setPageIndex(page);
  };

  const handleLink = (attachment: any) => {
    if (formik.values.attachments.attachments.length >= 5) {
      toast.warning(
        intl.formatMessage({
          id: "System.AccessValidation_MaxAttachmentUploadOnCommon",
        })
      );
      return;
    } else {
      formik.setFieldValue("attachments.attachments", [
        ...(formik.values.attachments.attachments || []),
        attachment,
      ]);
    }
    formik.setFieldValue("attachments.attachmentsToLink", [
      ...(formik.values.attachments.attachmentsToLink || []),
      {
        inboxItemId: attachment.inboxItemId,
        attachmentId: attachment.fileId,
        isRemoved: false,
        restoreAttachment: true,
        isDirectFileReference: false,
      },
    ]);
  };

  const uploadAllFiles = async () => {
    setUploading(true);
    setProgressList(new Array(tempFiles.length).fill(0)); // Initialize all progress bars at 0

    // Simulate progress bar update
    const result = updateProgressBars();

    try {
      const formData = new FormData();
      tempFiles.forEach((file: any) => {
        formData.append("files", file);
      });

      const response = await uploadAttachments(formData);
      let attachmentsToAdd: any[] = [];
      let attachmentsToLink: any[] = [];
      let currentAttachmentCount = formik.values.attachments.attachments.length;
      setTimeout(() => {
        if (response.isValid) {
          response.extraResult.forEach((result: any) => {
            const newAttachmentsCount = response.extraResult.length;

            // Collect all attachments in arrays before updating Formik values

            // Check if the total exceeds 5

            if (currentAttachmentCount < 5) {
              attachmentsToAdd.push(result);
              attachmentsToLink.push({
                inboxItemId: result.inboxItemId,
                attachmentId: result.fileId,
                isRemoved: false,
                restoreAttachment: true,
                isDirectFileReference: false,
              });
              currentAttachmentCount++;
            } else {
              toast.warning(
                intl.formatMessage({
                  id: "System.AccessValidation_MaxAttachmentUploadOnCommon",
                })
              );
              return; // Exit if limit is exceeded}

              // Collect each attachment for both `attachments.attachments` and `attachments.attachmentsToLink`
            }
          });

          // Update Formik values once after processing all files
          formik.setFieldValue("attachments.attachments", [
            ...(formik.values.attachments.attachments || []),
            ...attachmentsToAdd,
          ]);

          formik.setFieldValue("attachments.attachmentsToLink", [
            ...(formik.values.attachments.attachmentsToLink || []),
            ...attachmentsToLink,
          ]);

          // Update completed files and reset temp state
          setCompletedFiles((prevFiles: any) => [...prevFiles, ...tempFiles]);
          setTempFiles([]);
          setUploading(false);
          setProgressList([]);
        }

        handleToast(response);
      }, 2000);
    } catch (error) {
      console.error("Error processing upload:", error);
    }
  };

  useEffect(() => {}, []);
  const [downloadUrl, setDownloadUrl] = useState<string>("");
  const [fileExtension, setFileExtension] = useState<any>();

  return (
    <>
      <div
        className="modal fade show d-block"
        tabIndex={-1}
        role="dialog"
        id="attacgments_add_modal"
        aria-modal="true"
        style={{ maxHeight: "100vh" }}
      >
        <div className="modal-dialog mw-900px" style={{ maxHeight: "100vh" }}>
          <div className="modal-content ">
            <div className="modal-header d-flex flex-column bg-dark pb-3">
              <div className="d-flex justify-content-between align-items-center w-100">
                <div>
                  <h2 className="fw-bold text-white">
                    {intl.formatMessage({
                      id: "Fields.InboxUploadModuleTabUpload",
                    })}
                  </h2>
                </div>
                <div
                  className="btn btn-icon btn-sm btn-active-icon-primary"
                  onClick={() => setAttachmentsModalOpen(false)}
                  style={{ cursor: "pointer" }}
                >
                  <KTIcon iconName="cross" className="fs-2x text-white" />
                </div>
              </div>
            </div>
            <div className="modal-body " style={{ minHeight: "300px" }}>
              <QuoteViewModal
                downloadUrl={downloadUrl}
                fileExtension={fileExtension}
              />
              <ul className="nav nav-tabs nav-line-tabs nav-line-tabs-2xe mb-5 fs-6 align-items-center d-flex justify-content-start">
                <li className="nav-item">
                  <a
                    className="nav-link active d-flex align-items-center justify-content-center"
                    data-bs-toggle="tab"
                    href="#kt_tab_pane_1"
                  >
                    <i className="la la-cloud-upload-alt me-2 fs-2" />
                    {intl.formatMessage({
                      id: "Fields.InboxUploadModuleTabUpload",
                    })}
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link d-flex align-items-center justify-content-center"
                    data-bs-toggle="tab"
                    href="#kt_tab_pane_2"
                  >
                    <i className="la la-list me-2 fs-2" />

                    {intl.formatMessage({
                      id: "Fields.InboxUploadModuleTabOverview",
                    })}
                  </a>
                </li>
              </ul>

              <div className="tab-content" id="myTabContent">
                <div
                  className="tab-pane fade show active"
                  id="kt_tab_pane_1"
                  role="tabpanel"
                >
                  <form className="form">
                    <div className="form-group row px-10">
                      <div className="dropzone dropzone-queue mb-2">
                        <input {...getInputProps()} />

                        <div
                          className="d-flex info-container p-5 bg-light-primary my-5 alert"
                          {...getRootProps()}
                        >
                          <div className="col-1 ms-5">
                            <i className="ki-duotone ki-information-4 fs-3x text-center text-primary ">
                              <span className="path1"></span>
                              <span className="path2"></span>
                              <span className="path3"></span>
                            </i>
                          </div>
                          <div className="col-10">
                            <span
                              dangerouslySetInnerHTML={{
                                __html: intl.formatMessage({
                                  id: "Fields.InboxUploadModuleInfo",
                                }),
                              }}
                            />
                          </div>
                        </div>

                        <div className="dropzone-items gap-10">
                          {completedFiles?.length > 0 &&
                            completedFiles.map((file: any, index: number) => (
                              <div className="dropzone-item" key={index}>
                                <div className="dropzone-file">
                                  <div
                                    className="dropzone-filename"
                                    title={file.name}
                                  >
                                    <span>{file.name}</span>{" "}
                                    <strong>
                                      ({Math.round(file.size / 1024)} KB)
                                    </strong>
                                  </div>
                                </div>

                                <div className="dropzone-toolbar">
                                  <i className="ki-duotone ki-double-check text-success fs-1">
                                    <span className="path1"></span>
                                    <span className="path2"></span>
                                  </i>
                                </div>
                              </div>
                            ))}
                          {tempFiles?.length > 0 &&
                            tempFiles.map((file: any, index: number) => (
                              <div className="dropzone-item" key={index}>
                                <div className="dropzone-file">
                                  <div
                                    className="dropzone-filename"
                                    title={file.name}
                                  >
                                    <span>{file.name}</span>{" "}
                                    <strong>
                                      ({Math.round(file.size / 1024)} KB)
                                    </strong>
                                  </div>
                                </div>

                                <div className="dropzone-progress">
                                  <div className="progress bg-gray-300">
                                    <div
                                      className="progress-bar bg-primary"
                                      role="progressbar"
                                      style={{
                                        width: `${progressList[index] || 0}%`,
                                      }}
                                    ></div>
                                  </div>
                                </div>

                                <div className="dropzone-toolbar">
                                  {/* {!completedFiles[index] && (
                                  <span
                                    className="dropzone-start"
                                    onClick={() =>
                                      uploadSingleFile(file, index)
                                    }
                                  >
                                    <i className="bi bi-play-fill fs-3"></i>
                                  </span>
                                )} */}

                                  <span
                                    className="dropzone-delete"
                                    onClick={() => removeFile(file)}
                                  >
                                    <i className="bi bi-x fs-1"></i>
                                  </span>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </form>

                  <div className="separator mb-10"></div>
                  <div className=" d-flex justify-content-between">
                    <button
                      type="button"
                      className="btn btn-dark me-2 text-start "
                      {...getRootProps()}
                    >
                      <i className="ki-duotone ki-add-files fs-1 me-1">
                        <span className="path1"></span>
                        <span className="path2"></span>
                        <span className="path3"></span>
                      </i>
                      {intl.formatMessage({
                        id: "Fields.FileManagerBrowseFile",
                      })}
                    </button>

                    <div className="d-flex">
                      <button
                        type="button"
                        className="btn btn-dark me-2 text-start align-items-center d-flex"
                        onClick={uploadAllFiles}
                        disabled={uploading || tempFiles.length === 0}
                      >
                        <i className="fa-solid fa-cloud-arrow-up me-1 fs-3"></i>
                        {uploading ? "Uploading..." : "Upload"}
                      </button>
                    </div>
                  </div>
                </div>
                <div
                  className="tab-pane fade"
                  id="kt_tab_pane_2"
                  role="tabpanel"
                >
                  <div className="d-flex align-items-center position-relative mb-5 gap-2 ">
                    <KTIcon
                      iconName="magnifier"
                      className="fs-3 position-absolute ms-6"
                    />

                    <input
                      type="text"
                      data-kt-user-table-filter="search"
                      className="form-control form-control-solid w-100 ps-14 rounded-lg me-6"
                      placeholder={intl.formatMessage({
                        id: "Fields.SearchTerm",
                      })}
                      value={localSearchTerm}
                      onChange={(e) => {
                        e.preventDefault();
                        setLocalSearchTerm(e.target.value);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSearchClick();
                        }
                      }}
                    />
                    <div className="btn-group">
                      <button
                        className="btn btn-primary d-inline-flex align-items-center"
                        onClick={handleSearchClick}
                      >
                        <i className="la la-search fs-2"></i>
                        <span className="ms-1">
                          {intl.formatMessage({ id: "Fields.SearchBtn" })}
                        </span>
                      </button>

                      <button
                        className="btn btn-secondary btn-icon"
                        onClick={() => handleReset()}
                      >
                        <i className="la la-remove fs-3"></i>
                      </button>
                    </div>
                  </div>
                  <div className="">
                    {attachments?.result?.length > 0 ? (
                      attachments?.result?.map((attachment: any) => (
                        <>
                          <div
                            className="d-flex align-items-center justify-content-between py-3"
                            key={attachment.id}
                          >
                            {/* Image Section */}
                            <div className="me-3">
                              {attachment.fileType.name == "AdobePdf" ? (
                                <img
                                  alt="PDF"
                                  src="/media/svg/024-pdf.svg"
                                  width={60}
                                  height={60}
                                />
                              ) : attachment.fileType.name == "Png" ? (
                                <img
                                  alt="PNG"
                                  src="/media/svg/025-png.svg"
                                  width={60}
                                  height={60}
                                />
                              ) : (
                                <img
                                  alt="JPG"
                                  src="/media/svg/017-jpg.svg"
                                  width={60}
                                  height={60}
                                />
                              )}
                            </div>

                            {/* Document Date and File Info */}
                            <div className="flex-grow-1">
                              <div className="d-flex flex-column">
                                <div>
                                  <span className="badge bg-gray-200 mb-3">
                                    <i className="ki-duotone ki-calendar me-1 fs-1 text-primary">
                                      <span className="path1"></span>
                                      <span className="path2"></span>
                                    </i>
                                    {attachment.documentDateAsString}
                                  </span>
                                </div>
                                <div>
                                  <span
                                    className="fw-bold me-3 cursor-pointer"
                                    onClick={(e) => {
                                      handleLink(attachment);
                                    }}
                                  >
                                    {attachment.fileName}
                                  </span>
                                  {/* Breadcrumb for InvoiceNr */}
                                  <span className="badge bg-light-primary py-2">
                                    {attachment.sizeDescription} KB
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* File Size */}
                            <div className="text-end me-3"></div>

                            {/* Tooltip Buttons */}
                            <div className="text-end">
                              {/* {attachment.actions.ca} */}
                              <Tippy
                                content={intl.formatMessage({
                                  id: "Fields.ToolTipView",
                                })}
                              >
                                <button
                                  className="btn btn-icon btn-dark btn-sm me-2 cursor-pointer "
                                  data-bs-toggle="offcanvas"
                                  data-bs-target="#offcanvasRight"
                                  aria-controls="offcanvasRight"
                                  onClick={() => {
                                    setDownloadUrl(
                                      attachment.downloadInfo.downloadUrl
                                    );
                                    setFileExtension(
                                      attachment.downloadInfo.fileExtension
                                    );
                                  }}
                                >
                                  <i className="ki-duotone ki-eye fs-1">
                                    <span className="path1"></span>
                                    <span className="path2"></span>
                                    <span className="path3"></span>
                                  </i>
                                </button>
                              </Tippy>

                              {/* Pin Button */}
                              {!formik.values.attachments?.attachments?.find(
                                (item) => item.id === attachment.id
                              ) && (
                                <Tippy
                                  content={intl.formatMessage({
                                    id: "Fields.ToolTipLinkAttachment",
                                  })}
                                >
                                  <button
                                    className="btn btn-icon btn-primary btn-sm"
                                    onClick={(e) => {
                                      handleLink(attachment);
                                    }}
                                  >
                                    <i className="ki-duotone ki-pin text-white fs-2">
                                      <span className="path1"></span>
                                      <span className="path2"></span>
                                    </i>
                                  </button>
                                </Tippy>
                              )}
                            </div>
                          </div>
                          <div className="separator border-10 my-5"></div>
                        </>
                      ))
                    ) : (
                      <div className="text-center my-10">
                        <img
                          alt=""
                          src={toAbsoluteUrl("media/logos/searchnotfound.png")}
                          className="h-250px w-350px"
                        />
                        <h4>
                          {intl.formatMessage({
                            id: "Fields.SearchNoItemsAvailableDefault",
                          })}
                        </h4>
                      </div>
                    )}
                    {attachments?.totalRows !== 0 && (
                      <ListPagination
                        totalPages={attachments.totalPages}
                        pageIndex={attachments.pageIndex}
                        onPageChange={handlePageChange}
                        totalItems={attachments.totalRows}
                        moduleName="attachment-picker"
                      />
                    )}
                  </div>

                  {/* <div className="modal-footer d-flex justify-content-end">
                    <button
                      type="button"
                      className="btn btn-secondary me-3"
                      data-bs-dismiss="modal"
                      data-bs-target="client_add_modal"
                      onClick={() => {
                        setAttachmentsModalOpen(false);
                      }}
                    >
                      {intl.formatMessage({ id: "Fields.ActionCancel" })}
                    </button>
                    <div className="btn-group ">
                      <button type="submit" className="btn btn-warning ">
                        <i className="fa fas fa-save fs-2 me-2"></i>
                        {intl.formatMessage({ id: "Fields.ActionSave" })}
                      </button>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="modal-backdrop fade show m-0"></div>
    </>
  );
};

export { AttachmentsModal };
