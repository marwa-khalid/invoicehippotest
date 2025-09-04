import { useEffect, useState } from "react";
import { getVatTypes } from "../core/_requests";
import { VatTypesResult } from "../core/_models";
import { ListLoading } from "../../../generic/ListLoading";
import { KTCardBody } from "../../../../../_metronic/helpers";
import { useIntl } from "react-intl";
import { toAbsoluteUrl } from "../../../../../_metronic/helpers";
import { KTSVG } from "../../../../../_metronic/helpers";
import Tippy from "@tippyjs/react";
import { ListPagination } from "../../../generic/ListPagination";
import { getEnumOptions } from "../../../../helpers/intlHelper";
import enums from "../../../../../_metronic/i18n/messages/invoicehippo.enums.json";

interface UsersTableComponentProps {
  searchTerm: string;
  searchCounter: number;
  vatAreaUsageTypeFilter: number;
  setTotalRows: (type: number) => void;
  setAddModalOpen: (type: boolean) => void;
  setEditModalId: (type: number) => void;
  setVatTitle: (type: string) => void;
  setDeleteModalOpen: (type: boolean) => void;
  refresh: boolean;
  setPageIndex: (type: number) => void;
  pageIndex: number;
}
const VatTypesList = ({
  searchTerm,
  vatAreaUsageTypeFilter,
  setTotalRows,
  setAddModalOpen,
  searchCounter,
  setEditModalId,
  setVatTitle,
  setDeleteModalOpen,
  refresh,
  setPageIndex,
  pageIndex,
}: UsersTableComponentProps) => {
  const [vatTypesList, setVatTypesList] = useState<any>([]);
  const intl = useIntl();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchVatTypes = async () => {
    setIsLoading(true);

    try {
      const response = await getVatTypes(
        searchTerm,
        pageIndex,
        vatAreaUsageTypeFilter
      );
      if (response.isValid) {
        setVatTypesList(response);
        setTotalRows(response.totalRows);
      }
    } catch (error) {
      console.error("Error fetching VAT types:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handlePageChange = (page: number) => {
    setPageIndex(page);
  };

  useEffect(() => {
    fetchVatTypes();
  }, [searchTerm, vatAreaUsageTypeFilter, pageIndex, searchCounter, refresh]);

  const renderLockIcon = (isChecked: boolean) => {
    return isChecked ? (
      <Tippy
        content={intl.formatMessage({
          id: "Fields.ToolTipActive",
        })}
      >
        <span>
          <KTSVG
            path="media/icons/duotune/general/gen037.svg"
            className="svg-icon-success svg-icon-2x"
          />
        </span>
      </Tippy>
    ) : (
      <Tippy
        content={intl.formatMessage({
          id: "Fields.ToolTipInactive",
        })}
      >
        <span>
          <KTSVG
            path="media/icons/duotune/general/gen037.svg"
            className="svg-icon-danger svg-icon-2x"
          />
        </span>
      </Tippy>
    );
  };
  const openEditModal = (id: number) => {
    setEditModalId(id);
    setAddModalOpen(true);
  };

  const openDeleteModal = (id: number, vatTitle: string) => {
    setEditModalId(id);
    setDeleteModalOpen(true);
    setVatTitle(vatTitle);
  };
  return (
    <KTCardBody className="mt-8">
      <div className="row row-cols-1 row-cols-md-1 g-4">
        {
          // !isLoading &&
          vatTypesList?.result?.map((vatType: VatTypesResult) => (
            <div className="col" key={vatType.id}>
              <div className="card h-100">
                <div className="card-body">
                  {/* First Row: Checkbox, Divider, Value */}
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div
                      className="d-flex align-items-center gap-3 cursor-pointer title-clickable"
                      onClick={() => {
                        openEditModal(vatType.id);
                      }}
                    >
                      {renderLockIcon(vatType.useInLists)}
                      <span className="mx-2 text-muted">|</span>
                      <strong>{vatType.title}</strong>
                    </div>
                    <div className="align-items-center my-lg-0 my-1 necessary-icons">
                      <button
                        className="btn btn-icon btn-light btn-sm me-4"
                        onClick={() => {
                          openEditModal(vatType.id);
                        }}
                      >
                        <i className="ki-solid ki-pencil text-warning fs-2 ">
                          {/* <span className="path1"></span>
                          <span className="path2"></span> */}
                        </i>
                      </button>
                      <button
                        className="btn btn-icon btn-light btn-sm"
                        onClick={() => {
                          openDeleteModal(vatType.id, vatType.title);
                        }}
                      >
                        <i className="ki-solid ki-trash text-danger fs-2 ">
                          {/* <span className="path1"></span>
                          <span className="path2"></span>
                          <span className="path3"></span>
                          <span className="path4"></span>
                          <span className="path5"></span> */}
                        </i>
                      </button>
                    </div>
                  </div>
                  {/* separator Line */}

                  <div className="separator separator-solid mb-3"></div>

                  {/* Verkoopfacturen Text */}

                  <div className="mb-4 text-muted">
                    <small className="text-muted">
                      {getEnumOptions(enums.InvoiceStatusTypes, intl)
                        .find(
                          (item) =>
                            item.value === vatType.vatAreaUsageType.value
                        )
                        ?.label.toLowerCase()}
                    </small>
                  </div>

                  {/* Small Image and Ledger Account + Title */}
                  {vatType.ledgerAccountDisplayName && (
                    <div className="d-flex align-items-center flex-wrap">
                      <i className="ki-duotone ki-file-added fs-3x text-warning ">
                        <span className="path1"></span>
                        <span className="path2"></span>
                        <span className="path3"></span>
                        <span className="path4"></span>
                        <span className="path5"></span>
                      </i>

                      <div className="d-flex flex-column mx-6">
                        <span className="fs-sm text-muted">
                          {intl.formatMessage({ id: "Fields.LedgerAccount" })}
                        </span>
                        <span className="text-primary fw-bolder">
                          {vatType.ledgerAccountDisplayName}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        }

        {vatTypesList?.result?.length == 0 && (
          <div className="text-center">
            <img
              alt=""
              src={toAbsoluteUrl("media/logos/searchnotfound.png")}
              className="h-350px w-450px"
            />
            <h3>
              {intl.formatMessage({
                id: "Fields.SearchNoItemsAvailableDefault",
              })}
            </h3>
          </div>
        )}
        {isLoading && <ListLoading />}
      </div>

      {vatTypesList?.result?.length > 0 && (
        <ListPagination
          totalPages={vatTypesList.totalPages}
          pageIndex={pageIndex}
          moduleName="vat-module"
          onPageChange={handlePageChange}
          totalItems={vatTypesList.totalRows}
        />
      )}
    </KTCardBody>
  );
};

export { VatTypesList };
