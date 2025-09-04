import { useIntl } from "react-intl";
import { AttachmentDeleteModal } from "./attachment-delete/AttachmentDeleteModal";
import Tippy from "@tippyjs/react";
import { AttachmentsResult } from "../../accounting/bookings/components/core/_models";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface AttachmentProps {
  attachments: AttachmentsResult[] | Record<number, AttachmentsResult[]>;
  isBgGray?: boolean;
  formik?: any;
  setIsCollapsed?: (type: boolean) => void;
  isCollapsed?: boolean;
  restoreModalOpen?: boolean;
  setRestoreModalOpen?: (type: boolean) => void;
  selectedAttachment?: any;
  setDownloadUrl?: (type: string) => void;
  handleDelete?: (type: any) => void;
  setKey: Dispatch<SetStateAction<number>>;
  id?: number;
}
const AttachmentListing = ({
  attachments,
  formik,
  isBgGray,
  setIsCollapsed,
  isCollapsed,
  setDownloadUrl,
  restoreModalOpen,
  selectedAttachment,
  setRestoreModalOpen,
  handleDelete,
  setKey,
  id,
}: AttachmentProps) => {
  const intl = useIntl();

  return (
    <>
      {restoreModalOpen && setRestoreModalOpen && (
        <AttachmentDeleteModal
          attachment={selectedAttachment}
          setRestoreModalOpen={setRestoreModalOpen}
          formik={formik}
        />
      )}
      {attachments && Object.keys(attachments).length > 0 && (
        <div className={`p-5 ${isBgGray && "bg-secondary"}`}>
          {setIsCollapsed && (
            <div
              className="d-flex align-items-center mb-3 cursor-pointer "
              onClick={() => {
                if ((attachments as AttachmentsResult[]).length > 1) {
                  setIsCollapsed(!isCollapsed);
                }
              }}
            >
              <h2 className="me-2 position-relative pe-3">
                {intl.formatMessage({ id: "Fields.Attachments" })}
                <span className="position-absolute bottom-60 start-100 translate-middle badge badge-circle badge-sm badge-primary text-white fs-9">
                  {Object.keys(attachments).length}
                </span>
              </h2>

              {(attachments as AttachmentsResult[]).length > 1 && (
                <i
                  className={`fa fa-chevron-${
                    isCollapsed ? "down" : "up"
                  } ms-2 mb-1`}
                ></i>
              )}
            </div>
          )}
          {/* Collapsible section for multiple attachments */}
          <div className={`collapse ${!isCollapsed ? "show" : ""}`}>
            {(id
              ? (attachments as Record<number, AttachmentsResult[]>)[id]
              : (attachments as AttachmentsResult[])
            )?.map((attachment: AttachmentsResult, index: number) => (
              <div key={index}>
                <div className="d-flex align-items-center justify-content-between mb-2 p-5">
                  <div className="d-flex align-items-center">
                    {attachment?.fileType?.value === 6 ? (
                      <img
                        src="/media/svg/024-pdf.svg"
                        width={50}
                        height={50}
                        alt="pdf"
                      />
                    ) : attachment?.fileType?.value === 3 ? (
                      <img
                        alt="PNG"
                        src="/media/svg/025-png.svg"
                        width={50}
                        height={50}
                      />
                    ) : (
                      <img
                        src="/media/svg/017-jpg.svg"
                        width={50}
                        height={50}
                        alt="jpg"
                      />
                    )}

                    <div className="ms-2">
                      <span
                        className="text-primary fw-bold cursor-pointer"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#offcanvasRight"
                        aria-controls="offcanvasRight"
                        onClick={() => {
                          setDownloadUrl?.(
                            attachment?.downloadInfo?.downloadUrl
                          );
                          setKey((prev) => prev + 1);
                        }}
                      >
                        {attachment?.fileName}
                      </span>
                      <div className="text-muted small">
                        {attachment.fileType?.value}{" "}
                        {attachment.fileType?.description} &bull;{" "}
                        {attachment.sizeDescription}
                      </div>
                    </div>
                  </div>

                  <div className="d-flex">
                    {setDownloadUrl && attachment.actions?.canView && (
                      <Tippy
                        content={intl.formatMessage({
                          id: "Fields.ToolTipView",
                        })}
                      >
                        <button
                          type="button"
                          className="btn btn-icon btn-dark btn-sm me-2"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#offcanvasRight"
                          aria-controls="offcanvasRight"
                          onClick={() => {
                            setDownloadUrl(attachment.downloadInfo.downloadUrl);
                            setKey((prev) => prev + 1);
                          }}
                        >
                          <i className="ki-solid ki-eye fs-1"></i>
                        </button>
                      </Tippy>
                    )}
                    {attachment.actions?.canDownload && (
                      <Tippy
                        content={intl.formatMessage({
                          id: "Fields.ToolTipDownloadAttachment",
                        })}
                      >
                        <button
                          type="button"
                          className="btn btn-icon btn-primary btn-sm me-2"
                          onClick={() => {
                            const link = document.createElement("a");
                            link.href = attachment.downloadInfo.downloadUrl;
                            link.setAttribute("download", attachment.fileName);
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }}
                        >
                          <i className="fa-solid fa-cloud-arrow-down"></i>
                        </button>
                      </Tippy>
                    )}
                    {handleDelete && attachment.actions?.canDelete && (
                      <Tippy
                        content={intl.formatMessage({
                          id: "Fields.ToolTipDelete",
                        })}
                      >
                        <button
                          type="button"
                          className="btn btn-icon btn-danger btn-sm me-2"
                          onClick={() => handleDelete(attachment)}
                        >
                          <i className="ki-solid ki-trash text-white fs-2"></i>
                        </button>
                      </Tippy>
                    )}
                  </div>
                </div>

                {index <
                  (id
                    ? (attachments as Record<number, AttachmentsResult[]>)[id]
                        ?.length
                    : (attachments as AttachmentsResult[])?.length) -
                    1 && (
                  <div
                    className={`separator border-10 my-5 ${
                      isBgGray ? "border-gray-300" : ""
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export { AttachmentListing };
