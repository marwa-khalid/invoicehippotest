import React, { useEffect, useState } from "react";
import { getVatTypes } from "../core/_requests";
import { VatTypesResult } from "../core/_models";
import { VatListLoading } from "../components/loading/VatListLoading";
import { VatListPagination } from "../components/pagination/VatListPagination";
import { KTCardBody } from "../../../../../../_metronic/helpers";
import { useIntl } from "react-intl";
import { toAbsoluteUrl } from "../../../../../../_metronic/helpers";
// import { VatEditModal } from "../user-edit-modal/VatEditModal";
interface UsersTableComponentProps {
  searchTerm: string;
  vatAreaUsageTypeFilter: number;
  setCurrentRows: (type: number) => void;
  setEditModalOpen: (type: boolean) => void;
  setEditModalId: (type: number) => void;
  setVatTitle: (type: string) => void;
  setDeleteModalOpen: (type: boolean) => void;
  refresh: boolean;
}
const VatTypesList = ({
  searchTerm,
  vatAreaUsageTypeFilter,
  setCurrentRows,
  setEditModalOpen,
  setEditModalId,
  setVatTitle,
  setDeleteModalOpen,
  refresh,
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
  }, [searchTerm, pageIndex, vatAreaUsageTypeFilter, refresh]);

  useEffect(() => {});

  const renderLockIcon = (isChecked: boolean) => {
    return isChecked ? (
      <button className="btn btn-icon btn-light btn-sm me-4">
        <i className="ki-solid ki-lock text-success fs-2">
          {/* <span className="path1"></span>
          <span className="path2"></span>
          <span className="path3"></span> */}
        </i>
      </button>
    ) : (
      <button className="btn btn-icon btn-light btn-sm me-4">
        <i className="ki-solid ki-lock fs-2 text-danger">
          {/* <span className="path1"></span>
          <span className="path2"></span>
          <span className="path3"></span> */}
        </i>
      </button>
    );
  };
  const openEditModal = (id: number) => {
    setEditModalId(id);
    setEditModalOpen(true);
  };

  const openDeleteModal = (id: number, vatTitle: string) => {
    setEditModalId(id);
    setDeleteModalOpen(true);
    setVatTitle(vatTitle);
  };
  return (
    <KTCardBody className="py-4">
      <div className="row row-cols-1 row-cols-md-1 g-4">
        {isLoading && <VatListLoading />}
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
                        openEditModal(vatType.id);
                      }}
                      // style={{
                      //   transition: "color 0.3s", // Smooth transition effect
                      // }}
                      // onMouseEnter={(e) => {
                      //   e.currentTarget.style.color = "blue";
                      // }}
                      // onMouseLeave={(e) => {
                      //   e.currentTarget.style.color = "black";
                      // }}
                    >
                      <input
                        type="checkbox"
                        style={{ display: "none" }}
                        checked={vatType.useInLists}
                        readOnly={true}
                      />
                      {renderLockIcon(vatType.useInLists)}
                      <span className="mx-2 text-muted">|</span>
                      <strong>{vatType.title}</strong>
                    </div>
                    <div className="align-items-center my-lg-0 my-1 necessary-icons">
                      <button
                        className="btn btn-icon btn-warning btn-sm me-4"
                        onClick={() => {
                          openEditModal(vatType.id);
                        }}
                      >
                        <i className="ki-solid ki-pencil fs-2 ">
                          {/* <span className="path1"></span>
                          <span className="path2"></span> */}
                        </i>
                      </button>
                      <button
                        className="btn btn-icon btn-danger btn-sm"
                        onClick={() => {
                          openDeleteModal(vatType.id, vatType.title);
                        }}
                      >
                        <i className="ki-solid ki-trash fs-2 ">
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
                  {vatType.ledgerAccountDisplayName && (
                    <div className="separator separator-solid mb-3"></div>
                  )}
                  {/* Verkoopfacturen Text */}
                  {vatType.ledgerAccountDisplayName && (
                    <div className="mb-4 text-muted">
                      <small className="text-muted">
                        {vatType.vatAreaUsageType.description}
                      </small>
                    </div>
                  )}

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
          ))}

        {vatTypesList?.result?.length == 0 && (
          <div className="text-center">
            <img
              alt=""
              src={toAbsoluteUrl("media/logos/searchnotfound.png")}
              className="h-300px w-350px"
            />
          </div>
        )}
      </div>
      <VatListPagination
        totalPages={vatTypesList.totalPages}
        pageIndex={pageIndex}
        onPageChange={handlePageChange}
        totalItems={vatTypesList.totalRows}
      />
    </KTCardBody>
  );
};

export { VatTypesList };
