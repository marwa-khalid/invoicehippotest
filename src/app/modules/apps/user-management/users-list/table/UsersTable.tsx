import React, { useEffect, useState } from "react";
import { getVatTypes } from "../core/_requests";
import { VatTypesResult } from "../core/_models";
import { UsersListLoading } from "../components/loading/UsersListLoading";
import { UsersListPagination } from "../components/pagination/UsersListPagination";
import { KTCardBody } from "../../../../../../_metronic/helpers";
import { useIntl } from "react-intl";
import { toAbsoluteUrl } from "../../../../../../_metronic/helpers";
import { UserEditModal } from "../user-edit-modal/UserEditModal";
interface UsersTableComponentProps {
  searchTerm: string;
  vatAreaUsageTypeFilter: number;
  setCurrentRows: (type: number) => void;
  setEditModalOpen: (type: boolean) => void;
  setEditModalId: (type: number) => void;
  setLedgerAccountDisplayName: (type: string) => void;
  setVatTitle: (type: string) => void;
  setDeleteModalOpen: (type: boolean) => void;
}
const UsersTable = ({
  searchTerm,
  vatAreaUsageTypeFilter,
  setCurrentRows,
  setEditModalOpen,
  setEditModalId,
  setLedgerAccountDisplayName,
  setVatTitle,
  setDeleteModalOpen,
}: UsersTableComponentProps) => {
  const [vatTypesList, setVatTypesList] = useState<any>([]);
  const intl = useIntl();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pageIndex, setPageIndex] = useState<number>(1);

  const handlePageChange = (page: number) => {
    setPageIndex(page);
  };

  useEffect(() => {
    const fetchVatTypes = async () => {
      setIsLoading(true);
      try {
        const response = await getVatTypes(
          searchTerm,
          pageIndex,
          vatAreaUsageTypeFilter
        );
        setVatTypesList(response);
        setPageIndex(response.pageIndex);
        setCurrentRows(response.currentRows);
        // setTotalItems(response.result);
      } catch (error) {
        console.error("Error fetching VAT types:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVatTypes();
  }, [searchTerm, pageIndex, vatAreaUsageTypeFilter]);

  const renderLockIcon = (isChecked: boolean) => {
    return isChecked ? (
      <button className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-4">
        <i className="ki-duotone ki-lock text-success fs-2">
          <span className="path1"></span>
          <span className="path2"></span>
          <span className="path3"></span>
        </i>
      </button>
    ) : (
      <button className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-4">
        <i className="ki-duotone ki-lock text-danger fs-2">
          <span className="path1"></span>
          <span className="path2"></span>
          <span className="path3"></span>
        </i>
      </button>
    );
  };
  const openEditModal = (id: number, ledgerName: string) => {
    setEditModalId(id);
    setEditModalOpen(true);
    setLedgerAccountDisplayName(ledgerName);
  };

  const openDeleteModal = (vatTitle: string) => {
    setDeleteModalOpen(true);
    setVatTitle(vatTitle);
  };
  return (
    <KTCardBody className="py-4">
      <div className="row row-cols-1 row-cols-md-1 g-4">
        {isLoading && <UsersListLoading />}
        {!isLoading &&
          vatTypesList?.result?.map((vatType: VatTypesResult) => (
            <div className="col" key={vatType.id}>
              <div className="card h-100 py-6 ">
                <div className="card-body">
                  {/* First Row: Checkbox, Divider, Value */}
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div
                      className="d-flex align-items-center gap-3 cursor-pointer title-clickable"
                      onClick={() => {
                        openEditModal(
                          vatType.id,
                          vatType.ledgerAccountDisplayName
                        );
                      }}
                      style={{
                        transition: "color 0.3s", // Smooth transition effect
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "blue";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "black";
                      }}
                    >
                      <input
                        type="checkbox"
                        style={{ display: "none" }}
                        checked={vatType.useInLists}
                        readOnly={true}
                      />
                      {renderLockIcon(vatType.useInLists)}
                      <span className="mx-2 text-muted">|</span>
                      <strong>{vatType.value}%</strong>
                    </div>
                    <div className="align-items-center my-lg-0 my-1 necessary-icons">
                      <button
                        className="btn btn-icon btn-bg-light btn-active-color-warning btn-sm me-4"
                        onClick={() => {
                          openEditModal(
                            vatType.id,
                            vatType.ledgerAccountDisplayName
                          );
                        }}
                      >
                        <i className="ki-duotone ki-pencil fs-2 ">
                          <span className="path1"></span>
                          <span className="path2"></span>
                        </i>
                      </button>
                      <button
                        className="btn btn-icon btn-bg-light btn-active-color-danger btn-sm"
                        onClick={() => {
                          openDeleteModal(vatType.title);
                        }}
                      >
                        <i className="ki-duotone ki-trash fs-2">
                          <span className="path1"></span>
                          <span className="path2"></span>
                          <span className="path3"></span>
                          <span className="path4"></span>
                          <span className="path5"></span>
                        </i>
                      </button>
                    </div>
                  </div>
                  {/* separator Line */}
                  <div className="separator separator-solid mb-3"></div>
                  {/* Verkoopfacturen Text */}
                  <div className="mb-4 text-muted">
                    <small className="text-muted">verkoopfacturen</small>
                  </div>

                  {/* Small Image and Ledger Account + Title */}
                  <div className="d-flex align-items-center flex-wrap">
                    <i className="ki-duotone ki-file-added fs-3x text-black ">
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
                        {vatType.title}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
      <UsersListPagination
        totalPages={vatTypesList.totalPages}
        pageIndex={pageIndex}
        onPageChange={handlePageChange}
        totalItems={vatTypesList.totalRows}
      />
    </KTCardBody>
  );
};

export { UsersTable };
