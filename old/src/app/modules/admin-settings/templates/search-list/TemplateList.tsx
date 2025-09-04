import React, { useEffect, useState } from "react";
import { TemplateListResult, TemplateListModel } from "../core/_models";
import { getTemplates } from "../core/_requests";
import { useIntl } from "react-intl";
import Tippy from "@tippyjs/react";
import { KTCardBody, toAbsoluteUrl } from "../../../../../_metronic/helpers";
import { NoItemsPage } from "../../../generic/NoItemsPage";
import { ListLoading } from "../../../generic/ListLoading";
import { ListPagination } from "../../../generic/ListPagination";
import ListCard from "../../../generic/ListElements/ListCard";
import { getEnumOptions } from "../../../../helpers/intlHelper";
import enums from "../../../../../_metronic/i18n/messages/invoicehippo.enums.json";

export const getStatusClass = (statusValue50: number): string => {
  switch (statusValue50) {
    case 1:
      return "bg-gray-600";
    case 2:
      return "bg-success";
    case 3:
      return "bg-primary";
    case 4:
      return "bg-danger";
    default:
      return "bg-gray-600";
  }
};

interface ComponentProps {
  searchTerm: string;
  setTotalRows: (type: number) => void;
  setDeleteModalOpen: (type: boolean) => void;
  refresh: boolean;
  setPageIndex: (type: number) => void;
  pageIndex: number;
  searchCounter: number;
  setTemplates: React.Dispatch<
    React.SetStateAction<TemplateListModel | undefined>
  >;
  templates: TemplateListModel | undefined;
  setAddModalOpen: (type: boolean) => void;
  setPublishModalOpen: (type: boolean) => void;
  setEditModalId: (type: number) => void;
  setTranslationKey: (type: string) => void;
  subscriberIdForFilter: number | null;
  statusType: number;
}
const TemplateList = ({
  searchTerm,
  setTotalRows,
  setDeleteModalOpen,
  setAddModalOpen,
  setEditModalId,
  searchCounter,
  refresh,
  setPageIndex,
  pageIndex,
  setTemplates,
  templates,
  setTranslationKey,
  setPublishModalOpen,
  statusType,
  subscriberIdForFilter,
}: ComponentProps) => {
  const intl = useIntl();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchTemplate = async () => {
    setIsLoading(true);
    try {
      const response = await getTemplates(
        pageIndex,
        searchTerm,
        25,
        statusType,
        subscriberIdForFilter
      );
      if (response.isValid) {
        setTemplates(response);
        setTotalRows(response.totalRows);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching templates List:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handlePageChange = (page: number) => {
    setPageIndex(page);
  };

  useEffect(() => {
    fetchTemplate();
  }, [
    pageIndex,
    searchCounter,
    refresh,
    searchTerm,
    statusType,
    subscriberIdForFilter,
  ]);

  const handleDelete = async (template: TemplateListResult) => {
    setTranslationKey(template.title);
    setEditModalId(template.id);
    setDeleteModalOpen(true);
  };
  const openPublishModal = async (template: TemplateListResult) => {
    setTranslationKey(template.title);
    setEditModalId(template.id);
    setPublishModalOpen(true);
  };
  const openEditModal = (id: number) => {
    setEditModalId(id);
    setAddModalOpen(true);
  };

  return (
    <KTCardBody>
      <div className="row row-cols-1 row-cols-md-1 g-10">
        {templates?.result?.map((template: TemplateListResult) => (
          <ListCard key={template.id}>
            <div
              className="position-absolute cursor-pointer rounded"
              style={{
                top: "-12px",
                left: "-14px",
                width: "63px",
                height: "88px",
                backgroundColor: "white",
              }}
              onClick={(e) => {
                e.preventDefault();
                openEditModal(template.id);
              }}
              onContextMenu={(e) => {
                e.preventDefault(); // Prevent navigation for drafts
                openEditModal(template.id);
              }}
            >
              <div>
                {template.hasPreviewImage ? (
                  <img
                    src={template.previewImageFileUrl}
                    alt="preview"
                    style={{
                      objectFit: "fill",
                      width: "63px",
                      height: "88px",
                      border: "1px solid #ddd",
                      padding: "3px",
                    }}
                    className="rounded"
                  />
                ) : (
                  <img
                    src={toAbsoluteUrl(
                      "media/svg/brand-logos/office-building.svg"
                    )}
                    alt="Default Logo"
                    style={{
                      objectFit: "fill",
                      width: "63px",
                      height: "88px",
                      border: "1px solid #ddd",
                      padding: "3px",
                    }}
                    className="rounded"
                  />
                )}
              </div>
            </div>
            <div
              className="ribbon ribbon-end ribbon-clip position-absolute cursor-pointer"
              style={{
                top: "-12px",
                right: "0px",
                height: "70px",
                width: "300px",
              }}
            >
              <div
                className={`ribbon-label fw-bold ${getStatusClass(
                  template.statusType.value
                )} `}
              >
                {getEnumOptions(enums.TemplateStatusTypes, intl)
                  .find((item) => item.value === template.statusType.value)
                  ?.label.toLowerCase()}
                <span
                  className={`ribbon-inner ${getStatusClass(
                    template.statusType.value
                  )} `}
                ></span>
              </div>
            </div>

            <div className="card-body pt-0 pb-6 ps-0">
              {/* First Row: Checkbox, Divider, Value */}
              <div className="d-flex align-items-center justify-content-between">
                <div
                  className="d-flex flex-column gap-2 ms-20 cursor-pointer title-clickable text-primary"
                  onClick={() => {
                    openEditModal(template.id);
                  }}
                >
                  <strong>{template.title}</strong>
                  {template.hasOwner && (
                    <small className="text-gray-500 fs-9">
                      {template.owner.fullName}
                    </small>
                  )}
                </div>
                <div className="d-flex my-lg-0 necessary-icons pt-8">
                  {template.actions.canEdit && (
                    <Tippy
                      content={intl.formatMessage({
                        id: "Fields.ToolTipEdit",
                      })}
                    >
                      <button
                        className="btn btn-icon btn-light btn-sm me-4 cursor-pointer"
                        onClick={() => {
                          openEditModal(template.id);
                        }}
                      >
                        <i className="ki-solid ki-pencil text-warning fs-2"></i>
                      </button>
                    </Tippy>
                  )}
                  {template.actions.canPublish && (
                    <Tippy content="publish">
                      <button
                        className="btn btn-icon btn-light btn-sm me-4 cursor-pointer"
                        onClick={() => {
                          openPublishModal(template);
                        }}
                      >
                        <i className="ki-solid ki-add-files text-info fs-2"></i>
                      </button>
                    </Tippy>
                  )}

                  {template.actions.canDelete && (
                    <Tippy
                      content={intl.formatMessage({
                        id: "Fields.ToolTipDelete",
                      })}
                    >
                      <button
                        className="btn btn-icon btn-light btn-sm cursor-pointer"
                        onClick={() => {
                          handleDelete(template);
                        }}
                      >
                        <i className="ki-solid ki-trash text-danger fs-2"></i>
                      </button>
                    </Tippy>
                  )}
                </div>
              </div>
            </div>
          </ListCard>
        ))}

        {templates?.result?.length == 0 && <NoItemsPage />}
        {isLoading && <ListLoading />}
      </div>

      {templates && templates.result?.length > 0 && (
        <ListPagination
          totalPages={templates.totalPages}
          pageIndex={pageIndex}
          onPageChange={handlePageChange}
          totalItems={templates.totalRows}
          moduleName="template-module"
        />
      )}
    </KTCardBody>
  );
};

export { TemplateList };
