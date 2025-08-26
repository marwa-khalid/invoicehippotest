import { FC } from "react";
import { useIntl } from "react-intl";
import { FormikProps } from "formik";
import { Document, TemplatePost } from "../core/_models";
import { getEnumOptions } from "../../../../helpers/intlHelper";
import enums from "../../../../../_metronic/i18n/messages/invoicehippo.enums.json";

type Props = {
  formik: FormikProps<TemplatePost>;
  refresh: boolean;
  setRefresh: (type: boolean) => void;
  setAttachmentsModalOpen: (type: boolean) => void;
  setType: (type: any) => void;
  setInfo: (type: string) => void;
};

const TemplateAddStep2: FC<Props> = ({
  formik,
  setAttachmentsModalOpen,
  setType,
  setInfo,
}) => {
  const intl = useIntl();
  // const templateTypes =
  //   formik.values.categoryType === 1
  //     ? getEnumOptions(enums.TemplateDocumentTypes, intl).filter((t) =>
  //         [1, 3, 4, 5].includes(t.value)
  //       )
  //     : getEnumOptions(enums.TemplateDocumentTypes, intl).filter(
  //         (t) => t.value === 2
  //       );
  const templateTypes = getEnumOptions(enums.TemplateDocumentTypes, intl);
  // inside the parent component (the one rendering LocalizationAddStep2)

  const handleDeleteFile = (docTypeValue: number, fileKind: string) => {
    // 1️⃣ Update Formik
    const updatedDocs = formik.values.documents.map((doc) => {
      if (doc.documentType === docTypeValue) {
        return {
          ...doc,
          [fileKind]: 0, // remove the file ID
        };
      }
      if (fileKind === "wordTemplateDocumentFileId") {
        doc.wordTemplateDocumentFileName = "";
        doc.hasWordTemplateDocumentFileName = false;
      } else if (fileKind === "htmlTemplateDocumentFileId") {
        doc.htmlTemplateDocumentFileName = "";
        doc.hasHtmlTemplateDocumentFileName = false;
      }
      return doc;
    });
    formik.setFieldValue("documents", updatedDocs);
  };
  const renderFileBox = (
    label: string,
    docTypeValue: number,
    fileKind: "htmlTemplateDocumentFileId" | "wordTemplateDocumentFileId",
    accept: Record<string, string[]>,
    fileTypes: number[],
    fileName: string,
    hasFile: boolean,
    info: string
  ) => {
    return (
      <div className="d-flex flex-column align-items-center">
        {/* File box */}
        {hasFile ? (
          <div
            className="border rounded p-3 d-flex flex-column align-items-center justify-content-center position-relative"
            style={{ width: "120px", minHeight: "100px" }}
          >
            {fileKind.includes("html") ? (
              <i className="bi bi-filetype-html fs-1 text-danger"></i>
            ) : (
              <i className="bi bi-file-earmark-word fs-1 text-primary"></i>
            )}

            <small
              className="text-truncate mt-1"
              style={{ maxWidth: "100px" }}
              title={fileName}
            >
              {fileName}
            </small>

            <div className="d-flex gap-2 mt-2">
              <i
                className="bi bi-pencil-square text-warning cursor-pointer"
                title="Edit"
                onClick={() => {
                  setInfo(info);
                  setAttachmentsModalOpen(true);
                  setType({
                    key: "templateFile",
                    docTypeValue,
                    fileKind,
                    accept,
                    fileTypes,
                  });
                }}
              ></i>

              <i
                className="bi bi-trash text-danger cursor-pointer"
                title="Delete"
                onClick={() => handleDeleteFile(docTypeValue, fileKind)}
              ></i>
            </div>
          </div>
        ) : (
          <div
            className="border rounded p-4 d-flex flex-column align-items-center justify-content-center hover-shadow cursor-pointer"
            style={{ width: "120px", minHeight: "100px" }}
            onClick={() => {
              setInfo(info);
              setAttachmentsModalOpen(true);
              setType({
                key: "templateFile",
                docTypeValue,
                fileKind,
                accept,
                fileTypes,
              });
            }}
          >
            <span className="fw-semibold mb-2">{label}</span>
            <i className="bi bi-plus-lg fs-2"></i>
          </div>
        )}

        {/* Eye icon placeholder to keep alignment */}
        <div style={{ height: "24px", marginTop: "20px" }}>
          {hasFile && (
            <i
              className="ki-solid ki-eye cursor-pointer text-muted mt-2 p-2 fs-3 rounded bg-secondary"
              title="Preview"
              onClick={() => {
                // You can open a preview modal here
              }}
            ></i>
          )}
        </div>
      </div>
    );
  };

  const chunkedTemplateTypes = [];
  for (let i = 0; i < templateTypes.length; i += 2) {
    chunkedTemplateTypes.push(templateTypes.slice(i, i + 2));
  }

  return (
    <div className="modal-body bg-secondary">
      {/* <ViewCanvas downloadUrl={downloadUrl} keyy={key} /> */}
      <form className="form p-4 " noValidate>
        <div
          className="d-flex alert alert-custom alert-default bg-body align-items-center mb-10"
          style={{ borderRadius: "15px" }}
        >
          <div className="alert-icon col-1 me-4">
            <i className="ki-duotone ki-information-4 fs-3x text-primary">
              <span className="path1"></span>
              <span className="path2"></span>
              <span className="path3"></span>
            </i>
          </div>
          <div className="alert-text col-10">Please upload both documents</div>
        </div>
        {chunkedTemplateTypes.map((pair, rowIndex) => (
          <div key={rowIndex} className="mb-10 d-flex justify-content-between">
            {pair.map((type: any) => {
              // Find the corresponding doc in formik.values.documents
              const matchingDoc =
                formik.values.documents.find(
                  (doc) => doc.documentType === type.value
                ) || ({} as Document);

              return (
                <div
                  key={type.value}
                  className="border-bottom py-6 bg-body px-6 align-items-center justify-content-center text-center gap-10"
                  style={{ borderRadius: "15px" }}
                >
                  <h5 className="fw-bold mb-4 text-start">{type.label}</h5>

                  <div className="d-flex align-items-center justify-content-center gap-10">
                    {renderFileBox(
                      "HTML",
                      type.value,
                      "htmlTemplateDocumentFileId",
                      { "text/html": [".html", ".htm"] },
                      [27],
                      matchingDoc.htmlTemplateDocumentFileName || "",
                      matchingDoc.hasHtmlTemplateDocumentFileName || false,
                      "Fields.HtmlUploadModuleInfo"
                    )}

                    <span
                      style={{
                        width: "1px",
                        height: "90px",
                        backgroundColor: "#ddd",
                        margin: "0 10px",
                        marginBottom: "40px",
                      }}
                    />

                    {renderFileBox(
                      "Word",
                      type.value,
                      "wordTemplateDocumentFileId",
                      {
                        "application/msword": [".doc"],
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                          [".docx"],
                      },
                      [5],
                      matchingDoc.wordTemplateDocumentFileName || "",
                      matchingDoc.hasWordTemplateDocumentFileName || false,
                      "Fields.MsWordUploadModuleInfo"
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </form>
    </div>
  );
};

export { TemplateAddStep2 };
