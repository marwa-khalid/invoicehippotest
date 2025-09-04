import React, { useEffect, useState } from "react";
import { LocalizationResult, LocalizationModel } from "../core/_models";
import { getLocalizations } from "../core/_requests";
import { useIntl } from "react-intl";
import Tippy from "@tippyjs/react";
import { KTCardBody, KTSVG } from "../../../../../_metronic/helpers";
import { NoItemsPage } from "../../../generic/NoItemsPage";
import { ListLoading } from "../../../generic/ListLoading";
import { ListPagination } from "../../../generic/ListPagination";
import ListCard from "../../../generic/ListElements/ListCard";
import { getEnumOptions } from "../../../../helpers/intlHelper";
import enums from "../../../../../_metronic/i18n/messages/invoicehippo.enums.json";

export const getStatusClass = (statusValue: number): string => {
  switch (statusValue) {
    case 1:
      return "gray-600";
    case 2:
      return "bg-primary";
    case 3:
      return "bg-success";
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
  setRefresh: (type: boolean) => void;
  setLocalizations: React.Dispatch<
    React.SetStateAction<LocalizationModel | undefined>
  >;
  localizations: LocalizationModel | undefined;
  setAddModalOpen: (type: boolean) => void;
  setEditModalId: (type: number) => void;
  setTranslationKey: (type: string) => void;
}
const LocalizationList = ({
  searchTerm,
  setTotalRows,
  setDeleteModalOpen,
  setAddModalOpen,
  setEditModalId,
  searchCounter,
  refresh,
  setPageIndex,
  pageIndex,
  setRefresh,
  setLocalizations,
  localizations,
  setTranslationKey,
}: ComponentProps) => {
  const intl = useIntl();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchLocalization = async () => {
    setIsLoading(true);
    try {
      const response = await getLocalizations(pageIndex, searchTerm, 25);
      if (response.isValid) {
        setLocalizations(response);
        setTotalRows(response.totalRows);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching localizations List:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handlePageChange = (page: number) => {
    setPageIndex(page);
  };

  useEffect(() => {
    fetchLocalization();
  }, [pageIndex, searchCounter, refresh]);

  const handleDelete = async (localization: LocalizationResult) => {
    setTranslationKey(localization.key);
    setEditModalId(localization.id);
    setDeleteModalOpen(true);
  };

  const openEditModal = (id: number) => {
    setEditModalId(id);
    setAddModalOpen(true);
  };

  const languages = [
    { key: "hasNL", labelId: "Fields.ColumnHasNL", value: 1 },
    { key: "hasEN", labelId: "Fields.ColumnHasEN", value: 2 },
    { key: "hasDE", labelId: "Fields.ColumnHasDE", value: 4 },
    { key: "hasFR", labelId: "Fields.ColumnHasFR", value: 8 },
    { key: "hasES", labelId: "Fields.ColumnHasES", value: 16 },
    { key: "hasPL", labelId: "Fields.ColumnHasPL", value: 32 },
    { key: "hasTR", labelId: "Fields.ColumnHasTR", value: 64 },
  ];

  return (
    <KTCardBody>
      <div className="row row-cols-1 row-cols-md-1 g-4">
        {
          // !isLoading &&
          localizations?.result?.map((localization: LocalizationResult) => (
            <ListCard key={localization.id}>
              <div
                className="ribbon ribbon-start ribbon-clip position-absolute cursor-pointer"
                style={{
                  top: "10px",
                  height: "30px",
                  minWidth: "250px",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  openEditModal(localization.id);
                }}
                onContextMenu={(e) => {
                  e.preventDefault(); // Prevent navigation for drafts
                  openEditModal(localization.id);
                }}
              >
                <div
                  className={`ribbon-label fw-bold ${getStatusClass(
                    localization.editStatusType.value
                  )}`}
                >
                  {localization.editStatusType.description}
                  <span
                    className={`ribbon-inner ${getStatusClass(
                      localization.editStatusType.value
                    )} text-white`}
                  ></span>
                </div>
              </div>

              <div className="card-body">
                {/* First Row: Checkbox, Divider, Value */}
                <div className="d-flex align-items-top justify-content-between">
                  <div
                    className="d-flex gap-2 align-items-center cursor-pointer title-clickable text-primary"
                    onClick={() => {
                      openEditModal(localization.id);
                    }}
                  >
                    <strong>{localization.key}</strong>
                    <small className="rounded p-1 text-white bg-gray-500 px-2 fw-bold fs-9">
                      {localization.moduleType.description}
                    </small>
                  </div>
                  <div className="d-flex my-lg-0 necessary-icons">
                    <Tippy
                      content={intl.formatMessage({
                        id: "Fields.ToolTipEdit",
                      })}
                    >
                      <button
                        className="btn btn-icon btn-light btn-sm me-4 cursor-pointer"
                        onClick={() => {
                          openEditModal(localization.id);
                        }}
                      >
                        <i className="ki-solid ki-pencil text-warning fs-2"></i>
                      </button>
                    </Tippy>

                    {localization.canDelete && (
                      <Tippy
                        content={intl.formatMessage({
                          id: "Fields.ToolTipDelete",
                        })}
                      >
                        <button
                          className="btn btn-icon btn-light btn-sm cursor-pointer"
                          onClick={() => {
                            handleDelete(localization);
                          }}
                        >
                          <i className="ki-solid ki-trash text-danger fs-2"></i>
                        </button>
                      </Tippy>
                    )}
                  </div>
                </div>
                <small
                  className="text-muted"
                  dangerouslySetInnerHTML={{
                    __html: localization.previewContent,
                  }}
                />
                <div className="separator separator-solid my-3"></div>

                <div className="d-flex flex-row flex-wrap fs-8">
                  {languages.map((lang, index) => (
                    <React.Fragment key={lang.key}>
                      <Tippy
                        content={
                          getEnumOptions(enums.LanguageTypes, intl).find(
                            (option) => lang.value === option.value
                          )?.label
                        }
                      >
                        <div className="d-flex align-items-center flex-wrap cursor-pointer">
                          {localization.key ? (
                            <KTSVG
                              path="media/icons/duotune/general/gen037.svg"
                              className="svg-icon-muted svg-icon-3"
                            />
                          ) : (
                            <KTSVG
                              path="media/icons/duotune/general/gen034.svg"
                              className="svg-icon-muted svg-icon-3"
                            />
                          )}
                          <div className="d-flex flex-column mx-3">
                            <span className="fs-sm text-muted">
                              {intl.formatMessage({ id: lang.labelId })}
                            </span>
                          </div>
                        </div>
                      </Tippy>

                      {index < languages.length - 1 && (
                        <span className="ms-2 h-37px bg-gray-400 w-1px me-6"></span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </ListCard>
          ))
        }

        {localizations?.result?.length == 0 && <NoItemsPage />}
        {isLoading && <ListLoading />}
      </div>

      {localizations && localizations.result?.length > 0 && (
        <ListPagination
          totalPages={localizations.totalPages}
          pageIndex={pageIndex}
          onPageChange={handlePageChange}
          totalItems={localizations.totalRows}
          moduleName="localization-module"
        />
      )}
    </KTCardBody>
  );
};

export { LocalizationList };
