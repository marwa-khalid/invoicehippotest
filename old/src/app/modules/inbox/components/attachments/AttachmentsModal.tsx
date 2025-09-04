import { useIntl } from "react-intl";
import { KTIcon } from "../../../../../_metronic/helpers";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { uploadAttachments } from "../core/_requests";
import { toast } from "react-toastify";
import { handleToast } from "../../../auth/core/_toast";

interface Props {
  setRefresh: (type: boolean) => void;
  setAttachmentsModalOpen: (type: boolean) => void;
  archiveTypeList: any;
  isArchive: boolean;
}
const AttachmentsModal = ({
  setAttachmentsModalOpen,
  archiveTypeList,
  setRefresh,
  isArchive,
}: Props) => {
  const intl = useIntl();

  const [tempFiles, setTempFiles] = useState<any>([]);
  const [uploading, setUploading] = useState(false);
  const [archiveType, setArchiveType] = useState<number>(0);
  const [ocr, setOcr] = useState<boolean>(false);
  const [progressList, setProgressList] = useState<number[]>([]);
  const [completedFiles] = useState<any>([]);
  const maxSize = 5 * 1024 * 1024;
  const maxFiles = 25;

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

  const removeFile = (file: any) => {
    setTempFiles((prevFiles: any) => prevFiles.filter((f: any) => f !== file));
  };

  const uploadAllFiles = async () => {
    setUploading(true);
    setProgressList(new Array(tempFiles.length).fill(0)); // Initialize all progress bars at 0

    // Simulate progress bar update
    updateProgressBars();

    try {
      const formData = new FormData();
      tempFiles.forEach((file: any) => {
        formData.append("files", file);
      });

      const response = await uploadAttachments(formData, archiveType, ocr);
      setTimeout(() => {
        if (response.isValid) {
          setUploading(false);
          setAttachmentsModalOpen(false);
          setRefresh(true);
          handleToast(response);
        }
      }, 2000);
    } catch (error) {
      console.error("Error processing upload:", error);
    }
  };

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
                        {/* Archive Folder Field */}
                        {isArchive && (
                          <div className="col-6">
                            <label className="required fw-bold fs-6 mb-3">
                              {intl.formatMessage({ id: "Fields.ArchiveType" })}
                            </label>
                            <select
                              name="archiveFolder"
                              className="form-select form-select-sm form-select-solid"
                              onChange={(e) =>
                                setArchiveType(parseInt(e.target.value))
                              }
                            >
                              {archiveTypeList?.leaves &&
                                archiveTypeList?.leaves.map((folder: any) => (
                                  <option
                                    key={folder.archiveType.value}
                                    value={folder.archiveType.value}
                                  >
                                    {folder.archiveType.name}
                                  </option>
                                ))}
                            </select>
                          </div>
                        )}
                        {!isArchive && (
                          <div className="form-group row pt-3 px-10">
                            <div className="form-check form-switch  mt-1 ms-2 d-flex align-items-center mb-10">
                              <input
                                className="form-check-input h-25px w-45px me-5 cursor-pointer"
                                type="checkbox"
                                id="changeOcrSwitch"
                                onChange={(e) => setOcr(e.target.checked)}
                              />
                              <label
                                className="form-check-label fs-sm text-muted"
                                htmlFor="changeDateSwitch"
                              >
                                {intl.formatMessage({
                                  id: "Fields.RegisterFileUploadForOcr",
                                })}
                              </label>
                            </div>
                          </div>
                        )}
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export { AttachmentsModal };
